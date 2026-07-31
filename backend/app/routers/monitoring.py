from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.application_usage import ApplicationUsage
from app.models.focus_session import FocusSession
from app.models.notification_log import NotificationLog
from app.models.screen_time_event import ScreenTimeEvent
from app.models.task_switch_event import TaskSwitchEvent
from app.models.user import User
from app.schemas.domain import (
    ApplicationUsageCreate,
    ApplicationUsageRead,
    ApplicationUsageUpdate,
    FocusSessionCreate,
    FocusSessionRead,
    FocusSessionUpdate,
    NotificationLogCreate,
    NotificationLogRead,
    NotificationLogUpdate,
    ScreenTimeEventCreate,
    ScreenTimeEventRead,
    ScreenTimeEventUpdate,
    TaskSwitchEventCreate,
    TaskSwitchEventRead,
    TaskSwitchEventUpdate,
)

router = APIRouter(prefix="/monitoring", tags=["monitoring"])


# Screen time endpoints
@router.get("/screen-time", response_model=list[ScreenTimeEventRead])
def list_screen_time_events(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[ScreenTimeEvent]:
    return db.query(ScreenTimeEvent).filter(ScreenTimeEvent.user_id == current_user.id).order_by(ScreenTimeEvent.captured_at.desc()).all()


@router.post("/screen-time", response_model=ScreenTimeEventRead, status_code=status.HTTP_201_CREATED)
def create_screen_time_event(
    payload: ScreenTimeEventCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ScreenTimeEvent:
    event = ScreenTimeEvent(user_id=current_user.id, **payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/screen-time/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_screen_time_event(
    event_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> None:
    event = db.query(ScreenTimeEvent).filter(ScreenTimeEvent.id == event_id, ScreenTimeEvent.user_id == current_user.id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Screen time event not found")
    db.delete(event)
    db.commit()


# App usage endpoints
@router.get("/app-usage", response_model=list[ApplicationUsageRead])
def list_app_usage(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[ApplicationUsage]:
    return db.query(ApplicationUsage).filter(ApplicationUsage.user_id == current_user.id).order_by(ApplicationUsage.recorded_at.desc()).all()


@router.post("/app-usage", response_model=ApplicationUsageRead, status_code=status.HTTP_201_CREATED)
def create_app_usage(
    payload: ApplicationUsageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ApplicationUsage:
    usage = ApplicationUsage(user_id=current_user.id, **payload.model_dump())
    db.add(usage)
    db.commit()
    db.refresh(usage)
    return usage


# Task switching endpoints
@router.get("/task-switches", response_model=list[TaskSwitchEventRead])
def list_task_switches(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[TaskSwitchEvent]:
    return db.query(TaskSwitchEvent).filter(TaskSwitchEvent.user_id == current_user.id).order_by(TaskSwitchEvent.switched_at.desc()).all()


@router.post("/task-switches", response_model=TaskSwitchEventRead, status_code=status.HTTP_201_CREATED)
def create_task_switch(
    payload: TaskSwitchEventCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> TaskSwitchEvent:
    event = TaskSwitchEvent(user_id=current_user.id, **payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


# Notification logging endpoints
@router.get("/notifications", response_model=list[NotificationLogRead])
def list_notifications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[NotificationLog]:
    return db.query(NotificationLog).filter(NotificationLog.user_id == current_user.id).order_by(NotificationLog.created_at.desc()).all()


@router.post("/notifications", response_model=NotificationLogRead, status_code=status.HTTP_201_CREATED)
def create_notification(
    payload: NotificationLogCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> NotificationLog:
    notification = NotificationLog(user_id=current_user.id, **payload.model_dump())
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


# Focus session recording endpoints
@router.get("/focus-sessions", response_model=list[FocusSessionRead])
def list_focus_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[FocusSession]:
    return db.query(FocusSession).filter(FocusSession.user_id == current_user.id).order_by(FocusSession.started_at.desc()).all()


@router.post("/focus-sessions", response_model=FocusSessionRead, status_code=status.HTTP_201_CREATED)
def create_focus_session(
    payload: FocusSessionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> FocusSession:
    focus_session = FocusSession(user_id=current_user.id, **payload.model_dump())
    db.add(focus_session)
    db.commit()
    db.refresh(focus_session)
    return focus_session
