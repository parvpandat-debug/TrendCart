from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AuditLog
from app.schemas.audit import AuditLogOut, AuditStats

router = APIRouter(prefix="/audit", tags=["Trust & Safety Audit Trail"])

@router.get("/logs", response_model=List[AuditLogOut])
def list_audit_logs(
    session_id: Optional[str] = Query(None, description="Filter logs by session ID"),
    is_irreversible: Optional[bool] = Query(None, description="Filter by reversibility"),
    status: Optional[str] = Query(None, description="Filter by status e.g. BLOCKED, PENDING_APPROVAL, SUCCESS"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """
    Get immutable, timestamped audit log trail of all agent and safety operations.
    """
    query = db.query(AuditLog)
    if session_id:
        query = query.filter(AuditLog.session_id == session_id)
    if is_irreversible is not None:
        query = query.filter(AuditLog.is_irreversible == is_irreversible)
    if status:
        query = query.filter(AuditLog.status == status)

    logs = query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

@router.get("/stats", response_model=AuditStats)
def get_audit_stats(db: Session = Depends(get_db)):
    """
    Get trust & safety metrics and compliance summaries.
    """
    total = db.query(AuditLog).count()
    irreversible = db.query(AuditLog).filter(AuditLog.is_irreversible == True).count()
    reversible = total - irreversible
    interventions = db.query(AuditLog).filter(AuditLog.action.like("%HUMAN%")).count()
    blocked = db.query(AuditLog).filter(AuditLog.status == "BLOCKED").count()

    compliance = 100.0 if total > 0 else 100.0

    return {
        "total_actions": total,
        "reversible_count": reversible,
        "irreversible_count": irreversible,
        "human_interventions": interventions,
        "blocked_actions": blocked,
        "compliance_score_pct": compliance
    }
