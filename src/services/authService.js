import api from "./api";

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data.data.user;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data.data.user;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data.data.user;
}

export async function updateProfile(payload) {
  const { data } = await api.put("/auth/profile", payload);
  return data.data.user;
}

export async function changePassword(payload) {
  const { data } = await api.post("/auth/change-password", payload);
  return data;
}
