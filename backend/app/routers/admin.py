from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import Meal, Report, Reservation, Review, User
from app.schemas import MealOut, ReportOut, UserOut

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.get("/stats")
def stats(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return {
        "users": db.query(User).count(),
        "meals": db.query(Meal).count(),
        "open_meals": db.query(Meal).filter(Meal.status == "open").count(),
        "reservations": db.query(Reservation).count(),
        "reviews": db.query(Review).count(),
        "reports": db.query(Report).count(),
    }


@router.get("/users", response_model=list[UserOut])
def users(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}/block", response_model=UserOut)
def block_user(user_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user


@router.patch("/users/{user_id}/role", response_model=UserOut)
def change_role(user_id: int, role: str, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Rôle invalide")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    user.role = role
    db.commit()
    db.refresh(user)
    return user


@router.get("/meals", response_model=list[MealOut])
def meals(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Meal).order_by(Meal.created_at.desc()).all()


@router.get("/reports", response_model=list[ReportOut])
def reports(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()


@router.patch("/reports/{report_id}/close", response_model=ReportOut)
def close_report(report_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    report.status = "closed"
    db.commit()
    db.refresh(report)
    return report
