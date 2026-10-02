from sqlalchemy.orm import Session

from app.models.organization import Organization


def create(db: Session, payload):
    org = Organization(
        name=payload.name,
        company_email=payload.company_email,
        phone=payload.phone,
        address=payload.address,
    )

    db.add(org)
    db.commit()
    db.refresh(org)
    return org


def get_all(db: Session):
    return db.query(Organization).all()


def get(db: Session, org_id: int):
    return (
        db.query(Organization)
        .filter(Organization.id == org_id)
        .first()
    )


def update(db: Session, org: Organization, payload):
    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(org, key, value)

    db.commit()
    db.refresh(org)
    return org


def delete(db: Session, org: Organization):
    db.delete(org)
    db.commit()