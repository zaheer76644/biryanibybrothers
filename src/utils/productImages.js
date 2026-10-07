import {
  chickenDum,
  chickenTikka,
  coke,
  dumBiryani,
  eggBiryani,
  extraChicken,
  gulabJamun,
  hyderabadBiryani,
  raita,
  salan,
  vegBiryani,
} from "../assets/images";

const IMAGE_MAP = {
  "chicken-dum": chickenDum,
  "chicken-dum-biryani": chickenDum,
  "chicken-tikka": chickenTikka,
  "chicken-tikka-biryani": chickenTikka,
  "egg-biryani": eggBiryani,
  "hyderabad-biryani": hyderabadBiryani,
  "dum-biryani": dumBiryani,
  "veg-biryani": vegBiryani,
  "veg-dum-biryani": vegBiryani,
  "extra-chicken": extraChicken,
  raita,
  salan,
  "gulab-jamun": gulabJamun,
  coke,
  "chicken-biryani-coke": chickenDum,
  "veg-biryani-coke": vegBiryani,
  "chicken-tikka-biryani-coke": chickenTikka,
  "extra-paneer": vegBiryani,
};

export function resolveProductImage(product) {
  if (!product) return chickenDum;
  if (product.image && (product.image.startsWith("http") || product.image.startsWith("data:"))) {
    return product.image;
  }
  const key = product.image || product.slug || product.id;
  return IMAGE_MAP[key] || chickenDum;
}

export function mapApiProduct(product) {
  if (!product) return null;
  const id = product._id || product.id;
  const categorySlug = product.category?.slug || product.categorySlug || product.category;
  const availableStock = product.trackStock
    ? Math.max(0, (product.dailyStock || 0) - (product.soldQuantity || 0))
    : null;
  const isSoldOut = product.isSoldOut ?? (!product.isAvailable || (availableStock !== null && availableStock <= 0));

  return {
    id,
    _id: id,
    slug: product.slug,
    name: product.name,
    category: typeof categorySlug === "string" ? categorySlug : "main",
    categoryId: product.category?._id || product.category,
    diet: product.foodType,
    foodType: product.foodType,
    price: product.price,
    description: product.description || "",
    image: resolveProductImage(product),
    imageKey: product.image,
    bestseller: Boolean(product.isFeatured),
    badge: product.badge || "",
    available: !isSoldOut,
    isAvailable: product.isAvailable,
    allowAddOns: Boolean(product.allowAddOns),
    addOns: (product.addOns || []).map((a) => ({
      id: a._id || a.id,
      name: a.name,
      price: a.price,
      available: a.isAvailable !== false,
      diet: a.diet || "any",
    })),
    trackStock: Boolean(product.trackStock),
    availableStock,
    spiceLevel: product.spiceLevel,
    preparationTime: product.preparationTime,
  };
}
