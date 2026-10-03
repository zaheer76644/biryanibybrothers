import { createContext, useContext, useEffect, useState } from "react";
import { createOrder, readLastOrder } from "../utils/orderStorage";

const CUSTOMER_KEY = "bbb_customer";

export const emptyCustomer = {
  fullName: "",
  mobile: "",
  flat: "",
  building: "",
  area: "",
  pincode: "",
  instructions: "",
  confirmed: false,
};

function readCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return emptyCustomer;
    return { ...emptyCustomer, ...JSON.parse(raw), confirmed: false };
  } catch {
    return emptyCustomer;
  }
}

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [customer, setCustomer] = useState(readCustomer);
  const [lastOrder, setLastOrder] = useState(readLastOrder);

  useEffect(() => {
    const { confirmed, ...draft } = customer;
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(draft));
  }, [customer]);

  const updateCustomer = (patch) => {
    setCustomer((prev) => ({ ...prev, ...patch }));
  };

  const placeOrder = ({ items, pricing }) => {
    const order = createOrder({ customer, items, pricing });
    setLastOrder(order);
    setCustomer((prev) => ({ ...prev, confirmed: false, instructions: "" }));
    return order;
  };

  return (
    <OrderContext.Provider value={{ customer, updateCustomer, lastOrder, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within OrderProvider");
  return context;
}
