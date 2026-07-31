from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models import BehavioralInsight


def create_insight(
    db: Session,
    *,
    user_id: int,
    insight_type: str,
    period_start: datetime,
    period_end: datetime,
    score: float | None,
    pattern_label: str | None,
    summary: str | None,
    metrics: dict[str, Any],
) -> BehavioralInsight:
    insight = BehavioralInsight(
        user_id=user_id,
        insight_type=insight_type,
        period_start=period_start,
        period_end=period_end,
        score=score,
        pattern_label=pattern_label,
        summary=summary,
        metrics=metrics,
    )
    db.add(insight)
    db.commit()
    db.refresh(insight)
    return insight


def get_insight(db: Session, insight_id: int, user_id: int) -> BehavioralInsight | None:
    return (
        db.query(BehavioralInsight)
        .filter(BehavioralInsight.id == insight_id, BehavioralInsight.user_id == user_id)
        .first()
    )


def list_insights(
    db: Session,
    user_id: int,
    insight_type: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[BehavioralInsight]:
    query = db.query(BehavioralInsight).filter(BehavioralInsight.user_id == user_id)
    if insight_type:
        query = query.filter(BehavioralInsight.insight_type == insight_type)
    return (
        query.order_by(BehavioralInsight.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def delete_insight(db: Session, insight_id: int, user_id: int) -> bool:
    insight = get_insight(db, insight_id, user_id)
    if not insight:
        return False
    db.delete(insight)
    db.commit()
    return True
