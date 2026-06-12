from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import get_current_user
from app.models import Meal, Reservation, User
from app.schemas import ReservationCreate, ReservationOut

router = APIRouter(prefix="/reservations", tags=["Réservations"])


@router.post("/meals/{meal_id}", response_model=ReservationOut, status_code=201)
def reserve_meal(meal_id: int, payload: ReservationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = db.get(Meal, meal_id)
    if not meal or meal.status != "open":
        raise HTTPException(status_code=404, detail="Repas indisponible")
    if meal.host_id == current_user.id:
        raise HTTPException(status_code=400, detail="Tu ne peux pas réserver ton propre repas")
    if meal.remaining_places < payload.places:
        raise HTTPException(status_code=400, detail="Pas assez de places disponibles")
    existing = db.query(Reservation).filter(Reservation.meal_id == meal_id, Reservation.user_id == current_user.id, Reservation.status != "cancelled").first()
    if existing:
        raise HTTPException(status_code=400, detail="Réservation déjà existante")

    reservation = Reservation(meal_id=meal_id, user_id=current_user.id, places=payload.places, note_to_host=payload.note_to_host)
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.get("/mine", response_model=list[ReservationOut])
def my_reservations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Reservation)
        .options(joinedload(Reservation.meal), joinedload(Reservation.user))
        .filter(Reservation.user_id == current_user.id)
        .order_by(Reservation.created_at.desc())
        .all()
    )


@router.get("/meals/{meal_id}", response_model=list[ReservationOut])
def meal_reservations(meal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = db.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Repas introuvable")
    if meal.host_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Action non autorisée")
    return db.query(Reservation).options(joinedload(Reservation.user)).filter(Reservation.meal_id == meal_id).all()


@router.patch("/{reservation_id}/accept", response_model=ReservationOut)
def accept_reservation(reservation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation introuvable")
    meal = reservation.meal
    if meal.host_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Action non autorisée")
    if reservation.status != "pending":
        raise HTTPException(status_code=400, detail="Réservation déjà traitée")
    if meal.remaining_places < reservation.places:
        raise HTTPException(status_code=400, detail="Pas assez de places")
    reservation.status = "accepted"
    meal.remaining_places -= reservation.places
    if meal.remaining_places == 0:
        meal.status = "full"
    db.commit()
    db.refresh(reservation)
    return reservation


@router.patch("/{reservation_id}/refuse", response_model=ReservationOut)
def refuse_reservation(reservation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation introuvable")
    meal = reservation.meal
    if meal.host_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Action non autorisée")
    reservation.status = "refused"
    db.commit()
    db.refresh(reservation)
    return reservation


@router.patch("/{reservation_id}/cancel", response_model=ReservationOut)
def cancel_reservation(reservation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation introuvable")
    if reservation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Action non autorisée")
    if reservation.status == "accepted":
        reservation.meal.remaining_places += reservation.places
        if reservation.meal.status == "full":
            reservation.meal.status = "open"
    reservation.status = "cancelled"
    db.commit()
    db.refresh(reservation)
    return reservation
