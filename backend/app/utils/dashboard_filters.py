from sqlalchemy.orm import Query

from app.schemas.dashboard_filters import DashboardFilters
from app.models.transaction import Transaction


def apply_dashboard_filters(
    query: Query,
    filters: DashboardFilters,
):
    if filters.start_date:
        query = query.filter(
            Transaction.transaction_date >= filters.start_date
        )

    if filters.end_date:
        query = query.filter(
            Transaction.transaction_date <= filters.end_date
        )

    if filters.account_id:
        query = query.filter(
            Transaction.account_id == filters.account_id
        )

    if filters.category_id:
        query = query.filter(
            Transaction.category_id == filters.category_id
        )

    return query