import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!API_URL) {
  throw new Error("❌ EXPO_PUBLIC_BACKEND_URL is missing in .env");
}

const API_BASE = `${API_URL}/api`;

// Helper function to handle responses
const handleResponse = async (response: Response, endpoint: string) => {
  const contentType = response.headers.get("content-type");
  console.log(`📱 [${endpoint}] Content-Type:`, contentType);
  
  const text = await response.text();
  console.log(`📱 [${endpoint}] Response body:`, text.substring(0, 200));
  
  // Check if response is HTML (common with 404 errors)
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    console.error(`❌ [${endpoint}] Server returned HTML instead of JSON!`);
    console.error(`❌ This usually means the endpoint doesn't exist or the URL is wrong`);
    console.error(`❌ Requested URL: ${response.url}`);
    
    if (response.status === 404) {
      throw new Error(`Endpoint not found (404): ${response.url}. Please check if your backend has this route.`);
    }
    throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
  }
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
  }
  
  try {
    return JSON.parse(text);
  } catch (parseError) {
    console.error(`❌ [${endpoint}] Failed to parse JSON:`, text);
    throw new Error(`Invalid JSON response from server`);
  }
};

// ================== GET PROFILE ==================
export const getProfile = async () => {
  try {
    console.log("📱 [getProfile] Starting...");
    console.log("📱 [getProfile] API_BASE:", API_BASE);

    const token = await AsyncStorage.getItem("accessToken");
    console.log("📱 [getProfile] Token:", token ? `${token.substring(0, 20)}...` : "Missing");

    if (!token) {
      throw new Error("No token found in storage");
    }

    const profileUrl = `${API_BASE}/profile`;
    console.log("📱 [getProfile] Full URL:", profileUrl);

    const response = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📱 [getProfile] Response status:", response.status);
    console.log("📱 [getProfile] Response URL:", response.url);

    return await handleResponse(response, 'getProfile');
  } catch (error: any) {
    console.error("📱 [getProfile] Error:", error.message);
    throw error;
  }
};

// ================== UPDATE PROFILE ==================
export const updateProfile = async (profileData: any) => {
  try {
    console.log("✏️ [updateProfile] Starting...");
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = `${API_BASE}/profile`;
    console.log("✏️ [updateProfile] URL:", url);
    console.log("✏️ [updateProfile] Data:", profileData);

    // Always use JSON for profile updates (handle photo separately if needed)
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: profileData.fullName,
        gender: profileData.gender,
        height: profileData.height,
        weight: profileData.weight,
        dob: profileData.dob,
      }),
    });

    console.log("✏️ [updateProfile] Status:", response.status);
    const result = await handleResponse(response, 'updateProfile');

    // If there's a profile photo, upload it separately
    if (profileData.profilePhoto) {
      await uploadProfilePhoto(profileData.profilePhoto);
    }

    return result;
  } catch (error) {
    console.error("✏️ [updateProfile] Error:", error);
    throw error;
  }
};

// ================== UPLOAD PROFILE PHOTO ==================
export const uploadProfilePhoto = async (photo: any) => {
  try {
    console.log("📸 [uploadProfilePhoto] Starting...");
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

const formData = new FormData();

formData.append('photo', {
  uri: photo.uri,
  name: photo.fileName ?? 'profile.jpg',
  type: photo.type ?? 'image/jpeg',
} as any);


    const url = `${API_BASE}/profile/upload-photo`;
    console.log("📸 [uploadProfilePhoto] URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });

    console.log("📸 [uploadProfilePhoto] Status:", response.status);
    return await handleResponse(response, 'uploadProfilePhoto');
  } catch (error) {
    console.error("📸 [uploadProfilePhoto] Error:", error);
    throw error;
  }
};

// ================== CHANGE PASSWORD ==================
export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    console.log("🔐 [changePassword] Starting...");
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = `${API_BASE}/profile/change-password`;
    console.log("🔐 [changePassword] URL:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });

    console.log("🔐 [changePassword] Status:", response.status);
    return await handleResponse(response, 'changePassword');
  } catch (error) {
    console.error("🔐 [changePassword] Error:", error);
    throw error;
  }
};

// ================== UPDATE ACTIVITY ==================
export const updateActivityLevel = async (activityLevel: string) => {
  try {
    console.log("🏃 [updateActivityLevel] Starting...");
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = `${API_BASE}/profile/activity-level`;
    console.log("🏃 [updateActivityLevel] URL:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activityLevel }),
    });

    console.log("🏃 [updateActivityLevel] Status:", response.status);
    return await handleResponse(response, 'updateActivityLevel');
  } catch (error) {
    console.error("🏃 [updateActivityLevel] Error:", error);
    throw error;
  }
};

// ================== UPDATE GOAL ==================
export const updateGoal = async (goal: string) => {
  try {
    console.log("🎯 [updateGoal] Starting...");
    console.log("🎯 [updateGoal] Goal:", goal);

    const token = await AsyncStorage.getItem("accessToken");
    console.log("🎯 [updateGoal] Token:", token ? "Exists" : "Missing");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = `${API_BASE}/profile/goal`;
    console.log("🎯 [updateGoal] URL:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ goal }),
    });

    console.log("🎯 [updateGoal] Response status:", response.status);
    return await handleResponse(response, 'updateGoal');
  } catch (error) {
    console.error("🎯 [updateGoal] Error:", error);
    throw error;
  }
};

// ================== UPDATE TARGET WEIGHT ==================
export const updateTargetWeight = async (targetWeightData: {
  targetWeight: number;
  timeline: 'fast' | 'moderate' | 'slow';
}) => {
  try {
    console.log("🎯 [updateTargetWeight] Starting...");
    console.log("🎯 [updateTargetWeight] Data:", targetWeightData);

    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = `${API_BASE}/profile/target-weight`;
    console.log("🎯 [updateTargetWeight] URL:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        targetWeight: targetWeightData.targetWeight,
        timeline: targetWeightData.timeline,
      }),
    });

    console.log("🎯 [updateTargetWeight] Response status:", response.status);
    return await handleResponse(response, 'updateTargetWeight');
  } catch (error) {
    console.error("🎯 [updateTargetWeight] Error:", error);
    throw error;
  }
};