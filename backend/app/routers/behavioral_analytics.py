from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud import behavioral_insight as behavioral_insight_crud
from app.models.user import User
from app.schemas.behavioral_analytics import (
    AttentionPatternResponse,
    BehavioralInsightRead,
    BehavioralSummaryResponse,
    DistractionFrequencyResponse,
    FocusSessionAnalysisResponse,
    ProductivityTrendResponse,
)
from app.services.behavioral_analytics_service import BehavioralAnalyticsService

router = APIRouter(prefix="/behavioral-analytics", tags=["behavioral-analytics"])


@router.get("/attention-patterns", response_model=AttentionPatternResponse)
def get_attention_pattern_analysis(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    save: bool = Query(default=True, description="Persist this computed insight to history"),
    ai: bool = Query(default=False, description="Include an LLM-generated natural-language insight"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return BehavioralAnalyticsService.attention_pattern_analysis(db, current_user.id, start_date, end_date, save, ai)


@router.get("/focus-sessions", response_model=FocusSessionAnalysisResponse)
def get_focus_session_analysis(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    save: bool = Query(default=True, description="Persist this computed insight to history"),
    ai: bool = Query(default=False, description="Include an LLM-generated natural-language insight"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return BehavioralAnalyticsService.focus_session_analysis(db, current_user.id, start_date, end_date, save, ai)


@router.get("/productivity-trend", response_model=ProductivityTrendResponse)
def get_productivity_trend_analysis(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    productive_categories: str | None = Query(
        default=None,
        description="Comma-separated app-usage categories treated as productive, e.g. 'work,coding,study'",
    ),
    save: bool = Query(default=True, description="Persist this computed insight to history"),
    ai: bool = Query(default=False, description="Include an LLM-generated natural-language insight"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    categories = (
        {c.strip().lower() for c in productive_categories.split(",") if c.strip()}
        if productive_categories
        else None
    )
    return BehavioralAnalyticsService.productivity_trend_analysis(
        db, current_user.id, start_date, end_date, categories, save, ai
    )


@router.get("/distraction-frequency", response_model=DistractionFrequencyResponse)
def get_distraction_frequency_analysis(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    save: bool = Query(default=True, description="Persist this computed insight to history"),
    ai: bool = Query(default=False, description="Include an LLM-generated natural-language insight"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return BehavioralAnalyticsService.distraction_frequency_analysis(
        db, current_user.id, start_date, end_date, save, ai
    )


@router.get("/summary", response_model=BehavioralSummaryResponse)
def get_behavioral_summary(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    save: bool = Query(default=True, description="Persist each computed insight to history"),
    ai: bool = Query(default=False, description="Include LLM-generated insights for each analysis"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return BehavioralAnalyticsService.full_report(db, current_user.id, start_date, end_date, save, ai)


@router.get("/insights", response_model=list[BehavioralInsightRead])
def list_behavioral_insights(
    insight_type: str | None = Query(default=None),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list:
    return behavioral_insight_crud.list_insights(db, current_user.id, insight_type, limit, offset)


@router.get("/insights/{insight_id}", response_model=BehavioralInsightRead)
def get_behavioral_insight(
    insight_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    insight = behavioral_insight_crud.get_insight(db, insight_id, current_user.id)
    if not insight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Insight not found")
    return insight


@router.delete("/insights/{insight_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_behavioral_insight(
    insight_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    deleted = behavioral_insight_crud.delete_insight(db, insight_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Insight not found")