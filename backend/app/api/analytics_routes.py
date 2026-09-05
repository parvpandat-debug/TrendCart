from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.analytics import AnalyticsDashboardResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["AI Growth & Adoption Analytics"])

@router.get("/dashboard", response_model=AnalyticsDashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """
    Get full AI Growth Analytics dashboard metrics including KPIs,
    24-month adoption time-series, category penetration, and efficiency stats.
    """
    return AnalyticsService.get_dashboard_data(db)

@router.post("/simulate-month")
def simulate_month(db: Session = Depends(get_db)):
    """
    Advance the market simulation timeline by 1 month to demonstrate live data streaming.
    """
    new_snapshot = AnalyticsService.simulate_next_month(db)
    return {
        "success": True,
        "new_period": new_snapshot.metric_date if new_snapshot else None,
        "dashboard": AnalyticsService.get_dashboard_data(db)
    }
