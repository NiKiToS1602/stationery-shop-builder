import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { getToken } from "../shared/auth/tokenStorage";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const tokenFromStore = useSelector((s: RootState) => s.auth.accessToken);
  const token = tokenFromStore || getToken();

  if (!token) return <Navigate to="/login" replace />;
  return children;
}
