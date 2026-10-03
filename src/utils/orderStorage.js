import { business } from "../config/business";

const SEQ_KEY = "bbb_order_seq";
const LAST_KEY = "bbb_last_order";

/**
 * Static order placement.
 * Later, replace the body of createOrder() with a POST to your Node API
 * and return the server order. Pages only depend on the object shape below.
 */
export function createOrder({ customer, items, pricing }) {
  const seq = Number(localStorage.getItem(SEQ_KEY) || "1000") + 1;
  localStorage.setItem(SEQ_KEY, String(seq));

  const order = {
    id: `BBB-${seq}`,
    createdAt: new Date().toISOString(),
    customer: {
      fullName: customer.fullName.trim(),
      mobile: customer.mobile.replace(/\D/g, ""),
      flat: customer.flat.trim(),
      building: customer.building.trim(),
      area: customer.area.trim(),
      pincode: customer.pincode.trim(),
      instructions: customer.instructions.trim(),
    },
    items: items.map((item) => ({
      lineId: item.lineId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      addOns: item.addOns || [],
      instructions: item.instructions || "",
    })),
    totals: {
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      delivery: pricing.delivery,
      total: pricing.total,
    },
    paymentMethod: business.paymentLabel,
    expectedDelivery: business.expectedDelivery,
  };

  localStorage.setItem(LAST_KEY, JSON.stringify(order));
  return order;
}

export function readLastOrder() {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
