import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // ==================== MAIN CONTAINER ====================
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },

  // ==================== HEADER ====================
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // ==================== QUICK STATS ====================
  quickStats: {
    marginBottom: 20,
  },
  quickStatsContent: {
    paddingRight: 16,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statsSubValue: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  // ==================== CARD STYLES ====================
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  // ==================== SEGMENTED CONTROL ====================
  segment: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  segmentTextActive: {
    color: '#D37034',
  },

  // ==================== CHART STYLES ====================
  chartContainer: {
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    marginBottom: 12,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 4,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },

  // ==================== WEIGHT INFO ====================
  weightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  weightBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 4,
  },
  weightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  weightInfoItem: {
    alignItems: 'center',
  },
  weightInfoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  weightInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  weightInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },

  // ==================== GOAL STYLES ====================
  goalCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  goalStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  goalStatLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginBottom: 4,
  },
  goalStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  // ==================== WEEKLY PROGRESS ====================
  dateRange: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    marginRight: '2%',
    borderLeftWidth: 3,
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryCardLabel: {
    fontSize: 12,
    color: '#666',
  },

  // ==================== DAILY BREAKDOWN ====================
  dailyBreakdown: {
    marginTop: 12,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  breakdownDay: {
    width: 50,
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  breakdownBars: {
    flex: 1,
    marginHorizontal: 12,
  },
  breakdownBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginVertical: 2,
    overflow: 'hidden',
  },
  breakdownBar: {
    height: '100%',
    borderRadius: 3,
  },
  breakdownNet: {
    width: 60,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },

  // ==================== ACHIEVEMENTS ====================
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  achievementCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
  },
  achievementLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },

  // ==================== SKELETON LOADER ====================
  skeletonBox: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
  },

  // ==================== EMPTY STATES ====================
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateIcon: {
    marginBottom: 12,
  },
  emptyStateText: {
    marginTop: 12,
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
  emptyStateButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#D37034',
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // ==================== ERROR STATES ====================
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#D37034',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // ==================== UTILITY STYLES ====================
  bold: {
    fontWeight: '700',
  },
  semiBold: {
    fontWeight: '600',
  },
  medium: {
    fontWeight: '500',
  },
  textCenter: {
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  mt8: {
    marginTop: 8,
  },
  mt12: {
    marginTop: 12,
  },
  mt16: {
    marginTop: 16,
  },
  mt20: {
    marginTop: 20,
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mb16: {
    marginBottom: 16,
  },
  mb20: {
    marginBottom: 20,
  },
});

export default styles;