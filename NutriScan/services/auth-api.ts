import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:3000/api", // backend URL
  withCredentials: true, // required for cookies (refreshToken)
});

// ================== Types ==================
export interface SignupData {
  email: string;
  password: string;
  gender: string;
  height: number;
  weight: number;
  birthday: string; // must be string for TypeScript
  goal: string;
}

// ================== API Calls ==================

// SIGNUP
export const signup = async (data: SignupData) => {
  const res = await API.post("/auth/signup", data);
  return res.data; // { accessToken, bmi, bmr, dailyCalories }
};

// LOGIN
export const login = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data; // { accessToken }
};

// LOGOUT
export const logout = async () => {
  await API.post("/auth/logout");
};

// REFRESH TOKEN
export const refreshToken = async () => {
  const res = await API.get("/auth/refresh");
  return res.data; // { accessToken }
};

export default API;
