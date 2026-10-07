import { cartSignature } from "../utils/pricing";

export const CART_KEY = "bbb_cart";
export const MAX_QTY = 10;

export function readRawCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistRawCart(rawItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(rawItems));
}

export function normalizeLine(item, getProduct) {
  if (!item?.productId) return null;
  const product = getProduct(item.productId) || getProduct(item.slug);
  if (!product || product.available === false) return null;

  let addOns = [];
  if (product.addOns?.length) {
    addOns = (item.addOns || [])
      .map((addon) => {
        const current =
          product.addOns.find(
            (a) => a.id === addon.id || a.name === addon.name || String(a.id) === String(addon.id)
          ) || null;
        if (!current || current.available === false) return null;
        return { id: current.id, name: current.name, price: current.price };
      })
      .filter(Boolean);
  } else {
    addOns = (item.addOns || [])
      .map((addon) => {
        const current = getProduct(addon.id);
        if (!current || current.available === false) return null;
        return { id: current.id, name: current.name, price: current.price };
      })
      .filter(Boolean);
  }

  const next = {
    productId: product.id,
    slug: product.slug || product.id,
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
