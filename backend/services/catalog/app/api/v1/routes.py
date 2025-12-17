from fastapi import APIRouter
from app.api.v1.categories import router as categories_router
from app.api.v1.products import router as products_router

router = APIRouter()
router.include_router(categories_router, prefix="/categories", tags=["categories"])
router.include_router(products_router, prefix="/products", tags=["products"])
