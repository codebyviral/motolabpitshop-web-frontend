/* eslint-disable no-unused-vars */
import { Children, createContext, useContext, useState } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [admin, setAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );
  const [isAdmin, setIsAdmin] = useState(!!admin);

  const storeTokenInLocalStorage = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
    setIsLoggedIn(!!serverToken);
  };

  const storeisAdminState = (isAdminState) => {
    localStorage.setItem("isAdmin", isAdminState);
    setIsAdmin(isAdminState);
  };

  // console.log(localStorage.getItem("token"));
  // console.log(`isLogged in from Auth ${isLoggedIn}`);

  // Logout function
  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("profileImg");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("verified")
    localStorage.removeItem("totalItems")
    setIsLoggedIn(false);
  };

  // Store UserId
  const storeUserId = (userId) => {
    localStorage.setItem("userId", userId);
    console.log(localStorage.getItem("userId"));
  };

  // store account verification status
  const storeAccountStatus = (status) => {
    localStorage.setItem("verified", status);
  };

  // Store image url
  const storeImageUrl = (img) => {
    localStorage.setItem("userImg", img);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        LogoutUser,
        storeUserId,
        storeAccountStatus,
        storeTokenInLocalStorage,
        admin,
        storeisAdminState,
        storeImageUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
