import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "../../src/styles/history";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Meal type configurations
const MEAL_CONFIGS = {
  breakfast: { label: 'Breakfast', icon: 'sunny', color: '#FF9800', gradient: ['#FF9800', '#F57C00'] },
  lunch: { label: 'Lunch', icon: 'restaurant', color: '#4CAF50', gradient: ['#4CAF50', '#388E3C'] },
  dinner: { label: 'Dinner', icon: 'moon', color: '#673AB7', gradient: ['#673AB7', '#512DA8'] },
  snack: { label: 'Snack', icon: 'fast-food', color: '#FF5722', gradient: ['#FF5722', '#E64A19'] },
  dessert: { label: 'Dessert', icon: 'ice-cream', color: '#E91E63', gradient: ['#E91E63', '#C2185B'] },
};

interface MealEntry {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weight: number;
  mealType: string;
  imageUri: string;
  timestamp: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const storedMeals = await AsyncStorage.getItem('mealHistory');
      if (storedMeals) {
        const parsedMeals = JSON.parse(storedMeals);
        // Sort by timestamp, newest first
        parsedMeals.sort((a: MealEntry, b: MealEntry) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setMeals(parsedMeals);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeals();
    setRefreshing(false);
  };

  const deleteMeal = async (id: string) => {
    try {
      const updatedMeals = meals.filter(meal => meal.id !== id);
      await AsyncStorage.setItem('mealHistory', JSON.stringify(updatedMeals));
      setMeals(updatedMeals);
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const groupMealsByDate = () => {
    const grouped: { [key: string]: MealEntry[] } = {};
    
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

  const getTotalCalories = (mealsList: MealEntry[]) => {
    return mealsList.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const groupedMeals = groupMealsByDate();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View>
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
            <Text style={styles.emptySubtitle}>Start tracking your meals to see them here</Text>
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
                    key={meal.id}
                    style={styles.mealCard}
                    onPress={() => router.push({
                      pathname: "./signup/food-details",
                      params: {
                        imageUri: meal.imageUri,
                        foodName: meal.foodName,
                        calories: meal.calories,
                        protein: meal.protein,
                        carbs: meal.carbs,
                        fat: meal.fat,
                      }
                    })}
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
                          <MaterialCommunityIcons name="arm-flex" size={14} color="#2196F3" />
                          <Text style={styles.macroChipText}>{meal.protein}g</Text>
                        </View>
                        <View style={styles.macroChip}>
                          <MaterialCommunityIcons name="bread-slice" size={14} color="#FF9800" />
                          <Text style={styles.macroChipText}>{meal.carbs}g</Text>
                        </View>
                        <View style={styles.macroChip}>
                          <MaterialCommunityIcons name="water" size={14} color="#9C27B0" />
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
                      onPress={() => deleteMeal(meal.id)}
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
    </View>
  );
}