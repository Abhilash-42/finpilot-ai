from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:

    @staticmethod
    def create_category(
        db: Session,
        user_id: UUID,
        category_data: CategoryCreate,
    ):
        return CategoryRepository.create(
            db,
            user_id,
            category_data,
        )

    @staticmethod
    def get_categories(
        db: Session,
        user_id: UUID,
    ):
        return CategoryRepository.get_all(
            db,
            user_id,
        )

    @staticmethod
    def get_category(
        db: Session,
        category_id: UUID,
        user_id: UUID,
    ):
        category = CategoryRepository.get_by_id(
            db,
            category_id,
            user_id,
        )

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found.",
            )

        return category

    @staticmethod
    def update_category(
        db: Session,
        category_id: UUID,
        user_id: UUID,
        category_data: CategoryUpdate,
    ):
        category = CategoryService.get_category(
            db,
            category_id,
            user_id,
        )

        return CategoryRepository.update(
            db,
            category,
            category_data,
        )

    @staticmethod
    def delete_category(
        db: Session,
        category_id: UUID,
        user_id: UUID,
    ):
        category = CategoryService.get_category(
            db,
            category_id,
            user_id,
        )

        CategoryRepository.delete(
            db,
            category,
        )

        return {
            "message": "Category deleted successfully."
        }