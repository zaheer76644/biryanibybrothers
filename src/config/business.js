/**
 * Digits only, country code first, no plus sign.
 * Used everywhere a WhatsApp or phone link is built — do not copy it into components.
 */
export const BUSINESS_WHATSAPP_NUMBER = "918652188366";

const localNumber = BUSINESS_WHATSAPP_NUMBER.startsWith("91")
  ? BUSINESS_WHATSAPP_NUMBER.slice(2)
  : BUSINESS_WHATSAPP_NUMBER;

export const business = {
  name: "Biryani By Brothers",
  tagline: "Two Brothers. One Recipe.",
  taglineHeart: "From Our Handi to Your Heart.",
  location: "Mira Road, Maharashtra",
  kitchen: "Home Kitchen",
  hours: "12 PM – 11 PM",
  hoursDetail: "Open daily, 12 PM – 11 PM",
  deliveryArea: "Mira Road and nearby areas",
  expectedDelivery: "30–45 minutes",
  paymentLabel: "Cash / UPI on Delivery",
  paymentNote: "You can pay by cash or UPI when your order is delivered.",
  paymentExtra: "UPI and cash are both accepted.",
  phoneDisplay: `+91 ${localNumber.slice(0, 5)} ${localNumber.slice(5)}`,
  phoneTel: `+${BUSINESS_WHATSAPP_NUMBER}`,
  instagramUrl: "https://www.instagram.com/biryanibybrothers/",
  instagramHandle: "@biryanibybrothers",
};

/** Change `available` through the day. The homepage reads only this object. */
export const todaysBatch = {
  capacity: 30,
  available: 30,
};
