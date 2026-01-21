import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://192.168.1.72:3000';
const API_URL = "http://192.168.1.77:4000";

console.log('🌐 Profile API URL set to:', API_URL);

export const getProfile = async () => {
  try {
    console.log('📱 [getProfile] Starting...');
    
    const token = await AsyncStorage.getItem('accessToken');
    console.log('📱 [getProfile] Token:', token ? 'Exists' : 'Missing');
    
    if (!token) {
      throw new Error('No token found in storage');
    }
    
    const profileUrl = `${API_URL}/api/profile`;
    console.log('📱 [getProfile] Calling:', profileUrl);
    
    const response = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📱 [getProfile] Response status:', response.status);
    
    const text = await response.text();
    console.log('📱 [getProfile] Response text:', text);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    const data = JSON.parse(text);
    console.log('📱 [getProfile] Success!');
    return data;
    
  } catch (error: any) {
    console.error('📱 [getProfile] Error:', error.message);
    throw error;
  }
};



export const updateActivityLevel = async (activityLevel: string) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/profile/activity-level`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ activityLevel }),
    });

    if (!response.ok) {
      throw new Error('Failed to update activity level');
    }

    return await response.json();
  } catch (error) {
    console.error('Update activity level error:', error);
    throw error;
  }
};




export const updateGoal = async (goal: string) => {
  try {
    console.log('🎯 [updateGoal] Starting...');
    
    const token = await AsyncStorage.getItem('accessToken');
    console.log('🎯 [updateGoal] Token:', token ? 'Exists' : 'Missing');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('🎯 [updateGoal] Updating goal to:', goal);
    
    const response = await fetch(`${API_URL}/api/profile/goal`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ goal }),
    });

    console.log('🎯 [updateGoal] Response status:', response.status);
    
    const text = await response.text();
    console.log('🎯 [updateGoal] Response text:', text);
    
    if (!response.ok) {
      throw new Error(`Failed to update goal: ${text}`);
    }

    const data = JSON.parse(text);
    console.log('🎯 [updateGoal] Success:', data);
    return data;
    
  } catch (error) {
    console.error('🎯 [updateGoal] Error:', error);
    throw error;
  }
};