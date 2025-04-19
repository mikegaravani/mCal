import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type RequireAuthProps = {
  children: ReactNode;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

export default RequireAuth;
