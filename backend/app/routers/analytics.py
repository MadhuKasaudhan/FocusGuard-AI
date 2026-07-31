from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/weekly")
def get_weekly_analytics(
    day: date | None = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return AnalyticsService.calculate_weekly_scores(db, current_user.id, day)


@router.get("/monthly")
def get_monthly_analytics(
    day: date | None = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return AnalyticsService.calculate_monthly_scores(db, current_user.id, day)
