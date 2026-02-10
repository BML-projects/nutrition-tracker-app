import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ================= Screen & Container ================= */
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  container: {
    padding: 20,
    paddingBottom: 100,
  },

  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  /* ================= Header ================= */
  header: {
    marginBottom: 24,
    paddingTop: 10,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "400",
  },

  /* ================= Profile Hero Card ================= */
  profileHeroCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatarGradient: {
    backgroundColor: "#D37034",
    height: 90,
    width: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D37034",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },

  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#D37034',
    borderRadius: 12,
    shadowColor: "#D37034",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  /* ================= Health Metrics Grid ================= */
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },

  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },

  metricLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },

  metricSubtext: {
    fontSize: 11,
    color: '#999',
  },

  metricBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  metricBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  /* ================= Sections ================= */
  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  /* ================= Cards ================= */
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  /* ================= Goal Selector ================= */
  goalSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  goalSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  goalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3e7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalSelectorLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },

  goalSelectorValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  /* ================= Options Container ================= */
  optionsContainer: {
    marginTop: 16,
    gap: 10,
  },

  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  optionItemActive: {
    backgroundColor: '#e7f5ff',
    borderColor: '#D37034',
  },

  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  /* ================= Activity Options ================= */
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  activityOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  activityOptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  activityOptionDesc: {
    fontSize: 12,
    color: '#666',
  },

  /* ================= Calories Comparison ================= */
  caloriesComparison: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  caloriesComparisonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },

  caloriesRow: {
    flexDirection: 'row',
    gap: 10,
  },

  caloriesItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  caloriesItemActive: {
    backgroundColor: '#fef3e7',
    borderColor: '#D37034',
  },

  caloriesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 6,
    marginBottom: 4,
  },

  caloriesValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },

  caloriesUnit: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  /* ================= Personal Info Rows ================= */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fef3e7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  /* ================= Quick Actions ================= */
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  logoutCard: {
    borderWidth: 1,
    borderColor: '#fee2e2',
  },

  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },

  actionSubtitle: {
    fontSize: 13,
    color: '#666',
  },

  /* ================= Modal Styles ================= */
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },

  /* ================= Photo Picker ================= */
  photoPickerContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#D37034",
  },

  photoImage: {
    width: 100,
    height: 100,
  },

  photoPickerText: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },

  /* ================= Input Fields ================= */
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#000",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  /* ================= Gender Selector ================= */
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },

  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  genderButtonActive: {
    backgroundColor: "#fef3e7",
    borderColor: "#D37034",
  },

  genderButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },

  genderButtonTextActive: {
    color: "#D37034",
  },

  /* ================= Modal Actions ================= */
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 15,
  },

  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#D37034",
    alignItems: "center",
    shadowColor: "#D37034",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  /* ================= Bottom Navigation ================= */
  nav: {
    position: "absolute",
    bottom: 0,
    height: 70,
    width: "100%",
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },

  navButton: {
    padding: 10,
  },

  //  avatarGradient: {
  //   width: 80,
  //   height: 80,
  //   borderRadius: 40,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#D37034", // or your gradient
  // },

  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  navActive: {
    backgroundColor: "#D37034",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#D37034",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },


  // Target Weight Section Styles
targetWeightContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 4,
},
targetWeightLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
targetIconContainer: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#fef3c7',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
},
targetLabel: {
  fontSize: 13,
  color: '#666',
  marginBottom: 2,
},
targetValue: {
  fontSize: 18,
  fontWeight: '600',
  color: '#000',
},
targetHint: {
  fontSize: 14,
  color: '#999',
  marginTop: 2,
},
timelineBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  marginTop: 6,
  alignSelf: 'flex-start',
},
timelineBadgeText: {
  fontSize: 11,
  color: '#666',
  marginLeft: 4,
  fontWeight: '500',
},
targetPlanCard: {
  backgroundColor: '#f8f9fa',
  borderRadius: 12,
  padding: 12,
  marginTop: 16,
},
targetPlanRow: {
  flexDirection: 'row',
  marginBottom: 12,
},
targetPlanItem: {
  flex: 1,
  alignItems: 'center',
},
targetPlanDivider: {
  width: 1,
  height: 50,
  backgroundColor: '#e0e0e0',
  marginHorizontal: 8,
},
targetPlanLabel: {
  fontSize: 11,
  color: '#666',
  marginTop: 4,
},
targetPlanValue: {
  fontSize: 15,
  fontWeight: '600',
  color: '#000',
  marginTop: 2,
},
weightToGoCard: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 10,
},
weightToGoText: {
  fontSize: 13,
  color: '#333',
  marginLeft: 6,
  fontWeight: '500',
},

});