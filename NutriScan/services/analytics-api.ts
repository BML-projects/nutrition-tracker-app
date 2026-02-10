import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!API_URL) {
  throw new Error("❌ EXPO_PUBLIC_BACKEND_URL is missing in .env");
}

const API_BASE = `${API_URL}/api`;

// ==================== TYPES ====================
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==================== CACHE MANAGEMENT ====================
interface CacheItem {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheItem> = {};
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

const getCachedData = (key: string): any | null => {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 [Cache Hit] ${key}`);
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any): void => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
};

const clearCache = (): void => {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('🗑️ Cache cleared');
};

// ==================== HELPER FUNCTIONS ====================
const handleResponse = async (response: Response, endpoint: string) => {
  const contentType = response.headers.get("content-type");
  console.log(`📊 [${endpoint}] Status: ${response.status}, Content-Type:`, contentType);
  
  const text = await response.text();
  
  // Check for HTML response (server error or wrong endpoint)
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    console.error(`❌ [${endpoint}] Server returned HTML instead of JSON!`);
    if (response.status === 404) {
      throw new Error(`Endpoint not found (404): ${response.url}`);
    }
    throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
  }
  
  // Handle non-OK responses
  if (!response.ok) {
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      throw new Error(`HTTP ${response.status}: ${text || 'Unknown error'}`);
    }
    throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
  }
  
  // Parse JSON response
  try {
    return JSON.parse(text);
  } catch (parseError) {
    console.error(`❌ [${endpoint}] Failed to parse JSON:`, text.substring(0, 200));
    throw new Error(`Invalid JSON response from server`);
  }
};

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await AsyncStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const makeRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  return handleResponse(response, endpoint);
};

// ==================== API FUNCTIONS ====================

/**
 * Get weight logs for a specific time range
 * @param range - '7days' | '30days' | '90days'
 */
export const getWeightLogs = async (range: '7days' | '30days' | '90days' = '7days') => {
  try {
    console.log("📊 [getWeightLogs] Starting...", { range });
    
    // Check cache
    const cacheKey = `weight-logs-${range}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE}/weight-logs?range=${range}`;
    console.log("📊 [getWeightLogs] URL:", url);

    const data = await makeRequest(url, { method: "GET" });
    
    // Cache the response
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error: any) {
    console.error("📊 [getWeightLogs] Error:", error);
    throw new Error(error.message || "Failed to fetch weight logs");
  }
};

/**
 * Get calorie logs for a specific time range
 * @param range - '7days' | '30days' | '90days'
 */
export const getCalorieLogs = async (range: '7days' | '30days' | '90days' = '7days') => {
  try {
    console.log("📊 [getCalorieLogs] Starting...", { range });
    
    // Check cache
    const cacheKey = `calorie-logs-${range}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE}/calorie-logs?range=${range}`;
    console.log("📊 [getCalorieLogs] URL:", url);

    const data = await makeRequest(url, { method: "GET" });
    
    // Cache the response
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error: any) {
    console.error("📊 [getCalorieLogs] Error:", error);
    throw new Error(error.message || "Failed to fetch calorie logs");
  }
};

/**
 * Get weekly progress summary (last 7 days)
 */
export const getWeeklyProgress = async () => {
  try {
    console.log("📊 [getWeeklyProgress] Starting...");
    
    // Check cache
    const cacheKey = 'weekly-progress';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE}/progress/weekly`;
    console.log("📊 [getWeeklyProgress] URL:", url);

    const data = await makeRequest(url, { method: "GET" });
    
    // Cache the response
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error: any) {
    console.error("📊 [getWeeklyProgress] Error:", error);
    throw new Error(error.message || "Failed to fetch weekly progress");
  }
};

/**
 * Get streak data (current streak, longest streak, weekly goals met)
 */
export const getStreakData = async () => {
  try {
    console.log("📊 [getStreakData] Starting...");
    
    // Check cache
    const cacheKey = 'streak-data';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE}/progress/streak`;
    console.log("📊 [getStreakData] URL:", url);

    const data = await makeRequest(url, { method: "GET" });
    
    // Cache the response
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error: any) {
    console.error("📊 [getStreakData] Error:", error);
    throw new Error(error.message || "Failed to fetch streak data");
  }
};

/**
 * Get goal progress (target weight, current weight, progress percentage)
 */
export const getGoalProgress = async () => {
  try {
    console.log("📊 [getGoalProgress] Starting...");
    
    // Check cache
    const cacheKey = 'goal-progress';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE}/progress/goal`;
    console.log("📊 [getGoalProgress] URL:", url);

    const data = await makeRequest(url, { method: "GET" });
    
    // Cache the response
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error: any) {
    console.error("📊 [getGoalProgress] Error:", error);
    throw new Error(error.message || "Failed to fetch goal progress");
  }
};

/**
 * Get complete analytics summary (recommended for best performance)
 * This endpoint fetches all analytics data in a single optimized request
 */
export const getAnalyticsSummary = async () => {
  try {
    console.log("📊 [getAnalyticsSummary] Starting...");
    
    // Check cache
    const cacheKey = 'analytics-summary';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE}/analytics/summary`;
    console.log("📊 [getAnalyticsSummary] URL:", url);

    const data = await makeRequest(url, { method: "GET" });
    
    // Cache the response
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error: any) {
    console.error("📊 [getAnalyticsSummary] Error:", error);
    throw new Error(error.message || "Failed to fetch analytics summary");
  }
};

/**
 * Invalidate analytics cache
 * Call this after logging new weight or calories
 */
export const invalidateAnalyticsCache = () => {
  clearCache();
};

// Export cache utilities
export { clearCache, getCachedData, setCachedData };