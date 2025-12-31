import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: "http://192.168.1.72:3000/api", // MUST match backend port
  withCredentials: true,
});

// ================== SIGNUP ==================
export const signup = async (payload: any) => {
  const { data } = await API.post("/auth/signup", payload);
  return data;
};

// ================== LOGIN ==================
export const login = async (email: string, password: string) => {
  const { data } = await API.post("/auth/login", {
    email,
    password,
  });
  return data;
};

// ================== CHECK EMAIL ==================
export const checkEmailExists = async (email: string) => {
  return API.post("/auth/check-email", { email });
};

// ================== LOGOUT ==================
export const logout = async () => {
  await API.post("/auth/logout");
};

// ================== REFRESH ==================
export const refreshToken = async () => {
  const { data } = await API.get("/auth/refresh");
  return data;
};

export default API;
