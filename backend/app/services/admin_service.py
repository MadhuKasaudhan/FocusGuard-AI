"""
Admin Service
==============
Permission model:
    - Super Admin: can view, change roles, activate/deactivate,
      invite and delete any user.
    - Sub Admin: can only view and manage normal users.
"""

import secrets

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import (
    ROLE_USER,
    ROLE_SUB_ADMIN,
    ROLE_SUPER_ADMIN,
)
from app.core.security import get_password_hash
from app.crud import admin_user as admin_user_crud
from app.crud.admin_user import VALID_ROLES
from app.models.user import User


class AdminService:

    @staticmethod
    def dashboard(db: Session):
        return {
            "total_users": db.query(User).count(),
            "total_sub_admins": db.query(User)
            .filter(User.role == ROLE_SUB_ADMIN)
            .count(),
            "active_users": db.query(User)
            .filter(User.is_active == True)
            .count(),
            "inactive_users": db.query(User)
            .filter(User.is_active == False)
            .count(),
        }

    @staticmethod
    def list_users(db: Session, current_user: User) -> list[User]:
        if current_user.role == ROLE_SUPER_ADMIN:
            return admin_user_crud.list_users(db)

        return admin_user_crud.list_users(
            db,
            roles=[ROLE_USER],
        )

    @staticmethod
    def get_user(
        db: Session,
        current_user: User,
        user_id: int,
    ) -> User:

        target = admin_user_crud.get_user(db, user_id)

        if not target:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if (
            current_user.role != ROLE_SUPER_ADMIN
            and target.role != ROLE_USER
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not permitted to view this account",
            )

        return target

    @staticmethod
    def update_role(
        db: Session,
        current_user: User,
        user_id: int,
        new_role: str,
    ) -> User:

        if current_user.role != ROLE_SUPER_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Super Admin can change roles",
            )

        if new_role not in VALID_ROLES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role must be one of {VALID_ROLES}",
            )

        target = admin_user_crud.get_user(db, user_id)

        if not target:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if (
            target.id == current_user.id
            and new_role != ROLE_SUPER_ADMIN
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot demote your own account",
            )

        return admin_user_crud.update_role(
            db,
            target,
            new_role,
        )

    @staticmethod
    def update_status(
        db: Session,
        current_user: User,
        user_id: int,
        is_active: bool,
    ) -> User:

        target = admin_user_crud.get_user(db, user_id)

        if not target:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if (
            current_user.role != ROLE_SUPER_ADMIN
            and target.role != ROLE_USER
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not permitted to modify this account",
            )

        if target.id == current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot deactivate your own account",
            )

        return admin_user_crud.update_status(
            db,
            target,
            is_active,
        )

    @staticmethod
    def delete_user(
        db: Session,
        current_user: User,
        user_id: int,
    ) -> None:

        target = admin_user_crud.get_user(db, user_id)

        if not target:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if target.id == current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot delete your own account",
            )

        admin_user_crud.delete_user(db, target)

    @staticmethod
    def invite_user(
        db: Session,
        current_user: User,
        name: str,
        email: str,
    ):

        existing = db.query(User).filter(
            User.email == email
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        temporary_password = secrets.token_urlsafe(9)

        user = User(
            name=name,
            email=email,
            hashed_password=get_password_hash(
                temporary_password
            ),
            role=ROLE_USER,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user, temporary_password

    @staticmethod
    def create_sub_admin(
        db: Session,
        name: str,
        email: str,
        password: str,
    ):

        existing = db.query(User).filter(
            User.email == email
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists",
            )

        user = User(
            name=name,
            email=email,
            hashed_password=get_password_hash(password),
            role=ROLE_SUB_ADMIN,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user
    
    
    @staticmethod
    def create_sub_admin(db: Session, payload):
        existing = db.query(User).filter(
            User.email == payload.email
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists",
            )

        user = User(
            name=payload.name,
            email=payload.email,
            hashed_password=get_password_hash(payload.password),
            role=ROLE_SUB_ADMIN,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user