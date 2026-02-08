import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Hero Section
  heroSection: {
    position: "relative",
    width: "100%",
    height: 320,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },

  // Buttons
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  scanText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Content Section
  contentSection: {
    padding: 20,
    marginTop: -30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  // Title
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  foodTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },

  // Analysis
  analysisCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#FF9800",
  },
  analysisText: {
    flex: 1,
    fontSize: 14,
    color: "#F57C00",
    fontWeight: "500",
  },

  // Portion Section
  portionSection: {
    marginBottom: 24,
  },
  portionPresets: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  portionPresetButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  portionPresetButtonActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  portionPresetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  portionPresetTextActive: {
    color: "#2196F3",
    fontWeight: "700",
  },

  // Weight Card
  weightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    gap: 12,
  },
  weightIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  weightInfo: {
    flex: 1,
  },
  weightLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  // Calories Hero Card
  caloriesHero: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  caloriesGradient: {
    padding: 24,
    position: "relative",
  },
  caloriesContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  caloriesTextContainer: {
    flex: 1,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  caloriesLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: -4,
  },
  caloriesPattern: {
    position: "absolute",
    right: -20,
    bottom: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    marginTop: 8,
  },

  // Macros Grid
  macrosGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  macroCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  macroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },

  // Meal Type Section
  mealTypeSection: {
    marginBottom: 24,
  },
  mealTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  mealTypeCard: {
    width: (width - 64) / 2,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    position: "relative",
  },
  mealTypeCardActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealTypeIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  mealTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  mealTypeCheckmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // Predictions
  predictionsSection: {
    marginBottom: 24,
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  predictionRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  predictionContent: {
    flex: 1,
  },
  predictionName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
    minWidth: 50,
    textAlign: "right",
  },

  // Update Button
  updateButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  updateGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  updateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  weightInput: {
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  modalSaveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});