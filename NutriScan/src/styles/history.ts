import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },

  // Filter Chips
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContent: {
    gap: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#f5f5f5",
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#fff",
    borderColor: "#000",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  filterChipTextActive: {
    color: "#000",
    fontWeight: "700",
  },

  // Meals List
  mealsList: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Date Section
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  dateTotalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  dateTotalText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF6B6B",
  },

  // Meal Card
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative",
  },
  mealTypeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  // Meal Image
  mealImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mealImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },

  // Meal Info
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  mealMacros: {
    flexDirection: "row",
    gap: 8,
  },
  macroChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  macroChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },

  // Calories
  mealCalories: {
    alignItems: "center",
    marginLeft: 8,
    marginRight: 8,
  },
  caloriesNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  caloriesLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#999",
  },

  // Delete Button
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 30,
    overflow: "hidden",
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});