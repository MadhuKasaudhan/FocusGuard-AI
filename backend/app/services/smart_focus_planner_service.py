"""
Smart Focus Planner
=====================
Covers:
    - Optimal Work Session Recommendations
    - Break Scheduling Suggestions
    - High Focus Time Identification
"""

import statistics
from collections import defaultdict
from datetime import date, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app.models.focus_session import FocusSession
from app.services.behavioral_analytics_service import (
    DistractionFrequencyAnalyzer,
    FocusSessionAnalyzer,
    _period_bounds,
)


class SmartFocusPlannerService:
    @staticmethod
    def _hourly_breakdown(
        db: Session, user_id: int, start_date: date | None, end_date: date | None
    ) -> dict[int, dict[str, Any]]:
        start, end = _period_bounds(start_date, end_date)
        sessions = (
            db.query(FocusSession)
            .filter(
                FocusSession.user_id == user_id,
                FocusSession.started_at >= start,
                FocusSession.started_at < end,
            )
            .all()
        )

        buckets: dict[int, list[FocusSession]] = defaultdict(list)
        for s in sessions:
            buckets[s.started_at.hour].append(s)

        result = {}
        for hour, sess_list in buckets.items():
            completed = sum(1 for s in sess_list if s.is_completed)
            durations = [s.duration_minutes or 0 for s in sess_list]
            result[hour] = {
                "count": len(sess_list),
                "completion_rate": round(completed / len(sess_list) * 100, 2),
                "average_duration_minutes": round(statistics.mean(durations), 2) if durations else 0.0,
            }
        return result

    @staticmethod
    def recommend_optimal_sessions(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
        top_n: int = 3,
    ) -> dict[str, Any]:
        focus = FocusSessionAnalyzer.analyze(db, user_id, start_date, end_date)
        hourly = SmartFocusPlannerService._hourly_breakdown(db, user_id, start_date, end_date)

        ranked_hours = sorted(
            (h for h, stats in hourly.items() if stats["count"] >= 2),
            key=lambda h: hourly[h]["completion_rate"],
            reverse=True,
        )[:top_n]

        recommended_sessions = [
            {
                "start_hour": hour,
                "suggested_duration_minutes": (
                    hourly[hour]["average_duration_minutes"] or focus["average_duration_minutes"]
                ),
                "historical_completion_rate": hourly[hour]["completion_rate"],
            }
            for hour in ranked_hours
        ]

        if not recommended_sessions and focus["best_focus_hour"] is not None:
            recommended_sessions = [
                {
                    "start_hour": focus["best_focus_hour"],
                    "suggested_duration_minutes": focus["average_duration_minutes"],
                    "historical_completion_rate": focus["completion_rate"],
                }
            ]

        return {
            "period_start": focus["period_start"],
            "period_end": focus["period_end"],
            "recommended_sessions": recommended_sessions,
            "summary": (
                f"Top {len(recommended_sessions)} recommended work session slot(s) based on "
                "historical completion rate by hour."
                if recommended_sessions
                else "Not enough session history yet to recommend specific time slots."
            ),
        }

    @staticmethod
    def suggest_break_schedule(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        focus = FocusSessionAnalyzer.analyze(db, user_id, start_date, end_date)
        distraction = DistractionFrequencyAnalyzer.analyze(db, user_id, start_date, end_date)

        avg_duration = focus["average_duration_minutes"] or 25

        if distraction["pattern_label"] in ("high_distraction", "severe_distraction"):
            work_block = min(avg_duration, 25)
            break_minutes = 5
        elif avg_duration >= 50:
            work_block = avg_duration
            break_minutes = 10
        else:
            work_block = avg_duration
            break_minutes = 5

        return {
            "period_start": focus["period_start"],
            "period_end": focus["period_end"],
            "recommended_work_block_minutes": round(work_block, 2),
            "recommended_break_minutes": break_minutes,
            "distraction_pattern": distraction["pattern_label"],
            "summary": (
                f"Suggested rhythm: {round(work_block, 2)} min focused work, then a "
                f"{break_minutes}-min break, adjusted for a '{distraction['pattern_label']}' "
                "distraction pattern."
            ),
        }

    @staticmethod
    def identify_high_focus_time(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
        top_n: int = 3,
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date)
        hourly = SmartFocusPlannerService._hourly_breakdown(db, user_id, start_date, end_date)

        ranked = sorted(
            hourly.items(),
            key=lambda kv: (kv[1]["completion_rate"], kv[1]["average_duration_minutes"]),
            reverse=True,
        )[:top_n]

        high_focus_windows = [
            {
                "hour": hour,
                "completion_rate": stats["completion_rate"],
                "average_duration_minutes": stats["average_duration_minutes"],
                "session_count": stats["count"],
            }
            for hour, stats in ranked
        ]

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "high_focus_windows": high_focus_windows,
            "summary": (
                f"Highest-focus hour(s): {[w['hour'] for w in high_focus_windows]} (24h), "
                "ranked by historical completion rate."
                if high_focus_windows
                else "Not enough session data yet to identify high-focus windows."
            ),
        }
