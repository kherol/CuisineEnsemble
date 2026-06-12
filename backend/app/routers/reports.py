from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Report, User
from app.schemas import ReportCreate, ReportOut

router = APIRouter(prefix="/reports", tags=["Signalements"])


@router.post("", response_model=ReportOut, status_code=201)
def create_report(payload: ReportCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = Report(reporter_id=current_user.id, **payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
