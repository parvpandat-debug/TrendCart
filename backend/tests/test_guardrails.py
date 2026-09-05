from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_kill_switch_engagement():
    # 1. Create Session
    create_res = client.post("/api/agent/sessions", json={
        "user_query": "Find me noise cancelling headphones for flights under $400",
        "budget_limit": 400.0
    })
    assert create_res.status_code == 201
    session_id = create_res.json()["id"]

    # 2. Advance 1 step
    step_res = client.post(f"/api/agent/sessions/{session_id}/step")
    assert step_res.status_code == 200

    # 3. Trigger emergency kill switch
    kill_res = client.post(f"/api/agent/sessions/{session_id}/kill", json={
        "reason": "Safety test emergency abort"
    })
    assert kill_res.status_code == 200
    killed_session = kill_res.json()
    assert killed_session["is_killed"] is True
    assert killed_session["status"] == "CANCELLED"

    # 4. Attempting to step or auto-run a killed session must fail
    fail_res = client.post(f"/api/agent/sessions/{session_id}/step")
    assert fail_res.status_code == 400

def test_audit_logs_record_events():
    res = client.get("/api/audit/logs?limit=10")
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0
    # Audit log must contain actor, action, timestamp
    assert "actor" in logs[0]
    assert "action" in logs[0]
    assert "timestamp" in logs[0]
