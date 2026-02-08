import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    paddingBottom: 20,
  },

  /* ================= Header ================= */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  /* ================= Tabs ================= */
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    gap: 8,
  },

  tabActive: {
    backgroundColor: '#fef3e7',
    borderWidth: 2,
    borderColor: '#D37034',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },

  tabTextActive: {
    color: '#D37034',
  },

  /* ================= Content ================= */
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* ================= Photo Section ================= */
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  photoContainer: {
    marginBottom: 12,
  },

  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
  },

  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fef3e7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#D37034',
    borderStyle: 'dashed',
  },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D37034',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  photoHint: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  /* ================= Input Groups ================= */
  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    padding: 0,
  },

  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },

  disabledText: {
    flex: 1,
    fontSize: 15,
    color: '#999',
  },

  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    marginLeft: 4,
  },

  dateText: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },

  valueText: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },

  /* ================= Gender Selector ================= */
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  genderOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },

  genderOptionActive: {
    backgroundColor: '#fef3e7',
    borderColor: '#D37034',
  },

  genderLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },

  genderLabelActive: {
    color: '#D37034',
  },

  /* ================= Picker ================= */
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: -10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D37034',
    overflow: 'hidden',
  },

  picker: {
    width: '100%',
  },

  /* ================= Buttons ================= */
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D37034',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#D37034',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  saveButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  /* ================= Security Tab ================= */
  securityHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },

  securityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 12,
    marginBottom: 6,
  },

  securitySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  /* ================= Password Strength ================= */
  passwordStrength: {
    marginBottom: 20,
  },

  strengthLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  strengthBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },

  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },

  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
});