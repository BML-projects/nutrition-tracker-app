import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ================= Screen ================= */
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    padding: 16,
    paddingBottom: 90,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 20,
  },

  section: {
    marginBottom: 20,
  },

  /* ================= Section Badge ================= */
  sectionBadge: {
    backgroundColor: "#D37034",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
    color: "#000",
    fontWeight: "600",
  },

  /* ================= Cards ================= */
  card: {
    backgroundColor: "#E5E5E5",
    borderRadius: 16,
    padding: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },

  cardSub: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
  },

  /* ================= Rows ================= */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  rowLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  valueText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 14,
  },

  /* ================= Appearance ================= */
  appearancePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D37034",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },

  appearanceText: {
    color: "#000",
    fontWeight: "600",
  },

  optionBox: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 10,
  },

  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  optionText: {
    fontSize: 14,
    color: "#333",
  },

  /* ================= Profile ================= */
  profileCard: {
    backgroundColor: "#E5E5E5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 10,
  },

  avatar: {
    backgroundColor: "#D37034",
    height: 70,
    width: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  username: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },

  editProfileButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#D37034',
    borderRadius: 8,
  },

  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },

  menuItem: {
    backgroundColor: "#E5E5E5",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },

  menuText: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },

  /* ================= Bottom Navigation ================= */
  nav: {
    position: "absolute",
    bottom: 0,
    height: 80,
    width: "100%",
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navActive: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 12,
  },

  /* ================= New Styles for Goal Comparison ================= */
  goalComparisonContainer: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  goalComparisonTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },

  goalComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  goalComparisonItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },

  goalComparisonItemActive: {
    backgroundColor: '#e7f5ff',
    borderColor: '#339af0',
    borderWidth: 2,
  },

  goalComparisonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },

  goalComparisonCalories: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212529',
  },

  goalComparisonDescription: {
    fontSize: 10,
    color: '#868e96',
    textAlign: 'center',
    marginTop: 2,
  },

  goalComparisonNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  /* ================= User Details Section ================= */
  userDetailsSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },

  /* ================= Health Metrics ================= */
  metricsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
  },

  metricItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },

  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D37034',
    marginBottom: 2,
  },

  metricSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },










  /* ================= Refresh Control ================= */
  refreshControl: {
    backgroundColor: 'transparent',
  },
});