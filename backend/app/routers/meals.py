from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import get_current_user
from app.models import Meal, User
from app.schemas import MealCreate, MealOut, MealUpdate

router = APIRouter(prefix="/meals", tags=["Repas"])


@router.get("", response_model=list[MealOut])
def list_meals(
    district: str | None = None,
    max_price: float | None = Query(default=None, ge=0),
    dietary: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Meal).options(joinedload(Meal.host)).filter(Meal.status == "open")
    if district:
        query = query.filter(Meal.district.ilike(f"%{district}%"))
    if max_price is not None:
        query = query.filter(Meal.price_per_person <= max_price)
    if dietary:
        query = query.filter(Meal.dietary_tags.ilike(f"%{dietary}%"))
    return query.order_by(Meal.meal_datetime.asc()).all()


@router.post("", response_model=MealOut, status_code=201)
def create_meal(payload: MealCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = Meal(
        host_id=current_user.id,
        remaining_places=payload.total_places,
        **payload.model_dump(),
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal


@router.get("/mine", response_model=list[MealOut])
def my_meals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Meal).filter(Meal.host_id == current_user.id).order_by(Meal.created_at.desc()).all()


@router.get("/{meal_id}", response_model=MealOut)
def get_meal(meal_id: int, db: Session = Depends(get_db)):
    meal = db.query(Meal).options(joinedload(Meal.host)).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Repas introuvable")
    return meal


@router.patch("/{meal_id}", response_model=MealOut)
def update_meal(meal_id: int, payload: MealUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = db.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Repas introuvable")
    if meal.host_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Action non autorisée")

    old_total = meal.total_places
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(meal, field, value)

    if "total_places" in data:
        diff = meal.total_places - old_total
        meal.remaining_places = max(0, meal.remaining_places + diff)

    db.commit()
    db.refresh(meal)
    return meal


@router.delete("/{meal_id}")
def cancel_meal(meal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = db.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Repas introuvable")
    if meal.host_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Action non autorisée")
    meal.status = "cancelled"
    db.commit()
    return {"message": "Repas annulé"}
