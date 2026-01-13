import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const TOKEN_KEY = "access_token";

export function isAuthed(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
