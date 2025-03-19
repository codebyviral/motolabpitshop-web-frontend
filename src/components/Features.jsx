import React from "react";
import { FaTruck, FaExchangeAlt, FaLock } from "react-icons/fa";

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-center mb-6 md:mb-0">
    <div className="text-yellow-500 mr-4">
      <Icon size={32} className="md:w-8 md:h-8 w-6 h-6" />
    </div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: FaTruck,
      title: "Free Shipping",
      description: "When ordering over ₹500",
    },
    {
      icon: FaExchangeAlt,
      title: "Easy Return",
      description: "Get Return within 30 days",
    },
    {
      icon: FaLock,
      title: "Secure Payment",
      description: "100% Secure Online Payment",
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:space-x-4 space-y-6 md:space-y-0">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
