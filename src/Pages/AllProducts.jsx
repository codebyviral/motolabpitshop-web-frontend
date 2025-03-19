import React, { useState } from "react";
import { ProductCard, Header, Footer } from "../components/index";

const AllProducts = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  // Extended product list with more items
  const products = [
    {
      id: 1,
      name: "AGV K6 Helmet",
      category: "Helmets",
      price: 499.99,
      image:
        "https://dainese-cdn.thron.com/delivery/public/image/dainese/0b132a07-d6d7-405a-8569-4bb800e26b57/px6qct/std/450x450/2118395001_025_1.png?format=webp&quality=auto-medium&dpr=200",
      isNew: true,
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Dainese Leather Jacket",
      category: "Apparel",
      price: 649.99,
      image:
        "https://static.wixstatic.com/media/09a894_beb32c944f2f4ff1b1e81291cbfb9a33~mv2.png/v1/fill/w_1026,h_1026,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/09a894_beb32c944f2f4ff1b1e81291cbfb9a33~mv2.png",
      isNew: true,
      rating: 4.9,
      reviews: 78,
    },
    {
      id: 3,
      name: "Akrapovič Exhaust System",
      category: "Parts",
      price: 899.99,
      image:
        "https://royalpiston.in/cdn/shop/files/71f0CamGF7L.jpg?v=1712527958&width=3840",
      isNew: false,
      rating: 4.7,
      reviews: 56,
    },
    {
      id: 4,
      name: "Alpinestars Tech 10 Boots",
      category: "Footwear",
      price: 599.99,
      image: "/api/placeholder/450/450",
      isNew: false,
      rating: 4.8,
      reviews: 89,
    },
    {
      id: 5,
      name: "Shoei X-14 Helmet",
      category: "Helmets",
      price: 789.99,
      image: "/api/placeholder/450/450",
      isNew: true,
      rating: 4.9,
      reviews: 132,
    },
    {
      id: 6,
      name: "Alpinestars GP Pro Gloves",
      category: "Apparel",
      price: 159.99,
      image: "/api/placeholder/450/450",
      isNew: false,
      rating: 4.6,
      reviews: 64,
    },
    {
      id: 7,
      name: "Oxford Chain Lube",
      category: "Maintenance",
      price: 12.99,
      image: "/api/placeholder/450/450",
      isNew: false,
      rating: 4.5,
      reviews: 210,
    },
    {
      id: 8,
      name: "Yoshimura Slip-On Exhaust",
      category: "Parts",
      price: 459.99,
      image: "/api/placeholder/450/450",
      isNew: true,
      rating: 4.7,
      reviews: 42,
    },
    {
      id: 9,
      name: "REV'IT! Tornado 3 Jacket",
      category: "Apparel",
      price: 349.99,
      image: "/api/placeholder/450/450",
      isNew: false,
      rating: 4.6,
      reviews: 58,
    },
    {
      id: 10,
      name: "K&N Air Filter",
      category: "Parts",
      price: 69.99,
      image: "/api/placeholder/450/450",
      isNew: false,
      rating: 4.8,
      reviews: 176,
    },
    {
      id: 11,
      name: "Sena 50S Bluetooth Headset",
      category: "Electronics",
      price: 339.99,
      image: "/api/placeholder/450/450",
      isNew: true,
      rating: 4.7,
      reviews: 91,
    },
    {
      id: 12,
      name: "Dainese Delta 3 Leather Pants",
      category: "Apparel",
      price: 399.99,
      image: "/api/placeholder/450/450",
      isNew: false,
      rating: 4.8,
      reviews: 47,
    },
  ];

  // Get unique categories for filter
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter products based on selected category
  const filteredProducts =
    categoryFilter === "All"
      ? products
      : products.filter((product) => product.category === categoryFilter);

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.isNew ? 1 : -1;
      default:
        return 0; // featured - keep original order
    }
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">All Products</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Browse our extensive collection of premium motorcycle gear, parts,
              and accessories
            </p>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 not-rounded-full text-sm font-medium transition duration-300 ${
                    categoryFilter === category
                      ? "bg-black text-white"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center">
              <label
                htmlFor="sort"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 not-rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Product Count */}
          <div className="mb-6 text-gray-700">
            <p>{sortedProducts.length} products available</p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="flex space-x-2">
              <button className="px-4 py-2 bg-white border border-gray-300 not-rounded-md hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-black text-white not-rounded-md">
                1
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 not-rounded-md hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 not-rounded-md hover:bg-gray-50">
                3
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 not-rounded-md hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
