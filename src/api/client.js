// src/api/client.js
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000", // backend Django
});

export default client;
