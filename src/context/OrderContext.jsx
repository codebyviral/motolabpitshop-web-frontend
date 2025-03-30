import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [rzpId, setRzpId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedRzpId = localStorage.getItem("tmp_RzpId");
    const storedOrderId = localStorage.getItem("tmp_Oid");
    
    if (storedRzpId) setRzpId(storedRzpId);
    if (storedOrderId) setOrderId(storedOrderId);
  }, []);

  const updateRzpId = (id) => {
    if (!id) {
      console.error("Razorpay ID cannot be null");
      return;
    }
    setRzpId(id);
    localStorage.setItem("tmp_RzpId", id);
  };

  const updateOrderId = (id) => {
    if (!id) {
      console.error("Order ID cannot be null");
      return;
    }
    setOrderId(id);
    localStorage.setItem("tmp_Oid", id);
  };

  const clearOrderData = () => {
    setRzpId(null);
    setOrderId(null);
    localStorage.removeItem("tmp_RzpId");
    localStorage.removeItem("tmp_Oid");
  };

  return (
    <OrderContext.Provider
      value={{
        updateOrderId,
        updateRzpId,
        clearOrderData,
        rzpId,
        orderId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// PropTypes validation for the Provider (optional)
OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};