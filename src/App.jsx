/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
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
} from "./Pages/index.js";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/your-account" element={<Profile />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/view-all-products" element={<AllProducts />} />
          <Route path="/view-product/:id" element={<ViewProduct />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/ContactMethods" element={<ContactMethods />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
