import { createSlice } from "@reduxjs/toolkit";
import { MAX_QTY, normalizeLine, persistRawCart, readRawCart } from "../cartUtils";
import { selectProductById } from "./catalogSlice";

function getProductFromState(state, idOrSlug) {
  return selectProductById({ catalog: state.catalog ?? state }, idOrSlug);
}

/** Used inside reducers where full root state isn't available — products passed in */
function makeGetter(products) {
  return (idOrSlug) => {
    if (!idOrSlug) return null;
    return (
      products.find(
        (p) =>
          p.id === idOrSlug ||
          p._id === idOrSlug ||
          p.slug === idOrSlug ||
          String(p.id) === String(idOrSlug)
      ) || null
    );
  };
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    rawItems: readRawCart(),
    isDrawerOpen: false,
    isNavOpen: false,
    toast: null,
  },
  reducers: {
    setRawItems(state, action) {
      state.rawItems = action.payload;
      persistRawCart(state.rawItems);
    },
    addToCart(state, action) {
      const { payload, products, options = {} } = action.payload;
      const getProduct = makeGetter(products);
      const line = normalizeLine(payload, getProduct);
      if (!line) return;

      const stored = {
        productId: line.productId,
        slug: line.slug,
        quantity: line.quantity,
        addOns: line.addOns,
        instructions: line.instructions,
      };

      const index = state.rawItems.findIndex((item) => {
        const normalized = normalizeLine(item, getProduct);
        return normalized?.signature === line.signature;
      });

      if (index === -1) state.rawItems.push(stored);
      else {
        state.rawItems[index] = {
          ...state.rawItems[index],
          ...stored,
          quantity: Math.min(MAX_QTY, (state.rawItems[index].quantity || 0) + line.quantity),
        };
      }

      persistRawCart(state.rawItems);

      if (!options.silent) {
        state.isDrawerOpen = true;
        state.isNavOpen = false;
        state.toast = { id: Date.now(), message: `${line.name} added to your box` };
      }
    },
    removeFromCart(state, action) {
      const { lineId, products } = action.payload;
      const getProduct = makeGetter(products);
      state.rawItems = state.rawItems.filter(
        (item) => normalizeLine(item, getProduct)?.lineId !== lineId
      );
      persistRawCart(state.rawItems);
      state.toast = { id: Date.now(), message: "Removed from your box" };
    },
    updateQuantity(state, action) {
      const { lineId, quantity, products } = action.payload;
      const getProduct = makeGetter(products);
      if (quantity < 1) {
        state.rawItems = state.rawItems.filter(
          (item) => normalizeLine(item, getProduct)?.lineId !== lineId
        );
      } else {
        state.rawItems = state.rawItems.map((item) => {
          const normalized = normalizeLine(item, getProduct);
          if (normalized?.lineId !== lineId) return item;
          return { ...item, quantity: Math.min(MAX_QTY, quantity) };
        });
      }
      persistRawCart(state.rawItems);
    },
    clearCart(state) {
      state.rawItems = [];
      persistRawCart(state.rawItems);
    },
    replaceCart(state, action) {
      const { next, products } = action.payload;
      const getProduct = makeGetter(products);
      const merged = [];
      next
        .map((item) => normalizeLine(item, getProduct))
        .filter(Boolean)
        .forEach((line) => {
          const index = merged.findIndex((item) => item.signature === line.signature);
          const stored = {
            productId: line.productId,
            slug: line.slug,
            quantity: line.quantity,
            addOns: line.addOns,
            instructions: line.instructions,
            signature: line.signature,
          };
          if (index === -1) merged.push(stored);
          else merged[index].quantity = Math.min(MAX_QTY, merged[index].quantity + line.quantity);
        });
      state.rawItems = merged.map(({ productId, slug, quantity, addOns, instructions }) => ({
        productId,
        slug,
        quantity,
        addOns,
        instructions,
      }));
      persistRawCart(state.rawItems);
    },
    openDrawer(state) {
      state.isDrawerOpen = true;
      state.isNavOpen = false;
    },
    closeDrawer(state) {
      state.isDrawerOpen = false;
    },
    openNav(state) {
      state.isNavOpen = true;
      state.isDrawerOpen = false;
    },
    closeNav(state) {
      state.isNavOpen = false;
    },
    notify(state, action) {
      state.toast = { id: Date.now(), message: action.payload };
    },
    dismissToast(state) {
      state.toast = null;
    },
  },
});

export const {
  setRawItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  replaceCart,
  openDrawer,
  closeDrawer,
  openNav,
  closeNav,
  notify,
  dismissToast,
} = cartSlice.actions;

export { getProductFromState, MAX_QTY };
export default cartSlice.reducer;
