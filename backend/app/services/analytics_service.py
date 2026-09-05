from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models import AnalyticsSnapshot, AgentSession, Order, AuditLog

class AnalyticsService:
    @staticmethod
    def get_dashboard_data(db: Session) -> Dict[str, Any]:
        """
        Aggregates historical time-series analytics, live session metrics,
        and category adoption breakdowns.
        """
        snapshots = db.query(AnalyticsSnapshot).order_by(AnalyticsSnapshot.metric_date.asc()).all()
        
        # Real-time counts from current database sessions
        completed_sessions = db.query(AgentSession).filter(AgentSession.status == "COMPLETED").count()
        total_sessions = db.query(AgentSession).count()
        total_orders = db.query(Order).count()
        
        if not snapshots:
            return {
                "kpis": [],
                "time_series": [],
                "category_breakdown": [],
                "efficiency_metrics": {}
            }

        latest = snapshots[-1]
        prev = snapshots[-2] if len(snapshots) > 1 else snapshots[0]

        # Calculate KPIs
        latest_agentic = latest.agentic_transactions + completed_sessions
        latest_total = latest.total_transactions + total_sessions
        agentic_adoption_pct = (latest_agentic / latest_total * 100) if latest_total > 0 else 0.0

        prev_adoption_pct = (prev.agentic_transactions / prev.total_transactions * 100) if prev.total_transactions > 0 else 0.0
        adoption_growth = agentic_adoption_pct - prev_adoption_pct

        total_savings = latest.budget_savings_usd + (completed_sessions * 145.0)

        kpis = [
            {
                "title": "Agentic Transaction Share",
                "value": f"{agentic_adoption_pct:.1f}%",
                "change_pct": round(adoption_growth, 1),
                "change_direction": "up" if adoption_growth >= 0 else "down",
                "subtitle": f"+{round(adoption_growth, 1)}% vs previous month",
                "icon": "Bot"
            },
            {
                "title": "Monthly Autonomous Volume",
                "value": f"{latest_agentic:,.0f}",
                "change_pct": round(((latest_agentic - prev.agentic_transactions) / prev.agentic_transactions) * 100, 1),
                "change_direction": "up",
                "subtitle": "Transactions executed by AI",
                "icon": "TrendingUp"
            },
            {
                "title": "Avg Autonomous Decision Time",
                "value": f"{latest.avg_decision_time_sec:.2f}s",
                "change_pct": -12.4,
                "change_direction": "down", # down is good for decision latency
                "subtitle": "vs. 45 min human average",
                "icon": "Zap"
            },
            {
                "title": "Autonomous Budget Savings",
                "value": f"${total_savings:,.0f}",
                "change_pct": 18.2,
                "change_direction": "up",
                "subtitle": "Saved via automated price optimization",
                "icon": "ShieldCheck"
            }
        ]

        # Format Time-series points
        time_series = []
        for s in snapshots:
            time_series.append({
                "date": s.metric_date,
                "total_transactions": s.total_transactions,
                "agentic_transactions": s.agentic_transactions,
                "ai_assisted_transactions": s.ai_assisted_transactions,
                "human_only_transactions": s.human_only_transactions,
                "agentic_adoption_rate": round((s.agentic_transactions / s.total_transactions) * 100, 1),
                "avg_decision_time_sec": s.avg_decision_time_sec,
                "budget_savings_usd": s.budget_savings_usd
            })

        # Category Breakdown
        cat_data = latest.category_metrics or {}
        category_breakdown = [
            {
                "category": "Laptops & Computing",
                "agentic_share_pct": cat_data.get("Laptops & Computing", {}).get("agentic_share_pct", 72.5),
                "total_volume": cat_data.get("Laptops & Computing", {}).get("total_volume", 17100),
                "growth_yoy_pct": 142.5
            },
            {
                "category": "Audio & Headphones",
                "agentic_share_pct": cat_data.get("Audio & Headphones", {}).get("agentic_share_pct", 64.0),
                "total_volume": cat_data.get("Audio & Headphones", {}).get("total_volume", 11400),
                "growth_yoy_pct": 118.0
            },
            {
                "category": "Smart Home & Workspace",
                "agentic_share_pct": cat_data.get("Smart Home & Workspace", {}).get("agentic_share_pct", 58.0),
                "total_volume": cat_data.get("Smart Home & Workspace", {}).get("total_volume", 9500),
                "growth_yoy_pct": 95.2
            }
        ]

        efficiency_metrics = {
            "human_vs_agent_speedup": "2,250x faster (1.2s vs 45min)",
            "safety_checkpoint_compliance": "100%",
            "budget_overshoot_rate": "0.0%",
            "total_guardrail_interventions": latest.guardrail_interventions + db.query(AuditLog).filter(AuditLog.action.like("%SAFETY%")).count()
        }

        return {
            "kpis": kpis,
            "time_series": time_series,
            "category_breakdown": category_breakdown,
            "efficiency_metrics": efficiency_metrics
        }

    @staticmethod
    def simulate_next_month(db: Session) -> AnalyticsSnapshot:
        """
        Advances the simulated timeline forward by 1 month with procedural growth and noise.
        """
        last_snap = db.query(AnalyticsSnapshot).order_by(AnalyticsSnapshot.metric_date.desc()).first()
        if not last_snap:
            return None

        # Parse date e.g. "2025-12" -> "2026-01"
        year, month = map(int, last_snap.metric_date.split("-"))
        if month == 12:
            year += 1
            month = 1
        else:
            month += 1
        next_date_str = f"{year}-{month:02d}"

        growth_factor = 1.07
        new_total = int(last_snap.total_transactions * growth_factor)
        new_agentic = int(last_snap.agentic_transactions * 1.12)
        new_assisted = int(last_snap.ai_assisted_transactions * 1.06)
        new_human = max(1000, new_total - new_agentic - new_assisted)
        new_time = max(0.8, round(last_snap.avg_decision_time_sec * 0.95, 2))
        new_savings = round(last_snap.budget_savings_usd * 1.14, 2)
        new_guards = last_snap.guardrail_interventions + 45

        cat_metrics = {
            "Laptops & Computing": {
                "agentic_share_pct": min(85.0, last_snap.category_metrics.get("Laptops & Computing", {}).get("agentic_share_pct", 72.0) + 1.2),
                "total_volume": int(new_total * 0.46)
            },
            "Audio & Headphones": {
                "agentic_share_pct": min(78.0, last_snap.category_metrics.get("Audio & Headphones", {}).get("agentic_share_pct", 64.0) + 1.1),
                "total_volume": int(new_total * 0.30)
            },
            "Smart Home & Workspace": {
                "agentic_share_pct": min(72.0, last_snap.category_metrics.get("Smart Home & Workspace", {}).get("agentic_share_pct", 58.0) + 1.4),
                "total_volume": int(new_total * 0.24)
            }
        }

        new_snapshot = AnalyticsSnapshot(
            metric_date=next_date_str,
            total_transactions=new_total,
            agentic_transactions=new_agentic,
            ai_assisted_transactions=new_assisted,
            human_only_transactions=new_human,
            avg_decision_time_sec=new_time,
            budget_savings_usd=new_savings,
            guardrail_interventions=new_guards,
            category_metrics=cat_metrics
        )
        db.add(new_snapshot)
        db.commit()
        db.refresh(new_snapshot)
        return new_snapshot
