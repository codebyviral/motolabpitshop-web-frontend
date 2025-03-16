import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Auto-scrolls every 2 seconds
    arrows: false,
    pauseOnHover: false, // Ensures continuous auto-scrolling
  };

  const images = [
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583438738613-1ee17784f9ae?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vdG9yY3ljbGUlMjBhY2Nlc3Nvcmllc3xlbnwwfDB8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1682345334042-3b4b8ab0c29a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW90b3JjeWNsZSUyMGFjY2Vzc29yaWVzfGVufDB8MHwwfHx8MA%3D%3D",
  ];

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 opacity-10 z-0"></div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            The Premium <br className="md:hidden" /> Motorcycle Gear
          </h1>
          <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">
            High-quality motorcycle parts, accessories, and apparel for riders
            who demand the best. MotoLab Pit Shop - your one-stop destination.
          </p>
          <button className="bg-black text-white py-3 px-8 font-medium rounded-full transition duration-300 shadow-lg">
            SHOP NOW
          </button>
        </div>

        {/* Carousel Section */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <Slider {...settings} className="w-full max-w-sm md:max-w-md">
            {images.map((image, index) => (
              <div key={index} className="relative h-80">
                {" "}
                {/* Fixed height for consistency */}
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-xl transform hover:scale-105 transition duration-500"
                />
                {/* Overlay Badge */}
                <div className="absolute bottom-3 left-3 bg-gradient-to-r from-gray-900 to-gray-700 px-3 py-1.5 rounded-full shadow-lg text-xs font-medium text-white tracking-wide uppercase flex items-center gap-1">
                  <span className="text-yellow-400">★</span> Top Rated Gear
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Hero;
