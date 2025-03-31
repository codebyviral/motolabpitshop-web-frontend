/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Footer, Header, SadEmojiSvg, ShareIcon } from '../components';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutModal from '../components/CheckoutModal';
import { useAuthContext } from '../context/AuthContext';
import { useOrderContext } from '../context/OrderContext';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';

const ViewProduct = () => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND;
  const [product, setProduct] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(true);
  const [newOrderId, setNewOrderId] = useState('');

  ////////////////////////////////////////////////////////////////
  //                   order context api hook                   //
  ////////////////////////////////////////////////////////////////

  const { updateOrderId, updateRzpId, rzpId, orderId, clearOrderData } =
    useOrderContext();
  const { isLoggedIn } = useAuthContext();

  ////////////////////////////////////////////////////////////////
  //               carousel and fullscreen states               //
  ////////////////////////////////////////////////////////////////

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

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
      console.error('Error fetching product:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  //                     fetch user details                     //
  ////////////////////////////////////////////////////////////////

  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/get-user/?user=${localStorage.getItem('userId')}`,
      );
      const user = res.data.userFound;
      const updatedUserDetails = {
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: user.address?.[0]?.addressLine1 || '',
        city: user.address?.[0]?.city || '',
        state: user.address?.[0]?.state || '',
        pincode: user.address?.[0]?.pinCode || '',
      };

      // Add this check for Tamil Nadu
      if (
        updatedUserDetails.state === 'Tamil Nadu' ||
        updatedUserDetails.state === 'tamil nadu'
      ) {
        setDeliveryCharge(false);
      }

      setUserDetails(updatedUserDetails);
      return updatedUserDetails;
    } catch (error) {
      console.error(`Error getting user details: ${error}`);
      return null;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
    if (isLoggedIn) {
      getUserDetails();
    }
  }, [id, isLoggedIn]);

  ////////////////////////////////////////////////////////////////
  //                  razorpay payment gateway                  //
  ////////////////////////////////////////////////////////////////

  const initiateRazorpayCheckout = async (userInfo = null) => {
    console.log(`userDetails:`, userDetails);
    if (!product) return toast.error(`Product not found`);
    try {
      const {
        data: { key },
      } = await axios.get(`${backendUrl}/api/get-key`);
      const deliveryPrice = deliveryCharge ? 150 : 0;
      const checkoutResponse = await axios.post(`${backendUrl}/api/checkout`, {
        amount: product.price * quantity + deliveryPrice,
      });
      console.log('checkoutResponse', checkoutResponse);
      if (checkoutResponse.status === 200) {
        const rzp_id = checkoutResponse.data.order.id;
        localStorage.setItem('rzp_order_id', rzp_id);
        const userDetailsResponse = isLoggedIn ? await getUserDetails() : null;
        const userData = userInfo || userDetailsResponse || {};

        const productDesc = `Purchase: ${product.title.slice(0, 200)}`;
        var options = {
          key: key,
          amount: checkoutResponse.data.order.amount / 100,
          currency: 'INR',
          name: 'Motolab PitShop',
          description: productDesc,
          image: 'https://i.ibb.co/2178bTsx/motolab.jpg',
          order_id: checkoutResponse.data.order.id,
          callback_url: `${
            import.meta.env.VITE_BACKEND
          }/api/payment-verification`,
          prefill: {
            name: userData.fullName || '',
            email: userData.email || '',
            contact: userData.phone || '',
          },
          notes: {
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            pincode: userData.pincode || '',
            quantity: quantity,
            productId: id,
          },
          theme: {
            color: '#FACC14',
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
        razor.on('payment.failed', function (response) {
          toast.error(
            `Payment failed: ${response.error.reason || 'Unknown error'}`,
          );
          console.log('Payment Failed!');
          console.log('Error Code:', response.error.code);
          console.log('Description:', response.error.description);
          console.log('Source:', response.error.source);
          console.log('Step:', response.error.step);
          console.log('Reason:', response.error.reason);
          console.log('Order ID:', response.error.metadata.order_id);
          console.log('Payment ID:', response.error.metadata.payment_id);
          window.location.reload();
        });
        razor.on('close', function () {
          toast.info(
            'Payment window closed. Please do not go back or refresh.',
          );
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Payment initialization failed. Please try again.');
    } finally {
      // clearOrderData();
    }
  };

  ////////////////////////////////////////////////////////////////
  //               customer checkout place order                //
  ////////////////////////////////////////////////////////////////

  const createCustomerOrder = async () => {
    let productItems = [];
    productItems.push(product);
    const deliveryPrice = deliveryCharge ? 150 : 0;
    try {
      console.log('productItems', product);
      const orderData = {
        userId: localStorage.getItem('userId'),
        razorpayOrderId: await localStorage.getItem('rzp_order_id'),
        phoneNumber: userDetails.phone,
        shippingaddress: userDetails.address,
        items: [
          {
            product: product._id, // Send just the product ID
            quantity: quantity,
            price: product.price * quantity + deliveryPrice,
          },
        ],
      };
      const customerOrderResponse = await axios.post(
        `${backendUrl}/api/order/create`,
        orderData,
      );
      // updateOrderId(customerOrderResponse.data.order.id);
      setNewOrderId(customerOrderResponse.data.order.id);
    } catch (error) {
      console.log(`Error creating customer order: ${error}`);
    }
  };

  ////////////////////////////////////////////////////////////////
  //                handle checkout for customer                //
  ////////////////////////////////////////////////////////////////

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
          'Please add your address/phone in your profile before making a purchase.',
        );
        setTimeout(() => navigate('/your-account'), 500);
        return;
      }
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
        toast.success(
          'Payment processing... Please do not refresh or go back.',
        );
        await createCustomerOrder();
      }, 2500);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  ////////////////////////////////////////////////////////////////
  //                 guest checkout place order                 //
  ////////////////////////////////////////////////////////////////

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
          items: [
            {
              product: product._id,
              quantity: quantity,
              price: product.price,
            },
          ],
          totalAmount: product.price * quantity,
          shippingAddress: `${formData.addressLine1}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        },
      );
      console.log('Order created:', order_response.data);
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  ////////////////////////////////////////////////////////////////
  //                 guest checkout form submit                 //
  ////////////////////////////////////////////////////////////////

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
      toast.success('Redirecting to payment gateway...');
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('Failed to process the order. Please try again.');
    }
  };

  // Enhanced carousel functions with animation
  const nextImage = () => {
    if (product && Array.isArray(product.images) && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1,
      );
    }
  };

  const prevImage = () => {
    if (product && Array.isArray(product.images) && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1,
      );
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsZoomed(false); // Reset zoom when toggling fullscreen
  };

  // Image zoom functionality
  const handleImageHover = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const addToCart = async (productId, quantity) => {
    try {
      const cartResponse = await axios.post(
        `${backendUrl}/api/get-user/add-to-cart`,
        {
          userId: localStorage.getItem('userId'),
          productId,
          quantity,
        },
      );
      if (cartResponse.status === 200) {
        toast.success(`Item Added to Cart!`, {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.log(error);
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className='max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center py-10 px-6 max-w-md bg-white rounded-lg shadow-md'
          >
            <SadEmojiSvg />
            <h2 className='text-2xl font-bold text-gray-700 mb-2'>
              Product Not Available
            </h2>
            <p className='text-gray-600 mb-6'>
              We couldn't find the product you're looking for. It may have been
              removed or is temporarily unavailable.
            </p>
            <motion.a
              href='/'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='inline-block bg-orange-400 hover:bg-orange-500 py-2 px-6 font-medium text-black rounded transition-colors'
            >
              Continue Shopping
            </motion.a>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  const productImages = Array.isArray(product.images)
    ? product.images
    : [product.images];
  const currentImage = productImages[currentImageIndex];

  return (
    <>
      <Header />
      <div className='max-w-7xl mx-auto p-4 bg-white min-h-screen'>
        {/* Breadcrumb Navigation */}
        <div className='text-sm breadcrumbs mb-6 text-gray-600'>
          <ul className='flex flex-wrap items-center space-x-2'>
            <li>
              <a href='/' className='hover:text-gray-800'>
                Home
              </a>
            </li>
            <span>/</span>
            <li>
              <a
                // href={`/category/${product.category}`}
                className='hover:text-gray-800 capitalize'
              >
                {product.category}
              </a>
            </li>
            <span>/</span>
            <li className='text-orange-500 font-medium capitalize'>
              {product.title}
            </li>
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col lg:flex-row gap-8'
        >
          {/* Enhanced Product Image Gallery */}
          <div className='w-full lg:w-1/2'>
            <div className='border border-gray-200 rounded-lg p-4 relative bg-gray-50'>
              {/* Main Image with Zoom and Fullscreen */}
              <div
                className={`relative cursor-${
                  isZoomed ? 'zoom-out' : 'zoom-in'
                } overflow-hidden rounded-lg bg-white`}
                onClick={toggleZoom}
                onMouseMove={handleImageHover}
                style={{
                  height: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <img
                  src={currentImage}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                    isZoomed ? 'scale-150' : 'hover:scale-105'
                  }`}
                  style={{
                    transformOrigin: isZoomed
                      ? `${zoomPosition.x}% ${zoomPosition.y}%`
                      : 'center',
                  }}
                />
                {isZoomed && (
                  <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
                    Click to zoom out
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className='absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white focus:outline-none'
                  >
                    <svg
                      className='w-6 h-6 text-gray-800'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 19l-7-7 7-7'
                      ></path>
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className='absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white focus:outline-none'
                  >
                    <svg
                      className='w-6 h-6 text-gray-800'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'
                      ></path>
                    </svg>
                  </motion.button>
                </>
              )}

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className='flex justify-center mt-6 space-x-3 overflow-x-auto py-2'>
                  {productImages.map((img, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md border-2 ${
                        index === currentImageIndex
                          ? 'border-orange-500'
                          : 'border-gray-200'
                      } overflow-hidden cursor-pointer`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className='absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow hover:bg-white focus:outline-none'
                aria-label='View fullscreen'
              >
                <svg
                  className='w-5 h-5 text-gray-800'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Product Details */}
          <div className='w-full lg:w-1/2'>
            <div className='sticky top-4'>
              {/* Product Title with Favorite Button */}
              <div className='flex justify-between items-start mb-4'>
                <h1 className='text-3xl font-bold text-gray-900 capitalize'>
                  {product.title}
                </h1>
                <button className='text-gray-400 hover:text-red-500 transition-colors'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                </button>
              </div>

              {/* Ratings and Reviews */}
              <div className='flex items-center mb-4'>
                <div className='flex text-yellow-400 mr-2'>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <span className='text-sm text-gray-600 mr-4'>
                  {product.rating} (10 reviews)
                </span>
                <span className='text-sm text-green-600 font-medium'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 inline mr-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  In Stock
                </span>
              </div>

              {/* Price with Discount Badge - Fixed 10% off */}
              <div className='mb-6'>
                <div className='flex items-center'>
                  <span className='text-3xl font-bold text-gray-900 mr-3'>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className='bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded'>
                    10% OFF
                  </span>
                </div>
                <div className='text-sm text-gray-500 mt-1'>
                  <s>₹{(product.price / 0.9).toLocaleString('en-IN')}</s>
                  <span className='ml-2 text-green-600'>
                    Save ₹
                    {(product.price / 0.9 - product.price).toLocaleString(
                      'en-IN',
                    )}
                  </span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className='bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-yellow-400'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-yellow-700'>
                      {deliveryCharge ? (
                        <>
                          ₹150 shipping fee applies to all states except Tamil
                          Nadu. Free delivery for orders over ₹5000.
                        </>
                      ) : (
                        'Free delivery for Tamil Nadu customers!'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className='mb-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Highlights
                </h3>
                <ul className='list-disc pl-5 space-y-1 text-gray-700'>
                  {product.description
                    .split('. ')
                    .filter(Boolean)
                    .map((point, i) => (
                      <li key={i}>{point.trim()}</li>
                    ))}
                </ul>
              </div>

              {/* Size Selector */}
              {product.size && (
                <div className='mb-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Size
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {product.size.split(',').map((size) => (
                      <button
                        key={size}
                        className='px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500'
                      >
                        {size.trim()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className='mb-8'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Quantity
                </h3>
                <div className='flex items-center'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='bg-gray-200 hover:bg-gray-300 h-10 w-10 rounded-l flex items-center justify-center focus:outline-none'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M20 12H4'
                      />
                    </svg>
                  </button>
                  <div className='border-t border-b border-gray-300 h-10 w-16 flex items-center justify-center'>
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className='bg-gray-200 hover:bg-gray-300 h-10 w-10 rounded-r flex items-center justify-center focus:outline-none'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 4v16m8-8H4'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 mb-8'>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart(id, quantity)}
                  className='flex-1 bg-yellow-400 hover:bg-yellow-500 py-3 px-6 font-medium shadow-md flex items-center justify-center gap-2 transition-colors'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className='flex-1 bg-orange-500 hover:bg-orange-600 py-3 px-6 font-medium text-white shadow-md flex items-center justify-center gap-2 transition-colors'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                    />
                  </svg>
                  Buy Now
                </motion.button>
                <ShareIcon
                  url={window.location.href}
                  title={product.title}
                  className='flex-1'
                />
              </div>

              {/* Delivery Estimate */}
              <div className='border-t border-gray-200 pt-4 mb-6'>
                <div className='flex items-center text-gray-700'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 mr-2 text-green-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                    />
                  </svg>
                  <span>Expected delivery in 3-5 business days</span>
                </div>
              </div>

              {/* Product Meta */}
              <div className='space-y-2 text-sm text-gray-600'>
                <div>
                  <span className='font-medium'>Category:</span>{' '}
                  <a
                    href={`/category/${product.category}`}
                    className='text-orange-500 hover:underline'
                  >
                    {product.category}
                  </a>
                </div>
                <div>
                  <span className='font-medium'>SKU:</span>{' '}
                  {product._id.slice(-8).toUpperCase()}
                </div>
                <div>
                  <span className='font-medium'>Added:</span>{' '}
                  {new Date(product.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fullscreen Image View */}
        {isFullscreen && (
          <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center'>
            <div className='relative w-full h-full flex flex-col items-center justify-center'>
              <button
                onClick={toggleFullscreen}
                className='absolute top-4 right-4 bg-white rounded-full p-3 text-black hover:bg-gray-200 focus:outline-none shadow-lg'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  ></path>
                </svg>
              </button>

              <img
                src={currentImage}
                alt={`${product.title} - Fullscreen View`}
                className='max-w-full max-h-[80vh] object-contain'
              />

              {productImages.length > 1 && (
                <div className='w-full absolute bottom-10 left-0 flex justify-center space-x-4'>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevImage}
                    className='bg-white/20 hover:bg-white/40 rounded-full p-3 focus:outline-none shadow-lg'
                  >
                    <svg
                      className='w-6 h-6 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 19l-7-7 7-7'
                      ></path>
                    </svg>
                  </motion.button>
                  <div className='flex items-center space-x-2'>
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? 'bg-white'
                            : 'bg-gray-500'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className='bg-white/20 hover:bg-white/40 rounded-full p-3 focus:outline-none shadow-lg'
                  >
                    <svg
                      className='w-6 h-6 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'
                      ></path>
                    </svg>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {!isLoggedIn && (
          <CheckoutModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleFormSubmit}
            product={product}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewProduct;
