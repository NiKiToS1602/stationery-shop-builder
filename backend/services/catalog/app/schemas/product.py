from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    category_id: int
    name: str = Field(min_length=2, max_length=250)
    description: str | None = None
    sku: str = Field(min_length=2, max_length=64)
    price: float = Field(gt=0)
    is_active: bool = True


class ProductUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = Field(default=None, min_length=2, max_length=250)
    description: str | None = None
    sku: str | None = Field(default=None, min_length=2, max_length=64)
    price: float | None = Field(default=None, gt=0)
    is_active: bool | None = None


class ProductOut(BaseModel):
    id: int
    category_id: int
    name: str
    description: str | None
    sku: str
    price: float
    is_active: bool

    class Config:
        from_attributes = True
