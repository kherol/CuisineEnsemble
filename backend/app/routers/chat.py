from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import get_current_user
from app.models import Meal, Message, Reservation, User
from app.schemas import MessageCreate, MessageOut

router = APIRouter(prefix="/chat", tags=["Chat"])


def can_access_chat(meal: Meal, user: User, db: Session) -> bool:
    if meal.host_id == user.id or user.role == "admin":
        return True
    reservation = db.query(Reservation).filter(
        Reservation.meal_id == meal.id,
        Reservation.user_id == user.id,
        Reservation.status == "accepted",
    ).first()
    return reservation is not None


@router.get("/meals/{meal_id}", response_model=list[MessageOut])
def list_messages(meal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = db.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Repas introuvable")
    if not can_access_chat(meal, current_user, db):
        raise HTTPException(status_code=403, detail="Chat réservé aux participants acceptés")
    return (
        db.query(Message)
        .options(joinedload(Message.sender))
        .filter(Message.meal_id == meal_id)
        .order_by(Message.created_at.asc())
        .all()
    )


@router.post("/meals/{meal_id}", response_model=MessageOut, status_code=201)
def send_message(meal_id: int, payload: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = db.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Repas introuvable")
    if not can_access_chat(meal, current_user, db):
        raise HTTPException(status_code=403, detail="Chat réservé aux participants acceptés")
    message = Message(meal_id=meal_id, sender_id=current_user.id, content=payload.content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
