import { StyleSheet } from "react-native";

export const ITEM_HEIGHT = 50;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pickerSection: {
    flex: 1,
    paddingHorizontal: 30,
  },
  dateDisplay: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 250,
    gap: 12,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pickerWrapper: {
    height: 250,
    position: 'relative',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
selectionIndicator: {
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: ITEM_HEIGHT,
  marginTop: -ITEM_HEIGHT / 2, // exactly half
  backgroundColor: 'transparent',
  borderTopWidth: 2,
  borderBottomWidth: 2,
  borderColor: '#000',
  zIndex: 1,
},
 backButton: {
  position: 'absolute',
  top: 40, // distance from top, adjust if needed
  left: 20, // distance from left
  zIndex: 10,
},

backButtonCircle: {
  backgroundColor: '#fff', // optional
  padding: 10,
  borderRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
  elevation: 5, // for Android shadow
},




  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#999',
  },
  activeItemText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  gradientButton: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 10,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});