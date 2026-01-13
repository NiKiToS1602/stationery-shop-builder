import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./app/ProtectedRoute";
import { AdminLayout } from "./layouts/AdminLayout";

import { BuilderPage } from "./pages/BuilderPage";
import AdminPanelPage from "./pages/AdminPanelPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="builder" replace />} />
          <Route path="builder" element={<BuilderPage />} />
          <Route path="panel" element={<AdminPanelPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
