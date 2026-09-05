from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class KPICard(BaseModel):
    title: str
    value: str
    change_pct: float
    change_direction: str # "up" or "down"
    subtitle: str
    icon: str

class TimeSeriesPoint(BaseModel):
    date: str
    total_transactions: int
    agentic_transactions: int
    ai_assisted_transactions: int
    human_only_transactions: int
    agentic_adoption_rate: float # percentage e.g. 57.3
    avg_decision_time_sec: float
    budget_savings_usd: float

class CategoryAdoption(BaseModel):
    category: str
    agentic_share_pct: float
    total_volume: int
    growth_yoy_pct: float

class AnalyticsDashboardResponse(BaseModel):
    kpis: List[KPICard]
    time_series: List[TimeSeriesPoint]
    category_breakdown: List[CategoryAdoption]
    efficiency_metrics: Dict[str, Any]
