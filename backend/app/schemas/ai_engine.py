from typing import Any

from pydantic import BaseModel


class TrendInfo(BaseModel):
    slope: float
    direction: str
    confidence: float


class FrequentInterruptionsResponse(BaseModel):
    period_start: str
    period_end: str
    total_distractions: int
    distractions_per_day: float
    is_frequent_interruption_pattern: bool
    threshold_per_day: float
    summary: str

    class Config:
        extra = "allow"


class ContextSwitchingResponse(BaseModel):
    period_start: str
    period_end: str
    total_switches: int
    switches_per_day: float
    severity: str
    top_transitions: list[dict[str, Any]]
    peak_switching_hours: list[int]
    summary: str


class NotificationImpactResponse(BaseModel):
    period_start: str
    period_end: str
    total_notifications: int
    sessions_interrupted: int
    sessions_uninterrupted: int
    completion_rate_when_interrupted: float | None
    completion_rate_when_uninterrupted: float | None
    estimated_completion_impact: float | None
    summary: str


class FocusLossResponse(BaseModel):
    period_start: str
    period_end: str
    total_sessions: int
    focus_loss_events: list[dict[str, Any]]
    focus_loss_rate: float
    average_expected_duration_minutes: float
    summary: str


class FocusScoresResponse(BaseModel):
    period_start: str | None
    period_end: str | None
    daily_scores: list[dict[str, Any]]
    average_daily_focus_score: float
    average_productivity_score: float
    average_attention_stability_score: float
    concentration_trend: TrendInfo
    summary: str


class FocusDegradationResponse(BaseModel):
    period_start: str | None
    period_end: str | None
    daily_completion_rates: list[float]
    trend: TrendInfo
    projected_next_day_completion_rate: float | None
    degradation_risk: str
    summary: str


class ProductivityRiskResponse(BaseModel):
    period_start: str
    period_end: str
    productivity_trend: TrendInfo
    distraction_pattern: str
    risk_signals: list[str]
    productivity_risk_level: str
    summary: str


class AttentionFatigueResponse(BaseModel):
    period_start: str
    period_end: str
    time_of_day_breakdown: dict[str, dict[str, Any]]
    fatigue_detected: bool
    summary: str


class AttentionLeaksResponse(BaseModel):
    period_start: str
    period_end: str
    peak_leak_hours: list[int]
    top_attention_leaks: list[dict[str, Any]]
    attention_stability_score: float
    summary: str


class PersonalizedInsightsResponse(BaseModel):
    period_start: str
    period_end: str
    prioritized_insights: list[str]
    scores: dict[str, float]


class DailyPerformanceSummaryResponse(BaseModel):
    date: str
    overall_score: float
    attention_pattern: str
    focus_completion_rate: float
    productivity_score: float
    distraction_pattern: str
    summary: str
