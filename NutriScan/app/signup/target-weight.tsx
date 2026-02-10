import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/src/styles/target-weight";
import { useSignup } from "@/src/context/SignupContext";
import {
  calculateBMI,
  getBMICategory,
  calculateAge,
  calculateBMR,
  validateGoalWithBMI,
  calculateWeightPlan,
  getIdealWeightRange,
  WeightPlan
} from "@/src/utils/calculations";

export default function TargetWeight() {
  const router = useRouter();
  const { data, setData } = useSignup();

  const [targetWeight, setTargetWeight] = useState("");
  const [timeline, setTimeline] = useState<"fast" | "moderate" | "slow">("moderate");
  const [weightPlan, setWeightPlan] = useState<WeightPlan | null>(null);
  const [showBMIWarning, setShowBMIWarning] = useState(false);
  const [bmiValidation, setBmiValidation] = useState<any>(null);

  const currentWeight = data.weight || 0;
  const height = data.height || 0;
  const goal = data.goal || "maintain";
  const currentBMI = calculateBMI(height, currentWeight);
  const bmiInfo = getBMICategory(currentBMI);
  const idealWeightRange = getIdealWeightRange(height);

  // Check BMI and goal compatibility on mount
  useEffect(() => {
    if (goal !== 'maintain') {
      const validation = validateGoalWithBMI(currentBMI, goal);
      setBmiValidation(validation);
      
      if (!validation.isValid) {
        setShowBMIWarning(true);
      }
    }
  }, [currentBMI, goal]);

  // Calculate weight plan when target weight or timeline changes
  useEffect(() => {
    if (targetWeight && parseFloat(targetWeight) > 0 && data.dob) {
      calculatePlan();
    }
  }, [targetWeight, timeline]);

  const calculatePlan = () => {
    const target = parseFloat(targetWeight);
    const current = currentWeight;
    const difference = Math.abs(target - current);

    if (difference === 0) {
      Alert.alert("Notice", "Target weight is same as current weight. Consider maintaining.");
      return;
    }

    // Validate goal direction
    if (goal === "lose" && target >= current) {
      Alert.alert("Invalid Target", "For weight loss, target should be less than current weight.");
      return;
    }

    if (goal === "gain" && target <= current) {
      Alert.alert("Invalid Target", "For weight gain, target should be more than current weight.");
      return;
    }

    // Calculate BMR
    const age = calculateAge(data.dob!);
    const bmr = calculateBMR(height, currentWeight, age, data.gender || 'male');

    // Calculate weight plan
    const plan = calculateWeightPlan(
      current,
      target,
      goal as 'lose' | 'gain',
      timeline,
      bmr,
      'moderate' // Default activity level
    );

    setWeightPlan(plan);

    // Show warnings if any
    if (plan.warnings.length > 0) {
      Alert.alert(
        "⚠️ Important Considerations",
        plan.warnings.join('\n\n'),
        [{ text: "I Understand", style: "default" }]
      );
    }
  };

  const handleGoalSuggestionAccept = () => {
    if (bmiValidation?.suggestedGoal) {
      setData({ goal: bmiValidation.suggestedGoal });
      router.back(); // Go back to goal selection
    }
  };

  const handleNext = () => {
    if (!targetWeight || parseFloat(targetWeight) <= 0) {
      Alert.alert("Required", "Please enter your target weight");
      return;
    }

    const target = parseFloat(targetWeight);

    // Validation
    if (target < 30 || target > 300) {
      Alert.alert("Invalid Weight", "Please enter a realistic target weight (30-300 kg)");
      return;
    }

    // Check if target makes sense with goal
    if (goal === "lose" && target >= currentWeight) {
      Alert.alert("Invalid Target", "For weight loss, target must be less than current weight.");
      return;
    }

    if (goal === "gain" && target <= currentWeight) {
      Alert.alert("Invalid Target", "For weight gain, target must be more than current weight.");
      return;
    }

    if (!weightPlan) {
      Alert.alert("Error", "Please wait for plan calculation");
      return;
    }

    // Save to context
    setData({
      targetWeight: target,
      timeline: timeline,
      estimatedWeeks: weightPlan.estimatedWeeks,
    });

    console.log("Saved target weight data:", {
      targetWeight: target,
      timeline,
      estimatedWeeks: weightPlan.estimatedWeeks,
      dailyCalories: weightPlan.dailyCalories,
    });

    // Navigate to summary/signup screen (final step)
    router.push("/signup/summary");
  };

  const weightDifference = targetWeight ? Math.abs(parseFloat(targetWeight) - currentWeight) : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <View style={styles.backButtonCircle}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="flag" size={40} color="#000" />
          </View>
          <Text style={styles.title}>
            {goal === "lose" ? "Weight Loss Goal" : "Weight Gain Goal"}
          </Text>
          <Text style={styles.subtitle}>
            How much do you want to {goal === "lose" ? "lose" : "gain"}?
          </Text>
        </View>

        {/* BMI Warning Card */}
        {bmiValidation && !bmiValidation.isValid && showBMIWarning && (
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <Ionicons name="warning" size={24} color="#ef4444" />
              <Text style={styles.warningTitle}>{bmiValidation.warning}</Text>
            </View>
            <Text style={styles.warningText}>{bmiValidation.suggestion}</Text>
            
            <View style={styles.warningActions}>
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={() => setShowBMIWarning(false)}
              >
                <Text style={styles.dismissButtonText}>Continue Anyway</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleGoalSuggestionAccept}
              >
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.acceptButtonGradient}
                >
                  <Text style={styles.acceptButtonText}>
                    Switch to {bmiValidation.suggestedGoal}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Current Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsCardTitle}>Your Current Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="scale-outline" size={20} color="#D37034" />
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{currentWeight} kg</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="speedometer-outline" size={20} color="#D37034" />
              <Text style={styles.statLabel}>BMI</Text>
              <Text style={styles.statValue}>{currentBMI.toFixed(1)}</Text>
              <View style={[styles.bmiBadge, { backgroundColor: bmiInfo.color + '20' }]}>
                <Text style={[styles.bmiBadgeText, { color: bmiInfo.color }]}>
                  {bmiInfo.category}
                </Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="fitness-outline" size={20} color="#D37034" />
              <Text style={styles.statLabel}>Ideal Range</Text>
              <Text style={styles.statValue}>
                {idealWeightRange.min}-{idealWeightRange.max} kg
              </Text>
            </View>
          </View>
        </View>

        {/* Target Weight Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Target Weight (kg)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="trophy-outline" size={24} color="#D37034" style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="Enter target weight"
              placeholderTextColor="#999"
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="decimal-pad"
              maxLength={5}
            />
            <Text style={styles.unit}>kg</Text>
          </View>

          {weightDifference > 0 && (
            <View style={styles.differenceCard}>
              <Ionicons 
                name={goal === "lose" ? "arrow-down-circle" : "arrow-up-circle"} 
                size={20} 
                color={goal === "lose" ? "#3b82f6" : "#f59e0b"} 
              />
              <Text style={styles.differenceText}>
                {weightDifference.toFixed(1)} kg to {goal === "lose" ? "lose" : "gain"}
              </Text>
            </View>
          )}
        </View>

        {/* Timeline Selection */}
        <View style={styles.timelineSection}>
          <Text style={styles.label}>Choose Your Pace</Text>
          
          {[
            { 
              value: "fast", 
              label: "Fast", 
              description: goal === "lose" ? "~1 kg/week" : "~0.5 kg/week",
              subtext: goal === "lose" ? "Aggressive approach" : "Steady muscle gain",
              icon: "flash",
              color: "#ef4444"
            },
            { 
              value: "moderate", 
              label: "Moderate (Recommended)", 
              description: goal === "lose" ? "~0.5 kg/week" : "~0.35 kg/week",
              subtext: "Balanced and sustainable",
              icon: "walk",
              color: "#f59e0b"
            },
            { 
              value: "slow", 
              label: "Slow & Steady", 
              description: "~0.25 kg/week",
              subtext: "Gentle, minimal lifestyle change",
              icon: "hourglass",
              color: "#10b981"
            },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.timelineOption,
                timeline === option.value && styles.timelineOptionActive,
              ]}
              onPress={() => setTimeline(option.value as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.timelineIconContainer, { backgroundColor: option.color + '20' }]}>
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={[
                  styles.timelineLabel,
                  timeline === option.value && styles.timelineLabelActive
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.timelineDescription}>{option.description}</Text>
                <Text style={styles.timelineSubtext}>{option.subtext}</Text>
              </View>
              <View style={styles.radioOuter}>
                {timeline === option.value && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight Plan Card */}
        {weightPlan && (
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Ionicons name="calendar-outline" size={24} color="#D37034" />
              <Text style={styles.planTitle}>Your Personalized Plan</Text>
            </View>
            
            {/* Timeline Info */}
            <View style={styles.planSection}>
              <View style={styles.planRow}>
                <View style={styles.planItem}>
                  <Text style={styles.planLabel}>Duration</Text>
                  <Text style={styles.planValue}>{weightPlan.estimatedWeeks} weeks</Text>
                  <Text style={styles.planSubtext}>
                    ({(weightPlan.estimatedWeeks / 4).toFixed(1)} months)
                  </Text>
                </View>
                <View style={styles.planDivider} />
                <View style={styles.planItem}>
                  <Text style={styles.planLabel}>Weekly Change</Text>
                  <Text style={styles.planValue}>{weightPlan.weeklyRate} kg</Text>
                  <Text style={styles.planSubtext}>per week</Text>
                </View>
              </View>
              
              <View style={styles.targetDateCard}>
                <Ionicons name="flag-outline" size={18} color="#10b981" />
                <Text style={styles.targetDateText}>
                  Target completion: {weightPlan.estimatedCompletionDate}
                </Text>
              </View>
            </View>

            {/* Calories Info */}
            <View style={styles.caloriesSection}>
              <View style={styles.caloriesHeader}>
                <Ionicons name="nutrition-outline" size={20} color="#D37034" />
                <Text style={styles.caloriesHeaderText}>Daily Nutrition Plan</Text>
              </View>
              
              <View style={styles.caloriesCard}>
                <View style={styles.caloriesMain}>
                  <Text style={styles.caloriesMainValue}>
                    {weightPlan.dailyCalories.toLocaleString()}
                  </Text>
                  <Text style={styles.caloriesMainLabel}>calories per day</Text>
                </View>
                
                <View style={styles.caloriesDetail}>
                  <Ionicons 
                    name={goal === "lose" ? "remove-circle-outline" : "add-circle-outline"} 
                    size={18} 
                    color={goal === "lose" ? "#3b82f6" : "#f59e0b"} 
                  />
                  <Text style={styles.caloriesDetailText}>
                    {weightPlan.dailyCalorieAdjustment} cal {goal === "lose" ? "deficit" : "surplus"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Recommendations */}
            {weightPlan.recommendations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <Text style={styles.recommendationsTitle}>💡 Recommendations</Text>
                {weightPlan.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={styles.recommendationDot} />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.9}
          disabled={!weightPlan}
        >
          <LinearGradient
            colors={weightPlan ? ["#000", "#2a2a2a"] : ["#d0d0d0", "#b0b0b0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={[
              styles.nextButtonText,
              !weightPlan && { color: "#999" }
            ]}>
              Continue to Summary
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={22} 
              color={weightPlan ? "#fff" : "#999"} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}