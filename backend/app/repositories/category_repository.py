from uuid import UUID

from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


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
        return (
            db.query(Category)
            .filter(Category.user_id == user_id)
            .order_by(Category.name)
            .all()
        )

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