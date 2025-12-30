import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://192.168.1.72:3000/api", // backend URL
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
export const signup = async (payload: any) => {
  const response = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.errors?.[0] || "Signup failed"
    );
  }

  return data;
};

// LOGIN
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data; // { accessToken }
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
