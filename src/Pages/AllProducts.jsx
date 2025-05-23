import React, { useEffect, useState } from 'react';
import { ProductCard, Header, Footer } from '../components/index';
import axios from 'axios';
import { motion } from 'framer-motion';

// Skeleton component for ProductCard
const ProductCardSkeleton = () => {
  return (
    <div className='bg-white rounded-lg overflow-hidden shadow-lg animate-pulse'>
      {/* Image skeleton */}
      <div className='relative overflow-hidden h-64 bg-gray-300'>
        <div className='w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'></div>
      </div>

      {/* Content skeleton */}
      <div className='p-5'>
        {/* Category skeleton */}
        <div className='h-3 bg-gray-300 rounded w-20 mb-3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'></div>

        {/* Title skeleton */}
        <div className='h-5 bg-gray-300 rounded w-3/4 mb-2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'></div>

        {/* Description skeleton */}
        <div className='space-y-2 mb-4'>
          <div className='h-3 bg-gray-300 rounded w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'></div>
          <div className='h-3 bg-gray-300 rounded w-2/3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'></div>
        </div>

        {/* Price and rating skeleton */}
        <div className='flex justify-between items-center'>
          <div className='h-6 bg-gray-300 rounded w-20 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'></div>
          <div className='flex items-center space-x-1'>
            {/* Stars skeleton */}
            <div className='flex space-x-1'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='h-4 w-4 bg-gray-300 rounded bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'
                ></div>
              ))}
            </div>
            <div className='h-3 bg-gray-300 rounded w-8 ml-2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    window.scrollTo(0, 0);
    getProducts();
  }, []);

  // Get unique categories for filter
  const categories = [
    'All',
    ...new Set(products.map((product) => product.category)),
  ];
  console.log(categories);
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

          {/* Filters and Sort - Only show when not loading and no error */}
          {!loading && !error && (
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

          {/* Loading State with Skeleton Loaders */}
          {loading && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='mb-6 text-gray-700'
              >
                <div className='h-4 bg-gray-300 rounded w-32 animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              >
                {[...Array(12)].map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-${index}`} />
                ))}
              </motion.div>
            </>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className='text-center py-12'
            >
              <p className='text-red-500 text-lg mb-4'>{error}</p>
              <button
                onClick={getProducts}
                className='px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300'
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Products Content - Only show when not loading and no error */}
          {!loading && !error && (
            <>
              {/* Product Count */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className='mb-6 text-gray-700'
              >
                <p>{sortedProducts.length} products available</p>
              </motion.div>

              {/* Products Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              >
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className='col-span-full text-center py-12'>
                    <p className='text-gray-500 text-lg'>
                      No products found matching your criteria.
                    </p>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      <Footer />
    </>
  );
};

export default AllProducts;
