import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authToken = localStorage.getItem("authToken");
  
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
