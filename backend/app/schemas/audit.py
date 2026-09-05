from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    session_id: Optional[str] = None
    actor: str
    action: str
    is_irreversible: bool
    status: str
    details: str
    payload: Optional[Dict[str, Any]] = None
    timestamp: datetime

class AuditStats(BaseModel):
    total_actions: int
    reversible_count: int
    irreversible_count: int
    human_interventions: int
    blocked_actions: int
    compliance_score_pct: float
