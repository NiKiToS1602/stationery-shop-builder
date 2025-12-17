from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    slug: str = Field(min_length=2, max_length=200)
    is_active: bool = True


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    slug: str | None = Field(default=None, min_length=2, max_length=200)
    is_active: bool | None = None


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    is_active: bool

    class Config:
        from_attributes = True
