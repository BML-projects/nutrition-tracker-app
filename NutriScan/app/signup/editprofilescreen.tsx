import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  changePassword,
} from '@/services/profile-api';
interface User {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  height: number;
  weight: number;
  dob: string;
  profilePhoto?: string;
  goal: string;
  activityLevel: string;
  bmi: number;
  bmr: number;
  dailyCalories: number;
  targetWeight?: number;
  timeline?: string;
  estimatedWeeks?: number;
  estimatedCompletionDate?: string;
}

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>('profile');

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dob, setDob] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      const userData = response.user;
      setUser(userData);

      // Populate form fields
      setFullName(userData.fullName || '');
      setGender(userData.gender || '');
      setHeight(userData.height?.toString() || '');
      setWeight(userData.weight?.toString() || '');
      setDob(userData.dob || '');
      setProfilePhoto(userData.profilePhoto);
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Please grant camera roll permissions to change your profile photo'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset);
        setProfilePhoto(asset.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeProfilePhoto = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfilePhoto(undefined);
            setSelectedImage(null);
          },
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    try {
      if (!fullName.trim()) {
        Alert.alert('Validation Error', 'Please enter your full name');
        return;
      }

      if (!gender) {
        Alert.alert('Validation Error', 'Please select your gender');
        return;
      }

      const heightNum = parseFloat(height);
      if (!height || isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
        Alert.alert('Validation Error', 'Please enter a valid height (50-300 cm)');
        return;
      }

      const weightNum = parseFloat(weight);
      if (!weight || isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
        Alert.alert('Validation Error', 'Please enter a valid weight (20-300 kg)');
        return;
      }

      setSaving(true);

      const profileData = {
        fullName: fullName.trim(),
        gender,
        height: heightNum,
        weight: weightNum,
        dob,
      };

      await updateProfile(profileData);

      if (selectedImage) {
        const photoData = {
          uri: selectedImage.uri,
          fileName: selectedImage.fileName || 'profile.jpg',
          type: selectedImage.mimeType || 'image/jpeg',
        };
        await uploadProfilePhoto(photoData);
      }

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Validation Error', 'Please fill in all password fields');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Validation Error', 'New password must be at least 6 characters long');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Validation Error', 'New passwords do not match');
        return;
      }

      if (currentPassword === newPassword) {
        Alert.alert('Validation Error', 'New password must be different from current password');
        return;
      }

      setSaving(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      Alert.alert('Success', 'Password changed successfully');
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerPlaceholder} />
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'profile' && styles.activeTab]}
          onPress={() => setActiveSection('profile')}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={activeSection === 'profile' ? '#6366f1' : '#64748b'}
          />
          <Text style={[styles.tabText, activeSection === 'profile' && styles.activeTabText]}>
            Profile Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeSection === 'password' && styles.activeTab]}
          onPress={() => setActiveSection('password')}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={activeSection === 'password' ? '#6366f1' : '#64748b'}
          />
          <Text style={[styles.tabText, activeSection === 'password' && styles.activeTabText]}>
            Password
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === 'profile' ? (
          <View style={styles.section}>
            {/* Profile Hero Card */}
            <View style={styles.profileHeroCard}>
              <View style={styles.avatarContainer}>
                {profilePhoto ? (
                  <Image
                    source={{ uri: profilePhoto }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <Ionicons name="person" size={50} color="#fff" />
                  </LinearGradient>
                )}
                
                <View style={styles.avatarBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                </View>
              </View>

              <Text style={styles.profileName}>{fullName || user?.fullName || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
              
              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                  <Ionicons name="camera" size={18} color="#fff" />
                  <Text style={styles.changePhotoButtonText}>
                    {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                  </Text>
                </TouchableOpacity>

                {profilePhoto && (
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={removeProfilePhoto}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user?.email || ''}
                  editable={false}
                />
                <Text style={styles.helperText}>Email cannot be changed</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender *</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                    onPress={() => setGender('male')}
                  >
                    <Ionicons name="male" size={20} color={gender === 'male' ? '#fff' : '#64748b'} />
                    <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                    onPress={() => setGender('female')}
                  >
                    <Ionicons name="female" size={20} color={gender === 'female' ? '#fff' : '#64748b'} />
                    <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Height (cm) *</Text>
                  <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    placeholder="170"
                    keyboardType="numeric"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Weight (kg) *</Text>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="70"
                    keyboardType="numeric"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth *</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={dob}
                  editable={false}
                />
                <Text style={styles.helperText}>Date of birth cannot be changed</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Change Password</Text>
            <Text style={styles.sectionDescription}>
              Ensure your password is at least 6 characters long for security
            </Text>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password *</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    secureTextEntry={!showCurrentPassword}
                    placeholderTextColor="#94a3b8"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showCurrentPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password *</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    secureTextEntry={!showNewPassword}
                    placeholderTextColor="#94a3b8"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password *</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#94a3b8"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={newPassword.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={newPassword.length >= 6 ? '#10b981' : '#94a3b8'}
                  />
                  <Text style={styles.requirementText}>At least 6 characters</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      newPassword === confirmPassword && newPassword.length > 0
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={16}
                    color={
                      newPassword === confirmPassword && newPassword.length > 0
                        ? '#10b981'
                        : '#94a3b8'
                    }
                  />
                  <Text style={styles.requirementText}>Passwords match</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleChangePassword}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="key" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Change Password</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#64748b' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerPlaceholder: { width: 40 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  activeTab: { borderBottomColor: '#6366f1' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#6366f1' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  section: { gap: 24 },
  
  // Profile Hero Card Styles
  profileHeroCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.08, 
        shadowRadius: 12 
      },
      android: { elevation: 4 },
    }),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 8 
      },
      android: { elevation: 3 },
    }),
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 8 
      },
      android: { elevation: 3 },
    }),
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      },
      android: { elevation: 2 },
    }),
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: { 
        shadowColor: '#6366f1', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 4 
      },
      android: { elevation: 2 },
    }),
  },
  changePhotoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  removePhotoButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  sectionDescription: { fontSize: 14, color: '#64748b', marginTop: -8, marginBottom: 16 },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155' },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  disabledInput: { backgroundColor: '#f8fafc', color: '#94a3b8' },
  helperText: { fontSize: 12, color: '#64748b', marginTop: 4 },
  genderContainer: { flexDirection: 'row', gap: 12 },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  genderButtonActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  genderButtonText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  genderButtonTextActive: { color: '#fff' },
  rowInputs: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#1e293b' },
  eyeIcon: { padding: 12 },
  requirementsContainer: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, gap: 8 },
  requirementsTitle: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 4 },
  requirementItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requirementText: { fontSize: 13, color: '#64748b' },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    ...Platform.select({
      ios: { shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});