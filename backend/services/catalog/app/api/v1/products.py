from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.core.auth import require_auth
from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut

router = APIRouter()


@router.get("/", response_model=list[ProductOut], dependencies=[Depends(require_auth)])
async def list_products(
    session: AsyncSession = Depends(get_session),
    category_id: int | None = Query(default=None),
    q: str | None = Query(default=None, min_length=2),
):
    stmt = select(Product).order_by(Product.id)

    if category_id is not None:
        stmt = stmt.where(Product.category_id == category_id)

    if q is not None:
        stmt = stmt.where(Product.name.ilike(f"%{q}%"))

    res = await session.execute(stmt)
    return res.scalars().all()


@router.post("/", response_model=ProductOut, status_code=201, dependencies=[Depends(require_auth)])
async def create_product(data: ProductCreate, session: AsyncSession = Depends(get_session)):
    # категория должна существовать
    cat = await session.get(Category, data.category_id)
    if not cat:
        raise HTTPException(status_code=400, detail="Category does not exist")

    # sku unique
    exists = await session.execute(select(Product).where(Product.sku == data.sku))
    if exists.scalars().first():
        raise HTTPException(status_code=400, detail="SKU already exists")

    obj = Product(**data.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


@router.get("/{product_id}", response_model=ProductOut, dependencies=[Depends(require_auth)])
async def get_product(product_id: int, session: AsyncSession = Depends(get_session)):
    obj = await session.get(Product, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Product not found")
    return obj


@router.patch("/{product_id}", response_model=ProductOut, dependencies=[Depends(require_auth)])
async def update_product(product_id: int, data: ProductUpdate, session: AsyncSession = Depends(get_session)):
    obj = await session.get(Product, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Product not found")

    payload = data.model_dump(exclude_unset=True)

    if "category_id" in payload:
        cat = await session.get(Category, payload["category_id"])
        if not cat:
            raise HTTPException(status_code=400, detail="Category does not exist")

    if "sku" in payload:
        exists = await session.execute(select(Product).where(Product.sku == payload["sku"], Product.id != obj.id))
        if exists.scalars().first():
            raise HTTPException(status_code=400, detail="SKU already exists")

    for k, v in payload.items():
        setattr(obj, k, v)

    await session.commit()
    await session.refresh(obj)
    return obj


@router.delete("/{product_id}", status_code=204, dependencies=[Depends(require_auth)])
async def delete_product(product_id: int, session: AsyncSession = Depends(get_session)):
    obj = await session.get(Product, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Product not found")

    await session.delete(obj)
    await session.commit()
    return None
