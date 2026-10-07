import api from "./api";

export async function fetchAddresses() {
  const { data } = await api.get("/user/addresses");
  return data.data.addresses;
}

export async function createAddress(payload) {
  const { data } = await api.post("/user/addresses", payload);
  return data.data.addresses;
}

export async function updateAddress(id, payload) {
  const { data } = await api.put(`/user/addresses/${id}`, payload);
  return data.data.addresses;
}

export async function deleteAddress(id) {
  const { data } = await api.delete(`/user/addresses/${id}`);
  return data.data.addresses;
}

export async function setDefaultAddress(id) {
  const { data } = await api.patch(`/user/addresses/${id}/default`);
  return data.data.addresses;
}
