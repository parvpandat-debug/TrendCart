from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.db.models import AgentSession, AuditLog
from app.services.audit_service import AuditService

class TrustAndSafetyGuard:
    @staticmethod
    def validate_budget_cap(price: float, budget_limit: float) -> Tuple[bool, str]:
        """
        Enforces spending limits. Returns (is_allowed, reason).
        """
        if price <= budget_limit:
            return True, f"Item price ${price:,.2f} is within spending cap ${budget_limit:,.2f}."
        
        diff = price - budget_limit
        return False, f"SAFETY VIOLATION: Item price ${price:,.2f} exceeds user budget limit ${budget_limit:,.2f} by ${diff:,.2f}. Explicit human override or budget increase required."

    @staticmethod
    def is_action_reversible(action_type: str) -> bool:
        """
        Classifies whether an action is reversible.
        Reversible: Searching, extracting criteria, comparing, observing, staging.
        Irreversible: Cart commit, simulated charge, order dispatch.
        """
        irreversible_actions = {
            "STAGE_CART_ADD",
            "CONFIRM_PURCHASE",
            "EXECUTE_CHECKOUT",
            "EXECUTE_ORDER"
        }
        return action_type not in irreversible_actions

    @staticmethod
    def enforce_human_approval_required(session: AgentSession, db: Session) -> bool:
        """
        Ensures that before executing an irreversible checkout, the session status
        is explicitly APPROVED by the human user.
        """
        if session.is_killed:
            AuditService.log_event(
                db=db,
                action="SAFETY_BLOCK_KILLED_SESSION",
                actor="SAFETY_GUARD",
                is_irreversible=True,
                status="BLOCKED",
                details=f"Blocked attempt to execute action on killed session {session.id}.",
                session_id=session.id
            )
            return False

        if session.status != "APPROVED":
            AuditService.log_event(
                db=db,
                action="SAFETY_CHECKPOINT_HALT",
                actor="SAFETY_GUARD",
                is_irreversible=False,
                status="PENDING_APPROVAL",
                details="Autonomous execution paused. Irreversible action requires explicit human checkpoint confirmation.",
                session_id=session.id,
                payload={"current_status": session.status, "budget_limit": session.budget_limit}
            )
            return False

        return True

    @staticmethod
    def execute_kill_switch(session: AgentSession, db: Session, reason: str = "User initiated emergency abort") -> Dict[str, Any]:
        """
        Executes immediate hard stop on active agent task.
        """
        session.is_killed = True
        session.status = "CANCELLED"
        
        # Log to immutable audit trail
        AuditService.log_event(
            db=db,
            action="KILL_SWITCH_ENGAGED",
            actor="USER",
            is_irreversible=False,
            status="KILLED",
            details=f"EMERGENCY KILL SWITCH ACTIVATED: {reason}",
            session_id=session.id,
            payload={"reason": reason, "step_aborted_at": session.current_step}
        )
        
        db.commit()
        db.refresh(session)
        return {
            "session_id": session.id,
            "status": "CANCELLED",
            "is_killed": True,
            "message": f"Agent session successfully aborted: {reason}"
        }
