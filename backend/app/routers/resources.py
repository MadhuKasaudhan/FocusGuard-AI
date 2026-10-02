from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.activity_log import ActivityLog
from app.models.application_usage import ApplicationUsage
from app.models.focus_session import FocusSession
from app.models.goal import Goal
from app.models.notification_log import NotificationLog
from app.models.profile import Profile
from app.models.user import User
from app.schemas.domain import (
    ActivityLogCreate,
    ActivityLogRead,
    ActivityLogUpdate,
    ApplicationUsageCreate,
    ApplicationUsageRead,
    ApplicationUsageUpdate,
    FocusSessionCreate,
    FocusSessionRead,
    FocusSessionUpdate,
    GoalCreate,
    GoalRead,
    GoalUpdate,
    NotificationLogCreate,
    NotificationLogRead,
    NotificationLogUpdate,
    ProfileCreate,
    ProfileRead,
    ProfileUpdate,
)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


# Profile endpoints
@router.get("/profiles/me", response_model=ProfileRead)
def get_profile(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return profile


@router.post("/profiles/me", response_model=ProfileRead, status_code=status.HTTP_201_CREATED)
def create_profile(
    payload: ProfileCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Profile:
    existing = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Profile already exists")

    profile = Profile(user_id=current_user.id, **payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.put("/profiles/me", response_model=ProfileRead)
def update_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile


# Goal endpoints
@router.get("/goals", response_model=list[GoalRead])
def list_goals(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> list[Goal]:
    return db.query(Goal).filter(Goal.user_id == current_user.id).order_by(Goal.created_at.desc()).all()


@router.post("/goals", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Goal:
    goal = Goal(user_id=current_user.id, **payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/goals/{goal_id}", response_model=GoalRead)
def get_goal(goal_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> Goal:
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return goal


@router.put("/goals/{goal_id}", response_model=GoalRead)
def update_goal(
    goal_id: int,
    payload: GoalUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Goal:
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(goal, key, value)

    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/goals/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> None:
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    db.delete(goal)
    db.commit()


# Activity log endpoints
@router.get("/activity-logs", response_model=list[ActivityLogRead])
def list_activity_logs(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[ActivityLog]:
    return db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id).order_by(ActivityLog.created_at.desc()).all()


@router.post("/activity-logs", response_model=ActivityLogRead, status_code=status.HTTP_201_CREATED)
def create_activity_log(
    payload: ActivityLogCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ActivityLog:
    activity_log = ActivityLog(user_id=current_user.id, **payload.model_dump())
    db.add(activity_log)
    db.commit()
    db.refresh(activity_log)
    return activity_log


@router.get("/activity-logs/{activity_log_id}", response_model=ActivityLogRead)
def get_activity_log(
    activity_log_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ActivityLog:
    activity_log = db.query(ActivityLog).filter(ActivityLog.id == activity_log_id, ActivityLog.user_id == current_user.id).first()
    if not activity_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity log not found")
    return activity_log


@router.put("/activity-logs/{activity_log_id}", response_model=ActivityLogRead)
def update_activity_log(
    activity_log_id: int,
    payload: ActivityLogUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ActivityLog:
    activity_log = db.query(ActivityLog).filter(ActivityLog.id == activity_log_id, ActivityLog.user_id == current_user.id).first()
    if not activity_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity log not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(activity_log, key, value)

    db.commit()
    db.refresh(activity_log)
    return activity_log


@router.delete("/activity-logs/{activity_log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity_log(
    activity_log_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> None:
    activity_log = db.query(ActivityLog).filter(ActivityLog.id == activity_log_id, ActivityLog.user_id == current_user.id).first()
    if not activity_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity log not found")
    db.delete(activity_log)
    db.commit()


# Focus session endpoints
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


@router.get("/focus-sessions/{focus_session_id}", response_model=FocusSessionRead)
def get_focus_session(
    focus_session_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> FocusSession:
    focus_session = db.query(FocusSession).filter(FocusSession.id == focus_session_id, FocusSession.user_id == current_user.id).first()
    if not focus_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Focus session not found")
    return focus_session


@router.put("/focus-sessions/{focus_session_id}", response_model=FocusSessionRead)
def update_focus_session(
    focus_session_id: int,
    payload: FocusSessionUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> FocusSession:
    focus_session = db.query(FocusSession).filter(FocusSession.id == focus_session_id, FocusSession.user_id == current_user.id).first()
    if not focus_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Focus session not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(focus_session, key, value)

    db.commit()
    db.refresh(focus_session)
    return focus_session


@router.delete("/focus-sessions/{focus_session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_focus_session(
    focus_session_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> None:
    focus_session = db.query(FocusSession).filter(FocusSession.id == focus_session_id, FocusSession.user_id == current_user.id).first()
    if not focus_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Focus session not found")
    db.delete(focus_session)
    db.commit()


# Notification endpoints
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


@router.get("/notifications/{notification_id}", response_model=NotificationLogRead)
def get_notification(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> NotificationLog:
    notification = db.query(NotificationLog).filter(NotificationLog.id == notification_id, NotificationLog.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification


@router.put("/notifications/{notification_id}", response_model=NotificationLogRead)
def update_notification(
    notification_id: int,
    payload: NotificationLogUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> NotificationLog:
    notification = db.query(NotificationLog).filter(NotificationLog.id == notification_id, NotificationLog.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(notification, key, value)

    db.commit()
    db.refresh(notification)
    return notification


@router.delete("/notifications/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> None:
    notification = db.query(NotificationLog).filter(NotificationLog.id == notification_id, NotificationLog.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    db.delete(notification)
    db.commit()


# Application usage endpoints
@router.get("/application-usage", response_model=list[ApplicationUsageRead])
def list_application_usage(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[ApplicationUsage]:
    return db.query(ApplicationUsage).filter(ApplicationUsage.user_id == current_user.id).order_by(ApplicationUsage.recorded_at.desc()).all()


@router.post("/application-usage", response_model=ApplicationUsageRead, status_code=status.HTTP_201_CREATED)
def create_application_usage(
    payload: ApplicationUsageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ApplicationUsage:
    usage = ApplicationUsage(user_id=current_user.id, **payload.model_dump())
    db.add(usage)
    db.commit()
    db.refresh(usage)
    return usage


@router.get("/application-usage/{usage_id}", response_model=ApplicationUsageRead)
def get_application_usage(
    usage_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ApplicationUsage:
    usage = db.query(ApplicationUsage).filter(ApplicationUsage.id == usage_id, ApplicationUsage.user_id == current_user.id).first()
    if not usage:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application usage not found")
    return usage


@router.put("/application-usage/{usage_id}", response_model=ApplicationUsageRead)
def update_application_usage(
    usage_id: int,
    payload: ApplicationUsageUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ApplicationUsage:
    usage = db.query(ApplicationUsage).filter(ApplicationUsage.id == usage_id, ApplicationUsage.user_id == current_user.id).first()
    if not usage:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application usage not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(usage, key, value)

    db.commit()
    db.refresh(usage)
    return usage


@router.delete("/application-usage/{usage_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application_usage(
    usage_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> None:
    usage = db.query(ApplicationUsage).filter(ApplicationUsage.id == usage_id, ApplicationUsage.user_id == current_user.id).first()
    if not usage:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application usage not found")
    db.delete(usage)
    db.commit()
