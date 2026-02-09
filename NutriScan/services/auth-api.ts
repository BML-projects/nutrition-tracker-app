import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("❌ EXPO_PUBLIC_BACKEND_URL is missing in .env");
}

// ---------- Axios instance ----------
const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// ---------- Request interceptor: add token ----------
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Response interceptor: handle 401 / refresh ----------
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !(originalRequest.url?.includes("/auth/refresh"))
    ) {
      originalRequest!._retry = true;
      try {
        const refreshData = await refreshToken();
        await AsyncStorage.setItem("accessToken", refreshData.accessToken);
        originalRequest!.headers!["Authorization"] = `Bearer ${refreshData.accessToken}`;
        return API(originalRequest!);
      } catch (err) {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("userData");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// ============== AUTH FUNCTIONS ==============

export const login = async (email: string, password: string) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    // Save tokens and user data
    if (response.data.accessToken) {
      await AsyncStorage.setItem("accessToken", response.data.accessToken);
    }
    if (response.data.user) {
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Network error during login" };
  }
};

export const signup = async (payload: {
  email: string;
  password: string;
  name: string;
  gender: string;
  height: number;
  weight: number;
  dob: string;
  goal: string;
}) => {
  try {
    const response = await API.post("/auth/signup", payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

export const checkEmailExists = async (email: string) => {
  try {
    const response = await API.post("/auth/check-email", { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Network error while checking email" };
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("userData");
    await API.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/auth/refresh`, {
      withCredentials: true, // send cookies if your backend uses them
    });
    return response.data; // should contain new accessToken
  } catch (error: any) {
    throw error.response?.data || { message: "Refresh token failed" };
  }
};

// ================= PASSWORD RESET =================

export const forgotPassword = async (email: string) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Network error" };
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await API.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Network error" };
  }
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await API.post("/auth/reset-password", { email, otp, newPassword });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Network error" };
  }
};

export default API;
