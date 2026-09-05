import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Text,
    JSON,
    ForeignKey
)
from sqlalchemy.orm import relationship
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    brand = Column(String(100), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True) # e.g. "Laptops & Computing", "Audio & Headphones", "Smart Home & Workspace"
    subcategory = Column(String(100), nullable=True)
    price = Column(Float, nullable=False, index=True)
    original_price = Column(Float, nullable=True)
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=120)
    description = Column(Text, nullable=False)
    specs = Column(JSON, default=dict) # e.g. {"ram_gb": 16, "storage_gb": 512, "cpu": "Intel Core i7", "gpu": "RTX 4050"}
    features = Column(JSON, default=list) # e.g. ["4K OLED Screen", "12hr Battery"]
    image_url = Column(String(500), nullable=True)
    in_stock = Column(Boolean, default=True)
    stock_quantity = Column(Integer, default=25)
    delivery_days = Column(Integer, default=2)
    tags = Column(JSON, default=list) # e.g. ["budget", "video-editing", "gaming"]

class AgentSession(Base):
    __tablename__ = "agent_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_query = Column(Text, nullable=False)
    budget_limit = Column(Float, nullable=False, default=1000.0)
    status = Column(String(50), nullable=False, default="IDLE") 
    # Statuses: IDLE, PLANNING, SEARCHING, COMPARING, AWAITING_APPROVAL, APPROVED, CHECKING_OUT, COMPLETED, REJECTED, CANCELLED, FAILED
    current_step = Column(Integer, default=0)
    current_phase = Column(String(50), default="PLAN") # PLAN, ACT, OBSERVE, APPROVE
    
    parsed_intent = Column(JSON, default=dict) # {"category": "Laptops & Computing", "max_price": 700, "use_case": "video editing"}
    candidate_product_ids = Column(JSON, default=list)
    recommended_product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    trade_off_analysis = Column(JSON, default=dict) # Pros, Cons, Trade-offs, Scoring
    cart_item = Column(JSON, default=dict)
    total_cost = Column(Float, default=0.0)
    
    is_killed = Column(Boolean, default=False)
    human_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    traces = relationship("AgentTrace", back_populates="session", cascade="all, delete-orphan")
    recommended_product = relationship("Product")

class AgentTrace(Base):
    __tablename__ = "agent_traces"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(36), ForeignKey("agent_sessions.id"), nullable=False, index=True)
    step_number = Column(Integer, nullable=False)
    phase = Column(String(50), nullable=False) # PLAN, ACT, OBSERVE, APPROVE
    action_type = Column(String(100), nullable=False) # PARSE_GOAL, SEARCH_CATALOG, COMPARE_SPECS, CHECK_BUDGET, REQUEST_APPROVAL, EXECUTE_ORDER, ABORT_MISSION
    title = Column(String(255), nullable=False)
    reasoning = Column(Text, nullable=False) # Rich explanation of the agent's thought process
    input_data = Column(JSON, default=dict)
    output_data = Column(JSON, default=dict)
    is_reversible = Column(Boolean, default=True) # False for purchasing / cart modification
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("AgentSession", back_populates="traces")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(36), nullable=True, index=True)
    actor = Column(String(50), nullable=False) # AGENT, USER, SAFETY_GUARD, SYSTEM
    action = Column(String(100), nullable=False)
    is_irreversible = Column(Boolean, default=False)
    status = Column(String(50), nullable=False) # SUCCESS, BLOCKED, PENDING_APPROVAL, APPROVED, REJECTED, KILLED
    details = Column(Text, nullable=False)
    payload = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: f"ORD-{uuid.uuid4().hex[:8].upper()}")
    session_id = Column(String(36), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_title = Column(String(255), nullable=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    total_amount = Column(Float, nullable=False)
    shipping_address = Column(String(255), default="Simulated Address: 100 Agentic Way, San Francisco, CA")
    payment_method = Column(String(100), default="Simulated Corporate Agent Wallet")
    status = Column(String(50), default="SIMULATED_SUCCESS")
    created_at = Column(DateTime, default=datetime.utcnow)

class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    metric_date = Column(String(50), nullable=False, index=True) # e.g. "2024-01" to "2025-12"
    total_transactions = Column(Integer, nullable=False)
    agentic_transactions = Column(Integer, nullable=False)
    ai_assisted_transactions = Column(Integer, nullable=False)
    human_only_transactions = Column(Integer, nullable=False)
    avg_decision_time_sec = Column(Float, nullable=False)
    budget_savings_usd = Column(Float, nullable=False)
    guardrail_interventions = Column(Integer, nullable=False)
    category_metrics = Column(JSON, default=dict)
