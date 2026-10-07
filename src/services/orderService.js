import api from "./api";

export async function placeOrder(payload) {
  const { data } = await api.post("/orders", payload);
  return data.data;
}

export async function previewOrder(payload) {
  const { data } = await api.post("/orders/preview", payload);
  return data.data;
}

export async function fetchMyOrders(params = {}) {
  const { data } = await api.get("/user/orders", { params });
  return data.data;
}

export async function fetchMyOrder(orderId) {
  const { data } = await api.get(`/user/orders/${orderId}`);
  return data.data.order;
}

export async function trackOrder(orderId, mobile) {
  const { data } = await api.get(`/orders/track/${orderId}`, { params: { mobile } });
  return data.data.tracking;
}
