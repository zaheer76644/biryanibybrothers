import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { menuCategories, menuItems } from "../../data/menu";
import { deliveryConfig } from "../../config/deliveryConfig";
import { BUSINESS_WHATSAPP_NUMBER, business } from "../../config/business";
import { fetchProducts } from "../../services/productService";
import { fetchCategories } from "../../services/categoryService";
import { fetchSettings } from "../../services/settingsService";
import { mapApiProduct } from "../../utils/productImages";

function fallbackProducts() {
  return menuItems.map((item) => ({
    ...item,
    _id: item.id,
    slug: item.id,
    foodType: item.diet,
    addOns: [],
  }));
}

const defaultSettings = {
  ...deliveryConfig,
  businessName: business.name,
  tagline: business.tagline,
  whatsappNumber: BUSINESS_WHATSAPP_NUMBER,
  contactNumber: BUSINESS_WHATSAPP_NUMBER,
  estimatedDeliveryTime: { min: 30, max: 45 },
  canOrder: true,
  orderingStatus: "OPEN",
};

export const loadCatalog = createAsyncThunk("catalog/load", async (_, { rejectWithValue }) => {
  try {
    const [productData, categoryRows, settingsRow] = await Promise.all([
      fetchProducts({ limit: 100 }),
      fetchCategories(),
      fetchSettings(),
    ]);
    return { productData, categoryRows, settingsRow };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    products: fallbackProducts(),
    categories: menuCategories,
    settings: defaultSettings,
    isLoading: true,
    error: null,
    fromApi: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        const { productData, categoryRows, settingsRow } = action.payload;
        const mapped = (productData.products || []).map(mapApiProduct).filter(Boolean);
        if (mapped.length) {
          state.products = mapped;
          state.fromApi = true;
        }
        if (categoryRows?.length) {
          state.categories = [
            { id: "all", label: "All" },
            { id: "veg", label: "Veg" },
            { id: "non-veg", label: "Non-Veg" },
            ...categoryRows.map((c) => ({ id: c.slug, label: c.name, _id: c._id })),
          ];
        }
        if (settingsRow) {
          state.settings = { ...state.settings, ...settingsRow };
        }
        state.isLoading = false;
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        state.error = action.payload || "Failed to load catalog";
        state.fromApi = false;
        state.isLoading = false;
      });
  },
});

export const selectProductById = (state, idOrSlug) => {
  if (!idOrSlug) return null;
  return (
    state.catalog.products.find(
      (p) =>
        p.id === idOrSlug ||
        p._id === idOrSlug ||
        p.slug === idOrSlug ||
        String(p.id) === String(idOrSlug)
    ) || null
  );
};

export const selectAddOnsFor = (state, forDiet) =>
  state.catalog.products.filter((item) => {
    if (item.category !== "addon" || item.available === false) return false;
    if (forDiet === "veg" || forDiet === "egg") return item.diet !== "non-veg";
    return true;
  });

export default catalogSlice.reducer;
