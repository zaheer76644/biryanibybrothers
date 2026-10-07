import api from "./api";

export async function adminLogin(payload) {
  const { data } = await api.post("/admin/auth/login", payload);
  return data.data.admin;
}

export async function adminMe() {
  const { data } = await api.get("/admin/auth/me");
  return data.data.admin;
}

export async function adminLogout() {
  await api.post("/admin/auth/logout");
}

export async function fetchDashboard() {
  const { data } = await api.get("/admin/dashboard");
  return data.data;
}

export async function fetchAdminOrders(params = {}) {
  const { data } = await api.get("/admin/orders", { params });
  return data.data;
}

export async function fetchAdminOrder(id) {
  const { data } = await api.get(`/admin/orders/${id}`);
  return data.data.order;
}

export async function updateOrderStatus(id, payload) {
  const { data } = await api.patch(`/admin/orders/${id}/status`, payload);
  return data.data.order;
}

export async function fetchAdminProducts() {
  const { data } = await api.get("/admin/products");
  return data.data.products;
}

export async function updateProductAvailability(id, isAvailable) {
  const { data } = await api.patch(`/admin/products/${id}/availability`, { isAvailable });
  return data.data.product;
}

export async function updateProductStock(id, payload) {
  const { data } = await api.patch(`/admin/products/${id}/stock`, payload);
  return data.data.product;
}

export async function upsertProduct(id, payload) {
  if (id) {
    const { data } = await api.put(`/admin/products/${id}`, payload);
    return data.data.product;
  }
  const { data } = await api.post("/admin/products", payload);
  return data.data.product;
}

export async function fetchAdminCategories() {
  const { data } = await api.get("/admin/categories");
  return data.data.categories;
}

export async function fetchAdminCoupons() {
  const { data } = await api.get("/admin/coupons");
  return data.data.coupons;
}

export async function createCoupon(payload) {
  const { data } = await api.post("/admin/coupons", payload);
  return data.data.coupon;
}

export async function fetchAdminReviews() {
  const { data } = await api.get("/admin/reviews");
  return data.data.reviews;
}

export async function approveReview(id) {
  const { data } = await api.patch(`/admin/reviews/${id}/approve`);
  return data.data.review;
}

export async function fetchAdminCustomers(params = {}) {
  const { data } = await api.get("/admin/customers", { params });
  return data.data;
}

export async function fetchAdminSettings() {
  const { data } = await api.get("/admin/settings");
  return data.data.settings;
}

export async function updateAdminSettings(payload) {
  const { data } = await api.put("/admin/settings", payload);
  return data.data.settings;
}
