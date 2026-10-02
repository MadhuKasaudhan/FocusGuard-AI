"""
Distraction Detection System
=============================
Covers:
    - Frequent Interruption Detection
    - Context Switching Analysis
    - Notification Impact Assessment
    - Focus Loss Identification
"""

import statistics
from datetime import date, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app.models.focus_session import FocusSession
from app.models.notification_log import NotificationLog
from app.services.behavioral_analytics_service import (
    AttentionPatternAnalyzer,
    DistractionFrequencyAnalyzer,
    _period_bounds,
)


class DistractionDetectionService:
    INTERRUPTION_THRESHOLD_PER_DAY = 8

    @staticmethod
    def detect_frequent_interruptions(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        result = DistractionFrequencyAnalyzer.analyze(db, user_id, start_date, end_date)
        is_frequent = result["distractions_per_day"] > DistractionDetectionService.INTERRUPTION_THRESHOLD_PER_DAY
        return {
            **result,
            "is_frequent_interruption_pattern": is_frequent,
            "threshold_per_day": DistractionDetectionService.INTERRUPTION_THRESHOLD_PER_DAY,
        }

    @staticmethod
    def analyze_context_switching(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        result = AttentionPatternAnalyzer.analyze(db, user_id, start_date, end_date)
        return {
            "period_start": result["period_start"],
            "period_end": result["period_end"],
            "total_switches": result["total_task_switches"],
            "switches_per_day": result["switches_per_day"],
            "severity": result["pattern_label"],
            "top_transitions": result["top_task_transitions"],
            "peak_switching_hours": result["peak_distraction_hours"],
            "summary": result["summary"],
        }

    @staticmethod
    def assess_notification_impact(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date)

        notifications = (
            db.query(NotificationLog)
            .filter(
                NotificationLog.user_id == user_id,
                NotificationLog.created_at >= start,
                NotificationLog.created_at < end,
            )
            .all()
        )
        sessions = (
            db.query(FocusSession)
            .filter(
                FocusSession.user_id == user_id,
                FocusSession.started_at >= start,
                FocusSession.started_at < end,
            )
            .all()
        )

        interrupted_session_ids: set[int] = set()
        for s in sessions:
            if not s.ended_at:
                continue
            for n in notifications:
                if s.started_at <= n.created_at <= s.ended_at:
                    interrupted_session_ids.add(s.id)
                    break

        interrupted_sessions = [s for s in sessions if s.id in interrupted_session_ids]
        clean_sessions = [s for s in sessions if s.id not in interrupted_session_ids and s.ended_at]

        def completion_rate(sess_list: list[FocusSession]) -> float | None:
            if not sess_list:
                return None
            return round(sum(1 for s in sess_list if s.is_completed) / len(sess_list) * 100, 2)

        interrupted_rate = completion_rate(interrupted_sessions)
        clean_rate = completion_rate(clean_sessions)
        impact_delta = (
            round(clean_rate - interrupted_rate, 2)
            if interrupted_rate is not None and clean_rate is not None
            else None
        )

        summary = f"{len(interrupted_session_ids)} of {len(sessions)} session(s) had a notification during them."
        if impact_delta is not None:
            summary += f" Completion rate drops by {impact_delta} points when interrupted."
        else:
            summary += " Not enough data yet to estimate the completion-rate impact."

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "total_notifications": len(notifications),
            "sessions_interrupted": len(interrupted_session_ids),
            "sessions_uninterrupted": len(clean_sessions),
            "completion_rate_when_interrupted": interrupted_rate,
            "completion_rate_when_uninterrupted": clean_rate,
            "estimated_completion_impact": impact_delta,
            "summary": summary,
        }

    @staticmethod
    def identify_focus_loss(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date)

        sessions = (
            db.query(FocusSession)
            .filter(
                FocusSession.user_id == user_id,
                FocusSession.started_at >= start,
                FocusSession.started_at < end,
            )
            .order_by(FocusSession.started_at)
            .all()
        )

        durations = [s.duration_minutes or 0 for s in sessions]
        avg_duration = round(statistics.mean(durations), 2) if durations else 0.0

        focus_loss_events = []
        for s in sessions:
            duration = s.duration_minutes or 0
            if not s.is_completed and avg_duration and duration < avg_duration * 0.4:
                focus_loss_events.append(
                    {
                        "session_id": s.id,
                        "started_at": s.started_at.isoformat(),
                        "duration_minutes": duration,
                        "expected_minutes": avg_duration,
                    }
                )

        loss_rate = round(len(focus_loss_events) / len(sessions) * 100, 2) if sessions else 0.0

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "total_sessions": len(sessions),
            "focus_loss_events": focus_loss_events,
            "focus_loss_rate": loss_rate,
            "average_expected_duration_minutes": avg_duration,
            "summary": (
                f"{len(focus_loss_events)} of {len(sessions)} session(s) ({loss_rate}%) were abandoned "
                f"well below the typical {avg_duration}-minute duration."
            ),
        }
