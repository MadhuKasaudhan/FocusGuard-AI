"""
Notification Intelligence
============================
Covers:
    - Smart Reminder Generation
    - Focus Session Alerts
    - Distraction Alerts

These functions WRITE real NotificationLog rows using the same model your
/monitoring endpoints already use. This only decides WHAT notification to
create and WHEN it is warranted - actually delivering it (push, email,
in-app banner) is a separate client-side concern.
"""

from datetime import date, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app.models.focus_session import FocusSession
from app.models.notification_log import NotificationLog
from app.services.behavioral_analytics_service import (
    DistractionFrequencyAnalyzer,
    _period_bounds,
)
from app.services.smart_focus_planner_service import SmartFocusPlannerService


def _create_notification(db: Session, user_id: int, message: str, channel: str = "in_app") -> NotificationLog:
    notification = NotificationLog(user_id=user_id, message=message, channel=channel, is_read=False)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


class NotificationIntelligenceService:
    @staticmethod
    def generate_smart_reminders(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        planner_result = SmartFocusPlannerService.identify_high_focus_time(db, user_id, start_date, end_date, top_n=1)
        windows = planner_result["high_focus_windows"]

        created: list[dict[str, Any]] = []
        if windows:
            best = windows[0]
            today = date.today()
            already_scheduled = (
                db.query(FocusSession)
                .filter(
                    FocusSession.user_id == user_id,
                    FocusSession.started_at >= today,
                )
                .filter(FocusSession.started_at < today + timedelta(days=1))
                .filter(FocusSession.started_at.isnot(None))
                .all()
            )
            hour_already_used = any(s.started_at.hour == best["hour"] for s in already_scheduled)

            if not hour_already_used:
                message = (
                    f"Your focus tends to peak around {best['hour']}:00 "
                    f"({best['completion_rate']}% completion rate historically) - "
                    "consider scheduling a session then today."
                )
                notification = _create_notification(db, user_id, message, channel="in_app")
                created.append(
                    {
                        "notification_id": notification.id,
                        "message": notification.message,
                        "created_at": notification.created_at.isoformat(),
                    }
                )

        return {
            "high_focus_windows": windows,
            "reminders_created": created,
            "summary": (
                f"{len(created)} smart reminder(s) created."
                if created
                else "No new reminder needed - either no clear focus window yet, or already scheduled."
            ),
        }

    @staticmethod
    def generate_focus_session_alerts(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date, default_days=1)

        incomplete_sessions = (
            db.query(FocusSession)
            .filter(
                FocusSession.user_id == user_id,
                FocusSession.started_at >= start,
                FocusSession.started_at < end,
                FocusSession.is_completed.is_(False),
                FocusSession.ended_at.isnot(None),
            )
            .all()
        )

        created: list[dict[str, Any]] = []
        for s in incomplete_sessions:
            message = (
                f"Your focus session starting at {s.started_at.strftime('%H:%M')} ended early "
                f"({s.duration_minutes or 0} min). Want to try a shorter follow-up session now?"
            )
            notification = _create_notification(db, user_id, message, channel="in_app")
            created.append(
                {
                    "notification_id": notification.id,
                    "session_id": s.id,
                    "message": notification.message,
                }
            )

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "incomplete_sessions_found": len(incomplete_sessions),
            "alerts_created": created,
            "summary": f"{len(created)} focus session alert(s) created for incomplete sessions.",
        }

    @staticmethod
    def generate_distraction_alerts(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        distraction = DistractionFrequencyAnalyzer.analyze(db, user_id, start_date, end_date)

        created: list[dict[str, Any]] = []
        if distraction["pattern_label"] in ("high_distraction", "severe_distraction"):
            message = (
                f"Distractions are running '{distraction['pattern_label']}' "
                f"({distraction['distractions_per_day']}/day). "
                "Consider a focus block with notifications muted."
            )
            notification = _create_notification(db, user_id, message, channel="in_app")
            created.append(
                {
                    "notification_id": notification.id,
                    "message": notification.message,
                }
            )

        return {
            "period_start": distraction["period_start"],
            "period_end": distraction["period_end"],
            "distraction_pattern": distraction["pattern_label"],
            "alerts_created": created,
            "summary": (
                f"{len(created)} distraction alert created."
                if created
                else "Distraction levels are within normal range - no alert created."
            ),
        }
