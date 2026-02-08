import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("❌ EXPO_PUBLIC_BACKEND_URL is missing in .env");
}

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Attach token automatically
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============== PROFILE FUNCTIONS ==============
export const getProfile = async () => {
  try {
    const response = await API.get("/profile");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

export const updateActivityLevel = async (activityLevel: string) => {
  try {
    const response = await API.patch("/profile/activity-level", { activityLevel });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to update activity level" };
  }
};

export const updateGoal = async (goal: string) => {
  try {
    const response = await API.patch("/profile/goal", { goal });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to update goal" };
  }
};

export default API;
