from typing import Any

from pydantic import BaseModel


class FocusImprovementResponse(BaseModel):
    period_start: str
    period_end: str
    completion_rate: float
    consistency_score: float
    switches_per_day: float
    suggestions: list[str]


class ProductivityTipsResponse(BaseModel):
    period_start: str
    period_end: str
    average_productivity_score: float
    trend: dict[str, Any]
    tips: list[str]


class AttentionRecoveryResponse(BaseModel):
    period_start: str
    period_end: str
    distraction_pattern: str
    attention_pattern: str
    recommendations: list[str]


class WorkPatternOptimizationResponse(BaseModel):
    period_start: str
    period_end: str
    average_duration_minutes: float
    recommended_work_block_minutes: int
    anchor_hour: int | None
    recommendation: str


class OptimalSessionsResponse(BaseModel):
    period_start: str
    period_end: str
    recommended_sessions: list[dict[str, Any]]
    summary: str


class BreakScheduleResponse(BaseModel):
    period_start: str
    period_end: str
    recommended_work_block_minutes: float
    recommended_break_minutes: int
    distraction_pattern: str
    summary: str


class HighFocusTimeResponse(BaseModel):
    period_start: str
    period_end: str
    high_focus_windows: list[dict[str, Any]]
    summary: str
