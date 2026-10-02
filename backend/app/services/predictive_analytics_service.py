"""
Predictive Analytics
=====================
Covers:
    - Focus Degradation Prediction
    - Productivity Risk Detection
    - Attention Fatigue Analysis
"""

import statistics
from datetime import date, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app.models.focus_session import FocusSession
from app.services.behavioral_analytics_service import (
    BehavioralAI,
    DistractionFrequencyAnalyzer,
    FocusSessionAnalyzer,
    ProductivityTrendAnalyzer,
    _period_bounds,
)


class PredictiveAnalyticsService:
    @staticmethod
    def predict_focus_degradation(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date, default_days=14)
        days = [start.date() + timedelta(days=i) for i in range((end - start).days)]

        daily_completion = [FocusSessionAnalyzer.analyze(db, user_id, day, day)["completion_rate"] for day in days]

        trend = (
            BehavioralAI.linear_trend(daily_completion)
            if daily_completion
            else {"slope": 0.0, "direction": "insufficient_data", "confidence": 0.0}
        )

        projected_next = None
        if daily_completion and trend["direction"] != "insufficient_data":
            projected_next = max(0.0, min(100.0, round(daily_completion[-1] + trend["slope"], 2)))

        risk_level = "low"
        if trend["direction"] == "declining" and trend["confidence"] >= 0.5:
            risk_level = "high" if trend["confidence"] >= 0.75 else "moderate"

        return {
            "period_start": days[0].isoformat() if days else None,
            "period_end": days[-1].isoformat() if days else None,
            "daily_completion_rates": daily_completion,
            "trend": trend,
            "projected_next_day_completion_rate": projected_next,
            "degradation_risk": risk_level,
            "summary": (
                f"Focus completion trend is '{trend['direction']}'. "
                f"Degradation risk assessed as '{risk_level}'."
            ),
        }

    @staticmethod
    def detect_productivity_risk(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        productivity = ProductivityTrendAnalyzer.analyze(db, user_id, start_date, end_date)
        distraction = DistractionFrequencyAnalyzer.analyze(db, user_id, start_date, end_date)

        risk_signals = []
        if productivity["trend"]["direction"] == "declining":
            risk_signals.append("productivity_declining")
        if distraction["pattern_label"] in ("high_distraction", "severe_distraction"):
            risk_signals.append("high_distraction_frequency")

        risk_level = "low"
        if len(risk_signals) >= 2:
            risk_level = "high"
        elif len(risk_signals) == 1:
            risk_level = "moderate"

        return {
            "period_start": productivity["period_start"],
            "period_end": productivity["period_end"],
            "productivity_trend": productivity["trend"],
            "distraction_pattern": distraction["pattern_label"],
            "risk_signals": risk_signals,
            "productivity_risk_level": risk_level,
            "summary": (
                f"Productivity risk assessed as '{risk_level}' based on {len(risk_signals)} signal(s): "
                f"{', '.join(risk_signals) if risk_signals else 'none detected'}."
            ),
        }

    @staticmethod
    def analyze_attention_fatigue(
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

        buckets: dict[str, list[FocusSession]] = {"morning": [], "afternoon": [], "evening": []}
        for s in sessions:
            hour = s.started_at.hour
            bucket = "morning" if hour < 12 else "afternoon" if hour < 17 else "evening"
            buckets[bucket].append(s)

        def bucket_stats(sess_list: list[FocusSession]) -> dict[str, Any]:
            if not sess_list:
                return {"count": 0, "completion_rate": None, "average_duration_minutes": None}
            completed = sum(1 for s in sess_list if s.is_completed)
            durations = [s.duration_minutes or 0 for s in sess_list]
            return {
                "count": len(sess_list),
                "completion_rate": round(completed / len(sess_list) * 100, 2),
                "average_duration_minutes": round(statistics.mean(durations), 2),
            }

        bucket_results = {name: bucket_stats(sess) for name, sess in buckets.items()}

        rates = [
            bucket_results[b]["completion_rate"]
            for b in ("morning", "afternoon", "evening")
            if bucket_results[b]["completion_rate"] is not None
        ]
        fatigue_detected = len(rates) >= 2 and rates[-1] < rates[0] - 15

        return {
            "period_start": start.date().isoformat(),
            "period_end": (end - timedelta(days=1)).date().isoformat(),
            "time_of_day_breakdown": bucket_results,
            "fatigue_detected": fatigue_detected,
            "summary": (
                "Later-day sessions show a meaningful drop in completion rate versus morning, "
                "suggesting attention fatigue."
                if fatigue_detected
                else "No clear fatigue pattern detected across time-of-day buckets."
            ),
        }
