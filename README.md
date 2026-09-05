# TrendCart — AI Growth & Agentic Commerce Platform

> **A portfolio-grade demonstration of autonomous AI shopping agents, human-in-the-loop checkpoints, and macro AI adoption analytics.**

---

## 🌟 What is "Agentic Commerce"?

Traditional e-commerce is **search-and-browse**: a human types a keyword, scrolls through dozens of sponsored listings, opens multiple browser tabs to compare specifications, reads reviews, and manually keys in payment details.

**Agentic Commerce** represents a fundamental paradigm shift: **delegated autonomous execution with human authorization.**

Instead of browsing, a consumer defines a high-level outcome or constraint:
> *"Find me a budget laptop under $700 for video editing."*

An AI agent then acts as an autonomous shopping concierge:
1. **Decomposes the goal** into structured criteria (e.g. category, minimum 16GB RAM, dedicated GPU / AI boost encoder, color-accurate screen, strict budget cap).
2. **Scans and filters** the product catalog dynamically.
3. **Executes multi-criteria utility scoring** (balancing hardware specs, verified customer sentiment, deal discounts, and price).
4. **Constructs a side-by-side trade-off matrix** with explicit pros/cons and a defensible recommendation rationale.
5. **Halts at a mandatory Human-in-the-Loop Checkpoint**: Because purchasing is an *irreversible* financial transaction, the agent stages the order in the cart, verifies the spending cap, and requests explicit user approval.
6. **Executes the transaction** only once human authorization is granted, recording every step in an immutable, verifiable audit trail.

---

## 🚀 Key Features

### 1. 🤖 Autonomous Agent Command Center (`Agent Studio`)
- **Natural Language Shopping Input**: Flexible goal input with quick-start demo scenario chips.
- **Visual 6-Phase Pipeline Indicator**: Live status updates across `Goal Ingestion` → `Catalog Scan` → `Utility Scoring` → `Trade-Offs` → `Human Checkpoint` → `Checkout`.
- **Transparent Reasoning Trace Panel**: Inspect why the agent made each micro-decision, view execution timestamps, reversibility classifications, and structured JSON I/O payloads.
- **Side-by-Side Product Comparison Matrix**: Compare top candidates with pros/cons, score breakdowns, and explicit winner rationale.
- **Human Checkpoint Approval Gate**: Clear modal/card requiring user confirmation before simulated payment execution.
- **Simulated Order Fulfillment**: Instant receipt generation with simulated wallet transaction IDs and audit ledger links.

### 2. 📈 AI Growth & Adoption Analytics Dashboard
- **24-Month Macro Adoption Time-Series**: Stacked area visualization modeling the shift from human-only commerce to AI-assisted and autonomous agentic transactions.
- **Category Penetration Metrics**: Bar chart comparing agent adoption percentages across *Laptops & Computing*, *Audio & Headphones*, and *Smart Home & Workspace Gear*.
- **Agent Decision Latency Curve**: Demonstrates the exponential reduction in comparison time (from 45 minutes down to ~1.2 seconds).
- **Interactive Horizon Simulator**: Advance the simulation into future periods with one click to observe dynamic chart animations and procedural market growth.

### 3. 🛡️ Trust, Safety & Verifiable Audit Trail
- **Strict Spending Limit Guardrails**: Real-time validation preventing agent cart commits exceeding user-configured budget caps.
- **Reversibility Classification**: Categorizes actions into reversible (searching, scoring, comparing) vs irreversible (cart modification, checkout).
- **Emergency Task Kill Switch**: Single-click instantaneous abort capability that locks session execution and logs a safety event.
- **Immutable Verifiable Ledger**: Queryable, filterable audit log capturing every actor (`AGENT`, `USER`, `SAFETY_GUARD`, `SYSTEM`), status, and timestamp.

### 4. 🛍️ Mock Product Catalog Explorer
- 41+ realistic products across Laptops, Audio, and Smart Home with complete specifications, high-resolution imagery, customer ratings, and tags.
- Quick **"Agent Evaluate"** button on any item to instantly delegate comparison and evaluation to the agent.

