/* eslint-disable no-unused-vars */
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

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
  OrderStatus,
} from './Pages/index.js';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import AllProductsCategory from './Pages/AllProductsCategory.jsx';

function App() {
  return (
    <>
      <ToastContainer
        position='bottom-right'
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <div className='App'>
        <Routes>
          {/* PRIVATE ROUTES */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/signup' element={<SignupForm />} />
          <Route path='/your-account' element={<Profile />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/view-all-products' element={<AllProducts />} />
          <Route path="/products/:category?" element={<AllProductsCategory />} />
          <Route path='/view-product/:id' element={<ViewProduct />} />
          <Route path='/payment-success' element={<PaymentSuccess />} />
          <Route path='/ContactMethods' element={<ContactMethods />} />
          <Route path='/TermsAndConditions' element={<TermsAndConditions />} />
          <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/verify-account' element={<Verification />} />
          <Route path='/order-status/:orderId' element={<OrderStatus />} />
          <Route path='/my-cart' element={<Cart />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
