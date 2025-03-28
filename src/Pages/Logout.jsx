import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
const Logout = () => {
  const { LogoutUser } = useAuthContext();

  useEffect(() => {
    LogoutUser();
    toast.success("Logged out");
  }, [LogoutUser]);
  return <Navigate to="/" />;
};

export default Logout;
