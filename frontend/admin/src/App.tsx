import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./app/ProtectedRoute";
import { BuilderPage } from "./pages/BuilderPage";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* публичный маршрут */}
        <Route path="/login" element={<LoginPage />} />

        {/* всё остальное — только после логина */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BuilderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/debug"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* если попали на неизвестный путь — кидаем на главную,
            а ProtectedRoute уже решит: '/' или '/login' */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
