import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!API_URL) {
  throw new Error("❌ EXPO_PUBLIC_BACKEND_URL is missing in .env");
}

const API_BASE = `${API_URL}/api`;

// ================== GET PROFILE ==================
export const getProfile = async () => {
  try {
    console.log("📱 [getProfile] Starting...");

    const token = await AsyncStorage.getItem("accessToken");
    console.log("📱 [getProfile] Token:", token ? "Exists" : "Missing");

    if (!token) {
      throw new Error("No token found in storage");
    }

    const profileUrl = `${API_BASE}/profile`;
    console.log("📱 [getProfile] Calling:", profileUrl);

    const response = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📱 [getProfile] Response status:", response.status);

    const text = await response.text();
    console.log("📱 [getProfile] Response text:", text);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("📱 [getProfile] Error:", error.message);
    throw error;
  }
};

// ================== UPDATE ACTIVITY ==================
export const updateActivityLevel = async (activityLevel: string) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE}/profile/activity-level`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activityLevel }),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Update activity level error:", error);
    throw error;
  }
};

// ================== UPDATE GOAL ==================
export const updateGoal = async (goal: string) => {
  try {
    console.log("🎯 [updateGoal] Starting...");

    const token = await AsyncStorage.getItem("accessToken");
    console.log("🎯 [updateGoal] Token:", token ? "Exists" : "Missing");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE}/profile/goal`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ goal }),
    });

    console.log("🎯 [updateGoal] Response status:", response.status);

    const text = await response.text();
    console.log("🎯 [updateGoal] Response text:", text);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("🎯 [updateGoal] Error:", error);
    throw error;
  }
};
