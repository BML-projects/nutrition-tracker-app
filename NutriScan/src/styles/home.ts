import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  scrollContent: {
    paddingBottom: 100,
  },

  // Header Section
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  greetingSection: {
    flex: 1,
    marginLeft: 12,
  },

  greetingText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },

  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  // Header Actions (Profile + Notification)
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  profilePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "#fff",
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 4,
  },

  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },

  statIcon: {
    marginBottom: 4,
  },

  // Calendar Section
  calendarSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  calendarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },

  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  dayItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  dayItemActive: {
    backgroundColor: "#FF6B35",
    shadowColor: "#FF6B35",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  progressRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 3,
    borderColor: "#e0e0e0",
  },

  progressRingActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },

  progressRingFilled: {
    borderColor: "#FF9800",
    backgroundColor: "#FFF3E0",
  },

  progressText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
  },

  progressTextActive: {
    color: "#FF6B35",
  },

  dateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },

  dateTextActive: {
    color: "#fff",
  },

  dayText: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
  },

  dayTextActive: {
    color: "#fff",
  },

  mealCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF9800",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: "center",
  },

  mealCountText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#fff",
  },

  // Main Nutrition Card
  nutritionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  nutritionGradient: {
    padding: 20,
  },

  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  nutritionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  nutritionMain: {
    alignItems: "center",
    marginBottom: 20,
  },

  calorieCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 16,
  },

  calorieNumber: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
  },

  calorieLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    marginTop: 4,
  },

  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  goalText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },

  goalNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  // Macros Section
  macrosGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  macroItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },

  macroValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginTop: 8,
  },

  macroLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },

  macroProgress: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },

  macroProgressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },

  // AI Analysis
  aiAnalysisCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  aiIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },

  aiAnalysisText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  // Recent Meals Section
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  viewAllText: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "600",
  },

  // Meal Card
  mealCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },

  mealImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },

  mealInfo: {
    flex: 1,
  },

  mealName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },

  mealMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  mealTypeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },

  mealTypeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },

  mealTime: {
    fontSize: 12,
    color: "#999",
  },

  mealCalories: {
    alignItems: "flex-end",
  },

  mealCalorieValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B35",
  },

  mealCalorieLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },

  // Empty State
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 12,
  },

  emptyIcon: {
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  emptyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // Floating Add Button
  addButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },

  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#666",
  },

  // Weekly Stats Card
  weeklyStatsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  weeklyStatsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },

  weeklyStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  weeklyStatItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
  },

  weeklyStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF6B35",
    marginBottom: 4,
  },

  weeklyStatLabel: {
    fontSize: 12,
    color: "#666",
  },
});