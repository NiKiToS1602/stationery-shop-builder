from sqlalchemy import String, Boolean, DateTime, func, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="RESTRICT"), index=True)

    name: Mapped[str] = mapped_column(String(250), index=True)
    description: Mapped[str | None] = mapped_column(Text, default=None)

    sku: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2))

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    category = relationship("Category", back_populates="products")
