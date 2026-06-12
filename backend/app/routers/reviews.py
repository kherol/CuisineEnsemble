from sqlalchemy import func
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Meal, Reservation, Review, User
from app.schemas import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["Avis"])


def update_average_rating(user_id: int, db: Session):
    avg = db.query(func.avg(Review.rating)).filter(Review.reviewed_id == user_id).scalar() or 0
    user = db.get(User, user_id)
    if user:
        user.average_rating = round(float(avg), 2)


@router.post("/meals/{meal_id}", response_model=ReviewOut, status_code=201)
def create_review(meal_id: int, payload: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = db.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Repas introuvable")

    is_host = meal.host_id == current_user.id
    has_accepted_reservation = db.query(Reservation).filter(
        Reservation.meal_id == meal_id,
        Reservation.user_id == current_user.id,
        Reservation.status == "accepted",
    ).first()
    if not is_host and not has_accepted_reservation:
        raise HTTPException(status_code=403, detail="Seuls les participants peuvent noter")

    duplicate = db.query(Review).filter(
        Review.meal_id == meal_id,
        Review.reviewer_id == current_user.id,
        Review.reviewed_id == payload.reviewed_id,
    ).first()
    if duplicate:
        raise HTTPException(status_code=400, detail="Avis déjà donné")

    review = Review(meal_id=meal_id, reviewer_id=current_user.id, **payload.model_dump())
    db.add(review)
    db.flush()
    update_average_rating(payload.reviewed_id, db)
    db.commit()
    db.refresh(review)
    return review


@router.get("/users/{user_id}", response_model=list[ReviewOut])
def user_reviews(user_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.reviewed_id == user_id).order_by(Review.created_at.desc()).all()
