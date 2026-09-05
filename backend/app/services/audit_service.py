from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import AuditLog

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        action: str,
        actor: str,
        is_irreversible: bool,
        status: str,
        details: str,
        session_id: Optional[str] = None,
        payload: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        log_entry = AuditLog(
            session_id=session_id,
            actor=actor,
            action=action,
            is_irreversible=is_irreversible,
            status=status,
            details=details,
            payload=payload or {}
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
