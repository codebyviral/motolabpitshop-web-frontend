import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion"; // Import framer-motion for animations

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500, // Auto-scrolls every 2 seconds
    arrows: false,
    pauseOnHover: false, // Ensures continuous auto-scrolling
  };

  const images = [
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583438738613-1ee17784f9ae?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vdG9yY3ljbGUlMjBhY2Nlc3Nvcmllc3xlbnwwfDB8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1682345334042-3b4b8ab0c29a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW90b3JjeWNsZSUyMGFjY2Vzc29yaWVzfGVufDB8MHwwfHx8MA%3D%3D",
  ];

  return (
    <div className="relative py-16 overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Background Overlay */}
      <div className="absolute inset-0 opacity-10 z-0"></div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            The Premium <br className="md:hidden" /> Motorcycle Gear
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg"
          >
            High-quality motorcycle parts, accessories, and apparel for riders
            who demand the best. MotoLab Pit Shop - your one-stop destination.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            href="/view-all-products"
            className="relative inline-block px-6 py-3 font-medium group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
            <span className="relative text-black group-hover:text-white text-lg font-semibold">
              SHOP NOW
            </span>
          </motion.a>
        </div>

        {/* Carousel Section */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <Slider {...settings} className="w-full max-w-sm md:max-w-md">
            {images.map((image, index) => (
              <div key={index} className="relative h-80">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full overflow-hidden rounded-lg shadow-2xl"
                >
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </motion.div>
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 rounded-full shadow-lg text-sm font-medium text-white tracking-wide uppercase flex items-center gap-1">
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
