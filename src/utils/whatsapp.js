import { BUSINESS_WHATSAPP_NUMBER } from "../config/business";

/** Every WhatsApp link on the site should be built here. */
export function whatsappHref(message = "") {
  const base = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function orderHelpMessage(orderId) {
  return `Hello Biryani By Brothers, I need help with order ${orderId}.`;
}
