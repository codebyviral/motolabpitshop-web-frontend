import React, { useEffect, useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, Loader } from "lucide-react"; // Replaced X with Trash2
import { Header, Footer } from "../components/index";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const backendUrl = import.meta.env.VITE_BACKEND;
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);

  // Fetch user's cart
  const fetchCart = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/get-user/cart`, {
        userId,
      });
      if (data.success && data.items.length > 0) {
        setCartItems(data.items);
      } else {
        toast.info("Your cart is empty.");
      }
    } catch (error) {
      toast.error(`Error fetching cart details.`);
      setError("Failed to load cart. Please try again later.");
      console.log(`Error fetching cart: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // Handle quantity update
  const handleQuantityUpdate = async (id, action) => {
    try {
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
    }
  };

  // Handle remove item from cart
  const handleRemove = async (id) => {
    try {
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
    }
  };

  // Handle discount code application
  const applyDiscount = () => {
    if (discountCode === "SAVE10") {
      setDiscountApplied(true);
      setDiscountValue(10);
      toast.success("Discount applied successfully!");
    } else {
      toast.error("Invalid discount code.");
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const total = subtotal - discountValue;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2" /> Your Cart
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-8 w-8 text-yellow-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : cartItems.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  {/* Image Container */}
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityUpdate(item._id, "decrease")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Minus className="w-6 h-6" /> {/* Increased size */}
                  </button>
                  <span className="mx-2 text-lg">{item.quantity}</span>{" "}
                  {/* Increased font size */}
                  <button
                    onClick={() => handleQuantityUpdate(item._id, "increase")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="w-6 h-6" /> {/* Increased size */}
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="w-6 h-6" />{" "}
                    {/* Replaced X with Trash2 */}
                  </button>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Enter your discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full mr-2"
                />
                <button
                  onClick={applyDiscount}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500"
                >
                  Apply
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Subtotal</h3>
                <p className="text-xl font-bold">₹{subtotal.toFixed(2)}</p>
              </div>
              {discountApplied && (
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Discount</h3>
                  <p className="text-xl font-bold text-green-500">
                    -₹{discountValue.toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Total</h3>
                <p className="text-xl font-bold">₹{total.toFixed(2)}</p>
              </div>
              <button className="w-full bg-black text-white py-2 rounded-md mt-4 hover:bg-gray-800">
                Make a Purchase
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
