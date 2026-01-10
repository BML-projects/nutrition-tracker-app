import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get the correct backend URL
const BACKEND_URL = "http://192.168.1.72:3000/api"; // Use your actual IP

console.log("API Base URL:", BACKEND_URL);

// Axios instance with proper configuration
const API = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log("Request data:", config.data);
    console.log("Request headers:", config.headers);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log(`📥 Response ${response.status} from ${response.config.url}`);
    console.log("Response data:", response.data);
    console.log("Response headers:", response.headers);
    return response;
  },
  (error) => {
    console.error("Response error:", {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

// ================== LOGIN ==================
export const login = async (email: string, password: string) => {
  try {
    console.log("🔐 Attempting login for:", email);
    
    const response = await API.post("/auth/login", { 
      email: email.trim(), 
      password: password.trim()
    });
    
    console.log("✅ Login successful:", response.data);
    return response.data;
    
  } catch (error: any) {
    console.error("❌ Login failed:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Throw the error with proper structure
    throw error.response?.data || { 
      success: false,
      message: "Network error. Please check your connection." 
    };
  }
};

// ================== SIGNUP ==================
export const signup = async (payload: any) => {
  try {
    console.log("📝 Attempting signup for:", payload.email);
    
    const response = await API.post("/auth/signup", payload);
    console.log("✅ Signup successful:", response.data);
    return response.data;
    
  } catch (error: any) {
    console.error("❌ Signup failed:", error.response?.data);
    throw error.response?.data || { 
      success: false,
      message: "Network error during signup" 
    };
  }
};

// ================== CHECK EMAIL ==================
export const checkEmailExists = async (email: string) => {
  try {
    const response = await API.post("/auth/check-email", { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Network error" };
  }
};

// ================== LOGOUT ==================
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("userData");
    await API.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// ================== REFRESH ==================
export const refreshToken = async () => {
  try {
    const response = await API.get("/auth/refresh");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Refresh token failed" };
  }
};

export default API;