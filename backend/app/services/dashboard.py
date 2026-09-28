from uuid import UUID

from sqlalchemy.orm import Session
from app.services.financial_health import FinancialHealthService
from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, db: Session):
        self.repository = DashboardRepository(db)

    def get_summary(self, user_id: UUID):
        return self.repository.get_summary(user_id)
    def get_monthly_analytics(self, user_id):
       return self.repository.get_monthly_analytics(user_id)
    def get_category_analysis(self, user_id):
       return self.repository.get_category_analysis(user_id)
    def get_recent_transactions(self, user_id):
       return self.repository.get_recent_transactions(user_id)
    def get_health_score(self, user_id):
        summary = self.repository.get_summary(user_id)

        return FinancialHealthService.calculate(
        total_income=summary["total_income"],
        total_expense=summary["total_expense"],
        )