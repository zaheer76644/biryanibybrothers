import {
  chickenDum,
  chickenTikka,
  coke,
  dumBiryani,
  eggBiryani,
  gulabJamun,
  hyderabadBiryani,
} from "../assets/images";

/**
 * EDIT THE MENU HERE
 * -------------------
 * price, name, description, available, image, category, bestseller, badge.
 *
 * Hyderabad Biryani, Dum Biryani, Gulab Jamun and Coke prices live in
 * CONFIGURABLE_PRICES so they are easy to change without hunting through the list.
 *
 * category: "main" | "combo" | "addon" | "sweet" | "drink"
 * available: false shows the dish as sold out and blocks add to cart.
 * allowAddOns: shows extra chicken, raita and salan on the product page.
 * To swap a photo, replace the file in src/assets/images and update src/assets/images.js.
 */
export const CONFIGURABLE_PRICES = {
  hyderabadBiryani: 189,
  dumBiryani: 169,
  gulabJamun: 49,
  coke: 40,
};

export const menuCategories = [
  { id: "all", label: "All" },
  { id: "main", label: "Main Items" },
  { id: "combo", label: "Combos" },
  { id: "addon", label: "Add-ons" },
  { id: "sweet", label: "Sweets" },
  { id: "drink", label: "Drinks" },
];

export const menuItems = [
  {
    id: "chicken-dum-biryani",
    name: "Chicken Dum Biryani",
    category: "main",
    price: 149,
    description:
      "Fragrant basmati rice layered with tender chicken and aromatic spices, slow-cooked to perfection.",
    image: chickenDum,
    bestseller: true,
    badge: "Bestseller",
    available: true,
    allowAddOns: true,
  },
  {
    id: "chicken-tikka-biryani",
    name: "Chicken Tikka Biryani",
    category: "main",
    price: 179,
    description:
      "Charred tikka folded into saffron basmati, with fried onion and mint.",
    image: chickenTikka,
    bestseller: false,
    badge: "Brothers Pick",
    available: true,
    allowAddOns: true,
  },
  {
    id: "egg-biryani",
    name: "Egg Biryani",
    category: "main",
    price: 99,
    description:
      "Spiced basmati with boiled eggs, dum-cooked so the rice stays separate and fragrant.",
    image: eggBiryani,
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: true,
  },
  {
    id: "hyderabad-biryani",
    name: "Hyderabad Biryani",
    category: "main",
    price: CONFIGURABLE_PRICES.hyderabadBiryani,
    description:
      "A richer dum biryani with saffron rice, fried onions and a deeper spice layer.",
    image: hyderabadBiryani,
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: true,
  },
  {
    id: "dum-biryani",
    name: "Dum Biryani",
    category: "main",
    price: CONFIGURABLE_PRICES.dumBiryani,
    description:
      "Classic dum-style biryani, sealed and slow-cooked so the rice drinks in the masala.",
    image: dumBiryani,
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: true,
  },
  {
    id: "chicken-biryani-coke",
    name: "Chicken Biryani + Coke",
    category: "combo",
    price: 199,
    description: "Chicken Dum Biryani with a chilled Coke.",
    image: chickenDum,
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: true,
  },
  {
    id: "chicken-tikka-biryani-coke",
    name: "Chicken Tikka Biryani + Coke",
    category: "combo",
    price: 229,
    description: "Chicken Tikka Biryani with a chilled Coke.",
    image: chickenTikka,
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: true,
  },
  {
    id: "extra-chicken",
    name: "Extra Chicken Piece",
    category: "addon",
    price: 50,
    description: "One more piece of chicken, cooked with the same masala.",
    image: "",
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: false,
  },
  {
    id: "raita",
    name: "Raita",
    category: "addon",
    price: 20,
    description: "Cool yoghurt raita to sit beside the biryani.",
    image: "",
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: false,
  },
  {
    id: "salan",
    name: "Salan",
    category: "addon",
    price: 20,
    description: "A small portion of salan for spooning over the rice.",
    image: "",
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: false,
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    category: "sweet",
    price: CONFIGURABLE_PRICES.gulabJamun,
    description: "Warm gulab jamun, soaked in light sugar syrup.",
    image: gulabJamun,
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: false,
  },
  {
    id: "coke",
    name: "Coke",
    category: "drink",
    price: CONFIGURABLE_PRICES.coke,
    description: "A chilled Coke to go with the biryani.",
    image: coke,
    bestseller: false,
    badge: "",
    available: true,
    allowAddOns: false,
  },
];

export function getMenuItem(id) {
  return menuItems.find((item) => item.id === id) || null;
}

export function getAddOns() {
  return menuItems.filter((item) => item.category === "addon" && item.available);
}

export function getByCategory(category) {
  if (!category || category === "all") return menuItems.filter((item) => item.available || item);
  return menuItems.filter((item) => item.category === category);
}

export function getMainItems() {
  return menuItems.filter((item) => item.category === "main");
}
