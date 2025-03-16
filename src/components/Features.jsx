import React from 'react';
import { FaTruck, FaExchangeAlt, FaLock } from 'react-icons/fa';

const Features = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="text-yellow-500 mr-4">
              <FaTruck size={40} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Free Shipping</h3>
              <p className="text-gray-600">When ordering over ₹100</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-yellow-500 mr-4">
              <FaExchangeAlt size={40} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Easy return</h3>
              <p className="text-gray-600">Get Return within 30 days</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-yellow-500 mr-4">
              <FaLock size={40} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Secure Payment</h3>
              <p className="text-gray-600">100% Secure Online Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;