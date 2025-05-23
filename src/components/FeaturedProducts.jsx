import React from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/get/featured-products`,
      );
      setProducts(data.featuredProducts);
    } catch (error) {
      console.log(error);
      setProducts([]); // Set empty array on error
    } finally {
      // Always set loading to false after API call completes
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-2'>Featured Products</h2>
            <p className='text-gray-600'>
              Premium motorcycle gear and parts selected for you
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {loading
              ? // Show skeleton loaders while loading
                [...Array(8)].map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-${index}`} />
                ))
              : products.length > 0
              ? // Show actual products when loaded and available
                products.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))
              : // Show message when no products are available
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
                </div>
            }
          </div>

          {!loading && products.length > 0 && (
            <div className='text-center mt-12'>
              <a
                href='/view-all-products'
                className='relative inline-block px-4 py-2 font-medium group'
              >
                <span className='absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0'></span>
                <span className='absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black'></span>
                <span className='relative text-black group-hover:text-white'>
                  VIEW ALL PRODUCTS
                </span>
              </a>
            </div>
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
    </>
  );
};

export default FeaturedProducts;