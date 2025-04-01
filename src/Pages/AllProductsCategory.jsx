import React, { useEffect, useState } from 'react';
import { ProductCard, Header, Footer } from '../components/index';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const AllProductsCategory = () => {
  const backendUrl = import.meta.env.VITE_BACKEND;
  const { category: urlCategory } = useParams(); // Get category from URL params

  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(urlCategory || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backendUrl}/api/product/get-all`);

      if (response.data.success && response.data.products?.length > 0) {
        setProducts(response.data.products);

        // Validate that the URL category exists in the products
        if (urlCategory) {
          const categoryExists = response.data.products.some(
            (product) => product.category === urlCategory,
          );
          if (!categoryExists) {
            setError(`No products found in "${urlCategory}" category`);
            setCategoryFilter('All');
          }
        }
      } else {
        setProducts([]);
        setError('No products available');
      }
    } catch (err) {
      setError('Error fetching products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts();
  }, [urlCategory]); // Re-fetch when URL category changes

  // Get unique categories for filter
  const categories = [
    'All',
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // Filter products based on selected category
  const filteredProducts =
    categoryFilter === 'All'
      ? products
      : products.filter((product) => product.category === categoryFilter);

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return (b.isNew ? 1 : -1) - (a.isNew ? 1 : -1);
      default:
        return 0; // featured - keep original order
    }
  });

  return (
    <>
      <Header />
      <div className='min-h-screen bg-gray-50 py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center capitalize mb-12'>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl font-bold mb-4'
            >
              {categoryFilter === 'All'
                ? 'All Products'
                : `${categoryFilter} Products`}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-gray-600 max-w-xl mx-auto'
            >
              Browse our extensive collection of premium motorcycle gear, parts,
              and accessories
            </motion.p>
          </div>

          {/* Filters and Sort - Only show if we have products */}
          {!loading && !error && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0'
            >
              <div className='flex flex-wrap gap-2'>
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 text-sm font-medium transition duration-300 rounded-full ${
                      categoryFilter === category
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              <div className='flex items-center'>
                <label
                  htmlFor='sort'
                  className='mr-2 text-sm font-medium text-gray-700'
                >
                  Sort by:
                </label>
                <select
                  id='sort'
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                >
                  <option value='featured'>Featured</option>
                  <option value='price-low'>Price: Low to High</option>
                  <option value='price-high'>Price: High to Low</option>
                  <option value='rating'>Top Rated</option>
                  <option value='newest'>Newest</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className='text-center py-20'
            >
              <p className='text-gray-700 text-lg'>Loading products...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className='text-center py-20'
            >
              <p className='text-red-500 text-lg mb-4'>{error}</p>
              <button
                onClick={getProducts}
                className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition'
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Product Count - Only show if we have products */}
          {!loading && !error && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='mb-6 text-gray-700'
            >
              <p>
                {sortedProducts.length}{' '}
                {sortedProducts.length === 1 ? 'product' : 'products'} available
                {categoryFilter !== 'All' && ` in ${categoryFilter}`}
              </p>
            </motion.div>
          )}

          {/* Products Grid */}
          {!loading && !error && sortedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            >
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </motion.div>
          )}

          {/* Empty State - When no products match filters */}
          {!loading &&
            !error &&
            products.length > 0 &&
            sortedProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='text-center py-20'
              >
                <p className='text-xl text-gray-600 mb-4'>
                  No products found in the "{categoryFilter}" category.
                </p>
                <button
                  onClick={() => setCategoryFilter('All')}
                  className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition'
                >
                  Show All Products
                </button>
              </motion.div>
            )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProductsCategory;
