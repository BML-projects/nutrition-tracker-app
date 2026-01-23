import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get the correct backend URL
const BACKEND_URL = "http://192.168.182.42:4000/api";// Use your actual IP

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


// New forgot password functions
export const forgotPassword = async (email: string) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error(error.message || "Network error");
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await API.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error(error.message || "Network error");
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const response = await API.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error(error.message || "Network error");
  }
};




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
// services/auth-api.ts
export const signup = async (
  email: string,
  password: string,
  name: string,
  gender: string,
  height: number,
  weight: number,
  dob: string,
  goal: string
) => {
  try {
    console.log('📝 Signup API call:', {
      email,
      gender,
      height,
      weight,
      dob,
      goal
    });

    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        email,
        password,
        gender,
        height,
        weight,
        dob: new Date(dob).toISOString(), // Ensure proper date format
        goal
      }),
    });

    console.log('📝 Signup response status:', response.status);

    const text = await response.text();
    console.log('📝 Signup response text:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('📝 Failed to parse JSON:', e);
      throw new Error('Invalid server response');
    }

    if (!response.ok) {
      console.error('📝 Signup error response:', data);
      throw new Error(data.message || data.error || 'Signup failed');
    }

    console.log('📝 Signup successful:', data);
    return data;
  } catch (error) {
    console.error('📝 Signup API error:', error);
    throw error;
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