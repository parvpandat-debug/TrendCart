from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.product import ProductOut

class CreateSessionRequest(BaseModel):
    user_query: str = Field(..., examples=["Find me a budget laptop under $700 for video editing"])
    budget_limit: Optional[float] = Field(1000.0, description="Spending limit cap")

class SessionStepRequest(BaseModel):
    pass

class ApprovalDecisionRequest(BaseModel):
    decision: str = Field(..., pattern="^(APPROVE|REJECT|MODIFY)$", examples=["APPROVE"])
    feedback: Optional[str] = Field(None, description="Optional user notes or instructions if rejected/modified")

class KillSessionRequest(BaseModel):
    reason: Optional[str] = Field("User triggered emergency kill switch", description="Reason for aborting agent task")

class AgentTraceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    session_id: str
    step_number: int
    phase: str # PLAN, ACT, OBSERVE, APPROVE
    action_type: str
    title: str
    reasoning: str
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    is_reversible: bool
    timestamp: datetime

class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    session_id: str
    product_id: int
    product_title: str
    unit_price: float
    quantity: int
    total_amount: float
    shipping_address: str
    payment_method: str
    status: str
    created_at: datetime

class AgentSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_query: str
    budget_limit: float
    status: str
    current_step: int
    current_phase: str
    parsed_intent: Optional[Dict[str, Any]] = None
    candidate_product_ids: Optional[List[int]] = None
    recommended_product_id: Optional[int] = None
    recommended_product: Optional[ProductOut] = None
    candidate_products: Optional[List[ProductOut]] = None
    trade_off_analysis: Optional[Dict[str, Any]] = None
    cart_item: Optional[Dict[str, Any]] = None
    total_cost: float
    is_killed: bool
    human_feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    traces: List[AgentTraceOut] = []
    order: Optional[OrderOut] = None
