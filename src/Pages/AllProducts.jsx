import React, { useEffect, useState } from 'react';
import { ProductCard, Header, Footer } from '../components/index';
import axios from 'axios';
import { motion } from 'framer-motion';

const AllProducts = () => {
  const backendUrl = import.meta.env.VITE_BACKEND;

  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/get-all`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0,0)
    getProducts();
  }, []);

  // Get unique categories for filter
  const categories = [
    'All',
    ...new Set(products.map((product) => product.category)),
  ];
 console.log(categories)
  // Filter products based on selected category
  const filteredProducts =
    categoryFilter === 'All'
      ? products
      : products.filter((product) => product.category === categoryFilter);

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew ? 1 : -1;
      default:
        return 0; // featured - keep original order
    }
  });

  return (
    <>
      <Header />
      <div className='min-h-screen bg-gray-50 py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl font-bold mb-4'
            >
              All Products
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

          {/* Filters and Sort */}
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

          {/* Loading and Error Handling */}
          {loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className='text-center text-gray-700'
            >
              Loading products...
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className='text-center text-red-500'
            >
              {error}
            </motion.p>
          )}

          {/* Product Count */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='mb-6 text-gray-700'
            >
              <p>{sortedProducts.length} products available</p>
            </motion.div>
          )}

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
