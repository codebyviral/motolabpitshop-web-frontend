import React from 'react';
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  return (
    <header>
      {/* Top bar */}
      {/* <div className="bg-white py-2 px-4 flex justify-between items-center text-sm">
        <div>
          <span>Free Express Shipping on orders ₹200! </span>
          <a href="#" className="text-yellow-500 hover:underline">Click and Shop Now.</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:underline">Order Tracking</a>
          <div className="flex items-center gap-2">
            <button className="hover:underline">English</button>
            <span>|</span>
            <button className="hover:underline">USD</button>
          </div>
        </div>
      </div> */}

      {/* Main header */}
      <div className="bg-white py-4 px-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <a href="/">MotoLab</a>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search your favorite product..." 
              className="w-full py-2 px-4 border rounded-md"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <select className="py-2 px-4 border rounded-md appearance-none pr-8">
              <option>Select Category</option>
              <option>Helmets</option>
              <option>Jackets</option>
              <option>Gloves</option>
              <option>Boots</option>
              <option>Parts</option>
            </select>
            <span className="absolute right-2 top-3">▼</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button><FaUser size={20} /></button>
            <button className="relative">
              <FaHeart size={20} />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
            </button>
            <button className="relative">
              <FaShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-yellow-400 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white py-2 px-4 rounded">
            <span>≡</span>
            <span>All Categories</span>
          </button>
          
          <div className="flex items-center gap-6 ml-6">
            <a href="#" className="font-medium flex items-center">Home <span className="ml-1">▼</span></a>
            <a href="#" className="font-medium">Shop</a>
            <a href="#" className="font-medium flex items-center">Pages <span className="ml-1">▼</span></a>
            <a href="#" className="font-medium">About</a>
            <a href="#" className="font-medium">Blog</a>
            <a href="#" className="font-medium">Contact</a>
          </div>
        </div>
        
        <button className="bg-white py-2 px-6 rounded font-medium">Shop now</button>
      </nav>
    </header>
  );
};

export default Header;