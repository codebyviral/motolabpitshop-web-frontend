import React, { useState } from "react";

const CheckoutModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.address.addressLine1.trim())
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.address.city.trim()) newErrors.city = "City is required";
    if (!formData.address.state.trim()) newErrors.state = "State is required";
    if (!formData.address.pinCode.trim())
      newErrors.pinCode = "Pincode is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate a slight delay to show loading state
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-white">
              Shipping Information
            </h2>
            <p className="text-sm text-white/90">Please enter your details</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-100 focus:outline-none transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Product summary */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {product && (
              <>
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 border-orange-100 bg-white shadow-sm">
                  <img
                    src={
                      Array.isArray(product.images)
                        ? product.images[0]
                        : product.images
                    }
                    alt={product.title}
                    className="h-full w-full object-contain object-center"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-bold text-orange-500">
                      ₹{product.price.toFixed(2)}
                    </p>
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded">
                      1 item
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                {errors.fullName && (
                  <span className="text-xs text-red-600">
                    {errors.fullName}
                  </span>
                )}
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                {errors.email && (
                  <span className="text-xs text-red-600">{errors.email}</span>
                )}
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                {errors.phoneNumber && (
                  <span className="text-xs text-red-600">
                    {errors.phoneNumber}
                  </span>
                )}
              </div>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                placeholder="9876543210"
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="addressLine1"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 1
                </label>
                {errors.addressLine1 && (
                  <span className="text-xs text-red-600">
                    {errors.addressLine1}
                  </span>
                )}
              </div>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.address.addressLine1}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${
                  errors.addressLine1 ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                placeholder="Street address, P.O. box, company name"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label
                htmlFor="addressLine2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.address.addressLine2}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>

            {/* City, State, Pincode row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  {errors.city && (
                    <span className="text-xs text-red-600">{errors.city}</span>
                  )}
                </div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } px-4 py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                  placeholder="City"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  {errors.state && (
                    <span className="text-xs text-red-600">{errors.state}</span>
                  )}
                </div>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  } px-4 py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                  placeholder="State"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pinCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pincode
                </label>
                {errors.pinCode && (
                  <span className="text-xs text-red-600">{errors.pinCode}</span>
                )}
              </div>
              <input
                type="text"
                id="pinCode"
                name="pinCode"
                value={formData.address.pinCode}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${
                  errors.pinCode ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                placeholder="Postal code"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 py-3.5 px-6 text-center font-semibold text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
