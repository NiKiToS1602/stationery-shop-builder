import { useEffect, useState } from "react";
import { apiFetch } from "../shared/api/client";
import { CategoryTree, type Category } from "../components/categories/CategoryTree";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await apiFetch("/api/v1/categories");
      if (res.ok) {
        const data: Category[] = await res.json();
        setCategories(data);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div>
      <h1 style={{ color: "white" }}>Категории</h1>
      <CategoryTree categories={categories} />
    </div>
  );
}
