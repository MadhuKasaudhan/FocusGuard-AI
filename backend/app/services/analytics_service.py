import statistics
from datetime import date, datetime, timedelta, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.models.application_usage import ApplicationUsage
from app.models.focus_session import FocusSession
from app.models.notification_log import NotificationLog


class AnalyticsService:
    @staticmethod
    def calculate_daily_scores(db: Session, user_id: int, day: date | None = None) -> dict[str, Any]:
        target_day = day or date.today()
        start = datetime.combine(target_day, datetime.min.time(), tzinfo=timezone.utc)
        end = start + timedelta(days=1)

        focus_sessions = (
            db.query(FocusSession)
            .filter(FocusSession.user_id == user_id)
            .filter(FocusSession.started_at >= start)
            .filter(FocusSession.started_at < end)
            .all()
        )
        usage_entries = (
            db.query(ApplicationUsage)
            .filter(ApplicationUsage.user_id == user_id)
            .filter(ApplicationUsage.recorded_at >= start)
            .filter(ApplicationUsage.recorded_at < end)
            .all()
        )
        notifications = (
            db.query(NotificationLog)
            .filter(NotificationLog.user_id == user_id)
            .filter(NotificationLog.created_at >= start)
            .filter(NotificationLog.created_at < end)
            .all()
        )
        activity_logs = (
            db.query(ActivityLog)
            .filter(ActivityLog.user_id == user_id)
            .filter(ActivityLog.created_at >= start)
            .filter(ActivityLog.created_at < end)
            .all()
        )

        total_focus_minutes = sum(session.duration_minutes or 0 for session in focus_sessions)
        completed_sessions = sum(1 for session in focus_sessions if session.is_completed)
        distraction_count = len(notifications)
        total_usage_minutes = sum(entry.usage_minutes or 0 for entry in usage_entries)
        total_activity_events = len(activity_logs)

        focus_score = min(100, round((total_focus_minutes / 480) * 100 if total_focus_minutes else 0, 2))
        productivity_score = min(100, round((completed_sessions * 10 + max(0, 100 - total_usage_minutes // 10)) / 2, 2))
        attention_stability_score = min(100, round(max(0, 100 - distraction_count * 8 - total_activity_events), 2))
        distraction_frequency = round(distraction_count, 2)

        return {
            "date": target_day.isoformat(),
            "daily_focus_score": focus_score,
            "productivity_score": productivity_score,
            "attention_stability_score": attention_stability_score,
            "distraction_frequency": distraction_frequency,
            "focus_sessions": len(focus_sessions),
            "completed_sessions": completed_sessions,
            "total_focus_minutes": total_focus_minutes,
            "total_usage_minutes": total_usage_minutes,
            "activity_events": total_activity_events,
        }

    @staticmethod
    def calculate_weekly_scores(db: Session, user_id: int, day: date | None = None) -> dict[str, Any]:
        target_day = day or date.today()
        start_of_week = target_day - timedelta(days=target_day.weekday())  # Monday
        days = [start_of_week + timedelta(days=i) for i in range(7)]
        return AnalyticsService._aggregate_period(db, user_id, days, period_label="weekly")

    @staticmethod
    def calculate_monthly_scores(db: Session, user_id: int, day: date | None = None) -> dict[str, Any]:
        target_day = day or date.today()
        start_of_month = target_day.replace(day=1)
        if target_day.month == 12:
            next_month = target_day.replace(year=target_day.year + 1, month=1, day=1)
        else:
            next_month = target_day.replace(month=target_day.month + 1, day=1)
        num_days = (next_month - start_of_month).days
        days = [start_of_month + timedelta(days=i) for i in range(num_days)]
        return AnalyticsService._aggregate_period(db, user_id, days, period_label="monthly")

    @staticmethod
    def _aggregate_period(db: Session, user_id: int, days: list[date], period_label: str) -> dict[str, Any]:
        daily_results = [AnalyticsService.calculate_daily_scores(db, user_id, d) for d in days]

        def avg(key: str) -> float:
            values = [r[key] for r in daily_results]
            return round(statistics.mean(values), 2) if values else 0.0

        def total(key: str) -> int:
            return sum(r[key] for r in daily_results)

        return {
            "period": period_label,
            "period_start": days[0].isoformat(),
            "period_end": days[-1].isoformat(),
            "average_daily_focus_score": avg("daily_focus_score"),
            "average_productivity_score": avg("productivity_score"),
            "average_attention_stability_score": avg("attention_stability_score"),
            "total_distraction_frequency": total("distraction_frequency"),
            "total_focus_sessions": total("focus_sessions"),
            "total_completed_sessions": total("completed_sessions"),
            "total_focus_minutes": total("total_focus_minutes"),
            "total_usage_minutes": total("total_usage_minutes"),
            "total_activity_events": total("activity_events"),
            "daily_breakdown": daily_results,
        }