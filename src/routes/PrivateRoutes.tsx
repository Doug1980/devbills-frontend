import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = () => {
  const { authState } = useAuth();

  if (authState.loading) {
    return <div>Carregando...</div>;
  }

  if (!authState.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
