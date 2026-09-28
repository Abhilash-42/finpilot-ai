from uuid import UUID

from pydantic import BaseModel, Field

from app.core.enums import CategoryType


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    type: CategoryType
    color: str = "#2196F3"
    icon: str = "category"


class CategoryUpdate(BaseModel):
    name: str | None = None
    type: CategoryType | None = None
    color: str | None = None
    icon: str | None = None


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    type: CategoryType
    color: str
    icon: str
    is_default: bool

    model_config = {
        "from_attributes": True
    }