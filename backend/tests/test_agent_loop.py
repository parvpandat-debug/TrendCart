import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.agent.intent_parser import IntentParser

client = TestClient(app)

def test_intent_parser_budget_laptop():
    query = "Find me a budget laptop under $700 for video editing"
    intent = IntentParser.parse_goal(query, default_budget=1000.0)
    
    assert intent["category"] == "Laptops & Computing"
    assert intent["max_price"] == 700.0
    assert "Video Editing" in intent["use_case"]
    assert "video-editing" in intent["target_tags"]

def test_agent_loop_full_flow():
    # 1. Create Session
    create_res = client.post("/api/agent/sessions", json={
        "user_query": "Find me a budget laptop under $700 for video editing",
        "budget_limit": 700.0
    })
    assert create_res.status_code == 201
    session = create_res.json()
    session_id = session["id"]
    assert session["status"] == "IDLE"
    assert session["current_step"] == 0

    # 2. Auto run until human checkpoint
    auto_res = client.post(f"/api/agent/sessions/{session_id}/auto-run")
    assert auto_res.status_code == 200
    paused_session = auto_res.json()
    
    # Verify paused at human-in-the-loop checkpoint
    assert paused_session["status"] == "AWAITING_APPROVAL"
    assert paused_session["recommended_product"] is not None
    assert paused_session["recommended_product"]["price"] <= 700.0
    assert paused_session["trade_off_analysis"] is not None
    assert len(paused_session["traces"]) >= 5

    # 3. Human Approves the purchase
    approve_res = client.post(f"/api/agent/sessions/{session_id}/approve", json={
        "decision": "APPROVE",
        "feedback": "Looks great, please proceed"
    })
    assert approve_res.status_code == 200
    completed_session = approve_res.json()
    assert completed_session["status"] == "COMPLETED"
    assert completed_session["order"] is not None
    assert completed_session["order"]["total_amount"] <= 700.0

def test_catalog_endpoint():
    res = client.get("/api/products", params={"category": "Laptops & Computing"})
    assert res.status_code == 200
    products = res.json()
    assert len(products) > 0
    assert all(p["category"] == "Laptops & Computing" for p in products)

def test_analytics_dashboard():
    res = client.get("/api/analytics/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert len(data["kpis"]) == 4
    assert len(data["time_series"]) >= 24
    assert len(data["category_breakdown"]) == 3
