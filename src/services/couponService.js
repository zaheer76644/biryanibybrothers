import api from "./api";

export async function validateCoupon(payload) {
  const { data } = await api.post("/coupons/validate", payload);
  return data.data;
}
