from datetime import datetime

from pydantic import BaseModel

from app.schemas import MealOut, UserOut


class AdminReportOut(BaseModel):
    id: int
    reporter_id: int
    reported_user_id: int | None = None
    meal_id: int | None = None
    reason: str
    comment: str | None = None
    status: str
    created_at: datetime

    reporter: UserOut | None = None
    reported_user: UserOut | None = None
    meal: MealOut | None = None

    class Config:
        from_attributes = True