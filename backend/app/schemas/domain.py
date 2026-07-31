from datetime import datetime

from pydantic import BaseModel


class ProfileBase(BaseModel):
    full_name: str | None = None
    avatar_url: str | None = None
    timezone: str = "UTC"
    preferred_focus_hours: int = 4
    bio: str | None = None


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass


class ProfileRead(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GoalBase(BaseModel):
    title: str
    description: str | None = None
    target_value: int = 1
    unit: str = "times"
    due_date: datetime | None = None
    completed: bool = False


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    target_value: int | None = None
    unit: str | None = None
    due_date: datetime | None = None
    completed: bool | None = None


class GoalRead(GoalBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ActivityLogBase(BaseModel):
    action: str
    details: str | None = None


class ActivityLogCreate(ActivityLogBase):
    pass


class ActivityLogUpdate(BaseModel):
    action: str | None = None
    details: str | None = None


class ActivityLogRead(ActivityLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FocusSessionBase(BaseModel):
    started_at: datetime | None = None
    ended_at: datetime | None = None
    duration_minutes: int = 0
    notes: str | None = None
    is_completed: bool = False


class FocusSessionCreate(FocusSessionBase):
    pass


class FocusSessionUpdate(BaseModel):
    started_at: datetime | None = None
    ended_at: datetime | None = None
    duration_minutes: int | None = None
    notes: str | None = None
    is_completed: bool | None = None


class FocusSessionRead(FocusSessionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationLogBase(BaseModel):
    message: str
    channel: str = "in_app"
    is_read: bool = False


class NotificationLogCreate(NotificationLogBase):
    pass


class NotificationLogUpdate(BaseModel):
    message: str | None = None
    channel: str | None = None
    is_read: bool | None = None


class NotificationLogRead(NotificationLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ApplicationUsageBase(BaseModel):
    app_name: str
    usage_minutes: int = 0
    category: str | None = None
    recorded_at: datetime | None = None


class ApplicationUsageCreate(ApplicationUsageBase):
    pass


class ApplicationUsageUpdate(BaseModel):
    app_name: str | None = None
    usage_minutes: int | None = None
    category: str | None = None
    recorded_at: datetime | None = None


class ApplicationUsageRead(ApplicationUsageBase):
    id: int
    user_id: int
    recorded_at: datetime

    class Config:
        from_attributes = True


class ScreenTimeEventBase(BaseModel):
    duration_seconds: int = 0
    captured_at: datetime | None = None
    window_title: str | None = None


class ScreenTimeEventCreate(ScreenTimeEventBase):
    pass


class ScreenTimeEventUpdate(BaseModel):
    duration_seconds: int | None = None
    captured_at: datetime | None = None
    window_title: str | None = None


class ScreenTimeEventRead(ScreenTimeEventBase):
    id: int
    user_id: int
    captured_at: datetime

    class Config:
        from_attributes = True


class TaskSwitchEventBase(BaseModel):
    previous_task: str | None = None
    next_task: str | None = None
    switched_at: datetime | None = None


class TaskSwitchEventCreate(TaskSwitchEventBase):
    pass


class TaskSwitchEventUpdate(BaseModel):
    previous_task: str | None = None
    next_task: str | None = None
    switched_at: datetime | None = None


class TaskSwitchEventRead(TaskSwitchEventBase):
    id: int
    user_id: int
    switched_at: datetime

    class Config:
        from_attributes = True
