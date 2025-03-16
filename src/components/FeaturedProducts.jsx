import React from 'react';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'AGV K6 Helmet',
      category: 'Helmets',
      price: 499.99,
      image: '/images/helmet1.jpg',
      isNew: true
    },
    {
      id: 2,
      name: 'Dainese Leather Jacket',
      category: 'Apparel',
      price: 649.99,
      image: '/images/jacket1.jpg',
      isNew: true
    },
    {
      id: 3,
      name: 'Akrapovič Exhaust System',
      category: 'Parts',
      price: 899.99,
      image: '/images/exhaust1.jpg',
      isNew: false
    },
    {
      id: 4,
      name: 'Alpinestars Tech 10 Boots',
      category: 'Footwear',
      price: 599.99,
      image: '/images/boots1.jpg',
      isNew: false
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-gray-600">Premium motorcycle gear and parts selected for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-black text-white py-3 px-8 font-medium hover:bg-gray-800 transition duration-300">
            VIEW ALL PRODUCTS
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;