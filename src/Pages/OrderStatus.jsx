import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usePDF } from 'react-to-pdf';
import { Footer, Header } from '../components';

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND;
  const [downloading, setDownloading] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: `invoice_${orderId}.pdf` });
  const [hoveredRatings, setHoveredRatings] = useState({});
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/order/status?orderId=${orderId}`,
      );

      if (response.data.orderDetails) {
        setOrderDetails(response.data.orderDetails);
        const initialRatings = {};
        response.data.orderDetails.items.forEach((item) => {
          initialRatings[item.productDetails._id] =
            item.productDetails.rating || 0;
        });
        setUserRatings(initialRatings);
      } else {
        toast.error('Order details not found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      setLoading(false);
    }
  };

  const submitRating = async (productId, newRating) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/product/${productId}/rate`,
        { userId: localStorage.getItem('userId'), newRating },
      );

      if (response.data.success) {
        setUserRatings((prev) => ({
          ...prev,
          [productId]: newRating,
        }));

        setOrderDetails((prev) => {
          const updatedItems = prev.items.map((item) => {
            if (item.productDetails._id === productId) {
              return {
                ...item,
                productDetails: {
                  ...item.productDetails,
                  rating: newRating,
                },
              };
            }
            return item;
          });
          return {
            ...prev,
            items: updatedItems,
          };
        });

        toast.success(`Rating submitted successfully!`);
      } else {
        toast.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500'></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className='bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto mt-10'>
        <h3 className='mt-4 text-lg font-medium text-gray-900'>
          Order not found
        </h3>
        <button
          onClick={() => navigate('/profile')}
          className='mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600'
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        <div className='flex justify-between items-center mb-6'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center text-gray-600 hover:text-yellow-600'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Back
          </button>
          <button
            onClick={() => {
              setDownloading(true);
              toPDF();
              setTimeout(() => setDownloading(false), 1000);
            }}
            className='flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
            {downloading ? 'Downloading...' : 'Download Invoice'}
          </button>
        </div>

        <div ref={targetRef} className='bg-white p-6 rounded-lg shadow-md'>
          <div className='flex flex-col md:flex-row justify-between items-start mb-8'>
            <div className='mb-4 md:mb-0'>
              <h1 className='text-2xl font-bold text-gray-800'>
                Order Summary
              </h1>
              <p className='text-gray-600 mt-1'>Order ID: {orderDetails._id}</p>
            </div>
            <div className='flex flex-col items-end'>
              <p className='text-gray-600 mt-2'>
                Placed on {formatDate(orderDetails.placedAt)}
              </p>
            </div>
          </div>

          <div className='mb-8'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Order Tracking
            </h2>
            <div className='relative'>
              <div className='absolute h-full w-0.5 bg-gray-200 left-4 top-0'></div>
              <div className='space-y-6'>
                {[
                  {
                    status: 'Order Placed',
                    active: true,
                    date: orderDetails.placedAt,
                  },
                  {
                    status: 'Processing',
                    active: orderDetails.orderStatus !== 'Pending',
                    date:
                      orderDetails.orderStatus !== 'Pending'
                        ? orderDetails.updatedAt
                        : null,
                  },
                  {
                    status: 'Shipped',
                    active:
                      orderDetails.orderStatus === 'Shipped' ||
                      orderDetails.orderStatus === 'Delivered',
                    date:
                      orderDetails.orderStatus === 'Shipped' ||
                      orderDetails.orderStatus === 'Delivered'
                        ? orderDetails.updatedAt
                        : null,
                  },
                  {
                    status: 'Delivered',
                    active: orderDetails.orderStatus === 'Delivered',
                    date:
                      orderDetails.orderStatus === 'Delivered'
                        ? orderDetails.updatedAt
                        : null,
                  },
                ].map((step, index) => (
                  <div key={index} className='relative flex items-start'>
                    <div
                      className={`absolute w-3 h-3 rounded-full left-4 mt-1 ${
                        step.active ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}
                    ></div>
                    <div className='ml-8'>
                      <p
                        className={`font-medium ${
                          step.active ? 'text-gray-800' : 'text-gray-400'
                        }`}
                      >
                        {step.status}
                      </p>
                      {step.date && (
                        <p className='text-sm text-gray-500'>
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-8 mb-8'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h2 className='text-lg font-semibold text-gray-800 mb-2'>
                Shipping Information
              </h2>
              <p className='text-gray-600'>{orderDetails.shippingAddress}</p>
              <p className='text-gray-600 mt-1'>
                Phone: {orderDetails.phoneNumber}
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h2 className='text-lg font-semibold text-gray-800 mb-2'>
                Payment Information
              </h2>
              <div className='flex justify-between mb-1'>
                <span className='text-gray-600'>Status:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    orderDetails.paymentStatus === 'Success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {orderDetails.paymentStatus}
                </span>
              </div>
              <div className='flex justify-between mb-1'>
                <span className='text-gray-600'>Method:</span>
                <span className='text-gray-800'>RazorPay</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Transaction ID:</span>
                <span className='text-gray-800'>{orderDetails.rzpId}</span>
              </div>
            </div>
          </div>

          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Order Items
          </h2>
          <div className='space-y-6 mb-8'>
            {orderDetails.items.map((item, index) => (
              <div
                key={index}
                className='flex flex-col md:flex-row border border-gray-200 rounded-lg p-4'
              >
                <div className='flex-shrink-0 mb-4 md:mb-0 md:mr-4'>
                  <img
                    src={item.productDetails.images[0]}
                    alt={item.productDetails.title}
                    className='w-24 h-24 object-contain rounded'
                  />
                </div>
                <div className='flex-grow'>
                  <h3 className='text-lg font-medium text-gray-800'>
                    {item.productDetails.title}
                  </h3>
                  <p className='text-gray-600 text-sm mt-1'>
                    {item.productDetails.description}
                  </p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    <span className='text-sm bg-gray-100 px-2 py-1 rounded'>
                      Size: {item.productDetails.size}
                    </span>
                    <span className='text-sm bg-gray-100 px-2 py-1 rounded'>
                      Category: {item.productDetails.category}
                    </span>
                    {userRatings[item.productDetails._id] > 0 && (
                      <span className='text-sm bg-gray-100 px-2 py-1 rounded flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4 text-yellow-500 mr-1'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                        {userRatings[item.productDetails._id]}
                      </span>
                    )}
                  </div>
                  <div className='mt-3'>
                    <p className='text-sm font-medium text-gray-700 mb-1'>
                      Rate this product:
                    </p>
                    <div
                      className='flex items-center'
                      onMouseLeave={() =>
                        setHoveredRatings((prev) => ({
                          ...prev,
                          [item._id]: null,
                        }))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className='focus:outline-none transition-colors duration-100'
                          onMouseEnter={() =>
                            setHoveredRatings((prev) => ({
                              ...prev,
                              [item._id]: star,
                            }))
                          }
                          onClick={() => {
                            submitRating(item.product, star);
                          }}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className={`h-6 w-6 ${
                              star <=
                              (hoveredRatings[item._id] ||
                                userRatings[item.productDetails._id] ||
                                0)
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex-shrink-0 mt-4 md:mt-0 md:ml-4 text-right'>
                  <p className='text-gray-800'>
                    ₹{item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <p className='text-lg font-medium text-yellow-600 mt-1'>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Order Total
            </h2>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='text-gray-800'>
                  ₹
                  {orderDetails.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Shipping Charges</span>
                <span className='text-gray-800'>
                  ₹
                  {(
                    orderDetails.totalAmount -
                    orderDetails.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0,
                    )
                  ).toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between border-t border-gray-200 pt-3 mt-3 font-medium text-lg'>
                <span>Total Amount</span>
                <span className='text-yellow-600'>
                  ₹{orderDetails.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className='mt-8 text-center text-gray-500 text-sm'>
            <p>Thank you for shopping with us!</p>
            <p className='mt-1'>
              Need help? Contact our customer support at +919025194684
            </p>
            <p className='mt-1'>Email: motolab.official@gmail.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderStatus;
