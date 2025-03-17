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
} from "./Pages/index.js";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
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
        </Routes>
      </div>
    </>
  );
}

export default App;
