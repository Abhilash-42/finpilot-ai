from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.database import get_db

from app.models.user import User

from app.schemas.dashboard import (DashboardSummary, MonthlyAnalytics, CategoryAnalysis, RecentTransaction,FinancialHealthResponse)  
from app.services.dashboard import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/summary",
    response_model=DashboardSummary,
)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)

    return service.get_summary(current_user.id)

@router.get(
    "/monthly",
    response_model=list[MonthlyAnalytics],
)
def monthly_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)

    return service.get_monthly_analytics(current_user.id)

@router.get(
    "/category-analysis",
    response_model=list[CategoryAnalysis],
)
def category_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)

    return service.get_category_analysis(current_user.id)
@router.get(
    "/recent",
    response_model=list[RecentTransaction],
)
def recent_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)

    return service.get_recent_transactions(current_user.id)
@router.get(
    "/health-score",
    response_model=FinancialHealthResponse,
)
def health_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DashboardService(db)

    return service.get_health_score(current_user.id)