---

## 🏗️ Architecture & Directory Structure

```
AI Growth and Agentic Commerce/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point & CORS configuration
│   │   ├── config.py                   # App configuration & budget limits
│   │   ├── db/
│   │   │   ├── database.py             # SQLite engine & session dependency
│   │   │   ├── models.py               # SQLAlchemy models (Product, AgentSession, Trace, Audit, Order)
│   │   │   └── seed_data.py            # ~41 rich mock products & 24 months of telemetry
│   │   ├── schemas/                    # Pydantic v2 schemas
│   │   │   ├── agent.py
│   │   │   ├── product.py
│   │   │   ├── analytics.py
│   │   │   └── audit.py
│   │   ├── agent/                      # Core Agent Orchestration Layer
│   │   │   ├── intent_parser.py        # Goal decomposition & constraint extraction
│   │   │   ├── catalog_search.py       # Multi-criteria utility scoring engine
│   │   │   ├── comparator.py           # Trade-off matrix & recommendation rationale
│   │   │   ├── guardrails.py           # Budget validation & human checkpoint enforcer
│   │   │   └── orchestrator.py         # 6-step agent state machine
│   │   ├── services/
│   │   │   ├── analytics_service.py    # Time-series KPIs & procedural growth simulator
│   │   │   └── audit_service.py        # Immutable audit logging service
│   │   └── api/                        # REST API routes (/agent, /products, /analytics, /audit)
│   ├── requirements.txt
│   └── tests/                          # Pytest suite
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── agent/                  # Chat bar, Reasoning trace, Comparison cards, Approval card
│   │   │   ├── analytics/              # Recharts Area & Bar charts, KPI stat cards, Simulator
│   │   │   ├── trust/                  # Verifiable Audit table, Policy guardrails
│   │   │   ├── catalog/                # Interactive catalog browser
│   │   │   └── common/                 # Navbar, StatusBadge, PhaseStepIndicator
│   │   ├── types/                      # TypeScript definitions
│   │   ├── api/                        # Typed API client
│   │   ├── App.tsx                     # Master application shell
│   │   └── index.css                   # Tailwind CSS & glassmorphic design system
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── run.ps1                             # One-click startup script (PowerShell)
└── README.md
```

---

## ⚙️ Quickstart & Setup Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### Option 1: One-Click Startup (Recommended for Windows)

Run the included PowerShell script from the project root:
```powershell
.\run.ps1
```
This script will automatically start the FastAPI backend on `http://127.0.0.1:8000` and the Vite frontend on `http://localhost:5173`.

---

### Option 2: Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m app.db.seed_data
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs (Swagger UI): `http://127.0.0.1:8000/docs`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Running Automated Tests

Run the backend pytest suite:
```bash
cd backend
python -m pytest tests
```
The test suite validates:
- Intent parsing & constraint extraction
- Full agent state machine progression (`IDLE` → `PLANNING` → `SEARCHING` → `AWAITING_APPROVAL` → `APPROVED` → `COMPLETED`)
- Spending limit enforcement and emergency kill switch aborts
- Catalog search and scoring accuracy
- Audit logging & telemetry persistence

---

## 🔒 Trust & Safety Policy Specifications

| Rule ID | Policy Name | Enforcement Mechanism |
|---|---|---|
| **AC-01** | **Mandatory Human Checkpoint** | Irreversible actions (purchases/cart commits) pause state machine until explicit user confirmation. |
| **AC-02** | **Dynamic Spending Limits** | Items exceeding the user-configured budget ceiling cannot be recommended without explicit user override. |
| **AC-03** | **Emergency Kill Switch** | Single-click immediate task abort, permanently locking session execution. |
| **AC-04** | **Tamper-Evident Audit Ledger** | Every micro-action and human decision is timestamped with full input/output snapshots. |

---

## 📄 License
MIT License. Built for demonstration and portfolio showcasing.
