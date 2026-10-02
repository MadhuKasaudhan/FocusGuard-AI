"""
AI-Based Focus Scoring
=======================
Covers:
    - Daily Focus Score Generation
    - Productivity Score Generation
    - Attention Stability Score
    - Concentration Trend Analysis
"""

import statistics
from datetime import date, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app.services.behavioral_analytics_service import (
    AttentionPatternAnalyzer,
    BehavioralAI,
    FocusSessionAnalyzer,
    ProductivityTrendAnalyzer,
    _period_bounds,
)


class FocusScoringService:
    @staticmethod
    def generate_scores(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        start, end = _period_bounds(start_date, end_date, default_days=14)
        days = [start.date() + timedelta(days=i) for i in range((end - start).days)]

        daily_records = []
        for day in days:
            attention = AttentionPatternAnalyzer.analyze(db, user_id, day, day)
            focus = FocusSessionAnalyzer.analyze(db, user_id, day, day)
            productivity = ProductivityTrendAnalyzer.analyze(db, user_id, day, day)
            daily_records.append(
                {
                    "date": day.isoformat(),
                    "daily_focus_score": focus["completion_rate"],
                    "productivity_score": productivity["average_productivity_score"],
                    "attention_stability_score": attention["attention_stability_score"],
                }
            )

        focus_scores = [r["daily_focus_score"] for r in daily_records]
        productivity_scores = [r["productivity_score"] for r in daily_records]
        stability_scores = [r["attention_stability_score"] for r in daily_records]

        concentration_trend = (
            BehavioralAI.linear_trend(stability_scores)
            if stability_scores
            else {"slope": 0.0, "direction": "insufficient_data", "confidence": 0.0}
        )

        return {
            "period_start": days[0].isoformat() if days else None,
            "period_end": days[-1].isoformat() if days else None,
            "daily_scores": daily_records,
            "average_daily_focus_score": round(statistics.mean(focus_scores), 2) if focus_scores else 0.0,
            "average_productivity_score": (
                round(statistics.mean(productivity_scores), 2) if productivity_scores else 0.0
            ),
            "average_attention_stability_score": (
                round(statistics.mean(stability_scores), 2) if stability_scores else 0.0
            ),
            "concentration_trend": concentration_trend,
            "summary": (
                f"Concentration trend is '{concentration_trend['direction']}' over {len(days)} day(s)."
            ),
        }
