import React from "react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/get/featured-products`
      );
      setProducts(data.featuredProducts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">
              Premium motorcycle gear and parts selected for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/view-all-products"
              class="relative inline-block px-4 py-2 font-medium group"
            >
              <span class="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span class="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
              <span class="relative text-black group-hover:text-white">
                VIEW ALL PRODUCTS
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedProducts;
