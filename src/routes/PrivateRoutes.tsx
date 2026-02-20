import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = () => {
  const { AuthState } = useAuth();

  if (!AuthState.user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
