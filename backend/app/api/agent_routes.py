from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AgentSession, Product, Order
from app.schemas.agent import (
    CreateSessionRequest,
    AgentSessionOut,
    ApprovalDecisionRequest,
    KillSessionRequest
)
from app.schemas.product import ProductOut
from app.agent.orchestrator import AgentOrchestrator
from app.agent.guardrails import TrustAndSafetyGuard

router = APIRouter(prefix="/agent", tags=["Agentic Commerce"])

def format_session_response(db: Session, session: AgentSession) -> AgentSessionOut:
    """Helper to attach candidate products and order details to session response."""
    candidates = []
    if session.candidate_product_ids:
        prods = db.query(Product).filter(Product.id.in_(session.candidate_product_ids)).all()
        candidates = [ProductOut.model_validate(p) for p in prods]

    rec_prod = None
    if session.recommended_product_id:
        p = db.query(Product).filter(Product.id == session.recommended_product_id).first()
        if p:
            rec_prod = ProductOut.model_validate(p)

    order_out = None
    order_record = db.query(Order).filter(Order.session_id == session.id).first()
    if order_record:
        order_out = order_record

    res = AgentSessionOut.model_validate(session)
    res.candidate_products = candidates
    res.recommended_product = rec_prod
    res.order = order_out
    return res

@router.post("/sessions", response_model=AgentSessionOut, status_code=status.HTTP_201_CREATED)
def create_session(req: CreateSessionRequest, db: Session = Depends(get_db)):
    """
    Create a new agent shopping task with a user goal and spending limit.
    """
    session = AgentOrchestrator.create_session(
        db=db,
        user_query=req.user_query,
        budget_limit=req.budget_limit or 1000.0
    )
    return format_session_response(db, session)

@router.get("/sessions", response_model=List[AgentSessionOut])
def list_sessions(limit: int = 20, db: Session = Depends(get_db)):
    """
    List past and active agent sessions.
    """
    sessions = db.query(AgentSession).order_by(AgentSession.created_at.desc()).limit(limit).all()
    return [format_session_response(db, s) for s in sessions]

@router.get("/sessions/{session_id}", response_model=AgentSessionOut)
def get_session(session_id: str, db: Session = Depends(get_db)):
    """
    Get detailed state, reasoning traces, recommendation, and status for a session.
    """
    session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return format_session_response(db, session)

@router.post("/sessions/{session_id}/step", response_model=AgentSessionOut)
def step_session(session_id: str, db: Session = Depends(get_db)):
    """
    Execute exactly one autonomous step in the agent state machine.
    """
    session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.is_killed:
        raise HTTPException(status_code=400, detail="Session has been terminated by emergency kill switch")
    
    session = AgentOrchestrator.run_next_step(db, session)
    return format_session_response(db, session)

@router.post("/sessions/{session_id}/auto-run", response_model=AgentSessionOut)
def auto_run_session(session_id: str, db: Session = Depends(get_db)):
    """
    Run autonomous loop until reaching the Human Checkpoint (AWAITING_APPROVAL).
    """
    session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.is_killed:
        raise HTTPException(status_code=400, detail="Session has been terminated by emergency kill switch")

    session = AgentOrchestrator.auto_run_until_checkpoint(db, session)
    return format_session_response(db, session)

@router.post("/sessions/{session_id}/approve", response_model=AgentSessionOut)
def approve_decision(session_id: str, req: ApprovalDecisionRequest, db: Session = Depends(get_db)):
    """
    Human Checkpoint Action: APPROVE (executes irreversible simulated purchase),
    REJECT (aborts purchase), or MODIFY (re-plans with feedback).
    """
    session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.is_killed:
        raise HTTPException(status_code=400, detail="Session has been terminated by emergency kill switch")

    session = AgentOrchestrator.process_human_decision(
        db=db,
        session=session,
        decision=req.decision,
        feedback=req.feedback
    )
    return format_session_response(db, session)

@router.post("/sessions/{session_id}/kill", response_model=AgentSessionOut)
def kill_session(session_id: str, req: KillSessionRequest, db: Session = Depends(get_db)):
    """
    Emergency Kill Switch: Instantly halts active agent session and locks execution.
    """
    session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    TrustAndSafetyGuard.execute_kill_switch(session=session, db=db, reason=req.reason or "Kill switch pressed")
    return format_session_response(db, session)
