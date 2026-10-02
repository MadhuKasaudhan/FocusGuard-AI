"""
Insight Generation
===================
Covers:
    - Attention Leak Identification
    - Personalized Focus Insights
    - Daily Performance Summary
"""

import statistics
from datetime import date
from typing import Any

from sqlalchemy.orm import Session

from app.services.behavioral_analytics_service import (
    AttentionPatternAnalyzer,
    DistractionFrequencyAnalyzer,
    FocusSessionAnalyzer,
    ProductivityTrendAnalyzer,
)


class InsightGenerationService:
    @staticmethod
    def identify_attention_leaks(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        attention = AttentionPatternAnalyzer.analyze(db, user_id, start_date, end_date)
        leaks = [
            {"from_task": t["from"], "to_task": t["to"], "occurrences": t["count"]}
            for t in attention["top_task_transitions"][:3]
        ]

        summary = (
            f"Attention most frequently leaks around hour(s) {attention['peak_distraction_hours']} (24h), "
            f"most often switching {leaks[0]['from_task']} -> {leaks[0]['to_task']}."
            if leaks
            else "Not enough task-switch data to identify a leak pattern yet."
        )

        return {
            "period_start": attention["period_start"],
            "period_end": attention["period_end"],
            "peak_leak_hours": attention["peak_distraction_hours"],
            "top_attention_leaks": leaks,
            "attention_stability_score": attention["attention_stability_score"],
            "summary": summary,
        }

    @staticmethod
    def generate_personalized_insights(
        db: Session, user_id: int, start_date: date | None = None, end_date: date | None = None
    ) -> dict[str, Any]:
        attention = AttentionPatternAnalyzer.analyze(db, user_id, start_date, end_date)
        focus = FocusSessionAnalyzer.analyze(db, user_id, start_date, end_date)
        productivity = ProductivityTrendAnalyzer.analyze(db, user_id, start_date, end_date)
        distraction = DistractionFrequencyAnalyzer.analyze(db, user_id, start_date, end_date)

        candidates = [
            (attention["attention_stability_score"], attention["summary"]),
            (focus["completion_rate"], focus["summary"]),
            (productivity["average_productivity_score"], productivity["summary"]),
            (distraction["distraction_control_score"], distraction["summary"]),
        ]
        ranked = sorted(candidates, key=lambda c: c[0])
        insights = [text for _, text in ranked]

        return {
            "period_start": attention["period_start"],
            "period_end": attention["period_end"],
            "prioritized_insights": insights,
            "scores": {
                "attention_stability": attention["attention_stability_score"],
                "focus_completion_rate": focus["completion_rate"],
                "productivity": productivity["average_productivity_score"],
                "distraction_control": distraction["distraction_control_score"],
            },
        }

    @staticmethod
    def daily_performance_summary(db: Session, user_id: int, day: date | None = None) -> dict[str, Any]:
        target_day = day or date.today()
        attention = AttentionPatternAnalyzer.analyze(db, user_id, target_day, target_day)
        focus = FocusSessionAnalyzer.analyze(db, user_id, target_day, target_day)
        productivity = ProductivityTrendAnalyzer.analyze(db, user_id, target_day, target_day)
        distraction = DistractionFrequencyAnalyzer.analyze(db, user_id, target_day, target_day)

        overall_score = round(
            statistics.mean(
                [
                    attention["attention_stability_score"],
                    focus["completion_rate"],
                    productivity["average_productivity_score"],
                    distraction["distraction_control_score"],
                ]
            ),
            2,
        )

        return {
            "date": target_day.isoformat(),
            "overall_score": overall_score,
            "attention_pattern": attention["pattern_label"],
            "focus_completion_rate": focus["completion_rate"],
            "productivity_score": productivity["average_productivity_score"],
            "distraction_pattern": distraction["pattern_label"],
            "summary": (
                f"Overall performance score for {target_day.isoformat()} is {overall_score}/100. "
                f"Attention was '{attention['pattern_label']}', focus completion was "
                f"{focus['completion_rate']}%, and distractions were '{distraction['pattern_label']}'."
            ),
        }
