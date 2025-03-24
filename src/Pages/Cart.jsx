import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Loader,
  RefreshCw,
  Shield,
  Truck,
  CreditCard,
} from "lucide-react";
import { Header, Footer } from "../components/index";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const backendUrl = import.meta.env.VITE_BACKEND;
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(false);

  // Fetch user's cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/get-user/cart`, {
        userId,
      });
      if (data.success && data.items.length > 0) {
        setCartItems(data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      toast.error(`Error fetching cart details.`);
      setError("Failed to load cart. Please try again later.");
      console.log(`Error fetching cart: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's details to verify shipping charge for outer states of Tamil Nadu
  const fetchUser = async () => {
    try {
      const userResponse = await axios.get(
        `${backendUrl}/api/get-user/?user=${userId}`
      );
      if (
        userResponse.data.userFound.address[0].state === "Tamil Nadu" ||
        userResponse.data.userFound.address[0].state === "tamil nadu"
      ) {
        setDeliveryCharge(false);
      } else {
        setDeliveryCharge(true);
      }
    } catch (error) {
      console.log(`Error getting user's address: `, error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, [userId]);

  // Handle quantity update
  const handleQuantityUpdate = async (id, action) => {
    try {
      setIsUpdating(true);
      const { data } = await axios.post(
        `${backendUrl}/api/update-cart-quantity`,
        {
          userId,
          productId: id,
          action, // "increase" or "decrease"
        }
      );

      if (data.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === id
              ? {
                  ...item,
                  quantity: data.updatedQuantity,
                }
              : item
          )
        );
      } else {
        toast.error("Failed to update quantity.");
      }
    } catch (error) {
      toast.error("Error updating quantity.");
      console.log(`Error updating quantity: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle remove item from cart
  const handleRemove = async (id) => {
    try {
      setIsUpdating(true);
      const { data } = await axios.post(`${backendUrl}/api/remove-from-cart`, {
        userId,
        productId: id,
      });
      if (data.success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== id)
        );
        toast.success("Item removed from cart.");
      } else {
        toast.error("Failed to remove item from cart.");
      }
    } catch (error) {
      toast.error("Error removing item from cart.");
      console.log(`Error removing item: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const total = subtotal + (deliveryCharge ? 150 : 0);

  // Calculate estimated delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center text-black">
            <ShoppingCart className="mr-3 text-yellow-500" />
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 mb-8">
            Complete your purchase and get ready for fast delivery
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin h-10 w-10 text-yellow-500" />
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={fetchCart}
                className="flex items-center justify-center bg-yellow-400 text-black font-medium px-6 py-3 rounded-md hover:bg-yellow-500 transition duration-300"
              >
                <RefreshCw className="mr-2 h-5 w-5" /> Try Again
              </button>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Takes up 2/3 of the space on large screens */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-6 text-black border-b border-gray-200 pb-2">
                    Items in Your Cart
                  </h2>
                  {isUpdating && (
                    <div className="absolute inset-0 bg-black bg-opacity-10 flex justify-center items-center rounded-lg z-10">
                      <div className="bg-white p-3 rounded-full">
                        <Loader className="animate-spin h-6 w-6 text-yellow-500" />
                      </div>
                    </div>
                  )}

                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 py-6 relative hover:bg-gray-50 transition duration-300 rounded-md px-3"
                    >
                      <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                        {/* Image Container */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden mr-5 border border-gray-200 shadow-sm">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-black">
                            {item.title}
                          </h2>
                          <p className="text-gray-600 text-sm mt-1">
                            Available for immediate shipping
                          </p>
                          <div className="mt-2">
                            <span className="font-bold text-black text-lg">
                              ₹{item.price.toFixed(2)}
                            </span>
                            {item.originalPrice &&
                              item.originalPrice > item.price && (
                                <span className="text-gray-500 line-through ml-2">
                                  ₹{item.originalPrice.toFixed(2)}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                          <button
                            onClick={() =>
                              handleQuantityUpdate(item._id, "decrease")
                            }
                            disabled={item.quantity <= 1 || isUpdating}
                            className={`p-2 ${
                              item.quantity <= 1
                                ? "text-gray-400"
                                : "text-black hover:bg-gray-100"
                            }`}
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="mx-4 text-lg font-medium text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityUpdate(item._id, "increase")
                            }
                            disabled={isUpdating}
                            className="p-2 text-black hover:bg-gray-100"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={isUpdating}
                          className="text-gray-500 hover:text-red-600 ml-6 p-2 hover:bg-gray-100 rounded-full transition duration-300"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Delivery Information */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <Truck className="w-5 h-5 text-yellow-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-black">
                          Delivery Information
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Free shipping available. Expected delivery:{" "}
                          <span className="font-medium text-black">
                            {formattedDeliveryDate}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <Shield className="w-8 h-8 text-yellow-500 mr-3" />
                    <div>
                      <h3 className="font-medium text-black">Secure Payment</h3>
                      <p className="text-gray-600 text-sm">
                        All transactions encrypted
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <Truck className="w-8 h-8 text-yellow-500 mr-3" />
                    <div>
                      <h3 className="font-medium text-black">Fast Delivery</h3>
                      <p className="text-gray-600 text-sm">
                        Express shipping available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary - Takes up 1/3 of the space on large screens */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 sticky top-4">
                  <h2 className="text-xl font-semibold mb-6 text-black border-b border-gray-200 pb-2">
                    Order Summary
                  </h2>

                  {/* Price Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-black">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-black">
                      <span>Shipping</span>
                      {deliveryCharge ? (
                        <span className="text-black">₹ 150</span>
                      ) : (
                        <span className="text-green-600">Free</span>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center font-bold text-lg text-black">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        ₹150 shipping fee applies to all states except{" "}
                        <b>Tamil Nadu</b>. <br /> Including taxes and fees.
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-black mb-2 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-yellow-500" />{" "}
                      Accepted Payment Methods
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-gray-600">
                        VISA
                      </div>
                      <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-gray-600">
                        MC
                      </div>
                      <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-gray-600">
                        AMEX
                      </div>
                      <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-gray-600">
                        UPI
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button className="w-full bg-yellow-400 text-black py-4 rounded-md font-bold hover:bg-yellow-500 transition duration-300 shadow-md flex items-center justify-center text-lg">
                    Complete Purchase
                  </button>

                  {/* Continue Shopping Link */}
                  <div className="text-center mt-4">
                    <a
                      href="/view-all-products"
                      className="text-gray-700 hover:text-black text-sm inline-flex items-center transition duration-300"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Continue Shopping
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center bg-white shadow-lg rounded-lg p-12 border border-gray-200">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-black mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <a
                href="/products"
                className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-md font-medium hover:bg-yellow-500 transition duration-300 shadow-md"
              >
                Start Shopping Now
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
