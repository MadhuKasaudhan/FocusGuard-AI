from typing import Any

from pydantic import BaseModel


class SmartReminderResponse(BaseModel):
    high_focus_windows: list[dict[str, Any]]
    reminders_created: list[dict[str, Any]]
    summary: str


class FocusSessionAlertResponse(BaseModel):
    period_start: str
    period_end: str
    incomplete_sessions_found: int
    alerts_created: list[dict[str, Any]]
    summary: str


class DistractionAlertResponse(BaseModel):
    period_start: str
    period_end: str
    distraction_pattern: str
    alerts_created: list[dict[str, Any]]
    summary: str
