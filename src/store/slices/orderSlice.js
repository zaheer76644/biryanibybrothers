import { createSlice } from "@reduxjs/toolkit";
import { readLastOrder } from "../../utils/orderStorage";

const CUSTOMER_KEY = "bbb_customer";

export const emptyCustomer = {
  fullName: "",
  mobile: "",
  flat: "",
  building: "",
  area: "",
  pincode: "",
  instructions: "",
  confirmed: false,
};

function readCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return emptyCustomer;
    return { ...emptyCustomer, ...JSON.parse(raw), confirmed: false };
  } catch {
    return emptyCustomer;
  }
}

const orderSlice = createSlice({
  name: "order",
  initialState: {
    customer: readCustomer(),
    lastOrder: readLastOrder(),
  },
  reducers: {
    updateCustomer(state, action) {
      state.customer = { ...state.customer, ...action.payload };
      const { confirmed, ...draft } = state.customer;
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(draft));
    },
    setLastOrder(state, action) {
      state.lastOrder = action.payload;
      state.customer = { ...state.customer, confirmed: false, instructions: "" };
      const { confirmed, ...draft } = state.customer;
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(draft));
    },
  },
});

export const { updateCustomer, setLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
