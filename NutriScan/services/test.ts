// frontend src/api/auth-api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true, // important for cookies
});

export default API;
