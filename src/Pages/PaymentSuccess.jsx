import React from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get("reference");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center border border-yellow-100">
        <div className="mb-4 sm:mb-6">
          <div className="mx-auto bg-yellow-100 rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mb-3 sm:mb-4">
            <svg
              className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500"
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 uppercase tracking-wide mb-1 sm:mb-2">
            Payment Successful
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Thank you for your purchase!
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            Reference Number
          </p>
          <p className="text-base sm:text-lg font-semibold text-gray-800">
            {referenceNum}
          </p>
        </div>

        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 sm:py-3 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base">
          View Order Details
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
