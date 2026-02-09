import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "../../src/styles/history";
import mealAPI, { SavedMeal } from "../../services/meal-api";

// Meal type configurations
const MEAL_CONFIGS = {
  breakfast: { label: 'Breakfast', icon: 'sunny', color: '#FF9800', gradient: ['#FF9800', '#F57C00'] },
  lunch: { label: 'Lunch', icon: 'restaurant', color: '#4CAF50', gradient: ['#4CAF50', '#388E3C'] },
  dinner: { label: 'Dinner', icon: 'moon', color: '#673AB7', gradient: ['#673AB7', '#512DA8'] },
  snack: { label: 'Snack', icon: 'fast-food', color: '#FF5722', gradient: ['#FF5722', '#E64A19'] },
  dessert: { label: 'Dessert', icon: 'ice-cream', color: '#E91E63', gradient: ['#E91E63', '#C2185B'] },
};

export default function HistoryScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<SavedMeal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Load meals when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  const loadMeals = async () => {
    try {
      setLoading(true);
      const fetchedMeals = await mealAPI.getMeals();
      setMeals(fetchedMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
      Alert.alert('Error', 'Failed to load meal history');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeals();
    setRefreshing(false);
  };

  const deleteMeal = async (id: string) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await mealAPI.deleteMeal(id);
              setMeals(meals.filter(meal => meal._id !== id));
            } catch (error) {
              console.error('Error deleting meal:', error);
              Alert.alert('Error', 'Failed to delete meal');
            }
          },
        },
      ]
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const groupMealsByDate = () => {
    const grouped: { [key: string]: SavedMeal[] } = {};
    
    meals.forEach(meal => {
      if (selectedFilter && meal.mealType !== selectedFilter) return;
      
      const dateKey = formatDate(meal.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meal);
    });
    
    return grouped;
  };

  const getTotalCalories = (mealsList: SavedMeal[]) => {
    return mealsList.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const getTotalMacros = (mealsList: SavedMeal[]) => {
    return mealsList.reduce(
      (totals, meal) => ({
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  };

  const viewMealDetails = (meal: SavedMeal) => {
    router.push({
      pathname: "./signup/food-details",
      params: {
        imageUri: meal.imageUri,
        foodName: meal.foodName,
        mealId: meal._id,
        isViewMode: 'true',
      }
    });
  };

  const groupedMeals = groupMealsByDate();
  const filteredMeals = selectedFilter 
    ? meals.filter(m => m.mealType === selectedFilter)
    : meals;
  const totalDayCalories = getTotalCalories(filteredMeals);
  const totalDayMacros = getTotalMacros(filteredMeals);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Meal History</Text>
          <Text style={styles.headerSubtitle}>{meals.length} meals logged</Text>
        </View>
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={() => {/* TODO: Open calendar */}}
        >
          <Ionicons name="calendar-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Daily Summary Card */}
      {!loading && meals.length > 0 && (
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryGradient}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Ionicons name="flame" size={24} color="#fff" />
                <Text style={styles.summaryValue}>{totalDayCalories}</Text>
                <Text style={styles.summaryLabel}>Calories</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="arm-flex" size={24} color="#fff" />
                <Text style={styles.summaryValue}>{totalDayMacros.protein}g</Text>
                <Text style={styles.summaryLabel}>Protein</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="bread-slice" size={24} color="#fff" />
                <Text style={styles.summaryValue}>{totalDayMacros.carbs}g</Text>
                <Text style={styles.summaryLabel}>Carbs</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="water" size={24} color="#fff" />
                <Text style={styles.summaryValue}>{totalDayMacros.fat}g</Text>
                <Text style={styles.summaryLabel}>Fat</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedFilter && styles.filterChipActive
          ]}
          onPress={() => setSelectedFilter(null)}
        >
          <Text style={[
            styles.filterChipText,
            !selectedFilter && styles.filterChipTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>

        {Object.entries(MEAL_CONFIGS).map(([key, config]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterChip,
              selectedFilter === key && styles.filterChipActive,
              selectedFilter === key && { borderColor: config.color }
            ]}
            onPress={() => setSelectedFilter(key)}
          >
            <Ionicons 
              name={config.icon as any} 
              size={16} 
              color={selectedFilter === key ? config.color : '#999'} 
            />
            <Text style={[
              styles.filterChipText,
              selectedFilter === key && { color: config.color, fontWeight: '700' }
            ]}>
              {config.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Meals List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading meals...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.mealsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {Object.keys(groupedMeals).length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={80} color="#e0e0e0" />
              <Text style={styles.emptyTitle}>No meals logged yet</Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter 
                  ? `No ${MEAL_CONFIGS[selectedFilter as keyof typeof MEAL_CONFIGS]?.label.toLowerCase()} meals found`
                  : 'Start tracking your meals to see them here'
                }
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push("/signup/scan")}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.emptyButtonGradient}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.emptyButtonText}>Scan Food</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            Object.entries(groupedMeals).map(([date, dateMeals]) => (
              <View key={date} style={styles.dateSection}>
                
                {/* Date Header */}
                <View style={styles.dateHeader}>
                  <Text style={styles.dateText}>{date}</Text>
                  <View style={styles.dateTotalBadge}>
                    <Ionicons name="flame" size={14} color="#FF6B6B" />
                    <Text style={styles.dateTotalText}>
                      {getTotalCalories(dateMeals)} cal
                    </Text>
                  </View>
                </View>

                {/* Meal Cards */}
                {dateMeals.map((meal) => {
                  const mealConfig = MEAL_CONFIGS[meal.mealType as keyof typeof MEAL_CONFIGS];
                  
                  return (
                    <TouchableOpacity
                      key={meal._id}
                      style={styles.mealCard}
                      onPress={() => viewMealDetails(meal)}
                      activeOpacity={0.7}
                    >
                      {/* Meal Type Badge */}
                      <View style={[styles.mealTypeBadge, { backgroundColor: mealConfig.color }]}>
                        <Ionicons name={mealConfig.icon as any} size={16} color="#fff" />
                      </View>

                      {/* Food Image */}
                      <View style={styles.mealImageContainer}>
                        {meal.imageUri ? (
                          <Image 
                            source={{ uri: meal.imageUri }} 
                            style={styles.mealImage}
                          />
                        ) : (
                          <View style={styles.mealImagePlaceholder}>
                            <Ionicons name="image-outline" size={32} color="#ccc" />
                          </View>
                        )}
                      </View>

                      {/* Meal Info */}
                      <View style={styles.mealInfo}>
                        <Text style={styles.mealName} numberOfLines={1}>
                          {meal.foodName}
                        </Text>
                        <Text style={styles.mealTime}>{formatTime(meal.timestamp)}</Text>
                        <View style={styles.mealMacros}>
                          <View style={styles.macroChip}>
                            <MaterialCommunityIcons name="arm-flex" size={12} color="#2196F3" />
                            <Text style={styles.macroChipText}>{meal.protein}g</Text>
                          </View>
                          <View style={styles.macroChip}>
                            <MaterialCommunityIcons name="bread-slice" size={12} color="#FF9800" />
                            <Text style={styles.macroChipText}>{meal.carbs}g</Text>
                          </View>
                          <View style={styles.macroChip}>
                            <MaterialCommunityIcons name="water" size={12} color="#9C27B0" />
                            <Text style={styles.macroChipText}>{meal.fat}g</Text>
                          </View>
                        </View>
                      </View>

                      {/* Calories */}
                      <View style={styles.mealCalories}>
                        <Text style={styles.caloriesNumber}>{meal.calories}</Text>
                        <Text style={styles.caloriesLabel}>cal</Text>
                      </View>

                      {/* Delete Button */}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          deleteMeal(meal._id);
                        }}
                      >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}