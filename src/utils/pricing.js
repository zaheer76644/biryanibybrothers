import { deliveryConfig } from "../config/deliveryConfig";

export function lineUnitPrice(item) {
  const extras = (item.addOns || []).reduce((sum, addon) => sum + addon.price, 0);
  return item.price + extras;
}

export function lineTotal(item) {
  return lineUnitPrice(item) * item.quantity;
}

export function cartSignature({ productId, addOns = [], instructions = "" }) {
  const addonKey = addOns.map((addon) => addon.id).sort().join(",");
  return `${productId}|${addonKey}|${instructions.trim().toLowerCase()}`;
}

export function getPricing(items, config = deliveryConfig) {
  const minimumOrder = config.minimumOrder ?? deliveryConfig.minimumOrder;
  const deliveryFee = config.deliveryFee ?? deliveryConfig.deliveryFee;
  const freeDeliveryAbove = config.freeDeliveryAbove ?? deliveryConfig.freeDeliveryAbove;
  const discountConfig = config.discount ?? deliveryConfig.discount ?? 0;

  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const discount = Math.min(Math.max(discountConfig || 0, 0), subtotal);
  const afterDiscount = Math.max(0, subtotal - discount);
  const unlocked = afterDiscount >= freeDeliveryAbove && afterDiscount > 0;
  const delivery = afterDiscount === 0 || unlocked ? 0 : deliveryFee;

  return {
    subtotal,
    discount,
    delivery,
    total: afterDiscount + delivery,
    freeDelivery: unlocked,
    awayFromFree:
      unlocked || afterDiscount === 0 ? 0 : Math.max(0, freeDeliveryAbove - afterDiscount),
    shortOfMinimum:
      afterDiscount === 0 ? 0 : Math.max(0, minimumOrder - afterDiscount),
    minimumOrder,
    deliveryFee,
    freeDeliveryAbove,
  };
}
