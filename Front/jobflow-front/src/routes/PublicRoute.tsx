import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const user = localStorage.getItem("token"); 

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}