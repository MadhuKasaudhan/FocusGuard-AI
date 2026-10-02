from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.schemas.recommendation_engine import (
    AttentionRecoveryResponse,
    BreakScheduleResponse,
    FocusImprovementResponse,
    HighFocusTimeResponse,
    OptimalSessionsResponse,
    ProductivityTipsResponse,
    WorkPatternOptimizationResponse,
)
from app.services.recommendation_engine_service import RecommendationEngineService
from app.services.smart_focus_planner_service import SmartFocusPlannerService

router = APIRouter(prefix="/recommendation", tags=["Recommendation"])


@router.get("/focus-improvements", response_model=FocusImprovementResponse)
def get_focus_improvements(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return RecommendationEngineService.suggest_focus_improvements(db, current_user.id, start_date, end_date)


@router.get("/productivity-tips", response_model=ProductivityTipsResponse)
def get_productivity_tips(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return RecommendationEngineService.personalized_productivity_tips(db, current_user.id, start_date, end_date)


@router.get("/attention-recovery", response_model=AttentionRecoveryResponse)
def get_attention_recovery(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return RecommendationEngineService.attention_recovery_recommendations(
        db, current_user.id, start_date, end_date
    )


@router.get("/work-pattern-optimization", response_model=WorkPatternOptimizationResponse)
def get_work_pattern_optimization(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return RecommendationEngineService.optimize_work_patterns(db, current_user.id, start_date, end_date)


@router.get("/optimal-sessions", response_model=OptimalSessionsResponse)
def get_optimal_sessions(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    top_n: int = Query(default=3, ge=1, le=10),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return SmartFocusPlannerService.recommend_optimal_sessions(
        db, current_user.id, start_date, end_date, top_n
    )


@router.get("/break-schedule", response_model=BreakScheduleResponse)
def get_break_schedule(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return SmartFocusPlannerService.suggest_break_schedule(db, current_user.id, start_date, end_date)


@router.get("/high-focus-time", response_model=HighFocusTimeResponse)
def get_high_focus_time(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    top_n: int = Query(default=3, ge=1, le=10),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return SmartFocusPlannerService.identify_high_focus_time(db, current_user.id, start_date, end_date, top_n)
