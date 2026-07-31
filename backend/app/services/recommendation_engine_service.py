"""
Recommendation Engine
=======================
Covers:
    - Focus Improvement Suggestions
    - Personalized Productivity Tips
    - Attention Recovery Recommendations
    - Work Pattern Optimization
"""

from datetime import date
from typing import Any

from sqlalchemy.orm import Session

from app.services.behavioral_analytics_service import (
    AttentionPatternAnalyzer,
    DistractionFrequencyAnalyzer,
    FocusSessionAnalyzer,
    ProductivityTrendAnalyzer,
)


class RecommendationEngineService:
    @staticmethod
    def suggest_focus_improvements(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        focus = FocusSessionAnalyzer.analyze(db, user_id, start_date, end_date)
        attention = AttentionPatternAnalyzer.analyze(db, user_id, start_date, end_date)

        suggestions = []

        if focus["completion_rate"] < 60:
            suggestions.append(
                "Your completion rate is below 60 percent - try shortening your target session "
                "length so sessions feel achievable, then gradually increase it."
            )
        if focus["consistency_score"] < 50:
            suggestions.append(
                "Your session durations vary a lot - picking a fixed session length "
                "(e.g. always 25 or 45 minutes) can make focus more predictable."
            )
        if attention["switches_per_day"] > 10:
            suggestions.append(
                f"You are switching tasks about {attention['switches_per_day']} times/day - "
                "try closing unrelated tabs/apps before starting a session to reduce pulls."
            )
        if focus["best_focus_hour"] is not None:
            suggestions.append(
                f"Sessions started around {focus['best_focus_hour']}:00 complete most often - "
                "schedule your most important work then."
            )
        if not suggestions:
            suggestions.append("Your focus metrics look solid for this period - keep the current routine.")

        return {
            "period_start": focus["period_start"],
            "period_end": focus["period_end"],
            "completion_rate": focus["completion_rate"],
            "consistency_score": focus["consistency_score"],
            "switches_per_day": attention["switches_per_day"],
            "suggestions": suggestions,
        }

    @staticmethod
    def personalized_productivity_tips(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        productivity = ProductivityTrendAnalyzer.analyze(db, user_id, start_date, end_date)

        tips = []
        trend_direction = productivity["trend"]["direction"]

        if trend_direction == "declining":
            tips.append(
                "Your productivity score has been trending down - revisit what changed recently "
                "(schedule, workload, sleep) rather than pushing harder on the same routine."
            )
        elif trend_direction == "improving":
            tips.append(
                "Your productivity score is trending up - note what you did differently this "
                "period and try to repeat it."
            )

        if productivity["total_unproductive_minutes"] > productivity["total_productive_minutes"]:
            tips.append(
                "Unproductive app usage minutes outweigh productive ones over this period - "
                "consider app-blocking during your planned focus windows."
            )

        if productivity["best_day"] and productivity["worst_day"]:
            tips.append(
                f"{productivity['best_day']['date']} was your best day "
                f"({productivity['best_day']['productivity_score']}); "
                f"{productivity['worst_day']['date']} was your weakest "
                f"({productivity['worst_day']['productivity_score']}). "
                "Compare what was different about the schedule on each."
            )

        if not tips:
            tips.append("Productivity metrics are stable for this period - no red flags to address.")

        return {
            "period_start": productivity["period_start"],
            "period_end": productivity["period_end"],
            "average_productivity_score": productivity["average_productivity_score"],
            "trend": productivity["trend"],
            "tips": tips,
        }

    @staticmethod
    def attention_recovery_recommendations(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        distraction = DistractionFrequencyAnalyzer.analyze(db, user_id, start_date, end_date)
        attention = AttentionPatternAnalyzer.analyze(db, user_id, start_date, end_date)

        recommendations = []

        if distraction["pattern_label"] in ("high_distraction", "severe_distraction"):
            recommendations.append(
                "Distraction frequency is high - try a 5-minute reset (stand up, breathe, "
                "re-state your next task out loud) before returning to work after each interruption."
            )
        if distraction["peak_distraction_hours"]:
            recommendations.append(
                f"Distractions peak around hour(s) {distraction['peak_distraction_hours']} (24h) - "
                "consider silencing notifications specifically during that window."
            )
        if attention["pattern_label"] in ("scattered", "highly_fragmented"):
            recommendations.append(
                "Your attention pattern is fragmented - batch similar tasks together instead of "
                "interleaving unrelated ones."
            )
        if not recommendations:
            recommendations.append("Distraction levels are under control - no recovery action needed right now.")

        return {
            "period_start": distraction["period_start"],
            "period_end": distraction["period_end"],
            "distraction_pattern": distraction["pattern_label"],
            "attention_pattern": attention["pattern_label"],
            "recommendations": recommendations,
        }

    @staticmethod
    def optimize_work_patterns(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        focus = FocusSessionAnalyzer.analyze(db, user_id, start_date, end_date)

        avg = focus["average_duration_minutes"]
        block_options = [15, 25, 45, 60, 90]
        recommended_block = min(block_options, key=lambda b: abs(b - avg)) if avg else 25

        recommendation = (
            f"Based on your average session length ({avg} min), a {recommended_block}-minute "
            "work block is the closest structured fit."
        )
        if focus["best_focus_hour"] is not None:
            recommendation += f" Anchor it to a start time around {focus['best_focus_hour']}:00 where possible."

        return {
            "period_start": focus["period_start"],
            "period_end": focus["period_end"],
            "average_duration_minutes": avg,
            "recommended_work_block_minutes": recommended_block,
            "anchor_hour": focus["best_focus_hour"],
            "recommendation": recommendation,
        }
