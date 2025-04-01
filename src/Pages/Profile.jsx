import React, { useEffect, useState } from 'react';
import { Header, Footer } from '../components/index';
import { useAuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CiStar } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

const Profile = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: [],
    profileImage: '/api/placeholder/100/100',
    isVerified: false,
  });
  const [userOrders, setUserOrders] = useState([]);
  const [ratings, setRatings] = useState({}); // { orderId1: rating1, orderId2: rating2 }
  const [hoverStates, setHoverStates] = useState({}); // { orderId1: hoverRating1, orderId2: hoverRating2 }
  const [rateColor, setRateColor] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [addressData, setAddressData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
  });
  const [activeTab, setActiveTab] = useState('profile');

  const { LogoutUser } = useAuthContext();
  const backendUrl = import.meta.env.VITE_BACKEND;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ///////////////////////////////////
  ///// Fetch User Details //////////
  ///////////////////////////////////

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const response = await axios.get(`${backendUrl}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user;

        // Extract address details if available
        const addressDetails =
          userData.address && userData.address.length > 0
            ? userData.address[0]
            : {
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                pinCode: '',
              };

        setUser({
          name: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phoneNumber || '',
          address: userData.address || [],
          profileImage: userData.profileImage || '/api/placeholder/100/100',
          isVerified: userData.isVerified,
        });

        setFormData({
          name: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phoneNumber || '',
        });

        setAddressData({
          addressLine1: addressDetails.addressLine1 || '',
          addressLine2: addressDetails.addressLine2 || '',
          city: addressDetails.city || '',
          state: addressDetails.state || '',
          pinCode: addressDetails.pinCode || '',
          phone: userData.phone || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoadingUser(false);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  ///////////////////////////////////
  ///// Fetch User Orders //////////
  ///////////////////////////////////

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await axios.get(
          `${backendUrl}/api/get/user-order?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data && response.data.userOrders) {
          setUserOrders(response.data.userOrders);
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setLoadingOrders(false);
      }
    };

    if (token && userId) {
      fetchUserOrders();
    }
  }, [token, userId, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  ///////////////////////////////////
  ///// Update User API /////////////
  ///////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/auth/updateuser`,
        {
          fullName: formData.name,
          email: formData.email,
          phone: Number(formData.phone),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }));
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
      console.log(response);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.msg || 'Failed to update profile');
    }
  };

  ///////////////////////////////////
  ///// Update User Address ////////
  /////////////////////////////////

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format address as an array of objects as expected by the backend
      const formattedAddress = [
        {
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2,
          city: addressData.city,
          state: addressData.state,
          pinCode: addressData.pinCode,
        },
      ];

      const response = await axios.put(
        `${backendUrl}/api/auth/updateuser`,
        {
          address: formattedAddress,
          phone: addressData.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          address: formattedAddress,
          phone: addressData.phone,
        }));
        setIsEditingAddress(false);
        toast.success('Address updated successfully!');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error(error.response?.data?.msg || 'Failed to update address');
    }
  };

  const handleLogout = () => {
    LogoutUser();
    navigate('/');
  };

  // Format address for display
  const getFormattedAddress = () => {
    if (user.address && user.address.length > 0) {
      const addr = user.address[0];
      const parts = [
        addr.addressLine1,
        addr.addressLine2,
        addr.city,
        addr.state,
        addr.pinCode,
      ].filter((part) => part && part.trim() !== '');

      return parts.join(', ');
    }
    return 'No address saved';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Group orders by orderId
  const groupedOrders = userOrders.reduce((acc, order) => {
    if (!acc[order.orderId]) {
      acc[order.orderId] = {
        id: order.orderId,
        date: order.placedAt,
        status: order.orderStatus,
        items: [],
        total: 0,
      };
    }

    acc[order.orderId].items.push(order);
    acc[order.orderId].total += order.price * order.quantity;

    return acc;
  }, {});

  const orderHistory = Object.values(groupedOrders);

  const wishlistItems = [
    {
      id: 1,
      name: 'Akrapovic Exhaust System',
      price: '$899.99',
      image: '/api/placeholder/60/60',
    },
    {
      id: 2,
      name: 'Alpinestars Tech-Air Race Vest',
      price: '$699.99',
      image: '/api/placeholder/60/60',
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>My Account</h1>
          <button
            onClick={handleLogout}
            className='px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 flex items-center'
          >
            Logout
          </button>
        </div>

        {/* Profile Header */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6 flex items-center'>
          {loadingUser ? (
            <div className='flex items-center w-full'>
              <div className='w-20 h-20 rounded-full bg-gray-200 animate-pulse'></div>
              <div className='ml-6 space-y-2 flex-grow'>
                <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse'></div>
                <div className='h-4 w-1/2 bg-gray-200 rounded animate-pulse'></div>
                <div className='h-4 w-1/4 bg-gray-200 rounded animate-pulse'></div>
              </div>
            </div>
          ) : (
            <>
              <img
                src={import.meta.env.VITE_MOTOLAB_LOGO}
                alt='Profile'
                draggable='false'
                className='w-20 h-20 rounded-full object-cover border-2 border-yellow-400'
              />
              <div className='ml-6'>
                <h2 className='text-2xl font-semibold text-gray-800'>
                  {user.name}
                </h2>
                <p className='text-gray-600'>Member since January 2023</p>
                <div className='mt-2'>
                  {user.isVerified ? (
                    <span
                      onClick={() => toast.success(`We trust you! 🏍️`)}
                      className='bg-yellow-400 text-black text-xs font-medium px-2.5 py-0.5 rounded-full mr-2'
                    >
                      Verified
                    </span>
                  ) : (
                    <span
                      onClick={() => navigate(`/verify-account`)}
                      className='bg-red-100 text-yellow-800 text-xs font-medium cursor-pointer px-2.5 py-0.5 rounded-full mr-2'
                    >
                      Not Verified
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className='mb-6 border-b border-gray-200'>
          <ul className='flex flex-wrap -mb-px'>
            <li className='mr-2'>
              <button
                className={`inline-block p-4 ${
                  activeTab === 'profile'
                    ? 'text-yellow-600 border-b-2 border-yellow-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Details
              </button>
            </li>
            <li className='mr-2'>
              <button
                className={`inline-block p-4 ${
                  activeTab === 'orders'
                    ? 'text-yellow-600 border-b-2 border-yellow-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                Order History
              </button>
            </li>
            <li className='mr-2'>
              <button
                className={`inline-block p-4 ${
                  activeTab === 'Address'
                    ? 'text-yellow-600 border-b-2 border-yellow-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('Address')}
              >
                Address
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          {/* Profile Details Tab */}
          {activeTab === 'profile' && (
            <>
              {loadingUser ? (
                <div className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-6'>
                    {[...Array(4)].map((_, index) => (
                      <div key={index}>
                        <div className='h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2'></div>
                        <div className='h-10 w-full bg-gray-200 rounded animate-pulse'></div>
                      </div>
                    ))}
                  </div>
                  <div className='flex justify-end mt-6'>
                    <div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                </div>
              ) : isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <label
                        htmlFor='name'
                        className='block mb-2 text-sm font-medium text-gray-700'
                      >
                        Full Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='email'
                        className='block mb-2 text-sm font-medium text-gray-700'
                      >
                        Email Address
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='phone'
                        className='block mb-2 text-sm font-medium text-gray-700'
                      >
                        Phone Number
                      </label>
                      <input
                        type='tel'
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                        required
                      />
                    </div>
                  </div>
                  <div className='flex justify-end mt-6 space-x-3'>
                    <button
                      type='button'
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                        });
                      }}
                      className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600'
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-500'>
                        Full Name
                      </h3>
                      <p className='text-gray-800 mt-1'>
                        {user.name || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium text-gray-500'>
                        Email Address
                      </h3>
                      <p className='text-gray-800 mt-1'>
                        {user.email || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium text-gray-500'>
                        Phone Number
                      </h3>
                      <p className='text-gray-800 mt-1'>
                        {user.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-end mt-6'>
                    <button
                      onClick={() => setIsEditing(true)}
                      className='px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600'
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Order History Tab */}
          {activeTab === 'orders' && (
            <div>
              <h3 className='text-xl font-bold text-gray-800 mb-6'>
                Order History
              </h3>
              {loadingOrders ? (
                <div className='space-y-6'>
                  {[...Array(2)].map((_, index) => (
                    <div
                      key={index}
                      className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'
                    >
                      <div className='p-4 md:p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center'>
                        <div className='space-y-2'>
                          <div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
                          <div className='h-3 w-32 bg-gray-200 rounded animate-pulse'></div>
                        </div>
                        <div className='h-6 w-20 bg-gray-200 rounded animate-pulse'></div>
                      </div>
                      <div className='p-4 md:p-5'>
                        <div className='space-y-4'>
                          {[...Array(2)].map((_, itemIndex) => (
                            <div
                              key={itemIndex}
                              className='flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0'
                            >
                              <div className='w-16 h-16 bg-gray-200 rounded-md animate-pulse'></div>
                              <div className='flex-grow space-y-2'>
                                <div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse'></div>
                                <div className='h-3 w-1/2 bg-gray-200 rounded animate-pulse'></div>
                              </div>
                              <div className='h-4 w-12 bg-gray-200 rounded animate-pulse'></div>
                            </div>
                          ))}
                        </div>
                        <div className='mt-4 pt-4 border-t border-gray-100 flex justify-between items-center'>
                          <div className='h-3 w-20 bg-gray-200 rounded animate-pulse'></div>
                          <div className='h-5 w-24 bg-gray-200 rounded animate-pulse'></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : orderHistory.length > 0 ? (
                <div className='space-y-6'>
                  {orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200'
                    >
                      <div className='p-4 md:p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-3'>
                        <div>
                          <p className='text-sm text-gray-500'>
                            Order #{order.id.substring(order.id.length - 6)}
                          </p>
                          <p className='text-xs text-gray-400 mt-1'>
                            Placed on {formatDate(order.date)}
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                          <button
                            onClick={() => {
                              console.log(order);
                              navigate(`/order-status/${order.id}`);
                            }}
                            className='text-sm font-medium text-yellow-600 hover:text-yellow-700'
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className='p-4 md:p-5'>
                        <div className='space-y-4'>
                          {order.items.map((item) => (
                            <div
                              key={item.productId}
                              className='flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0'
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className='w-16 h-16 object-cover rounded-md border border-gray-200 cursor-pointer flex-shrink-0'
                                onClick={() =>
                                  navigate(`/view-product/${item.productId}`)
                                }
                              />
                              <div className='flex-grow'>
                                <div className='flex justify-between items-start'>
                                  <div>
                                    <h4 className='font-medium text-gray-800'>
                                      {item.title}
                                    </h4>
                                    <p className='text-sm text-gray-500 mt-1'>
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>
                                  <p className='text-gray-800 font-medium'>
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className='mt-4 pt-4 border-t border-gray-100 flex justify-between items-center'>
                          <p className='text-sm text-gray-500'>
                            {order.items.length} item
                            {order.items.length > 1 ? 's' : ''}
                          </p>
                          <p className='text-lg font-semibold text-gray-800'>
                            Total: ₹{order.total.toFixed(2)}
                          </p>
                        </div>
                        <div className='flex mt-7'>
                          {[...Array(5)].map((star, index) => {
                            const currentRate = index + 1;
                            return (
                              <label key={index}>
                                <input
                                  type='radio'
                                  name={`rate-${order.id}`} // Make name unique per order
                                  value={currentRate}
                                  onClick={() => {
                                    setRatings((prev) => ({
                                      ...prev,
                                      [order.id]: currentRate,
                                    }));
                                  }}
                                  style={{ display: 'none' }}
                                />
                                <FaStar
                                  size={20}
                                  color={
                                    currentRate <=
                                    (hoverStates[order.id] ||
                                      ratings[order.id] ||
                                      0)
                                      ? 'red'
                                      : 'grey'
                                  }
                                  onMouseEnter={() => {
                                    setHoverStates((prev) => ({
                                      ...prev,
                                      [order.id]: currentRate,
                                    }));
                                  }}
                                  onMouseLeave={() => {
                                    setHoverStates((prev) => ({
                                      ...prev,
                                      [order.id]: 0,
                                    }));
                                  }}
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center'>
                  <div className='max-w-md mx-auto'>
                    <svg
                      className='w-16 h-16 mx-auto text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1}
                        d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                      />
                    </svg>
                    <h3 className='mt-4 text-lg font-medium text-gray-900'>
                      No orders yet
                    </h3>
                    <p className='mt-2 text-sm text-gray-500'>
                      Your order history will appear here once you make a
                      purchase.
                    </p>
                    <div className='mt-6'>
                      <button
                        onClick={() => navigate('/products')}
                        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none'
                      >
                        Browse Products
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'Address' && (
            <div>
              <h3 className='text-lg font-semibold mb-4'>Saved Address</h3>
              {loadingUser ? (
                <div className='bg-gray-50 p-4 rounded-lg mb-4 space-y-4'>
                  <div className='space-y-2'>
                    {[...Array(5)].map((_, index) => (
                      <div key={index}>
                        <div className='h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-1'></div>
                        <div className='h-10 w-full bg-gray-200 rounded animate-pulse'></div>
                      </div>
                    ))}
                  </div>
                  <div className='flex justify-end mt-4 space-x-3'>
                    <div className='h-10 w-20 bg-gray-200 rounded animate-pulse'></div>
                    <div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                </div>
              ) : isEditingAddress ? (
                <form onSubmit={handleAddressSubmit}>
                  <div className='bg-gray-50 p-4 rounded-lg mb-4'>
                    <div className='space-y-4'>
                      <div>
                        <label
                          htmlFor='addressLine1'
                          className='block text-sm font-medium text-gray-700 mb-1'
                        >
                          Address Line 1
                        </label>
                        <input
                          type='text'
                          id='addressLine1'
                          name='addressLine1'
                          value={addressData.addressLine1}
                          onChange={handleAddressChange}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='addressLine2'
                          className='block text-sm font-medium text-gray-700 mb-1'
                        >
                          Address Line 2
                        </label>
                        <input
                          type='text'
                          id='addressLine2'
                          name='addressLine2'
                          value={addressData.addressLine2}
                          onChange={handleAddressChange}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label
                            htmlFor='city'
                            className='block text-sm font-medium text-gray-700 mb-1'
                          >
                            City
                          </label>
                          <input
                            type='text'
                            id='city'
                            name='city'
                            value={addressData.city}
                            onChange={handleAddressChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='state'
                            className='block text-sm font-medium text-gray-700 mb-1'
                          >
                            State
                          </label>
                          <input
                            type='text'
                            id='state'
                            name='state'
                            value={addressData.state}
                            onChange={handleAddressChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                          />
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label
                            htmlFor='pinCode'
                            className='block text-sm font-medium text-gray-700 mb-1'
                          >
                            PIN Code
                          </label>
                          <input
                            type='text'
                            id='pinCode'
                            name='pinCode'
                            value={addressData.pinCode}
                            onChange={handleAddressChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-end mt-4 space-x-3'>
                      <button
                        type='button'
                        onClick={() => {
                          setIsEditingAddress(false);
                          // Reset to current values
                          const currentAddress =
                            user.address && user.address.length > 0
                              ? user.address[0]
                              : {
                                  addressLine1: '',
                                  addressLine2: '',
                                  city: '',
                                  state: '',
                                  pinCode: '',
                                };

                          setAddressData({
                            addressLine1: currentAddress.addressLine1 || '',
                            addressLine2: currentAddress.addressLine2 || '',
                            city: currentAddress.city || '',
                            state: currentAddress.state || '',
                            pinCode: currentAddress.pinCode || '',
                            phone: user.phone || '',
                          });
                        }}
                        className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600'
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className='bg-gray-50 p-4 rounded-lg mb-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h4 className='font-medium text-gray-800'>
                        Primary Address
                      </h4>
                      <p className='text-gray-600 mt-1'>
                        {getFormattedAddress()}
                      </p>
                      <p className='text-gray-600'>
                        {user.phone || 'No phone number saved'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className='text-yellow-600 hover:text-yellow-800 text-sm font-medium'
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
