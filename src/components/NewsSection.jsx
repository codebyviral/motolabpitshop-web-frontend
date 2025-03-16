import React from "react";

const NewsSection = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 relative overflow-hidden rounded-lg">
            <div className="absolute top-4 left-4 bg-gray-200 py-1 px-3 rounded-sm">
              <span className="text-sm font-medium">New season</span>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-6">
                Premium riding gear now available
              </h3>
              <p className="mb-6">
                Discover our new collection of high-performance motorcycle gear
                engineered for both safety and style.
              </p>
              <button className="font-medium flex items-center">
                SHOP NOW <span className="ml-2">→</span>
              </button>
            </div>
            <div className="h-64 bg-gray-200">{/* Image placeholder */}</div>
          </div>

          <div className="bg-gray-100 relative overflow-hidden rounded-lg">
            <div className="absolute top-4 left-4 bg-gray-200 py-1 px-3 rounded-sm">
              <span className="text-sm font-medium">New season</span>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-6">
                Performance parts collection
              </h3>
              <p className="mb-6">
                Upgrade your motorcycle with our professionally tested
                performance parts and accessories.
              </p>
              <button className="font-medium flex items-center">
                SHOP NOW <span className="ml-2">→</span>
              </button>
            </div>
            <div className="h-64 bg-gray-200">{/* Image placeholder */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
