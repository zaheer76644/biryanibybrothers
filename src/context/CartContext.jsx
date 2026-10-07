import { useCallback, useMemo } from "react";
import { getPricing } from "../utils/pricing";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { normalizeLine, MAX_QTY } from "../store/cartUtils";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  replaceCart as replaceCartAction,
  openDrawer,
  closeDrawer,
  openNav,
  closeNav,
  notify as notifyAction,
  dismissToast,
} from "../store/slices/cartSlice";
import { useCatalog } from "./CatalogContext";

const deliveryFallback = {
  minimumOrder: 149,
  deliveryFee: 20,
  freeDeliveryAbove: 299,
};

export function CartProvider({ children }) {
  return children;
}

export function useCart() {
  const dispatch = useAppDispatch();
  const { getProduct, settings } = useCatalog();
  const products = useAppSelector((s) => s.catalog.products);
  const rawItems = useAppSelector((s) => s.cart.rawItems);
  const isDrawerOpen = useAppSelector((s) => s.cart.isDrawerOpen);
  const isNavOpen = useAppSelector((s) => s.cart.isNavOpen);
  const toast = useAppSelector((s) => s.cart.toast);

  const items = useMemo(
    () => rawItems.map((item) => normalizeLine(item, getProduct)).filter(Boolean),
    [rawItems, getProduct]
  );

  const pricing = useMemo(
    () =>
      getPricing(items, {
        minimumOrder: settings.minimumOrder ?? deliveryFallback.minimumOrder,
        deliveryFee: settings.deliveryFee ?? deliveryFallback.deliveryFee,
        freeDeliveryAbove: settings.freeDeliveryAbove ?? deliveryFallback.freeDeliveryAbove,
        discount: settings.discount || 0,
      }),
    [items, settings]
  );

  const addToCart = useCallback(
    (payload, options = {}) => {
      const line = normalizeLine(payload, getProduct);
      if (!line) return false;
      dispatch(addToCartAction({ payload, products, options }));
      return true;
    },
    [dispatch, getProduct, products]
  );

  const removeFromCart = useCallback(
    (lineId) => {
      dispatch(removeFromCartAction({ lineId, products }));
    },
    [dispatch, products]
  );

  const updateQuantity = useCallback(
    (lineId, quantity) => {
      dispatch(updateQuantityAction({ lineId, quantity, products }));
    },
    [dispatch, products]
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const replaceCart = useCallback(
    (next) => {
      dispatch(replaceCartAction({ next, products }));
    },
    [dispatch, products]
  );

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    replaceCart,
    getCartTotal: () => pricing.total,
    getCartCount: () => items.reduce((count, item) => count + item.quantity, 0),
    pricing,
    isDrawerOpen,
    openDrawer: () => dispatch(openDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
    isNavOpen,
    openNav: () => dispatch(openNav()),
    closeNav: () => dispatch(closeNav()),
    toast,
    notify: (message) => dispatch(notifyAction(message)),
    dismissToast: () => dispatch(dismissToast()),
    maxQty: MAX_QTY,
  };
}
