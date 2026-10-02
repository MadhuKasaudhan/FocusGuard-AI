from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.schemas.notification_intelligence import (
    DistractionAlertResponse,
    FocusSessionAlertResponse,
    SmartReminderResponse,
)
from app.services.notification_intelligence_service import NotificationIntelligenceService

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("/smart-reminders", response_model=SmartReminderResponse)
def create_smart_reminders(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return NotificationIntelligenceService.generate_smart_reminders(db, current_user.id, start_date, end_date)


@router.post("/focus-session-alerts", response_model=FocusSessionAlertResponse)
def create_focus_session_alerts(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return NotificationIntelligenceService.generate_focus_session_alerts(
        db, current_user.id, start_date, end_date
    )


@router.post("/distraction-alerts", response_model=DistractionAlertResponse)
def create_distraction_alerts(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return NotificationIntelligenceService.generate_distraction_alerts(db, current_user.id, start_date, end_date)
