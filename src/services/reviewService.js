import api from "./api";

export async function fetchReviews(params = {}) {
  const { data } = await api.get("/reviews", { params });
  return data.data.reviews;
}

export async function submitReview(payload) {
  const { data } = await api.post("/reviews", payload);
  return data.data.review;
}
