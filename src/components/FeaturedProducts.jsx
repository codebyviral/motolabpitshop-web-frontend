import React from "react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const products = [
    {
      id: 1,
      name: "AGV K6 Helmet",
      category: "Helmets",
      price: 499.99,
      image:
        "https://dainese-cdn.thron.com/delivery/public/image/dainese/0b132a07-d6d7-405a-8569-4bb800e26b57/px6qct/std/450x450/2118395001_025_1.png?format=webp&quality=auto-medium&dpr=200",
      isNew: true,
    },
    {
      id: 2,
      name: "Dainese Leather Jacket",
      category: "Apparel",
      price: 649.99,
      image:
        "https://static.wixstatic.com/media/09a894_beb32c944f2f4ff1b1e81291cbfb9a33~mv2.png/v1/fill/w_1026,h_1026,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/09a894_beb32c944f2f4ff1b1e81291cbfb9a33~mv2.png",
      isNew: true,
    },
    {
      id: 3,
      name: "Akrapovič Exhaust System",
      category: "Parts",
      price: 899.99,
      image:
        "https://royalpiston.in/cdn/shop/files/71f0CamGF7L.jpg?v=1712527958&width=3840",
      isNew: false,
    },
    {
      id: 4,
      name: "Alpinestars Tech 10 Boots",
      category: "Footwear",
      price: 599.99,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLSqlXNAwjyEvC2Hhl1z-JFaFKJRfdjVVdjW61bWjIGw&usqp=CAE&s",
      isNew: false,
    },
  ];

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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
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
