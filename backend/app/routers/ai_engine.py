from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.schemas.ai_engine import (
    AttentionFatigueResponse,
    AttentionLeaksResponse,
    ContextSwitchingResponse,
    DailyPerformanceSummaryResponse,
    FocusDegradationResponse,
    FocusLossResponse,
    FocusScoresResponse,
    FrequentInterruptionsResponse,
    NotificationImpactResponse,
    PersonalizedInsightsResponse,
    ProductivityRiskResponse,
)
from app.services.distraction_detection_service import DistractionDetectionService
from app.services.focus_scoring_service import FocusScoringService
from app.services.insight_generation_service import InsightGenerationService
from app.services.predictive_analytics_service import PredictiveAnalyticsService

router = APIRouter(prefix="/ai", tags=["AI"])


@router.get("/interruptions", response_model=FrequentInterruptionsResponse)
def get_frequent_interruptions(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return DistractionDetectionService.detect_frequent_interruptions(db, current_user.id, start_date, end_date)


@router.get("/context-switching", response_model=ContextSwitchingResponse)
def get_context_switching(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return DistractionDetectionService.analyze_context_switching(db, current_user.id, start_date, end_date)


@router.get("/notification-impact", response_model=NotificationImpactResponse)
def get_notification_impact(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return DistractionDetectionService.assess_notification_impact(db, current_user.id, start_date, end_date)


@router.get("/focus-loss", response_model=FocusLossResponse)
def get_focus_loss(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return DistractionDetectionService.identify_focus_loss(db, current_user.id, start_date, end_date)


@router.get("/focus-scores", response_model=FocusScoresResponse)
def get_focus_scores(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return FocusScoringService.generate_scores(db, current_user.id, start_date, end_date)


@router.get("/focus-degradation-prediction", response_model=FocusDegradationResponse)
def get_focus_degradation_prediction(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return PredictiveAnalyticsService.predict_focus_degradation(db, current_user.id, start_date, end_date)


@router.get("/productivity-risk", response_model=ProductivityRiskResponse)
def get_productivity_risk(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return PredictiveAnalyticsService.detect_productivity_risk(db, current_user.id, start_date, end_date)


@router.get("/attention-fatigue", response_model=AttentionFatigueResponse)
def get_attention_fatigue(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return PredictiveAnalyticsService.analyze_attention_fatigue(db, current_user.id, start_date, end_date)


@router.get("/attention-leaks", response_model=AttentionLeaksResponse)
def get_attention_leaks(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return InsightGenerationService.identify_attention_leaks(db, current_user.id, start_date, end_date)


@router.get("/personalized-insights", response_model=PersonalizedInsightsResponse)
def get_personalized_insights(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return InsightGenerationService.generate_personalized_insights(db, current_user.id, start_date, end_date)


@router.get("/daily-summary", response_model=DailyPerformanceSummaryResponse)
def get_daily_performance_summary(
    day: date | None = Query(default=None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return InsightGenerationService.daily_performance_summary(db, current_user.id, day)
