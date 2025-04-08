import React from 'react';
import { FaHeart, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {
    name,
    category,
    price,
    images,
    isNew,
    rating = 4.5,
    title = name,
  } = product;
  const { setId } = useProductContext();

  const handleSetProduct = () => {
    setId(product._id);
    console.log(localStorage.getItem('productId'));
    navigate(`/view-product/${localStorage.getItem('productId')}`);
  };

  // Determine the image source
  const imageSrc = Array.isArray(images) ? images[0] : images;

  // Calculate full stars and half stars for ratings
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div
      onClick={handleSetProduct}
      className='bg-white rounded-lg overflow-hidden shadow-lg group relative hover:shadow-xl transition-all duration-300 cursor-pointer'
    >
      {isNew && (
        <div className='absolute top-4 left-4 bg-yellow-500 text-white text-xs font-semibold py-1 px-3 rounded-full z-10'>
          NEW
        </div>
      )}

      <div className='relative overflow-hidden h-64'>
        <img
          src={imageSrc}
          alt={title || name}
          className='w-full h-full object-cover transition duration-500 group-hover:scale-110'
        />

        <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='flex gap-3'>
            <button className='bg-white p-3 rounded-full hover:bg-yellow-500 hover:text-white transition duration-300 transform hover:scale-110'>
              <FaHeart />
            </button>
            <button className='bg-white p-3 rounded-full hover:bg-yellow-500 hover:text-white transition duration-300 transform hover:scale-110'>
              <FaSearch />
            </button>
            <button className='bg-white p-3 rounded-full hover:bg-yellow-500 hover:text-white transition duration-300 transform hover:scale-110'>
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>

      <div className='p-5'>
        <div className='text-sm text-gray-500 uppercase tracking-wider mb-2 font-medium'>
          {category}
        </div>

        {/* Display title if available, otherwise fall back to name */}
        <h3 className='font-semibold text-lg mb-1 line-clamp-1 group-hover:text-yellow-600 transition-colors'>
          {title || name}
        </h3>

        {/* Display name as product description/subtitle if title exists and is different */}
        {title && title !== name && (
          <p className='text-sm text-gray-600 mb-3 line-clamp-2 h-10'>{name}</p>
        )}

        {/* If there's no separate title, ensure consistent spacing */}
        {(!title || title === name) && (
          <p className='text-sm text-gray-600 mb-3 line-clamp-2 h-10'>&nbsp;</p>
        )}

        <div className='flex justify-between items-center'>
          <div className='font-bold text-xl text-gray-800'>
            ₹{price.toFixed(2)}
          </div>
          <div className='flex items-center'>
            <div className='flex text-yellow-400 mr-1'>
              {[...Array(5)].map((_, i) => (
                <span key={i} className='text-lg'>
                  {i < fullStars
                    ? '★'
                    : i === fullStars && hasHalfStar
                    ? '⯨'
                    : '☆'}
                </span>
              ))}
            </div>
            <span className='text-gray-600 text-sm'>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
