from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200, examples=["Футболки"])
    slug: str = Field(min_length=2, max_length=200, examples=["t-shirts"])
    is_active: bool = Field(default=True, examples=[True])

    parent_id: int | None = Field(
        default=None,
        examples=[1],
        description="ID родительской категории (null если это корневая категория)",
    )


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200, examples=["Худи"])
    slug: str | None = Field(default=None, min_length=2, max_length=200, examples=["hoodies"])
    is_active: bool | None = Field(default=None, examples=[True])

    parent_id: int | None = Field(
        default=None,
        examples=[1],
        description="ID родительской категории (null если сделать корневой)",
    )


class CategoryOut(BaseModel):
    id: int = Field(examples=[1])
    name: str = Field(examples=["Футболки"])
    slug: str = Field(examples=["t-shirts"])
    is_active: bool = Field(examples=[True])

    parent_id: int | None = Field(default=None, examples=[1])

    class Config:
        from_attributes = True
