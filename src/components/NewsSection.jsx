import React from "react";

const NewsSection = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Card */}
          <div className="bg-gray-100 relative overflow-hidden rounded-lg flex flex-col h-full">
            <div className="p-8 flex-grow">
              <h3 className="text-3xl font-bold mb-6">
                Premium riding gear now available
              </h3>
              <p className="mb-6">
                Discover our new collection of high-performance motorcycle gear
                engineered for both safety and style.
              </p>
              <button className="font-medium flex items-center group">
                <span className="relative">
                  SHOP NOW
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </span>
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
            <div className="h-64 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1558981420-87aa9dad1c89?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGVjb21tZXJjZSUyMG1vdG9yY3ljbGV8ZW58MHwwfDB8fHww"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Second Card */}
          <div className="bg-gray-100 relative overflow-hidden rounded-lg flex flex-col h-full">
            <div className="p-8 flex-grow">
              <h3 className="text-3xl font-bold mb-6">
                Performance parts collection
              </h3>
              <p className="mb-6">
                Upgrade your motorcycle with our professionally tested
                performance parts and accessories.
              </p>
              <button className="font-medium flex items-center group">
                <span className="relative">
                  SHOP NOW
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </span>
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
            <div className="h-64 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1588756681780-9d5859fc2ca0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1vdG9yY3ljbGV8ZW58MHwwfDB8fHww"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
