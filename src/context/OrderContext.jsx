import { useCallback } from "react";
import { createOrder } from "../utils/orderStorage";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateCustomer, setLastOrder, emptyCustomer } from "../store/slices/orderSlice";

export { emptyCustomer };

export function OrderProvider({ children }) {
  return children;
}

export function useOrder() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector((s) => s.order.customer);
  const lastOrder = useAppSelector((s) => s.order.lastOrder);

  const updateCustomerFn = useCallback(
    (patch) => {
      dispatch(updateCustomer(patch));
    },
    [dispatch]
  );

  const placeOrder = useCallback(
    ({ items, pricing }) => {
      const order = createOrder({ customer, items, pricing });
      dispatch(setLastOrder(order));
      return order;
    },
    [dispatch, customer]
  );

  return {
    customer,
    updateCustomer: updateCustomerFn,
    lastOrder,
    placeOrder,
  };
}
