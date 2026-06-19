from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.admin_schemas import AdminReportOut
from app.database import get_db
from app.deps import require_admin
from app.models import Meal, Report, Reservation, Review, User
from app.schemas import MealOut, UserOut

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.get("/stats")
def stats(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return {
        "users": db.query(User).count(),
        "active_users": db.query(User).filter(User.is_active.is_(True)).count(),
        "blocked_users": db.query(User).filter(User.is_active.is_(False)).count(),
        "admins": db.query(User).filter(User.role == "admin").count(),
        "meals": db.query(Meal).count(),
        "open_meals": db.query(Meal).filter(Meal.status == "open").count(),
        "full_meals": db.query(Meal).filter(Meal.status == "full").count(),
        "finished_meals": db.query(Meal).filter(Meal.status == "finished").count(),
        "cancelled_meals": db.query(Meal).filter(Meal.status == "cancelled").count(),
        "reservations": db.query(Reservation).count(),
        "accepted_reservations": (
            db.query(Reservation)
            .filter(Reservation.status == "accepted")
            .count()
        ),
        "pending_reservations": (
            db.query(Reservation)
            .filter(Reservation.status == "pending")
            .count()
        ),
        "reviews": db.query(Review).count(),
        "reports": db.query(Report).count(),
        "open_reports": db.query(Report).filter(Report.status == "open").count(),
        "in_progress_reports": (
            db.query(Report)
            .filter(Report.status == "in_progress")
            .count()
        ),
        "closed_reports": db.query(Report).filter(Report.status == "closed").count(),
    }


@router.get("/users", response_model=list[UserOut])
def users(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}/toggle-status", response_model=UserOut)
def toggle_user_status(
    user_id: int,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Utilisateur introuvable",
        )

    if user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Le compte administrateur principal ne peut pas être bloqué",
        )

    if user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Tu ne peux pas bloquer ton propre compte",
        )

    user.is_active = not user.is_active

    db.commit()
    db.refresh(user)

    return user


@router.patch("/users/{user_id}/role", response_model=UserOut)
def change_role(
    user_id: int,
    role: str = Query(...),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if role not in {"user", "admin"}:
        raise HTTPException(
            status_code=400,
            detail="Rôle invalide",
        )

    user = db.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Utilisateur introuvable",
        )

    if user.role == role:
        return user

    # L'administrateur principal ne peut jamais être rétrogradé.
    if user.role == "admin" and role != "admin":
        raise HTTPException(
            status_code=400,
            detail="Le rôle de l'administrateur principal ne peut pas être retiré",
        )

    # Aucun deuxième administrateur ne peut être créé.
    if role == "admin":
        existing_admin = (
            db.query(User)
            .filter(
                User.role == "admin",
                User.id != user.id,
            )
            .first()
        )

        if existing_admin:
            raise HTTPException(
                status_code=400,
                detail="Un administrateur existe déjà. Un seul administrateur est autorisé.",
            )

    user.role = role

    db.commit()
    db.refresh(user)

    return user


@router.get("/meals", response_model=list[MealOut])
def meals(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return (
        db.query(Meal)
        .options(joinedload(Meal.host))
        .order_by(Meal.created_at.desc())
        .all()
    )


@router.patch("/meals/{meal_id}/status", response_model=MealOut)
def change_meal_status(
    meal_id: int,
    status: str = Query(...),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    allowed_statuses = {
        "open",
        "full",
        "finished",
        "cancelled",
    }

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Statut de repas invalide",
        )

    meal = (
        db.query(Meal)
        .options(joinedload(Meal.host))
        .filter(Meal.id == meal_id)
        .first()
    )

    if not meal:
        raise HTTPException(
            status_code=404,
            detail="Repas introuvable",
        )

    meal.status = status

    if status == "full":
        meal.remaining_places = 0

    elif status == "open" and meal.remaining_places == 0:
        meal.remaining_places = meal.total_places

    db.commit()
    db.refresh(meal)

    return meal


@router.get("/reports", response_model=list[AdminReportOut])
def reports(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return (
        db.query(Report)
        .options(
            joinedload(Report.reporter),
            joinedload(Report.reported_user),
            joinedload(Report.meal).joinedload(Meal.host),
        )
        .order_by(Report.created_at.desc())
        .all()
    )


@router.patch("/reports/{report_id}/status", response_model=AdminReportOut)
def change_report_status(
    report_id: int,
    status: str = Query(...),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    allowed_statuses = {
        "open",
        "in_progress",
        "closed",
    }

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Statut de signalement invalide",
        )

    report = (
        db.query(Report)
        .options(
            joinedload(Report.reporter),
            joinedload(Report.reported_user),
            joinedload(Report.meal).joinedload(Meal.host),
        )
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Signalement introuvable",
        )

    report.status = status

    db.commit()
    db.refresh(report)

    return report
