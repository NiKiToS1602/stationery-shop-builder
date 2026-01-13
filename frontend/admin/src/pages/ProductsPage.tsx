import { useEffect, useState } from "react";
import { apiFetch } from "../shared/api/client";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await apiFetch("/api/v1/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Товары</h1>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>Активен</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.isActive ? "Да" : "Нет"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
