import { useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("verified")
  );

  return isAuthenticated ? <Component /> : <Navigate to="/verify-account" />;
};
export default PrivateRoute;
