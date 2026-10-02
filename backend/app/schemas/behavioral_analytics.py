from datetime import datetime
from typing import Any

from pydantic import BaseModel


class TrendInfo(BaseModel):
    slope: float
    direction: str
    confidence: float


class AttentionPatternResponse(BaseModel):
    period_start: str
    period_end: str
    total_task_switches: int
    switches_per_day: float
    average_gap_between_switches_minutes: float | None
    average_screen_window_minutes: float | None
    peak_distraction_hours: list[int]
    hourly_switch_histogram: dict[int, int]
    top_task_transitions: list[dict[str, Any]]
    attention_stability_score: float
    pattern_label: str
    summary: str
    ai_insight: str | None = None


class FocusSessionAnalysisResponse(BaseModel):
    period_start: str
    period_end: str
    total_sessions: int
    completed_sessions: int
    completion_rate: float
    average_duration_minutes: float
    median_duration_minutes: float
    consistency_score: float
    best_focus_hour: int | None
    duration_trend: TrendInfo
    anomalous_sessions: list[dict[str, Any]]
    pattern_label: str
    summary: str
    ai_insight: str | None = None


class ProductivityTrendResponse(BaseModel):
    period_start: str
    period_end: str
    daily_scores: list[dict[str, Any]]
    average_productivity_score: float
    trend: TrendInfo
    best_day: dict[str, Any] | None
    worst_day: dict[str, Any] | None
    total_productive_minutes: int
    total_unproductive_minutes: int
    summary: str
    ai_insight: str | None = None


class DistractionFrequencyResponse(BaseModel):
    period_start: str
    period_end: str
    total_distractions: int
    distractions_per_day: float
    peak_distraction_hours: list[int]
    hourly_histogram: dict[int, int]
    channel_breakdown: dict[str, int]
    daily_counts: list[dict[str, Any]]
    trend: TrendInfo
    anomalous_days: list[dict[str, Any]]
    distraction_control_score: float
    pattern_label: str
    summary: str
    ai_insight: str | None = None


class BehavioralSummaryResponse(BaseModel):
    attention_pattern: AttentionPatternResponse
    focus_session: FocusSessionAnalysisResponse
    productivity_trend: ProductivityTrendResponse
    distraction_frequency: DistractionFrequencyResponse


class BehavioralInsightRead(BaseModel):
    id: int
    user_id: int
    insight_type: str
    period_start: datetime
    period_end: datetime
    score: float | None
    pattern_label: str | None
    summary: str | None
    metrics: dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True