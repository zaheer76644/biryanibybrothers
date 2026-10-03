import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMenuItem } from "../data/menu";
import { cartSignature, getPricing } from "../utils/pricing";

const CART_KEY = "bbb_cart";
const MAX_QTY = 10;
const CartContext = createContext(null);

function normalizeLine(item) {
  if (!item?.productId) return null;
  const product = getMenuItem(item.productId);
  if (!product || product.available === false) return null;

  const addOns = (item.addOns || [])
    .map((addon) => {
      const current = getMenuItem(addon.id);
      if (!current || current.available === false) return null;
      return { id: current.id, name: current.name, price: current.price };
    })
    .filter(Boolean);

  const next = {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: Math.min(MAX_QTY, Math.max(1, Number(item.quantity) || 1)),
    addOns,
    instructions: String(item.instructions || "").slice(0, 200),
  };
  next.signature = cartSignature(next);
  next.lineId = next.signature;
  return next;
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeLine).filter(Boolean);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isNavOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const notify = useCallback((message) => {
    setToast({ id: Date.now(), message });
  }, []);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    setNavOpen(false);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const openNav = useCallback(() => {
    setNavOpen(true);
    setDrawerOpen(false);
  }, []);

  const closeNav = useCallback(() => setNavOpen(false), []);

  const addToCart = useCallback((payload, options = {}) => {
    const line = normalizeLine(payload);
    if (!line) return false;
    setItems((prev) => {
      const index = prev.findIndex((item) => item.signature === line.signature);
      if (index === -1) return [...prev, line];
      const next = [...prev];
      next[index] = {
        ...next[index],
        quantity: Math.min(MAX_QTY, next[index].quantity + line.quantity),
      };
      return next;
    });
    if (!options.silent) {
      setDrawerOpen(true);
      setNavOpen(false);
      setToast({ id: Date.now(), message: `${line.name} added to your box` });
    }
    return true;
  }, []);

  const removeFromCart = useCallback((lineId) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
    setToast({ id: Date.now(), message: "Removed from your box" });
  }, []);

  const updateQuantity = useCallback((lineId, quantity) => {
    setItems((prev) => {
      if (quantity < 1) return prev.filter((item) => item.lineId !== lineId);
      return prev.map((item) =>
        item.lineId === lineId
          ? { ...item, quantity: Math.min(MAX_QTY, quantity) }
          : item
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const replaceCart = useCallback((next) => {
    const merged = [];
    next.map(normalizeLine).filter(Boolean).forEach((line) => {
      const index = merged.findIndex((item) => item.signature === line.signature);
      if (index === -1) merged.push(line);
      else merged[index].quantity = Math.min(MAX_QTY, merged[index].quantity + line.quantity);
    });
    setItems(merged);
  }, []);

  const pricing = useMemo(() => getPricing(items), [items]);

  const getCartTotal = useCallback(() => pricing.total, [pricing.total]);
  const getCartCount = useCallback(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items]
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    replaceCart,
    getCartTotal,
    getCartCount,
    pricing,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    isNavOpen,
    openNav,
    closeNav,
    toast,
    notify,
    dismissToast: () => setToast(null),
    maxQty: MAX_QTY,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
