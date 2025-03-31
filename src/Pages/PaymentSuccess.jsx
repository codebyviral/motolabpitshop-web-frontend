import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useOrderContext } from "../context/OrderContext";
import axios from "axios";

const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get("reference");
  const userId = localStorage.getItem("userId");
  const backendUrl = import.meta.env.VITE_BACKEND;
  const { clearOrderData } = useOrderContext();

  const clearCartItems = async () => {
    try {
      const cartClearResponse = await axios.delete(
        `${backendUrl}/api/product/delete-cart-items?userId=${userId}`
      );
      console.log("cartClearResponse", cartClearResponse);
    } catch (error) {
      console.log(`Error during clearing cart Items: ${error}`);
    }
  };

  useEffect(() => {
    clearOrderData();
    clearCartItems();
    localStorage.removeItem("rzp_order_id");
    localStorage.removeItem("rzp_cart_oid");
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-yellow-50 opacity-60"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-yellow-50 opacity-60"></div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="mx-auto flex justify-center mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full h-20 w-20 flex items-center justify-center shadow-lg">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Payment Successful
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been processed successfully
          </p>

          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">
                Reference #
              </span>
              <span className="text-sm font-medium text-gray-500">Status</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-800">
                {referenceNum}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Completed
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/your-account")}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Order Details
            </button>
            <button
              onClick={() => navigate("/view-all-products")}
              className="w-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            <p>
              A confirmation email has been sent to your registered email
              address
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
