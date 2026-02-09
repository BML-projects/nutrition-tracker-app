import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this with your actual backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API;

export interface MealData {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weight: number;
  mealType: string;
  imageUri: string;
  timestamp?: string;
}

export interface SavedMeal extends MealData {
  _id: string;
  user: string;
  timestamp: string;
}

class MealAPI {
  private cachedUserId: string | null = null;

  private async getAuthToken(): Promise<string | null> {
    try {
      // Try multiple possible key names
      let token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        token = await AsyncStorage.getItem('token');
      }
      
      if (!token) {
        token = await AsyncStorage.getItem('authToken');
      }
      
      if (!token) {
        token = await AsyncStorage.getItem('accessToken');
      }
      
      console.log('🔑 Token retrieved from AsyncStorage:', token ? 'EXISTS' : 'NOT FOUND');
      
      return token;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      return null;
    }
  }

  // Get userId by making a request to backend /me endpoint
  private async getUserIdFromBackend(): Promise<string | null> {
    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        console.log('👤 Cannot get user ID: No token found');
        return null;
      }

      console.log('👤 Fetching user info from backend...');
      
      const response = await axios.get(
        `${API_BASE_URL}/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('👤 Backend response:', response.data);
      
      // Try multiple possible locations for userId
      const userId = 
        response.data.userId || 
        response.data._id || 
        response.data.id ||
        response.data.user?.id ||
        response.data.user?._id ||
        response.data.data?.userId ||
        response.data.data?._id;
        
      console.log('👤 Extracted user ID:', userId);
      
      if (!userId) {
        console.error('❌ Could not find userId in response:', response.data);
        return null;
      }
      
      // Cache it for future use
      this.cachedUserId = userId;
      
      return userId;
    } catch (error: any) {
      console.error('❌ Error fetching user info from backend:', error.response?.data || error.message);
      return null;
    }
  }

  private async getUserId(): Promise<string | null> {
    try {
      // Return cached userId if available
      if (this.cachedUserId) {
        console.log('👤 Using cached user ID:', this.cachedUserId);
        return this.cachedUserId;
      }

      // Try to get from AsyncStorage first
      let userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        userId = await AsyncStorage.getItem('user_id');
      }
      
      if (!userId) {
        userId = await AsyncStorage.getItem('id');
      }
      
      // If not found in AsyncStorage, fetch from backend
      if (!userId) {
        console.log('👤 User ID not in AsyncStorage, fetching from backend...');
        userId = await this.getUserIdFromBackend();
      }
      
      console.log('👤 User ID retrieved:', userId ? 'EXISTS' : 'NOT FOUND');
      
      return userId;
    } catch (error) {
      console.error('❌ Error getting user ID:', error);
      return null;
    }
  }

  async saveMeal(mealData: MealData): Promise<SavedMeal> {
    try {
      console.log('📤 Starting to save meal...');
      console.log('📤 Meal data:', mealData);
      
      const token = await this.getAuthToken();

      if (!token) {
        console.error('❌ No token found in AsyncStorage');
        throw new Error('User not authenticated - No token found. Please log in again.');
      }

      console.log('🌐 API URL:', `${API_BASE_URL}/meals`);

      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add image if exists
      if (mealData.imageUri && mealData.imageUri.startsWith('file://')) {
        formData.append('image', {
          uri: mealData.imageUri,
          name: `meal_${Date.now()}.jpg`,
          type: 'image/jpeg',
        } as any);
      }

      // Add other meal data
      formData.append('foodName', mealData.foodName);
      formData.append('calories', mealData.calories.toString());
      formData.append('protein', mealData.protein.toString());
      formData.append('carbs', mealData.carbs.toString());
      formData.append('fat', mealData.fat.toString());
      formData.append('weight', mealData.weight.toString());
      formData.append('mealType', mealData.mealType);
      formData.append('timestamp', mealData.timestamp || new Date().toISOString());

      const response = await axios.post(
        `${API_BASE_URL}/meals`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ Meal saved successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error saving meal:', error.response?.data || error.message);
      
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', error.response.data);
      }
      
      throw error;
    }
  }

  async getMeals(): Promise<SavedMeal[]> {
    try {
      console.log("📥 Fetching meals...");

      const token = await this.getAuthToken();

      if (!token) {
        console.error("❌ No token found");
        throw new Error("User not authenticated - No token found");
      }

      console.log("🌐 API URL:", `${API_BASE_URL}/meals`);

      const response = await axios.get(`${API_BASE_URL}/meals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📥 Raw response:", response.data);

      // Make sure we always return an array
      const mealsArray =
        Array.isArray(response.data) ? response.data :
        Array.isArray(response.data.meals) ? response.data.meals :
        Array.isArray(response.data.data) ? response.data.data :
        [];

      console.log("✅ Fetched meals:", mealsArray.length, "meals");

      return mealsArray;
    } catch (error: any) {
      console.error("❌ Error fetching meals:", error.response?.data || error.message);
      return []; // Prevent crash
    }
  }

  async deleteMeal(mealId: string): Promise<void> {
    try {
      console.log('🗑️ Deleting meal:', mealId);
      
      const token = await this.getAuthToken();

      if (!token) {
        throw new Error('User not authenticated');
      }

      await axios.delete(
        `${API_BASE_URL}/meals/${mealId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('✅ Meal deleted successfully');
    } catch (error: any) {
      console.error('❌ Error deleting meal:', error.response?.data || error.message);
      throw error;
    }
  }

  async getMealById(mealId: string): Promise<SavedMeal> {
    try {
      console.log('📥 Fetching meal by ID:', mealId);
      
      const token = await this.getAuthToken();

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(
        `${API_BASE_URL}/meals/detail/${mealId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('✅ Fetched meal:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching meal details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Utility method to debug AsyncStorage
  async debugAsyncStorage(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('📦 All AsyncStorage keys:', allKeys);
      
      for (const key of allKeys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`📦 ${key}:`, value ? `${value.substring(0, 50)}...` : 'null');
      }
    } catch (error) {
      console.error('❌ Error debugging AsyncStorage:', error);
    }
  }
}

export default new MealAPI();