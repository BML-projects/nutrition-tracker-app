import { logout } from "@/services/auth-api";
import { getProfile, updateGoal, updateProfile } from "@/services/profile-api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Animated
} from "react-native";
import EditProfileModal from "./editprofilemodal";
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
  profilePhoto?: string;
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

  // Edit profile modal state
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));

  // Activity level options
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise', icon: 'bed-outline' },
    { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week', icon: 'walk-outline' },
    { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week', icon: 'bicycle-outline' },
    { value: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week', icon: 'fitness-outline' },
    { value: 'very_active', label: 'Very Active', description: 'Very hard exercise & physical job', icon: 'barbell-outline' }
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

  // Get BMI category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3b82f6' };
    if (bmi < 25) return { category: 'Normal', color: '#10b981' };
    if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' };
    return { category: 'Obese', color: '#ef4444' };
  };

  // Activity level change handler
  const handleActivityLevelChange = async (level: string) => {
    try {
      setActivityLevel(level);
      
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
        
        setUser({
          ...user,
          dailyCalories: newCalories,
          activityLevel: level
        });
        
        const loseCalories = Math.round(maintenance - 500);
        const gainCalories = Math.round(maintenance + 500);
        
        setGoalCalories({
          lose: loseCalories,
          maintain: Math.round(maintenance),
          gain: gainCalories
        });
        
        Alert.alert(
          '✓ Activity Level Updated',
          `Your estimated daily calories: ${newCalories.toLocaleString()}\n\n` +
          `Note: This is a local estimate. Update will be saved when backend supports activity level.`
        );
      }
    } catch (error: any) {
      console.error('Failed to update activity level:', error);
      Alert.alert('Error', 'Failed to update activity level');
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (profileData: any) => {
    try {
      const response = await updateProfile(profileData);
      
      if (response.success) {
        Alert.alert("✓ Success", "Profile updated successfully!");
        await fetchUserProfile();
      }
    } catch (error: any) {
      throw error;
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
        
        if (userData.activityLevel) {
          setActivityLevel(userData.activityLevel);
        }
        
        if (response.goalCalories) {
          setGoalCalories(response.goalCalories);
        }

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
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
  }, [router, fadeAnim]);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle goal change
  const handleGoalChange = async (newGoal: string) => {
    try {
      console.log('🎯 Changing goal to:', newGoal);
      const response = await updateGoal(newGoal);
      
      if (response.success) {
        if (user) {
          setUser({
            ...user,
            goal: newGoal,
            bmr: response.bmr || user.bmr,
            dailyCalories: response.dailyCalories || user.dailyCalories
          });
        }
        
        if (response.goalCalories) {
          setGoalCalories(response.goalCalories);
        }
        
        Alert.alert(
          '✓ Goal Updated Successfully!',
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

  // Handle logout
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
      <View style={[styles.screen, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#D37034" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  const bmiInfo = user?.bmi ? getBMICategory(user.bmi) : null;

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
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your fitness journey</Text>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ================= PROFILE HERO CARD ================= */}
          <View style={styles.profileHeroCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarContainer}>
  {user?.profilePhoto ? (
    <Image
      source={{ uri: user.profilePhoto }}
      style={styles.avatarImage}
      resizeMode="cover"
    />
  ) : (
    <View style={styles.avatarGradient}>
      <Ionicons name="person" size={50} color="#fff" />
    </View>
  )}

  <View style={styles.avatarBadge}>
    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
  </View>
</View>

              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
            </View>

            <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => setEditModalVisible(true)}
            >
              <Ionicons name="create-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* ================= HEALTH METRICS CARDS ================= */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="speedometer-outline" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.metricValue}>{user?.bmi?.toFixed(1) || '--'}</Text>
              <Text style={styles.metricLabel}>BMI</Text>
              {bmiInfo && (
                <View style={[styles.metricBadge, { backgroundColor: bmiInfo.color + '20' }]}>
                  <Text style={[styles.metricBadgeText, { color: bmiInfo.color }]}>
                    {bmiInfo.category}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="flame-outline" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.metricValue}>{user?.bmr?.toFixed(0) || '--'}</Text>
              <Text style={styles.metricLabel}>BMR</Text>
              <Text style={styles.metricSubtext}>cal/day</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#d1fae5' }]}>
                <Ionicons name="nutrition-outline" size={24} color="#10b981" />
              </View>
              <Text style={styles.metricValue}>{user?.dailyCalories?.toLocaleString() || '--'}</Text>
              <Text style={styles.metricLabel}>Daily Goal</Text>
              <Text style={styles.metricSubtext}>calories</Text>
            </View>
          </View>

          {/* ================= FITNESS GOALS SECTION ================= */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy-outline" size={22} color="#D37034" />
              <Text style={styles.sectionTitle}>Fitness Goals</Text>
            </View>

            <View style={styles.card}>
              <TouchableOpacity
                style={styles.goalSelector}
                onPress={() => setShowGoalOptions(!showGoalOptions)}
              >
                <View style={styles.goalSelectorLeft}>
                  <View style={styles.goalIconContainer}>
                    <Ionicons 
                      name={user?.goal === 'lose' ? 'trending-down' : 
                            user?.goal === 'gain' ? 'trending-up' : 'remove'} 
                      size={22} 
                      color="#D37034" 
                    />
                  </View>
                  <View>
                    <Text style={styles.goalSelectorLabel}>Current Goal</Text>
                    <Text style={styles.goalSelectorValue}>
                      {user?.goal === 'lose' ? 'Lose Weight' : 
                       user?.goal === 'gain' ? 'Gain Weight' : 
                       user?.goal === 'maintain' ? 'Maintain Weight' : 
                       'Set Goal'}
                    </Text>
                  </View>
                </View>
                <Ionicons 
                  name={showGoalOptions ? "chevron-up" : "chevron-down"} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>

              {showGoalOptions && (
                <View style={styles.optionsContainer}>
                  {[
                    {value: 'lose', label: 'Lose Weight', icon: 'trending-down', color: '#3b82f6'},
                    {value: 'maintain', label: 'Maintain Weight', icon: 'remove', color: '#10b981'},
                    {value: 'gain', label: 'Gain Weight', icon: 'trending-up', color: '#f59e0b'}
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.optionItem,
                        user?.goal === item.value && styles.optionItemActive
                      ]}
                      onPress={() => {
                        handleGoalChange(item.value);
                        setShowGoalOptions(false);
                      }}
                    >
                      <View style={[styles.optionIconContainer, { backgroundColor: item.color + '20' }]}>
                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                      </View>
                      <Text style={styles.optionText}>{item.label}</Text>
                      {user?.goal === item.value && (
                        <Ionicons name="checkmark-circle" size={22} color="#10b981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {goalCalories && (
                <View style={styles.caloriesComparison}>
                  <Text style={styles.caloriesComparisonTitle}>Daily Calories by Goal</Text>
                  
                  <View style={styles.caloriesRow}>
                    {[
                      { key: 'lose', label: 'Lose', value: goalCalories.lose, icon: 'trending-down', color: '#3b82f6' },
                      { key: 'maintain', label: 'Maintain', value: goalCalories.maintain, icon: 'remove', color: '#10b981' },
                      { key: 'gain', label: 'Gain', value: goalCalories.gain, icon: 'trending-up', color: '#f59e0b' }
                    ].map((item) => (
                      <View 
                        key={item.key}
                        style={[
                          styles.caloriesItem,
                          user?.goal === item.key && styles.caloriesItemActive
                        ]}
                      >
                        <Ionicons name={item.icon as any} size={18} color={item.color} />
                        <Text style={styles.caloriesLabel}>{item.label}</Text>
                        <Text style={styles.caloriesValue}>{item.value.toLocaleString()}</Text>
                        <Text style={styles.caloriesUnit}>cal</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* ================= ACTIVITY LEVEL SECTION ================= */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="fitness-outline" size={22} color="#D37034" />
              <Text style={styles.sectionTitle}>Activity Level</Text>
            </View>

            <View style={styles.card}>
              <TouchableOpacity
                style={styles.goalSelector}
                onPress={() => setShowActivityOptions(!showActivityOptions)}
              >
                <View style={styles.goalSelectorLeft}>
                  <View style={styles.goalIconContainer}>
                    <Ionicons 
                      name={activityLevels.find(a => a.value === activityLevel)?.icon as any || 'bicycle-outline'} 
                      size={22} 
                      color="#D37034" 
                    />
                  </View>
                  <View>
                    <Text style={styles.goalSelectorLabel}>Your Activity</Text>
                    <Text style={styles.goalSelectorValue}>
                      {activityLevels.find(a => a.value === activityLevel)?.label || 'Moderate'}
                    </Text>
                  </View>
                </View>
                <Ionicons 
                  name={showActivityOptions ? "chevron-up" : "chevron-down"} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>

              {showActivityOptions && (
                <View style={styles.optionsContainer}>
                  {activityLevels.map((level) => (
                    <TouchableOpacity
                      key={level.value}
                      style={[
                        styles.activityOption,
                        activityLevel === level.value && styles.optionItemActive
                      ]}
                      onPress={() => {
                        handleActivityLevelChange(level.value);
                        setShowActivityOptions(false);
                      }}
                    >
                      <View style={styles.activityOptionLeft}>
                        <Ionicons name={level.icon as any} size={24} color="#D37034" />
                        <View style={{ marginLeft: 12 }}>
                          <Text style={styles.activityOptionLabel}>{level.label}</Text>
                          <Text style={styles.activityOptionDesc}>{level.description}</Text>
                        </View>
                      </View>
                      {activityLevel === level.value && (
                        <Ionicons name="checkmark-circle" size={22} color="#10b981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* ================= PERSONAL INFO SECTION ================= */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={22} color="#D37034" />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            <View style={styles.card}>
              {[
                { icon: 'person-outline', label: 'Full Name', value: user?.fullName || 'Not set' },
                { icon: 'mail-outline', label: 'Email', value: user?.email || 'Not set' },
                { icon: 'male-female-outline', label: 'Gender', value: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set' },
                { icon: 'calendar-outline', label: 'Age', value: user?.dob ? `${calculateAge(user.dob)} years` : 'Not set' },
                { icon: 'resize-outline', label: 'Height', value: user?.height ? `${user.height} cm` : 'Not set' },
                { icon: 'scale-outline', label: 'Weight', value: user?.weight ? `${user.weight} kg` : 'Not set' }
              ].map((item, index) => (
                <View key={index} style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <View style={styles.infoIconContainer}>
                      <Ionicons name={item.icon as any} size={20} color="#D37034" />
                    </View>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ================= QUICK ACTIONS ================= */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="grid-outline" size={22} color="#D37034" />
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Alert.alert('Coming Soon', 'Progress tracking feature coming soon!')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="stats-chart" size={24} color="#3b82f6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>My Progress</Text>
                <Text style={styles.actionSubtitle}>Track your fitness journey</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Alert.alert('Coming Soon', 'Notifications settings coming soon!')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="notifications" size={24} color="#f59e0b" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Notifications</Text>
                <Text style={styles.actionSubtitle}>Manage your alerts</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.logoutCard]}
              onPress={handleLogout}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="log-out" size={24} color="#ef4444" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: '#ef4444' }]}>Logout</Text>
                <Text style={styles.actionSubtitle}>Sign out of your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 20 }} />
        </Animated.View>
      </ScrollView>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {user && (
        <EditProfileModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          userData={user}
          onSave={handleProfileUpdate}
        />
      )}

      {/* ================= BOTTOM NAV ================= */}
      <View style={styles.nav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push("./home")}
        >
          <Ionicons name="home-outline" size={26} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push("/signup/scan")}
        >
          <Ionicons name="camera-outline" size={26} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push("/signup/analytics")}
        >
          <Ionicons name="bar-chart-outline" size={26} color="#aaa" />
        </TouchableOpacity>

        <View style={styles.navActive}>
          <Ionicons name="settings" size={24} color="#fff" />
        </View>
      </View>
    </View>
  );
}