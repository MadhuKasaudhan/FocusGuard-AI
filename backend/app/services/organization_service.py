from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud import organization as crud


class OrganizationService:

    @staticmethod
    def create(db: Session, payload):
        return crud.create(db, payload)

    @staticmethod
    def list(db: Session):
        return crud.get_all(db)

    @staticmethod
    def get(db: Session, org_id: int):
        org = crud.get(db, org_id)

        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found",
            )

        return org

    @staticmethod
    def update(db: Session, org_id: int, payload):
        org = crud.get(db, org_id)

        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found",
            )

        return crud.update(db, org, payload)

    @staticmethod
    def delete(db: Session, org_id: int):
        org = crud.get(db, org_id)

        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found",
            )

        crud.delete(db, org)