/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaUser,
  FaUserCheck,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Header = () => {
  const backendUrl = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartCounter, setCartCounter] = useState(0);

  const { isLoggedIn } = useAuthContext();

  const handleRedirect = () => {
    if (isLoggedIn) {
      navigate('/your-account');
    } else {
      navigate('/login');
    }
  };

  const googleLoginSuccess = async () => {
    try {
      const res = await axios.get(`${backendUrl}/login/success`, {
        withCredentials: true,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/get-categories`);
      setCategories(res.data.categories.slice(0, 5));
    } catch (error) {
      console.log(`Error getting categories`);
    }
  };

  // cart counter
  const fetchCart = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/get-user/cart`, {
        userId: localStorage.getItem('userId'),
      });
      if (data.success && data.items.length > 0) {
        // Calculate total quantity by summing up the quantity of each item
        const totalQuantity = data.items.reduce((total, item) => {
          return total + (item.quantity || 1); // Default to 1 if quantity is not defined
        }, 0);

        setCartCounter(totalQuantity);
      } else {
        setCartCounter(0);
      }
    } catch (error) {
      console.log(`Error fetching cart: ${error}`);
      setCartCounter(0);
    }
  };

  useEffect(() => {
    // googleLoginSuccess();
    fetchCart();
    getCategories(); // Fetch categories on component mount
  }, []); // Added empty dependency array to prevent infinite loops

  const AutoLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const expiry = Number(localStorage.getItem('tokenExpiry')); // Convert to number

      if (token && expiry && Date.now() > expiry) {
        toast.warn(`Session Expired. Please Login Again!`);
        localStorage.clear();
      } else if (!token) {
        localStorage.clear(); // Silent clear if there's no token
      }
    } catch (error) {
      console.error('Error handling token:', error);
    }
  };
  useEffect(() => {
    AutoLogout();
  }, []);

  const handleCategoryClick = (categoryName) => {
    console.log(categoryName);
    navigate(`/products/${categoryName}`);
  };

  return (
    <header className='w-full shadow-md'>
      {/* Main header */}
      <div className='bg-white py-3 px-4 md:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4'>
        {/* Logo */}
        <div className='text-2xl font-bold order-1'>
          <a href='/' className='flex items-center'>
            Motolab PitShop
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className='md:hidden order-3'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Search bar */}
        <div className='w-full md:w-auto md:flex-1 max-w-xl order-4 md:order-2 mt-4 md:mt-0 md:mx-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search your favorite product...'
              className='w-full py-2 px-4 border rounded-md'
            />
            <FaSearch className='absolute right-3 top-3 text-gray-400' />
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex items-center gap-4 order-2 md:order-3 ml-auto md:ml-0 relative'>
          <button onClick={() => handleRedirect()} className='hidden sm:block'>
            {isLoggedIn ? (
              <>
                <FaUserCheck size={20} />
              </>
            ) : (
              <>
                <FaUser size={20} />
              </>
            )}
          </button>
          {/* <button className='relative'>
            <FaHeart size={20} />
            <span className='absolute -top-1.5 -right-1.5 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
              0
            </span>
          </button> */}
          <button onClick={() => navigate('/my-cart')} className='relative'>
            <FaShoppingCart size={20} />
            <span className='absolute -top-1.5 -right-1.5 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
              {cartCounter}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className='bg-yellow-400 py-3 px-4 md:px-6 lg:px-8'>
        <div className='flex flex-wrap justify-between items-center'>
          {/* Categories dropdown */}
          <div className='relative z-20'>
            <button
              className='flex items-center gap-2 bg-white py-2 px-4'
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            >
              <span className='font-medium text-sm'>Categories</span>
              <FaChevronDown
                size={12}
                className={
                  categoryMenuOpen
                    ? 'transform rotate-180 transition-transform'
                    : 'transition-transform'
                }
              />
            </button>

            {/* Categories dropdown menu */}
            {categoryMenuOpen && (
              <div className='absolute top-full left-0 mt-1 w-48 bg-white shadow-md rounded py-2 z-20'>
                {categories.map((category) => (
                  <a
                    // href='/'
                    key={category._id}
                    onClick={() => handleCategoryClick(category.category)}
                    className='block cursor-pointer px-4 py-2 hover:bg-gray-100'
                  >
                    {category.category}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav links - desktop */}
          <div className='hidden md:flex items-center gap-6 ml-6 flex-grow'>
            <a href='/' className='font-medium'>
              Home
            </a>
            <a href='#' className='font-medium'>
              Shop
            </a>
            <a href='/about-us' className='font-medium'>
              About
            </a>
            <a href='#' className='font-medium'>
              Blog
            </a>
            <a href='/ContactMethods' className='font-medium'>
              Contact
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-4 py-2 bg-white rounded shadow-md'>
            <div className='flex flex-col'>
              <a href='#' className='px-4 py-2 hover:bg-gray-100 font-medium'>
                Home
              </a>
              <a href='#' className='px-4 py-2 hover:bg-gray-100 font-medium'>
                Shop
              </a>
              <a href='#' className='px-4 py-2 hover:bg-gray-100 font-medium'>
                Pages
              </a>
              <a href='#' className='px-4 py-2 hover:bg-gray-100 font-medium'>
                About
              </a>
              <a href='#' className='px-4 py-2 hover:bg-gray-100 font-medium'>
                Blog
              </a>
              <a href='#' className='px-4 py-2 hover:bg-gray-100 font-medium'>
                Contact
              </a>
              <div className='px-4 py-2 border-t'>
                <button
                  onClick={() => handleRedirect()}
                  className='flex items-center gap-2'
                >
                  {isLoggedIn ? (
                    <>
                      <FaUserCheck size={16} />
                      <span>Your Account</span>
                    </>
                  ) : (
                    <>
                      <FaUser size={16} />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
