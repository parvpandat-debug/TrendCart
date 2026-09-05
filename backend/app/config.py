import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = os.getenv("DB_PATH", str(BASE_DIR / "trendcart.db"))
DATABASE_URL = f"sqlite:///{DB_PATH}"

DEFAULT_BUDGET_LIMIT = float(os.getenv("DEFAULT_BUDGET_LIMIT", "1000.0"))
AUTONOMOUS_AUTO_APPROVAL_THRESHOLD = float(os.getenv("AUTONOMOUS_AUTO_APPROVAL_THRESHOLD", "50.0"))
APP_TITLE = "TrendCart AI Growth & Agentic Commerce API"
APP_VERSION = "1.0.0"
