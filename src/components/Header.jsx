import React, { useState, useEffect, useRef } from 'react';
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

  // Search functionality states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const searchRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);

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

  // Fetch all products on initial load
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/get-all`);
      if (response.data.success) {
        setAllProducts(response.data.products);
        console.log('Products loaded:', response.data.products.length);

        // Log the first product to see its structure
        if (response.data.products.length > 0) {
          console.log('Sample product structure:', response.data.products[0]);
        }
      }
    } catch (error) {
      console.log('Error loading products:', error);
    }
  };

  // Search functionality with improved logging and more flexible matching
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      console.log('Searching for:', query);
      console.log('Total products to search through:', allProducts.length);

      const lowercaseQuery = query.toLowerCase().trim();

      // More flexible search logic
      const filteredProducts = allProducts.filter((product) => {
        if (!product) return false;

        // Extract all searchable fields and join them
        const searchableText = [
          product.name,
          product.title,
          product.description,
          product.category,
          product.brand,
          // Add any other potentially searchable fields here
        ]
          .filter(Boolean) // Remove null/undefined fields
          .join(' ')
          .toLowerCase();

        return searchableText.includes(lowercaseQuery);
      });

      console.log('Search results found:', filteredProducts.length);

      if (filteredProducts.length > 0) {
        console.log(
          'First match:',
          filteredProducts[0].name || filteredProducts[0].title,
        );
      }

      setSearchResults(filteredProducts.slice(0, 6)); // Limit to 6 results
      setShowResults(true);
    } catch (error) {
      console.log('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search to avoid too many searches
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // googleLoginSuccess();
    fetchCart();
    getCategories(); // Fetch categories on component mount
    fetchAllProducts(); // Fetch all products on component mount
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

  const handleProductClick = (productId) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/view-product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedResultIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0,
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedResultIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1,
      );
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResultIndex >= 0) {
        handleProductClick(searchResults[selectedResultIndex]._id);
      } else if (searchQuery.trim()) {
        // Navigate to search results page with query
        navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
        setShowResults(false);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  // Handle search on enter when there are no results or no selection
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  // Function to get product name (handles multiple possible field names)
  const getProductName = (product) => {
    return product.name || product.title || 'Unnamed Product';
  };

  // Function to get product price with safe handling
  const getProductPrice = (product) => {
    if (product.price !== undefined) {
      return typeof product.price === 'number'
        // ? product.price.toFixed(2)
        // : product.price;
    }
    return null;
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
          <div className='relative' ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type='text'
                placeholder='Search your favorite product...'
                className='w-full py-2 px-4 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && handleSearch(searchQuery)}
                onKeyDown={handleKeyDown}
              />
              <button
                type='submit'
                className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
              >
                <FaSearch />
              </button>
            </form>

            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className='absolute z-50 left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto'>
                {isSearching ? (
                  <div className='p-4 text-center text-gray-500'>
                    Searching...
                  </div>
                ) : (
                  <>
                    {searchResults.map((product, index) => (
                      <div
                        key={product._id}
                        className={`p-3 border-b last:border-b-0 cursor-pointer flex items-center ${
                          index === selectedResultIndex
                            ? 'bg-yellow-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleProductClick(product._id)}
                        onMouseEnter={() => setSelectedResultIndex(index)}
                      >
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={getProductName(product)}
                            className='w-12 h-12 object-cover rounded mr-3'
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/path/to/fallback-image.jpg'; // Add fallback image path
                            }}
                          />
                        ) : (
                          <div className='w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center'>
                            <FaSearch className='text-gray-400' />
                          </div>
                        )}
                        <div className='flex-1'>
                          <div className='font-medium'>
                            {getProductName(product)}
                          </div>
                          {product.category && (
                            <div className='text-sm text-gray-600'>
                              {product.category}
                            </div>
                          )}
                        </div>
                        {getProductPrice(product) !== null && (
                          <div className='font-semibold text-yellow-600'>
                            {getProductPrice(product)}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* <div
                      className='p-2 bg-gray-50 text-center text-sm text-blue-600 cursor-pointer hover:bg-gray-100'
                      onClick={() => {
                        navigate(
                          `/search-results?q=${encodeURIComponent(
                            searchQuery,
                          )}`,
                        );
                        setShowResults(false);
                      }}
                    >
                      See all results for "{searchQuery}"
                    </div> */}
                  </>
                )}
              </div>
            )}

            {/* No results message */}
            {showResults &&
              searchQuery &&
              searchResults.length === 0 &&
              !isSearching && (
                <div className='absolute z-50 left-0 right-0 mt-1 bg-white border rounded-md shadow-lg p-4 text-center'>
                  No products found for "{searchQuery}"
                </div>
              )}
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
              className='flex items-center gap-2 bg-white py-2 px-4 rounded hover:shadow-md transition-all'
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
            <a
              href='/'
              className='font-medium hover:text-yellow-800 transition-colors'
            >
              Home
            </a>
            <a
              href='/view-all-products'
              className='font-medium hover:text-yellow-800 transition-colors'
            >
              Shop
            </a>
            <a
              href='/about-us'
              className='font-medium hover:text-yellow-800 transition-colors'
            >
              About
            </a>
            <a
              href='/ContactMethods'
              className='font-medium hover:text-yellow-800 transition-colors'
            >
              Contact
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-4 py-2 bg-white rounded shadow-md'>
            <div className='flex flex-col'>
              <a href='/' className='px-4 py-2 hover:bg-gray-100 font-medium'>
                Home
              </a>
              <a
                href='/view-all-products'
                className='px-4 py-2 hover:bg-gray-100 font-medium'
              >
                Shop
              </a>
              <a
                href='/about-us'
                className='px-4 py-2 hover:bg-gray-100 font-medium'
              >
                About
              </a>
              <a
                href='/ContactMethods'
                className='px-4 py-2 hover:bg-gray-100 font-medium'
              >
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
