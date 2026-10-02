from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.core.roles import (
    ROLE_SUPER_ADMIN,
    ROLE_SUB_ADMIN,
)

from app.models.user import User
from app.schemas.user import (
    UserRead,
    UserRoleUpdate,
    UserStatusUpdate,
    InviteRequest,
    InviteResponse,
    CreateSubAdmin,
)
from app.services.admin_service import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)


@router.get("/dashboard")
def admin_dashboard(
    current_user: User = Depends(
        require_role(ROLE_SUPER_ADMIN)
    ),
    db: Session = Depends(get_db),
):
    return AdminService.dashboard(db)


@router.get("/users", response_model=list[UserRead])
def list_users(
    current_user: User = Depends(
        require_role(
            ROLE_SUB_ADMIN,
            ROLE_SUPER_ADMIN,
        )
    ),
    db: Session = Depends(get_db),
):
    return AdminService.list_users(db, current_user)


@router.get("/users/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    current_user: User = Depends(
        require_role(
            ROLE_SUB_ADMIN,
            ROLE_SUPER_ADMIN,
        )
    ),
    db: Session = Depends(get_db),
):
    return AdminService.get_user(
        db,
        current_user,
        user_id,
    )


@router.patch("/users/{user_id}/role", response_model=UserRead)
def update_role(
    user_id: int,
    payload: UserRoleUpdate,
    current_user: User = Depends(
        require_role(
            ROLE_SUPER_ADMIN,
        )
    ),
    db: Session = Depends(get_db),
):
    return AdminService.update_role(
        db,
        current_user,
        user_id,
        payload.role,
    )


@router.patch("/users/{user_id}/status", response_model=UserRead)
def update_status(
    user_id: int,
    payload: UserStatusUpdate,
    current_user: User = Depends(
        require_role(
            ROLE_SUB_ADMIN,
            ROLE_SUPER_ADMIN,
        )
    ),
    db: Session = Depends(get_db),
):
    return AdminService.update_status(
        db,
        current_user,
        user_id,
        payload.is_active,
    )


@router.delete(
    "/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(
    user_id: int,
    current_user: User = Depends(
        require_role(
            ROLE_SUPER_ADMIN,
        )
    ),
    db: Session = Depends(get_db),
):
    AdminService.delete_user(
        db,
        current_user,
        user_id,
    )


@router.post(
    "/invite",
    response_model=InviteResponse,
)
def invite_user(
    payload: InviteRequest,
    current_user: User = Depends(
        require_role(
            ROLE_SUB_ADMIN,
            ROLE_SUPER_ADMIN,
        )
    ),
    db: Session = Depends(get_db),
):
    user, password = AdminService.invite_user(
        db,
        current_user,
        payload.name,
        payload.email,
    )

    return InviteResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        temporary_password=password,
    )


@router.post(
    "/sub-admin",
    response_model=UserRead,
)
def create_sub_admin(
    payload: CreateSubAdmin,
    current_user: User = Depends(
        require_role(
            ROLE_SUPER_ADMIN,
        )
    ),
    db: Session = Depends(get_db),
):
    return AdminService.create_sub_admin(
        db,
        payload,
    )