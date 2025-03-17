import React from "react";
import { Header, Hero, Features, FeaturedProducts, NewsSection , Footer } from "../components/index";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <FeaturedProducts />
      <NewsSection />
      <Footer />
    </div>
  );
};

export default Home;
