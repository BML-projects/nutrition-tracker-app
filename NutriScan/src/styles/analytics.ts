import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_PADDING = 16;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  container: {
    padding: 16,
    paddingBottom: 20,
  },

  // Header
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
    color: '#1A1A1A',
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
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Quick Stats
  quickStats: {
    marginBottom: 20,
  },

  quickStatsContent: {
    paddingRight: 16,
  },

  statsCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
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

  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: CARD_PADDING,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
    flex: 1,
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },

  // Segmented Control
  segment: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },

  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  segmentActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },

  segmentTextActive: {
    color: '#1A1A1A',
  },

  // Enhanced Chart
  chartContainer: {
    marginVertical: 10,
  },

  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginBottom: 10,
  },

  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  barValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },

  barContainer: {
    width: '80%',
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  bar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 4,
  },

  barLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
  },

  // Weight Info
  weightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },

  weightBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },

  weightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  weightInfoItem: {
    alignItems: 'center',
  },

  weightInfoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },

  weightInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  weightInfoDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },

  // Goal Card
  goalCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
  },

  goalText: {
    fontSize: 15,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },

  progressContainer: {
    marginBottom: 20,
  },

  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
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
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
  },

  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  goalStatItem: {
    alignItems: 'center',
    flex: 1,
  },

  goalStatLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    marginBottom: 4,
  },

  goalStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // Weekly Progress
  dateRange: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  summaryCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
  },

  summaryCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginVertical: 8,
  },

  summaryCardLabel: {
    fontSize: 12,
    color: '#666',
  },

  // Daily Breakdown
  dailyBreakdown: {
    marginTop: 10,
  },

  breakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  breakdownDay: {
    width: 40,
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },

  breakdownBars: {
    flex: 1,
    marginHorizontal: 12,
  },

  breakdownBarContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },

  breakdownBar: {
    height: '100%',
    borderRadius: 3,
  },

  breakdownNet: {
    width: 50,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },

  // Achievements
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  achievementCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
  },

  achievementValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginVertical: 8,
  },

  achievementLabel: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },

  // Legacy support for old chart (can be removed)
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },

  chartCol: {
    alignItems: 'center',
  },

  chartBar: {
    width: 40,
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
  },

  chartLabel: {
    fontSize: 12,
    color: '#999',
  },

  // Old styles for compatibility
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  dashedBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },

  centerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },

  subTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  bold: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
});