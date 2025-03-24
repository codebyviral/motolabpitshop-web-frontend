/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import TurnstileWidget from "./components/TurnstilWidget.jsx";
import {
  Home,
  LoginForm,
  SignupForm,
  AboutUs,
  AllProducts,
  Logout,
  Profile,
  ViewProduct,
  PaymentSuccess,
  ContactMethods,
  TermsAndConditions,
  PrivacyPolicy,
  Cart,
  NotFound,
  Verification,
} from "./Pages/index.js";
import { ToastContainer } from "react-toastify";
import "./app.css";

function App() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (token) => {
    setIsVerified(true);
    console.log("Turnstile token:", token);
    // Optionally send the token to your backend for validation
  };

  return (
    <>
      <ToastContainer />
      {!isVerified ? (
        <div className="verification-container">
          <div className="verification-content">
            <h1 className="verification-title">Welcome to Motolab</h1>
            <p className="verification-text">
              Please complete the verification to continue:
            </p>
            <div className="turnstile-wrapper">
              <TurnstileWidget onVerify={handleVerify} />
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/contact" element={<ContactMethods />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;