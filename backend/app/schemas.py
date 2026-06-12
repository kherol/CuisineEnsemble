from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str
    email: EmailStr
    district: str | None = None
    dietary_preferences: str | None = None
    allergies: str | None = None


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserUpdate(BaseModel):
    name: str | None = None
    district: str | None = None
    dietary_preferences: str | None = None
    allergies: str | None = None


class UserOut(UserBase):
    id: int
    role: str
    is_active: bool
    average_rating: float
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class MealBase(BaseModel):
    title: str
    description: str
    meal_datetime: datetime
    location: str
    district: str | None = None
    total_places: int = Field(gt=0)
    price_per_person: float = Field(ge=0)
    allergens: str | None = None
    dietary_tags: str | None = None
    image_url: str | None = None


class MealCreate(MealBase):
    pass


class MealUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    meal_datetime: datetime | None = None
    location: str | None = None
    district: str | None = None
    total_places: int | None = Field(default=None, gt=0)
    price_per_person: float | None = Field(default=None, ge=0)
    allergens: str | None = None
    dietary_tags: str | None = None
    image_url: str | None = None
    status: str | None = None


class MealOut(MealBase):
    id: int
    host_id: int
    remaining_places: int
    status: str
    created_at: datetime
    host: UserOut | None = None

    class Config:
        from_attributes = True


class ReservationCreate(BaseModel):
    places: int = Field(default=1, gt=0)
    note_to_host: str | None = None


class ReservationOut(BaseModel):
    id: int
    meal_id: int
    user_id: int
    places: int
    status: str
    note_to_host: str | None = None
    created_at: datetime
    meal: MealOut | None = None
    user: UserOut | None = None

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    content: str = Field(min_length=1)


class MessageOut(BaseModel):
    id: int
    meal_id: int
    sender_id: int
    content: str
    created_at: datetime
    sender: UserOut | None = None

    class Config:
        from_attributes = True


class ReviewCreate(BaseModel):
    reviewed_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    meal_id: int
    reviewer_id: int
    reviewed_id: int
    rating: int
    comment: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReportCreate(BaseModel):
    reported_user_id: int | None = None
    meal_id: int | None = None
    reason: str
    comment: str | None = None


class ReportOut(BaseModel):
    id: int
    reporter_id: int
    reported_user_id: int | None = None
    meal_id: int | None = None
    reason: str
    comment: str | None = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
