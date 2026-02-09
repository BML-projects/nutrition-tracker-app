import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import axios from "axios";
import { Ingredient, Prediction } from "@/src/types/index";
import { styles } from "@/src/styles/fooddetails";
import mealAPI from "@/services/meal-api";

const BACKEND_HOST = "https://unnominal-nonfashionable-marcela.ngrok-free.dev/api/food/predict";

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: 'sunny', color: '#FF9800' },
  { id: 'lunch', label: 'Lunch', icon: 'restaurant', color: '#4CAF50' },
  { id: 'dinner', label: 'Dinner', icon: 'moon', color: '#673AB7' },
  { id: 'snack', label: 'Snack', icon: 'fast-food', color: '#FF5722' },
  { id: 'dessert', label: 'Dessert', icon: 'ice-cream', color: '#E91E63' },
];

const PORTION_PRESETS = [
  { label: '0.25x', multiplier: 0.25 },
  { label: '0.5x', multiplier: 0.5 },
  { label: '1x', multiplier: 1 },
  { label: '1.5x', multiplier: 1.5 },
  { label: '2x', multiplier: 2 },
];

export default function FoodDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const imageUri = params.imageUri as string;
  const isViewMode = params.isViewMode === 'true';
  const mealId = params.mealId as string;

  // Original nutrition values (from API)
  const [originalCalories, setOriginalCalories] = useState(0);
  const [originalProtein, setOriginalProtein] = useState(0);
  const [originalCarbs, setOriginalCarbs] = useState(0);
  const [originalFat, setOriginalFat] = useState(0);

  // Display values (adjusted by weight)
  const [foodName, setFoodName] = useState((params.foodName as string) ?? "Food Analysis");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  
  const [analysis, setAnalysis] = useState(
    (params.analysis as string) ?? "Tap 'Scan Food' to analyze the nutritional content"
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    params.ingredients ? JSON.parse(params.ingredients as string) : []
  );
  const [loading, setLoading] = useState(false);
  const [top5, setTop5] = useState<Prediction[]>([]);
  const [scanned, setScanned] = useState(false);

  // Weight/Portion controls
  const [weight, setWeight] = useState("100");
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [showWeightModal, setShowWeightModal] = useState(false);

  // Meal type selection
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  // Load meal details if viewing saved meal
  useEffect(() => {
    if (isViewMode && mealId) {
      loadMealDetails();
    }
  }, [isViewMode, mealId]);

  const loadMealDetails = async () => {
    try {
      setLoading(true);
      const meal = await mealAPI.getMealById(mealId);
      
      setFoodName(meal.foodName);
      setCalories(meal.calories);
      setProtein(meal.protein);
      setCarbs(meal.carbs);
      setFat(meal.fat);
      setWeight(meal.weight.toString());
      setSelectedMealType(meal.mealType);
      setScanned(true);
      
      // Set original values for recalculation if needed
      setOriginalCalories(meal.calories);
      setOriginalProtein(meal.protein);
      setOriginalCarbs(meal.carbs);
      setOriginalFat(meal.fat);
      
      setAnalysis(`Logged meal from ${new Date(meal.timestamp).toLocaleDateString()}`);
    } catch (error) {
      console.error("Error loading meal:", error);
      setAnalysis("Failed to load meal details");
    } finally {
      setLoading(false);
    }
  };

  // Calculate nutrition based on weight
  useEffect(() => {
    if (originalCalories > 0) {
      const multiplier = (parseFloat(weight) / 100) * portionMultiplier;
      setCalories(Math.round(originalCalories * multiplier));
      setProtein(Math.round(originalProtein * multiplier));
      setCarbs(Math.round(originalCarbs * multiplier));
      setFat(Math.round(originalFat * multiplier));
    }
  }, [weight, portionMultiplier, originalCalories]);

  const onUpdatePress = async () => {
    if (!selectedMealType) {
      alert("Please select a meal type");
      return;
    }

    const mealData = {
      foodName,
      calories,
      protein,
      carbs,
      fat,
      weight: parseFloat(weight),
      mealType: selectedMealType,
      imageUri, // This will be handled properly in meal-api.ts
      timestamp: new Date().toISOString(),
    };

    try {
      setLoading(true);
      console.log("💾 Saving meal with data:", mealData);
      const savedMeal = await mealAPI.saveMeal(mealData);
      console.log("✅ MEAL SAVED:", savedMeal);
      
      alert(`Added to ${MEAL_TYPES.find(m => m.id === selectedMealType)?.label}!`);
      
      // Navigate back or to history
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error: any) {
      console.error("❌ Error saving meal:", error);
      alert("Failed to save meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      setAnalysis("No image selected");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Ensure proper image format for FormData
      const imageFile = {
        uri: imageUri,
        name: `food_${Date.now()}.jpg`,
        type: 'image/jpeg',
      };

      formData.append("file", imageFile as any);

      console.log("📤 Uploading image to:", BACKEND_HOST);
      console.log("📤 Image URI:", imageUri);

      const response = await axios.post(BACKEND_HOST, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
        },
        timeout: 30000, // 30 seconds
      });

      const data = response.data;
      console.log("✅ FULL RESPONSE:", data);

      setFoodName(data.top1.class);
      setAnalysis(`AI detected with ${Math.round(data.top1.confidence * 100)}% confidence`);
      setScanned(true);

      if (data.nutrition) {
        setOriginalCalories(data.nutrition.calories ?? 0);
        setOriginalProtein(data.nutrition.protein ?? 0);
        setOriginalCarbs(data.nutrition.carbs ?? 0);
        setOriginalFat(data.nutrition.fat ?? 0);

        setCalories(data.nutrition.calories ?? 0);
        setProtein(data.nutrition.protein ?? 0);
        setCarbs(data.nutrition.carbs ?? 0);
        setFat(data.nutrition.fat ?? 0);
      }

      setIngredients([
        {
          name: data.top1.class,
          calories: data.nutrition?.calories ?? 0,
          protein: data.nutrition?.protein ?? 0,
          carbs: data.nutrition?.carbs ?? 0,
          fat: data.nutrition?.fat ?? 0,
        },
      ]);

      if (data.top5) setTop5(data.top5);

    } catch (err: any) {
      console.error("❌ UPLOAD ERROR:", err);
      console.error("❌ Error details:", err?.response?.data || err.message);
      
      // More detailed error message
      let errorMessage = "Prediction failed. Please try again.";
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (err.response?.status === 413) {
        errorMessage = "Image too large. Please use a smaller image.";
      } else if (err.message.includes('Network')) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setAnalysis(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalMacros = protein + carbs + fat;
  const proteinPercentage = totalMacros > 0 ? (protein / totalMacros) * 100 : 0;
  const carbsPercentage = totalMacros > 0 ? (carbs / totalMacros) * 100 : 0;
  const fatPercentage = totalMacros > 0 ? (fat / totalMacros) * 100 : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Hero Image Section */}
      <View style={styles.heroSection}>
        {imageUri ? (
          <>
            <Image 
              source={{ uri: imageUri }} 
              style={styles.heroImage}
              onError={(error) => {
                console.log("❌ Image load error:", error.nativeEvent.error);
              }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
          </>
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="camera-outline" size={60} color="#ccc" />
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {imageUri && !isViewMode && (
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={uploadImage}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#999', '#777'] : ['#4CAF50', '#45a049']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scanGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="scan" size={20} color="#fff" />
                  <Text style={styles.scanText}>SCAN FOOD</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        
        {/* Food Name & Status Badge */}
        <View style={styles.titleRow}>
          <Text style={styles.foodTitle}>{foodName}</Text>
          {scanned && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>{isViewMode ? 'Logged' : 'Verified'}</Text>
            </View>
          )}
        </View>

        {/* Analysis */}
        <View style={styles.analysisCard}>
          <Ionicons name="sparkles" size={18} color="#FF9800" />
          <Text style={styles.analysisText}>{analysis}</Text>
        </View>

        {/* Portion/Weight Adjustment */}
        {scanned && !isViewMode && (
          <View style={styles.portionSection}>
            <Text style={styles.sectionTitle}>Adjust Portion</Text>
            
            {/* Quick Portion Buttons */}
            <View style={styles.portionPresets}>
              {PORTION_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.label}
                  style={[
                    styles.portionPresetButton,
                    portionMultiplier === preset.multiplier && styles.portionPresetButtonActive
                  ]}
                  onPress={() => setPortionMultiplier(preset.multiplier)}
                >
                  <Text style={[
                    styles.portionPresetText,
                    portionMultiplier === preset.multiplier && styles.portionPresetTextActive
                  ]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Weight Input */}
            <TouchableOpacity 
              style={styles.weightCard}
              onPress={() => setShowWeightModal(true)}
            >
              <View style={styles.weightIconCircle}>
                <MaterialCommunityIcons name="weight-gram" size={24} color="#2196F3" />
              </View>
              <View style={styles.weightInfo}>
                <Text style={styles.weightLabel}>Weight (grams)</Text>
                <Text style={styles.weightValue}>{weight}g</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        )}

        {/* View mode weight display */}
        {isViewMode && (
          <View style={styles.portionSection}>
            <Text style={styles.sectionTitle}>Portion Size</Text>
            <View style={styles.weightCard}>
              <View style={styles.weightIconCircle}>
                <MaterialCommunityIcons name="weight-gram" size={24} color="#2196F3" />
              </View>
              <View style={styles.weightInfo}>
                <Text style={styles.weightLabel}>Weight</Text>
                <Text style={styles.weightValue}>{weight}g</Text>
              </View>
            </View>
          </View>
        )}

        {/* Calories Card - Hero */}
        <View style={styles.caloriesHero}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.caloriesGradient}
          >
            <View style={styles.caloriesContent}>
              <Ionicons name="flame" size={40} color="#fff" />
              <View style={styles.caloriesTextContainer}>
                <Text style={styles.caloriesValue}>{calories}</Text>
                <Text style={styles.caloriesLabel}>Calories</Text>
              </View>
            </View>
            <View style={styles.caloriesPattern} />
          </LinearGradient>
        </View>

        {/* Macros Cards Grid */}
        <Text style={styles.sectionTitle}>Macronutrients</Text>
        <View style={styles.macrosGrid}>
          
          <View style={styles.macroCard}>
            <View style={[styles.macroIconCircle, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="arm-flex" size={28} color="#2196F3" />
            </View>
            <Text style={styles.macroValue}>{protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${proteinPercentage}%`, 
                backgroundColor: '#2196F3' 
              }]} />
            </View>
          </View>

          <View style={styles.macroCard}>
            <View style={[styles.macroIconCircle, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="bread-slice" size={28} color="#FF9800" />
            </View>
            <Text style={styles.macroValue}>{carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${carbsPercentage}%`, 
                backgroundColor: '#FF9800' 
              }]} />
            </View>
          </View>

          <View style={styles.macroCard}>
            <View style={[styles.macroIconCircle, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="water" size={28} color="#9C27B0" />
            </View>
            <Text style={styles.macroValue}>{fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${fatPercentage}%`, 
                backgroundColor: '#9C27B0' 
              }]} />
            </View>
          </View>

        </View>

        {/* Meal Type Selection or Display */}
        {scanned && (
          <View style={styles.mealTypeSection}>
            <Text style={styles.sectionTitle}>
              {isViewMode ? 'Meal Type' : 'Select Meal Type'}
            </Text>
            <View style={styles.mealTypesGrid}>
              {MEAL_TYPES.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={[
                    styles.mealTypeCard,
                    selectedMealType === meal.id && styles.mealTypeCardActive
                  ]}
                  onPress={() => !isViewMode && setSelectedMealType(meal.id)}
                  activeOpacity={isViewMode ? 1 : 0.7}
                  disabled={isViewMode}
                >
                  <View style={[
                    styles.mealTypeIconCircle,
                    { backgroundColor: selectedMealType === meal.id ? meal.color : '#f5f5f5' }
                  ]}>
                    <Ionicons 
                      name={meal.icon as any} 
                      size={24} 
                      color={selectedMealType === meal.id ? '#fff' : meal.color} 
                    />
                  </View>
                  <Text style={[
                    styles.mealTypeLabel,
                    selectedMealType === meal.id && { color: meal.color, fontWeight: '700' }
                  ]}>
                    {meal.label}
                  </Text>
                  {selectedMealType === meal.id && (
                    <View style={[styles.mealTypeCheckmark, { backgroundColor: meal.color }]}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Top 5 Predictions */}
        {top5.length > 0 && (
          <View style={styles.predictionsSection}>
            <Text style={styles.sectionTitle}>AI Predictions</Text>
            {top5.map((item, index) => (
              <View key={item.class} style={styles.predictionItem}>
                <View style={styles.predictionRank}>
                  <Text style={styles.rankNumber}>#{index + 1}</Text>
                </View>
                <View style={styles.predictionContent}>
                  <Text style={styles.predictionName}>{item.class}</Text>
                  <View style={styles.confidenceBar}>
                    <View style={[styles.confidenceFill, { 
                      width: `${item.confidence * 100}%` 
                    }]} />
                  </View>
                </View>
                <Text style={styles.confidenceText}>
                  {Math.round(item.confidence * 100)}%
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Update Button - Only show in add mode */}
        {scanned && !isViewMode && (
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={onUpdatePress}
            activeOpacity={0.9}
            disabled={loading}
          >
            <LinearGradient
              colors={selectedMealType && !loading ? ['#4CAF50', '#45a049'] : ['#999', '#777']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.updateGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  <Text style={styles.updateText}>
                    {selectedMealType ? 'SAVE TO DIARY' : 'SELECT MEAL TYPE'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

      </View>

      {/* Weight Input Modal */}
      <Modal
        visible={showWeightModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Weight (grams)</Text>
            <TextInput
              style={styles.weightInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="100"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowWeightModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={() => setShowWeightModal(false)}
              >
                <Text style={styles.modalSaveText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}