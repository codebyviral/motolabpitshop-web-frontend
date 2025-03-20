import React, { useState, useEffect } from "react";
import { Footer, Header } from "../components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Razorpay from "razorpay";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
        console.log(data);
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

  const checkout = async () => {
    if (!product) return toast.error(`Product not found`);

    const {
      data: { key },
    } = await axios.get(`${backendUrl}/api/get-key`);

    console.log(key);

    try {
      const {
        data: { order },
      } = await axios.post(`${backendUrl}/api/checkout`, {
        amount: product.price,
      });
      var options = {
        key: await key,
        amount: order.amount,
        currency: "INR",
        name: "Motolab PitShop",
        description: product.description,
        image: "https://i.ibb.co/2178bTsx/motolab.jpg",
        order_id: order.id,
        callback_url: `${
          import.meta.env.VITE_BACKEND
        }/api/payment-verification`,
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          name: "Gaurav Kumar", //your customer's name
          email: "gaurav.kumar@example.com",
          contact: "9000090000", //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#FACC14",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
          <div className="loader-container">
            <div className="loader-spinner">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
          </div>
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
          <div className="text-center py-10 px-6 max-w-md">
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
          </div>
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
        <div className="flex flex-col md:flex-row gap-8">
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
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

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
              <button className="bg-yellow-400 hover:bg-yellow-500 py-2 px-6 font-medium rounded">
                Add to Cart
              </button>
              <button
                onClick={checkout}
                className="bg-orange-400 hover:bg-orange-500 py-2 px-6 font-medium rounded"
              >
                Buy Now
              </button>
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewProduct;
