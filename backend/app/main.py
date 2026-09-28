from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.ai import router as ai_router
from app.api.v1.auth import router as auth_router
from app.api.v1.auth.accounts.routes import router as account_router
from app.api.v1.budgets import router as budget_router
from app.api.v1.categories import router as category_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.goals import router as goal_router
from app.api.v1.reports import router as reports_router
from app.api.v1.transactions import router as transaction_router
from app.config.settings import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

cors_origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": settings.PROJECT_NAME}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}


app.include_router(auth_router)
app.include_router(account_router)
app.include_router(category_router)
app.include_router(transaction_router)
app.include_router(dashboard_router)
app.include_router(budget_router)
app.include_router(goal_router)
app.include_router(reports_router)
app.include_router(ai_router)
