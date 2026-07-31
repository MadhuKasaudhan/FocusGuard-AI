from pydantic import BaseModel, EmailStr, Field


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

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: str | None = Field(default=None)
    email: EmailStr | None = Field(default=None)
    password: str | None = Field(default=None)
    is_active: bool | None = None