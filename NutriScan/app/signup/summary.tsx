import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { 
  Text, 
  TouchableOpacity, 
  View, 
  StatusBar, 
  ScrollView,
  Alert 
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignup } from "../../src/context/SignupContext";
import API from "@/services/auth-api";
import {
  calculateBMI,
  calculateAge,
  calculateBMR,
  calculateDailyCalories,
  calculateWeightPlan,
  getBMICategory
} from "@/src/utils/calculations";

export default function SummaryScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fitnessPlan, setFitnessPlan] = useState<any>(null);

  const router = useRouter();
  const { data, setData } = useSignup();

  // Calculate fitness plan on mount
  useEffect(() => {
    if (data.height && data.weight && data.dob && data.goal) {
      const age = calculateAge(data.dob);
      const bmi = calculateBMI(data.height, data.weight);
      const bmr = calculateBMR(data.height, data.weight, age, data.gender || 'male');
      const dailyCalories = calculateDailyCalories(bmr, data.goal);
      const bmiInfo = getBMICategory(bmi);

      let plan: any = {
        goal: data.goal,
        currentWeight: data.weight,
        bmi: bmi.toFixed(1),
        bmr: bmr.toFixed(0),
        dailyCalories,
        bmiCategory: bmiInfo.category,
      };

      // Add target weight plan if available
      if (data.targetWeight && (data.goal === 'lose' || data.goal === 'gain')) {
        const weightPlan = calculateWeightPlan(
          data.weight,
          data.targetWeight,
          data.goal,
          data.timeline || 'moderate',
          bmr
        );

        plan = {
          ...plan,
          targetWeight: data.targetWeight,
          weightDifference: weightPlan.weightDifference,
          timeline: data.timeline,
          estimatedWeeks: weightPlan.estimatedWeeks,
          estimatedDate: weightPlan.estimatedCompletionDate,
          weeklyRate: weightPlan.weeklyRate,
          dailyCalorieAdjustment: weightPlan.dailyCalorieAdjustment,
        };
      }

      setFitnessPlan(plan);
    }
  }, []);

  const handleSignup = async () => {
    // Validate required fields
    if (
      !data.fullName ||
      !data.email ||
      !data.password ||
      !data.gender ||
      !data.dob ||
      !data.height ||
      !data.weight ||
      !data.goal
    ) {
      setError("Please complete all signup steps");
      return;
    }

    // For lose/gain goals, validate target weight
    if ((data.goal === 'lose' || data.goal === 'gain') && !data.targetWeight) {
      Alert.alert(
        "Target Weight Required",
        "Please go back and set your target weight.",
        [
          {
            text: "Go Back",
            onPress: () => router.back()
          }
        ]
      );
      return;
    }

    const payload = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      confirmPassword: data.password,
      gender: data.gender,
      dob: new Date(data.dob).toISOString(),
      height: Number(data.height),
      weight: Number(data.weight),
      goal: data.goal,
      // Include target weight data
      targetWeight: data.targetWeight ? Number(data.targetWeight) : undefined,
      timeline: data.timeline,
      estimatedWeeks: data.estimatedWeeks,
    };

    try {
      setLoading(true);
      setError("");
      
      console.log("Sending signup payload:", payload);
      const res = await API.post("/auth/signup", payload);

      if (res.data.accessToken) {
        await AsyncStorage.setItem("accessToken", res.data.accessToken);
      }

      if (res.data.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
      }

      // Show success message
      Alert.alert(
        "🎉 Welcome to Your Fitness Journey!",
        `Your personalized plan is ready!\n\nDaily Calories: ${fitnessPlan.dailyCalories.toLocaleString()}\n${fitnessPlan.targetWeight ? `Target: ${fitnessPlan.targetWeight} kg\n` : ''}Let's achieve your goals together!`,
        [
          {
            text: "Start Journey",
            onPress: () => router.replace("./home")
          }
        ]
      );
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);

      setError(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!fitnessPlan) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Preparing your plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <View style={styles.backButtonCircle}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={50} color="#10b981" />
          </View>
          <Text style={styles.title}>Your Fitness Plan</Text>
          <Text style={styles.subtitle}>Review your personalized plan before completing signup</Text>
        </View>

        {/* Plan Summary Card */}
        <View style={styles.planSummaryCard}>
          {/* Current Stats */}
          <View style={styles.summarySection}>
            <Text style={styles.summarySectionTitle}>Current Stats</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Weight</Text>
                <Text style={styles.summaryValue}>{fitnessPlan.currentWeight} kg</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>BMI</Text>
                <Text style={styles.summaryValue}>{fitnessPlan.bmi}</Text>
                <Text style={styles.summarySubtext}>{fitnessPlan.bmiCategory}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>BMR</Text>
                <Text style={styles.summaryValue}>{fitnessPlan.bmr}</Text>
                <Text style={styles.summarySubtext}>cal/day</Text>
              </View>
            </View>
          </View>

          {/* Goal Details */}
          {fitnessPlan.targetWeight && (
            <View style={styles.summarySection}>
              <Text style={styles.summarySectionTitle}>Your Goal</Text>
              <View style={styles.goalDetailsCard}>
                <View style={styles.goalDetailRow}>
                  <View style={styles.goalDetailItem}>
                    <Ionicons name="flag-outline" size={20} color="#D37034" />
                    <Text style={styles.goalDetailLabel}>Target Weight</Text>
                    <Text style={styles.goalDetailValue}>{fitnessPlan.targetWeight} kg</Text>
                  </View>
                  <View style={styles.goalDetailDivider} />
                  <View style={styles.goalDetailItem}>
                    <Ionicons 
                      name={data.goal === "lose" ? "trending-down" : "trending-up"} 
                      size={20} 
                      color="#D37034" 
                    />
                    <Text style={styles.goalDetailLabel}>To {data.goal}</Text>
                    <Text style={styles.goalDetailValue}>
                      {fitnessPlan.weightDifference?.toFixed(1)} kg
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Timeline */}
          {fitnessPlan.estimatedWeeks && (
            <View style={styles.summarySection}>
              <Text style={styles.summarySectionTitle}>Timeline</Text>
              <View style={styles.timelineCard}>
                <View style={styles.timelineRow}>
                  <Ionicons name="time-outline" size={20} color="#3b82f6" />
                  <View style={styles.timelineInfo}>
                    <Text style={styles.timelineLabel}>Duration</Text>
                    <Text style={styles.timelineValue}>
                      {fitnessPlan.estimatedWeeks} weeks 
                      ({(fitnessPlan.estimatedWeeks / 4).toFixed(1)} months)
                    </Text>
                  </View>
                </View>
                <View style={styles.timelineRow}>
                  <Ionicons name="speedometer-outline" size={20} color="#f59e0b" />
                  <View style={styles.timelineInfo}>
                    <Text style={styles.timelineLabel}>Weekly Progress</Text>
                    <Text style={styles.timelineValue}>
                      {fitnessPlan.weeklyRate} kg/week
                    </Text>
                  </View>
                </View>
                <View style={styles.timelineRow}>
                  <Ionicons name="calendar-outline" size={20} color="#10b981" />
                  <View style={styles.timelineInfo}>
                    <Text style={styles.timelineLabel}>Target Date</Text>
                    <Text style={styles.timelineValue}>{fitnessPlan.estimatedDate}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Daily Calories */}
          <View style={styles.summarySection}>
            <Text style={styles.summarySectionTitle}>Daily Nutrition</Text>
            <View style={styles.caloriesCard}>
              <View style={styles.caloriesMain}>
                <Ionicons name="nutrition-outline" size={32} color="#D37034" />
                <View>
                  <Text style={styles.caloriesMainValue}>
                    {fitnessPlan.dailyCalories.toLocaleString()}
                  </Text>
                  <Text style={styles.caloriesMainLabel}>calories per day</Text>
                </View>
              </View>
              
              {fitnessPlan.dailyCalorieAdjustment && (
                <View style={styles.caloriesAdjustment}>
                  <Ionicons 
                    name={data.goal === "lose" ? "remove-circle" : "add-circle"} 
                    size={18} 
                    color={data.goal === "lose" ? "#3b82f6" : "#f59e0b"} 
                  />
                  <Text style={styles.caloriesAdjustmentText}>
                    {fitnessPlan.dailyCalorieAdjustment} cal{" "}
                    {data.goal === "lose" ? "deficit" : "surplus"} from maintenance
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Personal Info Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summarySectionTitle}>Personal Information</Text>
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{data.fullName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{data.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender:</Text>
                <Text style={styles.infoValue}>{data.gender?.charAt(0).toUpperCase()}{data.gender?.slice(1)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Height:</Text>
                <Text style={styles.infoValue}>{data.height} cm</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current Weight:</Text>
                <Text style={styles.infoValue}>{data.weight} kg</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Sign Up Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          activeOpacity={0.9}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ['#d0d0d0', '#b0b0b0'] : ['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.signupButtonText}>Creating account</Text>
                <View style={styles.dots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.signupButtonText}>Complete Sign Up</Text>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles (add to your styles file or include here)
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  planSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#D37034',
  },
  summarySection: {
    marginBottom: 20,
  },
  summarySectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  summarySubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  goalDetailsCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
  },
  goalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  goalDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  goalDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    marginBottom: 4,
  },
  goalDetailValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  goalDetailDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#f59e0b',
    opacity: 0.3,
  },
  timelineCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  timelineValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  caloriesCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
  },
  caloriesMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  caloriesMainValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
  },
  caloriesMainLabel: {
    fontSize: 14,
    color: '#666',
  },
  caloriesAdjustment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  caloriesAdjustmentText: {
    fontSize: 13,
    color: '#666',
  },
  infoList: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  signupButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  dot1: {},
  dot2: {},
  dot3: {},
});