import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const customerToken = localStorage.getItem("customerToken");
  const deliveryToken = localStorage.getItem("deliveryToken");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (deliveryToken) {
    config.headers.Authorization = `Bearer ${deliveryToken}`;
  } else if (customerToken) {
    config.headers.Authorization = `Bearer ${customerToken}`;
  }
  return config;
});

export default api;