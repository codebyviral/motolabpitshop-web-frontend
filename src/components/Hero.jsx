import React from 'react';

const Hero = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 flex items-center">
        <div className="w-1/2">
          <h1 className="text-5xl font-bold mb-4">The Premium Motorcycle Gear</h1>
          <p className="text-gray-600 mb-8">
            High-quality motorcycle parts, accessories, and apparel for riders who demand the best. MotoLab Pit Shop - your one-stop destination for all your motorcycle needs.
          </p>
          <button className="bg-black text-white py-3 px-8 font-medium hover:bg-gray-800 transition duration-300">
            SHOP NOW
          </button>
        </div>
        
        <div className="w-1/2">
          <img 
            src="/images/motorcycle-gear.jpg" 
            alt="Premium Motorcycle Gear" 
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;