import React from 'react';
import { FaHeart, FaSearch, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { name, category, price, image, isNew } = product;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md group relative">
      {isNew && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs py-1 px-2 rounded z-10">
          NEW SEASON
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-64 object-cover transition duration-300 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="flex gap-2">
            <button className="bg-white p-2 rounded-full hover:bg-yellow-500 hover:text-white transition duration-300">
              <FaHeart />
            </button>
            <button className="bg-white p-2 rounded-full hover:bg-yellow-500 hover:text-white transition duration-300">
              <FaSearch />
            </button>
            <button className="bg-white p-2 rounded-full hover:bg-yellow-500 hover:text-white transition duration-300">
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{category}</div>
        <h3 className="font-medium text-lg mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <div className="font-bold">${price.toFixed(2)}</div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-500">★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;