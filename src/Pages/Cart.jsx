/* eslint-disable no-unused-vars */
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
  Heart,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Header, Footer } from "../components/index";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext";
import CheckoutModal from "../components/CheckoutModal";

const Cart = () => {
  const backendUrl = import.meta.env.VITE_BACKEND;
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuthContext();
  const navigate = useNavigate();

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

  // Fetch user's details to verify shipping charge
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
    window.scrollTo(0, 0);
    fetchCart();
    if (isLoggedIn) {
      fetchUser();
      getUserDetails();
    }
  }, [userId, isLoggedIn]);

  // Handle quantity update
  const handleQuantityUpdate = async (id, action) => {
    try {
      setIsUpdating(true);
      const item = cartItems.find((item) => item._id === id);
      const newQuantity =
        action === "increase"
          ? item.quantity + 1
          : Math.max(1, item.quantity - 1);

      const { data } = await axios.put(
        `${backendUrl}/api/get-user/update-cart-item`,
        {
          userId,
          productId: id,
          quantity: newQuantity,
        }
      );

      if (data.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === id ? { ...item, quantity: newQuantity } : item
          )
        );
        toast.success("Quantity updated");
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
      const { data } = await axios.delete(
        `${backendUrl}/api/get-user/delete-cart-item?user=${userId}&product=${id}`
      );
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

  // Handle move to wishlist
  const handleMoveToWishlist = async (productId) => {
    try {
      setIsUpdating(true);
      // Add to wishlist API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      handleRemove(productId);
      toast.success("Item moved to wishlist");
    } catch (error) {
      toast.error("Failed to move to wishlist");
    } finally {
      setIsUpdating(false);
    }
  };

  // get userDetails
  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/get-user/?user=${localStorage.getItem("userId")}`
      );
      const user = res.data.userFound;
      const updatedUserDetails = {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        address: user.address?.[0]?.addressLine1 || "",
        city: user.address?.[0]?.city || "",
        state: user.address?.[0]?.state || "",
        pincode: user.address?.[0]?.pinCode || "",
      };
      setUserDetails(updatedUserDetails);
      return updatedUserDetails;
    } catch (error) {
      console.error(`Error getting user details: ${error}`);
      return null;
    }
  };

  // Razorpay payment integration
  const initiateRazorpayCheckout = async (userInfo = null) => {
    if (!cartItems || cartItems.length === 0)
      return toast.error(`Cart is empty`);

    try {
      const {
        data: { key },
      } = await axios.get(`${backendUrl}/api/get-key`);

      let shippingCharges = deliveryCharge ? 150 : 0;
      const totalAmount =
        cartItems.reduce(
          (total, item) => total + item.price * (item.quantity || 1),
          0
        ) + shippingCharges;

      const checkoutResponse = await axios.post(`${backendUrl}/api/checkout`, {
        amount: totalAmount,
      });

      if (checkoutResponse.status === 200) {
        const rzp_cart_purchase_id = checkoutResponse.data.order.id;
        localStorage.setItem("rzp_cart_oid",rzp_cart_purchase_id)
        const userDetailsResponse = isLoggedIn ? await getUserDetails() : null;
        const userData = userInfo || userDetailsResponse || {};

        const productDesc = `Purchase of ${cartItems.length} item(s) from Motolab PitShop`;

        var options = {
          key: key,
          amount: checkoutResponse.data.order.amount / 100,
          currency: "INR",
          name: "Motolab PitShop",
          description: productDesc,
          image: "https://i.ibb.co/2178bTsx/motolab.jpg",
          order_id: checkoutResponse.data.order.id,
          callback_url: `${
            import.meta.env.VITE_BACKEND
          }/api/payment-verification`,
          prefill: {
            name: userData.fullName || "",
            email: userData.email || "",
            contact: userData.phone || "",
          },
          notes: {
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
            pincode: userData.pincode || "",
            items: JSON.stringify(
              cartItems.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
                price: item.price,
              }))
            ),
            userId: userId || "guest",
          },
          theme: {
            color: "#FACC14",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Payment initialization failed. Please try again.");
    }
  };

  const createCustomerOrder = async () => {
    try {
      const deliveryPrice = deliveryCharge ? 150 : 0;

      // Mapping cartItems to the required format
      const productItems = cartItems.map((product) => ({
        product: product, // Extracting product ID
        quantity: product.quantity,
        price: product.price * product.quantity + deliveryPrice,
      }));

      console.log("productItems", productItems);

      const orderData = {
        userId: localStorage.getItem("userId"),
        razorpayOrderId: await localStorage.getItem("rzp_cart_oid"),
        phoneNumber: userDetails.phone,
        shippingaddress: userDetails.address,
        items: productItems, // Assigning the formatted array
      };

      const customerOrderResponse = await axios.post(
        `${backendUrl}/api/order/create`,
        orderData
      );
    } catch (error) {
      console.log(`Error creating customer order: ${error}`);
    }
  };

  const handleCheckout = async () => {
    if (isLoggedIn) {
      const userDetailsResponse = await getUserDetails();

      if (
        !userDetailsResponse.address ||
        !userDetailsResponse.city ||
        !userDetailsResponse.state ||
        !userDetailsResponse.pincode ||
        !userDetailsResponse.phone
      ) {
        toast.error(
          "Please add your address/phone in your profile before making a purchase."
        );
        setTimeout(() => navigate("/your-account"), 500);
        return;
      }

      const state = userDetails.state;
      if (state === "Tamil Nadu" || state === "tamil nadu")
        setDeliveryCharge(false);

      setIsProcessingCheckout(true);
      await initiateRazorpayCheckout({
        fullName: userDetails.fullName,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address,
        city: userDetails.city,
        state: userDetails.state,
        pincode: userDetails.pincode,
      });
      setTimeout(async () => {
        toast.success("Payment processing... Please do not refresh or go back.");
        await createCustomerOrder();
      });
      setIsProcessingCheckout(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const placeOrder = async (formData) => {
    try {
      const order_response = await axios.post(
        `${backendUrl}/api/order/create-guest-order`,
        {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pincode,
          },
          items: cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount:
            cartItems.reduce(
              (total, item) => total + item.price * (item.quantity || 1),
              0
            ) + (deliveryCharge ? 150 : 0),
          shippingAddress: `${formData.addressLine1}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        }
      );
      console.log("Order created:", order_response.data);
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const formattedData = {
        ...formData,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pincode,
        },
      };

      await placeOrder(formattedData);
      initiateRazorpayCheckout(formattedData);
      setIsModalOpen(false);
      toast.success("Redirecting to payment gateway...");
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Failed to process the order. Please try again.");
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const shippingCharge = deliveryCharge ? 150 : 0;
  const total = subtotal + shippingCharge;

  // Calculate estimated delivery date (3-5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(
    deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3
  );
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "₹ ");
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-yellow-600"
                >
                  Home
                </a>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Shopping Cart
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="mr-3 text-yellow-500" size={28} />
              Your Shopping Cart
            </h1>
            {cartItems.length > 0 && (
              <span className="ml-4 bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader className="animate-spin h-12 w-12 text-yellow-500 mb-4" />
              <p className="text-gray-600">Loading your cart...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-red-500 mb-4 text-lg">{error}</div>
              <button
                onClick={fetchCart}
                className="flex items-center justify-center bg-yellow-400 text-black font-medium px-6 py-3 rounded-lg hover:bg-yellow-500 transition duration-300 shadow-sm"
              >
                <RefreshCw className="mr-2 h-5 w-5" /> Try Again
              </button>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Takes up 2/3 of the space on large screens */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      Items in Your Cart
                    </h2>
                    {isUpdating && (
                      <div className="absolute inset-0 bg-black bg-opacity-10 flex justify-center items-center rounded-xl z-10">
                        <div className="bg-white p-4 rounded-full shadow-lg">
                          <Loader className="animate-spin h-8 w-8 text-yellow-500" />
                        </div>
                      </div>
                    )}

                    <div className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 relative group hover:bg-gray-50 transition duration-200 px-3"
                        >
                          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                            {/* Image Container */}
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              className="w-24 h-24 rounded-lg overflow-hidden mr-5 border border-gray-200 shadow-sm cursor-pointer"
                              onClick={() =>
                                navigate(`/view-product/${item._id}`)
                              }
                            >
                              <img
                                loading="lazy"
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                              />
                            </motion.div>
                            <div className="flex-1">
                              <h2
                                className="text-lg font-semibold text-gray-900 hover:text-yellow-600 cursor-pointer transition-colors"
                                onClick={() =>
                                  navigate(`/view-product/${item._id}`)
                                }
                              >
                                {item.title}
                              </h2>
                              <p className="text-gray-600 text-sm mt-1">
                                {item.category}
                              </p>
                              <div className="mt-2">
                                <span className="font-bold text-gray-900 text-lg">
                                  {formatCurrency(item.price)}
                                </span>
                                {item.originalPrice &&
                                  item.originalPrice > item.price && (
                                    <span className="text-gray-500 line-through ml-2 text-sm">
                                      {formatCurrency(item.originalPrice)}
                                    </span>
                                  )}
                                {item.originalPrice &&
                                  item.originalPrice > item.price && (
                                    <span className="ml-2 text-green-600 text-sm font-medium">
                                      {Math.round(
                                        (1 - item.price / item.originalPrice) *
                                          100
                                      )}
                                      % OFF
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end space-x-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(item._id, "decrease")
                                }
                                disabled={item.quantity <= 1 || isUpdating}
                                className={`p-2 ${
                                  item.quantity <= 1
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-100"
                                } transition-colors`}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="mx-3 text-base font-medium text-gray-900 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(item._id, "increase")
                                }
                                disabled={isUpdating}
                                className="p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleMoveToWishlist(item._id)}
                                disabled={isUpdating}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Move to wishlist"
                                title="Move to wishlist"
                              >
                                <Heart className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleRemove(item._id)}
                                disabled={isUpdating}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Remove item"
                                title="Remove item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="flex items-start">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <Truck className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Delivery Information
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {deliveryCharge ? (
                            <>
                              <span className="font-medium">
                                Standard Shipping:
                              </span>{" "}
                              ₹150. Expected delivery by{" "}
                              <span className="font-medium text-gray-900">
                                {formattedDeliveryDate}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-green-600 font-medium">
                                Free Shipping!
                              </span>
                              Expected delivery by{" "}
                              <span className="font-medium text-gray-900">
                                {formattedDeliveryDate}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="bg-yellow-100 p-2 rounded-full mr-4">
                      <Shield className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Secure Payment
                      </h3>
                      <p className="text-gray-600 text-sm">
                        256-bit SSL encryption for all transactions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="bg-yellow-100 p-2 rounded-full mr-4">
                      <Truck className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Fast Delivery
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Express shipping available for all orders
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary - Takes up 1/3 of the space on large screens */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 sticky top-4">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="mr-2 text-yellow-500" size={20} />
                      Order Summary
                    </h2>

                    {/* Price Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-gray-700">
                        <span>
                          Subtotal ({cartItems.length}{" "}
                          {cartItems.length === 1 ? "item" : "items"})
                        </span>
                        <span className="font-medium">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-gray-700">
                        <span>Shipping</span>
                        {deliveryCharge ? (
                          <span className="font-medium">
                            {formatCurrency(150)}
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">
                            FREE
                          </span>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between items-center font-bold text-lg text-gray-900">
                          <span>Total</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-2">
                          {deliveryCharge ? (
                            <>
                              ₹150 shipping fee applies to all states except{" "}
                              <b>Tamil Nadu</b>. Including taxes.
                            </>
                          ) : (
                            <>
                              Free shipping for Tamil Nadu customers. Including
                              taxes.
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={isProcessingCheckout}
                      className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-600 transition duration-300 shadow-md flex items-center justify-center text-lg mb-4"
                    >
                      {isProcessingCheckout ? (
                        <>
                          <Loader className="animate-spin mr-2 h-5 w-5" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </motion.button>

                    {/* Payment Methods */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        We Accept
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <img
                            src="https://i.ibb.co/Lhvt9d4F/download.png"
                            alt="Visa"
                            className="h-5"
                          />
                        </div>
                        <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <img
                            src="https://i.ibb.co/qF0MR6nb/image.png"
                            alt="Mastercard"
                            className="h-5"
                          />
                        </div>
                        <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <img
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                            alt="Google Pay"
                            className="h-5"
                          />
                        </div>
                        <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-700">
                            UPI
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Continue Shopping Link */}
                    <div className="text-center">
                      <a
                        href="/view-all-products"
                        className="inline-flex items-center text-gray-700 hover:text-yellow-600 text-sm transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Continue Shopping
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 max-w-2xl mx-auto">
              <div className="p-12">
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-16 w-16 text-yellow-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Looks like you haven't added anything to your cart yet.
                  Explore our products and find something you like!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="/view-all-products"
                    className="inline-flex items-center justify-center bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition duration-300 shadow-md"
                  >
                    Browse Products
                  </a>
                  <a
                    href="/deals"
                    className="inline-flex items-center justify-center bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition duration-300"
                  >
                    View Special Offers
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Checkout Modal for guest users */}
      {!isLoggedIn && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          cartItems={cartItems}
          totalAmount={total}
        />
      )}
    </>
  );
};

export default Cart;
