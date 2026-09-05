from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import APP_TITLE, APP_VERSION
from app.db.seed_data import init_db
from app.api.agent_routes import router as agent_router
from app.api.catalog_routes import router as catalog_router
from app.api.analytics_routes import router as analytics_router
from app.api.audit_routes import router as audit_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed data on startup
    init_db()
    yield

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description="Full-stack AI Growth & Agentic Commerce Platform API.",
    lifespan=lifespan
)

# CORS Configuration for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(agent_router, prefix="/api")
app.include_router(catalog_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(audit_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TrendCart AI Agentic Commerce Platform",
        "version": APP_VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
