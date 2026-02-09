import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../../src/styles/home";
import { Images } from "../../src/constants/images";
import dashboardAPI, { DashboardData } from "../../services/dashboard-api";
import BottomNav from "./ButtomNav";

const MEAL_TYPE_COLORS: { [key: string]: string } = {
  breakfast: "#FF9800",
  lunch: "#4CAF50",
  dinner: "#673AB7",
  snack: "#FF5722",
  dessert: "#E91E63",
};

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const dashboardData = await dashboardAPI.getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Refresh dashboard
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  // Load data on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  // Image picker
  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Gallery access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      router.push({
        pathname: "./fooddetails",
        params: { imageUri },
      });
    }
  };

  // Navigate to meal details
  const viewMealDetails = (mealId: string, imageUri: string, foodName: string) => {
    router.push({
      pathname: "./fooddetails",
      params: {
        imageUri,
        foodName,
        mealId,
        isViewMode: "true",
      },
    });
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.loadingText}>Failed to load dashboard</Text>
      </View>
    );
  }

  const { weekData, todayNutrition, recentMeals, weeklyStats, userInfo } = data;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <Image 
                source={Images.logo} 
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.greetingSection}>
                <Text style={styles.greetingText}>{getGreeting()},</Text>
                <Text style={styles.userName}>{userInfo.fullName}</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => router.push("./setting")}
              >
                {userInfo.profilePhoto ? (
                  <Image 
                    source={{ uri: userInfo.profilePhoto }} 
                    style={styles.profileImage} 
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Ionicons name="person" size={20} color="#666" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={22} color="#666" />
                {recentMeals.length > 0 && <View style={styles.notificationBadge} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="flame" size={20} color="#FF6B35" style={styles.statIcon} />
              <Text style={styles.statValue}>{weeklyStats.avgCalories}</Text>
              <Text style={styles.statLabel}>Avg/Day</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="restaurant" size={20} color="#FF9800" style={styles.statIcon} />
              <Text style={styles.statValue}>{weeklyStats.totalMeals}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="trophy" size={20} color="#FFD700" style={styles.statIcon} />
              <Text style={styles.statValue}>{weeklyStats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.calendarSection}>
          <Text style={styles.calendarTitle}>This Week</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View style={styles.calendarRow}>
              {weekData.map((day, index) => (
                <TouchableOpacity
                  key={day.dateNum + day.dayName + index}
                  style={[
                    styles.dayItem,
                    day.isToday && styles.dayItemActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.progressRing,
                      day.isToday && styles.progressRingActive,
                      day.progress > 0 && !day.isToday && styles.progressRingFilled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.progressText,
                        day.isToday && styles.progressTextActive,
                      ]}
                    >
                      {day.progress}%
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.dateText,
                      day.isToday && styles.dateTextActive,
                    ]}
                  >
                    {day.dateNum}
                  </Text>
                  <Text
                    style={[
                      styles.dayText,
                      day.isToday && styles.dayTextActive,
                    ]}
                  >
                    {day.dayName}
                  </Text>

                  {day.mealCount > 0 && !day.isToday && (
                    <View style={styles.mealCountBadge}>
                      <Text style={styles.mealCountText}>{day.mealCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Main Nutrition Card */}
        <View style={styles.nutritionCard}>
          <LinearGradient
            colors={["#FF6B35", "#FF8E53", "#FFA07A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nutritionGradient}
          >
            <View style={styles.nutritionHeader}>
              <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() =>
                  Alert.alert("AI Analysis", todayNutrition.aiAnalysis)
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.nutritionMain}>
              <View style={styles.calorieCircle}>
                <Text style={styles.calorieNumber}>
                  {todayNutrition.caloriesConsumed}
                </Text>
                <Text style={styles.calorieLabel}>calories</Text>
              </View>

              <View style={styles.goalRow}>
                <Text style={styles.goalText}>of</Text>
                <Text style={styles.goalNumber}>
                  {todayNutrition.dailyCalorieGoal}
                </Text>
                <Text style={styles.goalText}>goal</Text>
                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}
                  >
                    {todayNutrition.calorieProgress}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Macros Grid */}
            <View style={styles.macrosGrid}>
              <View style={styles.macroItem}>
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.macroValue}>
                  {todayNutrition.proteinConsumed}g
                </Text>
                <Text style={styles.macroLabel}>Protein</Text>
                <View style={styles.macroProgress}>
                  <View
                    style={[
                      styles.macroProgressFill,
                      { width: `${todayNutrition.proteinProgress}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.macroItem}>
                <MaterialCommunityIcons
                  name="bread-slice"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.macroValue}>
                  {todayNutrition.carbsConsumed}g
                </Text>
                <Text style={styles.macroLabel}>Carbs</Text>
                <View style={styles.macroProgress}>
                  <View
                    style={[
                      styles.macroProgressFill,
                      { width: `${todayNutrition.carbsProgress}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.macroItem}>
                <MaterialCommunityIcons name="water" size={24} color="#fff" />
                <Text style={styles.macroValue}>
                  {todayNutrition.fatConsumed}g
                </Text>
                <Text style={styles.macroLabel}>Fat</Text>
                <View style={styles.macroProgress}>
                  <View
                    style={[
                      styles.macroProgressFill,
                      { width: `${todayNutrition.fatProgress}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* AI Analysis Card */}
        <View style={styles.aiAnalysisCard}>
          <View style={styles.aiIconCircle}>
            <Ionicons name="bulb" size={24} color="#FFA500" />
          </View>
          <Text style={styles.aiAnalysisText}>
            {todayNutrition.aiAnalysis}
          </Text>
        </View>

        {/* Weekly Stats */}
        {weeklyStats.totalMeals > 0 && (
          <View style={styles.weeklyStatsCard}>
            <Text style={styles.weeklyStatsTitle}>Weekly Summary</Text>
            <View style={styles.weeklyStatsGrid}>
              <View style={styles.weeklyStatItem}>
                <Text style={[styles.weeklyStatValue, { color: '#FF6B35' }]}>
                  {weeklyStats.avgCalories}
                </Text>
                <Text style={styles.weeklyStatLabel}>Avg Calories/Day</Text>
              </View>

              <View style={styles.weeklyStatItem}>
                <Text style={[styles.weeklyStatValue, { color: '#FF6B35' }]}>
                  {weeklyStats.totalMeals}
                </Text>
                <Text style={styles.weeklyStatLabel}>Total Meals</Text>
              </View>

              <View style={styles.weeklyStatItem}>
                <Text style={[styles.weeklyStatValue, { color: '#FF6B35' }]}>
                  {weeklyStats.bestDay}
                </Text>
                <Text style={styles.weeklyStatLabel}>Most Active Day</Text>
              </View>

              <View style={styles.weeklyStatItem}>
                <Text style={[styles.weeklyStatValue, { color: '#FF6B35' }]}>
                  {weeklyStats.streak}
                </Text>
                <Text style={styles.weeklyStatLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Meals */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Meals</Text>
            {recentMeals.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push("/signup/history")}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
              </TouchableOpacity>
            )}
          </View>

          {recentMeals.length > 0 ? (
            recentMeals.map((meal) => (
              <TouchableOpacity
                key={meal.id}
                style={styles.mealCard}
                onPress={() =>
                  viewMealDetails(meal.id, meal.imageUri, meal.foodName)
                }
                activeOpacity={0.7}
              >
                {meal.imageUri ? (
                  <Image
                    source={{ uri: meal.imageUri }}
                    style={styles.mealImage}
                  />
                ) : (
                  <View style={styles.mealImagePlaceholder}>
                    <Ionicons name="restaurant" size={24} color="#ccc" />
                  </View>
                )}

                <View style={styles.mealInfo}>
                  <Text style={styles.mealName} numberOfLines={1}>
                    {meal.foodName}
                  </Text>
                  <View style={styles.mealMeta}>
                    <View
                      style={[
                        styles.mealTypeChip,
                        {
                          backgroundColor:
                            MEAL_TYPE_COLORS[meal.mealType] + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.mealTypeText,
                          { color: MEAL_TYPE_COLORS[meal.mealType] },
                        ]}
                      >
                        {meal.mealType}
                      </Text>
                    </View>
                    <Text style={styles.mealTime}>{meal.timeAgo}</Text>
                  </View>
                </View>

                <View style={styles.mealCalories}>
                  <Text style={styles.mealCalorieValue}>{meal.calories}</Text>
                  <Text style={styles.mealCalorieLabel}>cal</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="restaurant-outline"
                size={64}
                color="#e0e0e0"
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No meals logged yet</Text>
              <Text style={styles.emptySubtitle}>
                Start tracking your meals to see your nutrition insights
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={pickImageFromGallery}
              >
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Add Your First Meal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={pickImageFromGallery}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}