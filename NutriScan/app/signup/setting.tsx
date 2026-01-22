import { logout } from "@/services/auth-api";
import { getProfile, updateGoal } from "@/services/profile-api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { styles } from "../../src/styles/setting";

/* ================= INTERFACES ================= */
interface GoalCalories {
  lose: number;
  maintain: number;
  gain: number;
}

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  height: number;
  weight: number;
  dob: string;
  goal: string;
  bmi: number;
  bmr: number;
  dailyCalories: number;
  activityLevel?: string;
}

interface ProfileResponse {
  success: boolean;
  user: UserProfile;
  goalCalories?: GoalCalories;
}

export default function SettingsScreen() {
  const router = useRouter();

  // State for user data
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [goalCalories, setGoalCalories] = useState<GoalCalories | null>(null);
  
  // UI state
  const [showGoalOptions, setShowGoalOptions] = useState(false);
  const [showActivityOptions, setShowActivityOptions] = useState(false);
  const [activityLevel, setActivityLevel] = useState('moderate');

  // Activity level options
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
    { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Very hard exercise & physical job' }
  ];

  // Calculate age from DOB
  const calculateAge = useCallback((dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  // Activity level change handler (frontend-only for now)
  const handleActivityLevelChange = async (level: string) => {
    try {
      // For now, just update locally
      setActivityLevel(level);
      
      // Calculate local calorie estimate
      if (user) {
        const multipliers: Record<string, number> = {
          'sedentary': 1.2,
          'light': 1.375,
          'moderate': 1.55,
          'active': 1.725,
          'very_active': 1.9
        };
        
        const adjustments: Record<string, number> = {
          'lose': -500,
          'maintain': 0,
          'gain': 500
        };
        
        const maintenance = user.bmr * (multipliers[level] || 1.55);
        const newCalories = Math.round(maintenance + (adjustments[user.goal] || 0));
        
        // Update local display
        setUser({
          ...user,
          dailyCalories: newCalories,
          activityLevel: level
        });
        
        // Update goal calories locally
        const loseCalories = Math.round(maintenance - 500);
        const gainCalories = Math.round(maintenance + 500);
        
        setGoalCalories({
          lose: loseCalories,
          maintain: Math.round(maintenance),
          gain: gainCalories
        });
        
        Alert.alert(
          'Activity Level Changed',
          `Your estimated daily calories: ${newCalories.toLocaleString()}\n\n` +
          `Note: This is a local estimate. Update will be saved when backend supports activity level.`
        );
      }
    } catch (error: any) {
      console.error('Failed to update activity level:', error);
      Alert.alert('Error', 'Failed to update activity level');
    }
  };

  // Check token on mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('🔍 SettingsScreen - Token exists:', !!token);
      } catch (error) {
        console.error('🔍 SettingsScreen - Token check error:', error);
      }
    };
    
    checkToken();
  }, []);

  // Fetch user profile function
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching user profile...');
      
      const response: ProfileResponse = await getProfile();
      console.log('🔄 Profile response:', response);
      
      if (response.success && response.user) {
        const userData = response.user;
        console.log('🔄 User data received:', userData);
        setUser(userData);
        
        // Set activity level
        if (userData.activityLevel) {
          setActivityLevel(userData.activityLevel);
        }
        
        // Store goal calories if provided
        if (response.goalCalories) {
          setGoalCalories(response.goalCalories);
        }
      } else {
        console.error('🔄 Invalid response format:', response);
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      
      let errorMessage = 'Failed to load profile data';
      if (error.message.includes('Session expired') || error.message.includes('No authentication')) {
        errorMessage = 'Session expired. Please login again.';
        await AsyncStorage.multiRemove(['accessToken', 'userData']);
        router.replace('/login');
      } else if (error.message.includes('404')) {
        errorMessage = 'Profile endpoint not found. Please check backend.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Unauthorized. Please login again.';
        await AsyncStorage.removeItem('accessToken');
        router.replace('/login');
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle goal change with calorie recalculation
  const handleGoalChange = async (newGoal: string) => {
    try {
      console.log('🎯 Changing goal to:', newGoal);
      const response = await updateGoal(newGoal);
      
      if (response.success) {
        // Update user state with new values
        if (user) {
          setUser({
            ...user,
            goal: newGoal,
            bmr: response.bmr || user.bmr,
            dailyCalories: response.dailyCalories || user.dailyCalories
          });
        }
        
        // Update goal calories if provided
        if (response.goalCalories) {
          setGoalCalories(response.goalCalories);
        }
        
        // Show detailed alert with explanation
        Alert.alert(
          'Goal Updated Successfully!',
          `${response.explanation}\n\n` +
          `Daily Calories: ${response.dailyCalories?.toLocaleString()}\n` +
          `BMI: ${response.bmi?.toFixed(1)}\n` +
          `BMR: ${response.bmr?.toFixed(0)}`
        );
      }
    } catch (error: any) {
      console.error('Failed to update goal:', error);
      Alert.alert('Error', error.message || 'Failed to update goal');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              await logout();
              await AsyncStorage.multiRemove(['accessToken', 'userData']);
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              await AsyncStorage.multiRemove(['accessToken', 'userData']);
              router.replace('/login');
            }
          }
        }
      ]
    );
  };

 

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#D37034" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#D37034']}
            tintColor="#D37034"
          />
        }
      >
        {/* ================= HEADER ================= */}
        <Text style={styles.title}>Settings</Text>

    

        {/* ================= PERSONAL INFO ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionBadge}>Personal Information</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personalization Settings</Text>
            <Text style={styles.cardSub}>
              Update your fitness goals and view your metrics
            </Text>

            {/* Goal Row */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => setShowGoalOptions(!showGoalOptions)}
            >
              <Text style={styles.rowLabel}>Fitness Goal</Text>

              <View style={styles.rowRight}>
                <Text style={styles.valueText}>
                  {user?.goal === 'lose' ? 'Lose Weight' : 
                   user?.goal === 'gain' ? 'Gain Weight' : 
                   user?.goal === 'maintain' ? 'Maintain Weight' : 
                   'Set Goal'}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#666" />
              </View>
            </TouchableOpacity>

            {showGoalOptions && (
              <View style={styles.optionBox}>
                {[
                  {value: 'lose', label: 'Lose Weight'},
                  {value: 'maintain', label: 'Maintain Weight'},
                  {value: 'gain', label: 'Gain Weight'}
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.optionRow}
                    onPress={() => {
                      handleGoalChange(item.value);
                      setShowGoalOptions(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Activity Level Row */}
            <TouchableOpacity
              style={[styles.row, { marginTop: 10 }]}
              onPress={() => setShowActivityOptions(!showActivityOptions)}
            >
              <Text style={styles.rowLabel}>Activity Level</Text>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>
                  {activityLevels.find(a => a.value === activityLevel)?.label || 'Moderate'}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#666" />
              </View>
            </TouchableOpacity>

            {showActivityOptions && (
              <View style={styles.optionBox}>
                {activityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={styles.optionRow}
                    onPress={() => {
                      handleActivityLevelChange(level.value);
                      setShowActivityOptions(false);
                    }}
                  >
                    <View>
                      <Text style={styles.optionText}>{level.label}</Text>
                      <Text style={{ fontSize: 11, color: '#666' }}>
                        {level.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Goal Comparison Section */}
            {goalCalories && (
              <View style={styles.goalComparisonContainer}>
                <Text style={styles.goalComparisonTitle}>Daily Calories by Goal</Text>
                
                <View style={styles.goalComparisonRow}>
                  <View style={[
                    styles.goalComparisonItem, 
                    user?.goal === 'lose' && styles.goalComparisonItemActive
                  ]}>
                    <Text style={styles.goalComparisonLabel}>Lose Weight</Text>
                    <Text style={styles.goalComparisonCalories}>
                      {goalCalories.lose.toLocaleString()} cal
                    </Text>
                    <Text style={styles.goalComparisonDescription}>
                      Calorie deficit
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.goalComparisonItem,
                    user?.goal === 'maintain' && styles.goalComparisonItemActive
                  ]}>
                    <Text style={styles.goalComparisonLabel}>Maintain</Text>
                    <Text style={styles.goalComparisonCalories}>
                      {goalCalories.maintain.toLocaleString()} cal
                    </Text>
                    <Text style={styles.goalComparisonDescription}>
                      Maintenance
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.goalComparisonItem,
                    user?.goal === 'gain' && styles.goalComparisonItemActive
                  ]}>
                    <Text style={styles.goalComparisonLabel}>Gain Weight</Text>
                    <Text style={styles.goalComparisonCalories}>
                      {goalCalories.gain.toLocaleString()} cal
                    </Text>
                    <Text style={styles.goalComparisonDescription}>
                      Calorie surplus
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.goalComparisonNote}>
                  Your current goal: {user?.goal === 'lose' ? 'Lose Weight' : 
                                   user?.goal === 'gain' ? 'Gain Weight' : 
                                   'Maintain Weight'}
                </Text>
              </View>
            )}

            {/* User Details Section */}
            <View style={styles.userDetailsSection}>
              <Text style={styles.detailsTitle}>Your Details</Text>
              
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{user?.fullName || 'Not set'}</Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{user?.email || 'Not set'}</Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Gender:</Text>
                <Text style={styles.detailValue}>
                  {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set'}
                </Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Age:</Text>
                <Text style={styles.detailValue}>
                  {user?.dob ? `${calculateAge(user.dob)} years` : 'Not set'}
                </Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Height:</Text>
                <Text style={styles.detailValue}>
                  {user?.height ? `${user.height} cm` : 'Not set'}
                </Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Weight:</Text>
                <Text style={styles.detailValue}>
                  {user?.weight ? `${user.weight} kg` : 'Not set'}
                </Text>
              </View>
            </View>

            {/* Health Metrics Section */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>BMI</Text>
                <Text style={styles.metricValue}>{user?.bmi?.toFixed(1) || '--'}</Text>
                <Text style={styles.metricSubtitle}>Body Mass Index</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>BMR</Text>
                <Text style={styles.metricValue}>{user?.bmr?.toFixed(0) || '--'}</Text>
                <Text style={styles.metricSubtitle}>Basal Metabolic Rate</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Daily Calories</Text>
                <Text style={styles.metricValue}>{user?.dailyCalories?.toLocaleString() || '--'}</Text>
                <Text style={styles.metricSubtitle}>Recommended Intake</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================= PROFILE ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionBadge}>Profile</Text>

          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>

            <Text style={styles.username}>{user?.fullName || 'User'}</Text>
            <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
            
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => Alert.alert('Info', 'Profile edit feature coming soon!')}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Progress tracking feature coming soon!')}
          >
            <Ionicons name="stats-chart-outline" size={20} />
            <Text style={styles.menuText}>My Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Notifications settings coming soon!')}
          >
            <Ionicons name="notifications-outline" size={20} />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.menuText, { color: '#FF3B30' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ================= BOTTOM NAV ================= */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.push("./home")}>
          <Ionicons name="home-outline" size={24} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup/scan")}>
          <Ionicons name="camera-outline" size={24} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup/analytics")}>
          <Ionicons name="bar-chart-outline" size={24} color="#aaa" />
        </TouchableOpacity>

        <View style={styles.navActive}>
          <Ionicons name="settings" size={22} color="#000" />
        </View>
      </View>
    </View>
  );
}