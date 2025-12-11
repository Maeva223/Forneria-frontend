// src/api/client.js
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000", // backend Django
});

// Interceptor para agregar el token JWT en cada petición
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
