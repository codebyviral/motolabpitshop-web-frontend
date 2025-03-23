import React, { useState, useEffect } from "react";
import { Footer, Header, ShareIcon } from "../components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutModal from "../components/CheckoutModal"; // Import the modal component
import { useAuthContext } from "../context/AuthContext"; // Import auth context
import { motion } from "framer-motion"; // Import framer-motion for animations

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuthContext(); // Get login status
  const backendUrl = import.meta.env.VITE_BACKEND;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await axios.post(`${backendUrl}/api/product/get-by-id`, {
        productId: id,
      });
      if (data.success && data.product) {
        setProduct(data.product);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Get user details by their ID
  const getUserDetails = async () => {
    try {
      const userResponse = await axios.get(
        `${backendUrl}/api/get-user/?user=${localStorage.getItem("userId")}`
      );
      console.log(userResponse);
    } catch (error) {
      console.error(`Error getting user details: ${error}`);
    }
  };

  const initiateRazorpayCheckout = async (userInfo = null) => {
    if (!product) return toast.error(`Product not found`);

    try {
      // Get Razorpay key
      const {
        data: { key },
      } = await axios.get(`${backendUrl}/api/get-key`);

      // Checkout cart
      const checkoutResponse = await axios.post(`${backendUrl}/api/checkout`, {
        amount: product.price * quantity,
      });

      if (checkoutResponse.status === 200) {
        // Checkout is successful
        console.log("checkoutResponse", checkoutResponse);
        console.log("Amount is ", checkoutResponse.data.order.amount);
        const items = [];
        items.push(product);
        console.log("items", items);
        // Fetch user shipping details before creating order
        await getUserDetails();
      }
      // Configure Razorpay options with either user-provided info or logged-in user info
      var options = {
        key: key,
        amount: checkoutResponse.data.order.amount / 100,
        currency: "INR",
        name: "Motolab PitShop",
        description: product.description,
        image: "https://i.ibb.co/2178bTsx/motolab.jpg",
        order_id: checkoutResponse.data.order.id,
        callback_url: `${
          import.meta.env.VITE_BACKEND
        }/api/payment-verification`,
        prefill: {
          // Use form data if provided, otherwise will be set by backend for logged-in users
          name: userInfo?.fullName || "",
          email: userInfo?.email || "",
          contact: userInfo?.phone || "",
        },
        notes: {
          address: userInfo?.address?.addressLine1 || "",
          city: userInfo?.address?.city || "",
          state: userInfo?.address?.state || "",
          pincode: userInfo?.address?.pinCode || "",
          quantity: quantity,
          productId: id,
        },
        theme: {
          color: "#FACC14",
        },
      };

      // Initialize Razorpay
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Payment initialization failed. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      // If logged in, directly proceed to Razorpay
      initiateRazorpayCheckout();
    } else {
      // If not logged in, show the modal
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Create a guest order checkout
  const placeOrder = async (formData) => {
    console.log(formData);
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
          items: [
            {
              product: product._id, // Use the product ID from the state
              quantity: quantity,
              price: product.price,
            },
          ],
          totalAmount: product.price * quantity,
          shippingAddress: `${formData.addressLine1}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        }
      );

      console.log("Order created:", order_response.data);
    } catch (error) {
      console.error("Error placing order:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Format the address as an object
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

      // Pass the formatted data to the backend
      await placeOrder(formattedData);

      // Initiate Razorpay checkout
      initiateRazorpayCheckout(formattedData);
      setIsModalOpen(false);
      toast.success("Redirecting to payment gateway...");
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Failed to process the order. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="loader-container"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-10 px-6 max-w-md"
          >
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Product Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the product you're looking for. It may have been
              removed or is temporarily unavailable.
            </p>
            <a
              href="/"
              className="inline-block bg-orange-400 hover:bg-orange-500 py-2 px-6 font-medium text-black rounded"
            >
              Continue Shopping
            </a>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  // Determine the image source
  const imageSrc = Array.isArray(product.images)
    ? product.images[0]
    : product.images;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="border border-gray-200 rounded p-4">
              <img
                src={imageSrc}
                alt={product.title}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            {/* Product Title */}
            <h1 className="text-2xl capitalize font-bold mb-2">{product.title}</h1>

            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ratings
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold mb-4">
              ₹{product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Size */}
            {product.size && (
              <div className="mb-4">
                <p className="text-gray-700">
                  <span className="font-medium">Size:</span> {product.size}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded p-2 w-full max-w-xs"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 hover:bg-yellow-500 py-2 px-6 font-medium rounded"
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="bg-orange-400 hover:bg-orange-500 py-2 px-6 font-medium rounded"
              >
                Buy Now
              </motion.button>
              <ShareIcon url={window.location.href} title={product.title} />
            </div>

            {/* Category */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Category:{" "}
                <span className="font-medium">{product.category}</span>
              </p>
            </div>

            {/* Creation Date */}
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Added on {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Checkout Modal - only shown for non-logged in users */}
      {!isLoggedIn && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          product={product}
        />
      )}

      <Footer />
    </>
  );
};

export default ViewProduct;
