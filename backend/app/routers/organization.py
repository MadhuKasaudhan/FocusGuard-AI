from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.core.roles import ROLE_SUPER_ADMIN
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationRead,
)
from app.services.organization_service import OrganizationService

router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
)


@router.post("/", response_model=OrganizationRead)
def create_organization(
    payload: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(ROLE_SUPER_ADMIN)),
):
    return OrganizationService.create(db, payload)


@router.get("/", response_model=list[OrganizationRead])
def list_organizations(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(ROLE_SUPER_ADMIN)),
):
    return OrganizationService.list(db)


@router.get("/{organization_id}", response_model=OrganizationRead)
def get_organization(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(ROLE_SUPER_ADMIN)),
):
    return OrganizationService.get(db, organization_id)


@router.put("/{organization_id}", response_model=OrganizationRead)
def update_organization(
    organization_id: int,
    payload: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(ROLE_SUPER_ADMIN)),
):
    return OrganizationService.update(
        db,
        organization_id,
        payload,
    )


@router.delete("/{organization_id}")
def delete_organization(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(ROLE_SUPER_ADMIN)),
):
    OrganizationService.delete(db, organization_id)

    return {
        "message": "Organization deleted successfully"
    }