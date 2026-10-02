from pydantic import BaseModel, EmailStr, Field

class CreateSubAdmin(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserBase(BaseModel):
    name: str = Field(
        example="Madhu Kasaudhan",
        description="Full name of the user"
    )
    email: EmailStr = Field(
        example="madhu@gmail.com",
        description="User email address"
    )


class UserCreate(UserBase):
    password: str = Field(
        example="Madhu123",
        description="User password"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Madhu Kasaudhan",
                "email": "madhu@gmail.com",
                "password": "Madhu123"
            }
        }
    }


class UserRead(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    role: str

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: str | None = Field(default=None)
    email: EmailStr | None = Field(default=None)
    password: str | None = Field(default=None)
    is_active: bool | None = None


class UserRoleUpdate(BaseModel):
    role: str = Field(description="One of: user, subadmin, superadmin")


class UserStatusUpdate(BaseModel):
    is_active: bool


class InviteRequest(BaseModel):
    name: str
    email: EmailStr


class InviteResponse(BaseModel):
    id: int
    name: str
    email: str
    temporary_password: str
