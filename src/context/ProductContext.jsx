import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productId, setProductId] = useState(localStorage.getItem("productId"));

  // Function to set product ID
  const setId = (id) => {
    setProductId(id);
    localStorage.setItem("productId",id);
  };

  return (
    <ProductContext.Provider
      value={{
        productId,
        setId,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
