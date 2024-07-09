// frontend/src/services/api.js
import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}`;

const API = axios.create({
  baseURL: API_ENDPOINT,
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

export default API;
