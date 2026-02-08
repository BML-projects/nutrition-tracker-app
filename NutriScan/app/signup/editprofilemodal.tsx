import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../src/styles/editprofilemodal';
import { changePassword } from '../../services/profile-api';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    userData: {
        fullName: string;
        email: string;
        gender: string;
        height: number;
        weight: number;
        dob: string;
        profilePhoto?: string;
    };
    onSave: (data: any) => Promise<void>;
}

export default function EditProfileModal({
    visible,
    onClose,
    userData,
    onSave,
}: EditProfileModalProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [loading, setLoading] = useState(false);

    // Profile data
    const [fullName, setFullName] = useState(userData.fullName || '');
    const [gender, setGender] = useState(userData.gender || 'male');
    const [height, setHeight] = useState(userData.height?.toString() || '');
    const [weight, setWeight] = useState(userData.weight?.toString() || '');
    const [dob, setDob] = useState(userData.dob ? new Date(userData.dob) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<any>(null);

    // Password data
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Height/Weight pickers
    const [showHeightPicker, setShowHeightPicker] = useState(false);
    const [showWeightPicker, setShowWeightPicker] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setProfilePhoto(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleSaveProfile = async () => {
        // Validation
        if (!fullName.trim()) {
            Alert.alert('Validation Error', 'Please enter your full name');
            return;
        }

        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);

        if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
            Alert.alert('Validation Error', 'Please enter a valid height (100-250 cm)');
            return;
        }

        if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
            Alert.alert('Validation Error', 'Please enter a valid weight (30-300 kg)');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                fullName,
                gender,
                height: heightNum,
                weight: weightNum,
                dob: dob.toISOString().split('T')[0],
                profilePhoto,
            });
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        // Validation
        if (!currentPassword) {
            Alert.alert('Validation Error', 'Please enter your current password');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Validation Error', 'New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Validation Error', 'New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // Call the actual password change API
            await changePassword({
                currentPassword,
                newPassword,
            });
            
            Alert.alert('Success', 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Generate height options (100-250 cm)
    const heightOptions = Array.from({ length: 151 }, (_, i) => 100 + i);

    // Generate weight options (30-300 kg)
    const weightOptions = Array.from({ length: 271 }, (_, i) => 30 + i);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
                            onPress={() => setActiveTab('profile')}
                        >
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={activeTab === 'profile' ? '#D37034' : '#666'}
                            />
                            <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
                                Profile
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'security' && styles.tabActive]}
                            onPress={() => setActiveTab('security')}
                        >
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={20}
                                color={activeTab === 'security' ? '#D37034' : '#666'}
                            />
                            <Text style={[styles.tabText, activeTab === 'security' && styles.tabTextActive]}>
                                Security
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {activeTab === 'profile' ? (
                            <>
                                {/* Profile Photo */}
                                <View style={styles.photoSection}>
                                    <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                                        <View style={styles.photoCircle}>
                                            {profilePhoto ? (
                                                <Image source={{ uri: profilePhoto.uri }} style={styles.photoImage} />
                                            ) : userData.profilePhoto ? (
                                                <Image source={{ uri: userData.profilePhoto }} style={styles.photoImage} />
                                            ) : (
                                                <View style={styles.photoPlaceholder}>
                                                    <Ionicons name="person" size={50} color="#D37034" />
                                                </View>
                                            )}
                                            <View style={styles.cameraButton}>
                                                <Ionicons name="camera" size={18} color="#fff" />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.photoHint}>Tap to change photo</Text>
                                </View>

                                {/* Full Name */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={fullName}
                                            onChangeText={setFullName}
                                            placeholder="Enter your full name"
                                            placeholderTextColor="#999"
                                        />
                                    </View>
                                </View>

                                {/* Email (Read-only) */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Email</Text>
                                    <View style={[styles.inputContainer, styles.inputDisabled]}>
                                        <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                                        <Text style={styles.disabledText}>{userData.email}</Text>
                                    </View>
                                    <Text style={styles.helperText}>Email cannot be changed</Text>
                                </View>

                                {/* Gender */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Gender</Text>
                                    <View style={styles.genderContainer}>
                                        {[
                                            { value: 'male', icon: 'male', label: 'Male' },
                                            { value: 'female', icon: 'female', label: 'Female' },
                                            { value: 'other', icon: 'transgender', label: 'Other' },
                                        ].map((option) => (
                                            <TouchableOpacity
                                                key={option.value}
                                                style={[
                                                    styles.genderOption,
                                                    gender === option.value && styles.genderOptionActive,
                                                ]}
                                                onPress={() => setGender(option.value)}
                                            >
                                                <Ionicons
                                                    name={option.icon as any}
                                                    size={24}
                                                    color={gender === option.value ? '#D37034' : '#666'}
                                                />
                                                <Text
                                                    style={[
                                                        styles.genderLabel,
                                                        gender === option.value && styles.genderLabelActive,
                                                    ]}
                                                >
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Date of Birth */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Date of Birth</Text>
                                    <TouchableOpacity
                                        style={styles.inputContainer}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <Text style={styles.dateText}>{formatDate(dob)}</Text>
                                        <Ionicons name="chevron-down" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={dob}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={(_event: any, selectedDate: Date | undefined) => {
                                            setShowDatePicker(Platform.OS === 'ios');
                                            if (selectedDate) {
                                                setDob(selectedDate);
                                            }
                                        }}
                                        maximumDate={new Date()}
                                        minimumDate={new Date(1940, 0, 1)}
                                    />
                                )}

                                {/* Height */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Height</Text>
                                    <TouchableOpacity
                                        style={styles.inputContainer}
                                        onPress={() => setShowHeightPicker(!showHeightPicker)}
                                    >
                                        <Ionicons name="resize-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <Text style={styles.valueText}>{height || '170'} cm</Text>
                                        <Ionicons name="chevron-down" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                {showHeightPicker && (
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={height || '170'}
                                            onValueChange={(value: { toString: () => React.SetStateAction<string>; }) => {
                                                setHeight(value.toString());
                                                setShowHeightPicker(false);
                                            }}
                                            style={styles.picker}
                                        >
                                            {heightOptions.map((h) => (
                                                <Picker.Item key={h} label={`${h} cm`} value={h.toString()} />
                                            ))}
                                        </Picker>
                                    </View>
                                )}

                                {/* Weight */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Weight</Text>
                                    <TouchableOpacity
                                        style={styles.inputContainer}
                                        onPress={() => setShowWeightPicker(!showWeightPicker)}
                                    >
                                        <Ionicons name="barbell-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <Text style={styles.valueText}>{weight || '70'} kg</Text>
                                        <Ionicons name="chevron-down" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                {showWeightPicker && (
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={weight || '70'}
                                            onValueChange={(value) => {
                                                setWeight(value.toString());
                                                setShowWeightPicker(false);
                                            }}
                                            style={styles.picker}
                                        >
                                            {weightOptions.map((w) => (
                                                <Picker.Item key={w} label={`${w} kg`} value={w.toString()} />
                                            ))}
                                        </Picker>
                                    </View>
                                )}

                                {/* Save Button */}
                                <TouchableOpacity
                                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                                    onPress={handleSaveProfile}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Text style={styles.saveButtonText}>Saving...</Text>
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                                            <Text style={styles.saveButtonText}>Save Changes</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* Security Tab */}
                                <View style={styles.securityHeader}>
                                    <Ionicons name="shield-checkmark" size={40} color="#D37034" />
                                    <Text style={styles.securityTitle}>Change Password</Text>
                                    <Text style={styles.securitySubtitle}>
                                        Keep your account secure by using a strong password
                                    </Text>
                                </View>

                                {/* Current Password */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Current Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            placeholder="Enter current password"
                                            placeholderTextColor="#999"
                                            secureTextEntry={!showCurrentPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                                            <Ionicons
                                                name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="#666"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* New Password */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>New Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            placeholder="Enter new password"
                                            placeholderTextColor="#999"
                                            secureTextEntry={!showNewPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                            <Ionicons
                                                name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="#666"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.helperText}>Minimum 6 characters</Text>
                                </View>

                                {/* Confirm Password */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Confirm New Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            placeholder="Confirm new password"
                                            placeholderTextColor="#999"
                                            secureTextEntry={!showConfirmPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <Ionicons
                                                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="#666"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Password Strength Indicator */}
                                {newPassword.length > 0 && (
                                    <View style={styles.passwordStrength}>
                                        <Text style={styles.strengthLabel}>Password Strength:</Text>
                                        <View style={styles.strengthBar}>
                                            <View
                                                style={[
                                                    styles.strengthFill,
                                                    {
                                                        width:
                                                            newPassword.length < 6
                                                                ? '33%'
                                                                : newPassword.length < 10
                                                                    ? '66%'
                                                                    : '100%',
                                                        backgroundColor:
                                                            newPassword.length < 6
                                                                ? '#ef4444'
                                                                : newPassword.length < 10
                                                                    ? '#f59e0b'
                                                                    : '#10b981',
                                                    },
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.strengthText}>
                                            {newPassword.length < 6
                                                ? 'Weak'
                                                : newPassword.length < 10
                                                    ? 'Medium'
                                                    : 'Strong'}
                                        </Text>
                                    </View>
                                )}

                                {/* Change Password Button */}
                                <TouchableOpacity
                                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                                    onPress={handleChangePassword}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Text style={styles.saveButtonText}>Changing...</Text>
                                    ) : (
                                        <>
                                            <Ionicons name="shield-checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
                                            <Text style={styles.saveButtonText}>Change Password</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}