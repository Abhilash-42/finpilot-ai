from datetime import date
from uuid import UUID

from pydantic import BaseModel


class DashboardFilters(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    account_id: UUID | None = None
    category_id: UUID | None = None