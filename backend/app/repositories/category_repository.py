from uuid import UUID

from sqlalchemy.orm import Session

from app.core.enums import CategoryType
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


DEFAULT_CATEGORIES = [
    ("Salary", CategoryType.INCOME, "#16A34A", "wallet"),
    ("Freelance", CategoryType.INCOME, "#16A34A", "briefcase"),
    ("Investment", CategoryType.INCOME, "#16A34A", "trending-up"),
    ("Other Income", CategoryType.INCOME, "#16A34A", "plus-circle"),
    ("Food", CategoryType.EXPENSE, "#F97316", "utensils"),
    ("Transport", CategoryType.EXPENSE, "#0EA5E9", "car"),
    ("Shopping", CategoryType.EXPENSE, "#A855F7", "shopping-bag"),
    ("Bills", CategoryType.EXPENSE, "#64748B", "receipt"),
    ("Health", CategoryType.EXPENSE, "#EF4444", "heart-pulse"),
    ("Entertainment", CategoryType.EXPENSE, "#EC4899", "clapperboard"),
    ("Education", CategoryType.EXPENSE, "#6366F1", "book-open"),
    ("Other Expense", CategoryType.EXPENSE, "#64748B", "circle-ellipsis"),
]


class CategoryRepository:

    @staticmethod
    def create(
        db: Session,
        user_id: UUID,
        category_data: CategoryCreate,
    ) -> Category:
        category = Category(
            user_id=user_id,
            **category_data.model_dump(),
        )
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def get_all(
        db: Session,
        user_id: UUID,
    ):
        categories = (
            db.query(Category)
            .filter(Category.user_id == user_id)
            .order_by(Category.name)
            .all()
        )

        # Existing accounts created before default-category seeding are handled too.
        if not categories:
            db.add_all(
                [
                    Category(
                        user_id=user_id,
                        name=name,
                        type=category_type,
                        color=color,
                        icon=icon,
                        is_default=True,
                    )
                    for name, category_type, color, icon in DEFAULT_CATEGORIES
                ]
            )
            db.commit()
            categories = (
                db.query(Category)
                .filter(Category.user_id == user_id)
                .order_by(Category.name)
                .all()
            )

        return categories

    @staticmethod
    def get_by_id(
        db: Session,
        category_id: UUID,
        user_id: UUID,
    ):
        return (
            db.query(Category)
            .filter(
                Category.id == category_id,
                Category.user_id == user_id,
            )
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        category: Category,
        category_data: CategoryUpdate,
    ):
        for key, value in category_data.model_dump(exclude_unset=True).items():
            setattr(category, key, value)
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def delete(
        db: Session,
        category: Category,
    ):
        db.delete(category)
        db.commit()
