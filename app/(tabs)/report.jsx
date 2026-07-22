import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import AppButton from '../../components/AppButton';
import FormInput from '../../components/FormInput';
import ScreenHeader from '../../components/ScreenHeader';
import { COLORS, RADIUS } from '../../constants/theme';

import {
  RETRIEVAL_LOCATIONS,
} from '../../constants/retrievalLocations';



export default function ReportScreen() {
  const router = useRouter();

  const [photo, setPhoto] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [confirmStudentId, setConfirmStudentId] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [retrievalLocation, setRetrievalLocation] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const clearError = (field) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const saveSelectedPhoto = (result) => {
    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0]);
      clearError('photo');
    }
  };

  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Camera permission required',
        'Please allow RetrieveID to use your camera so you can photograph the found ID.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      cameraType: ImagePicker.CameraType.back,
      allowsEditing: false,
      quality: 0.8,
    });

    saveSelectedPhoto(result);
  };

  const chooseFromLibrary = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Photo permission required',
        'Please allow RetrieveID to access your photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    saveSelectedPhoto(result);
  };

  const showPhotoOptions = () => {
    const options = [
      {
        text: 'Take Photo',
        onPress: takePhoto,
      },
      {
        text: 'Choose from Library',
        onPress: chooseFromLibrary,
      },
    ];

    if (photo) {
      options.push({
        text: 'Remove Photo',
        style: 'destructive',
        onPress: () => {
          setPhoto(null);
          setErrors((currentErrors) => ({
            ...currentErrors,
            photo: 'Please upload a clear photo of the ID.',
          }));
        },
      });
    }

    options.push({
      text: 'Cancel',
      style: 'cancel',
    });

    Alert.alert(
      'Upload ID Photo',
      'Choose how you would like to add the photo.',
      options
    );
  };

  const handleStudentIdChange = (value) => {
    const numbersOnly = value.replace(/\D/g, '').slice(0, 8);

    setStudentId(numbersOnly);
    clearError('studentId');

    if (confirmStudentId) {
      clearError('confirmStudentId');
    }
  };

  const handleConfirmStudentIdChange = (value) => {
    const numbersOnly = value.replace(/\D/g, '').slice(0, 8);

    setConfirmStudentId(numbersOnly);
    clearError('confirmStudentId');
  };

  const handleContactChange = (value) => {
    const acceptedCharacters = value.replace(/[^\d+]/g, '').slice(0, 15);

    setContact(acceptedCharacters);
    clearError('contact');
  };

  const selectRetrievalLocation = (location) => {
    setRetrievalLocation(location);
    setLocationModalVisible(false);
    clearError('retrievalLocation');
  };

  const findNearestLocation = () => {
    /*
      This is temporary frontend behaviour.
      Real GPS functionality will be connected later.
    */

    const temporaryNearestLocation =
          RETRIEVAL_LOCATIONS[0].name;

    setRetrievalLocation(temporaryNearestLocation);
    clearError('retrievalLocation');

    Alert.alert(
      'Nearest retrieval location',
      `${temporaryNearestLocation} has been selected for this frontend demonstration.`
    );
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!photo) {
      nextErrors.photo = 'Please upload a clear photo of the ID.';
    }

    if (!/^\d{8}$/.test(studentId)) {
      nextErrors.studentId =
        'Student ID must contain exactly 8 digits.';
    }

    if (!confirmStudentId) {
      nextErrors.confirmStudentId =
        'Please confirm the Student ID number.';
    } else if (studentId !== confirmStudentId) {
      nextErrors.confirmStudentId =
        'The Student ID numbers do not match.';
    }

    const contactDigits = contact.replace(/\D/g, '');

    if (!contact) {
      nextErrors.contact = 'Please enter your contact number.';
    } else if (
      contactDigits.length < 10 ||
      contactDigits.length > 15
    ) {
      nextErrors.contact =
        'Please enter a valid contact number.';
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!retrievalLocation) {
      nextErrors.retrievalLocation =
        'Please select a retrieval location.';
    }

    if (!confirmed) {
      nextErrors.confirmed =
        'You must confirm that you will submit the physical ID.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const submitReport = () => {
    const formIsValid = validateForm();

    if (!formIsValid) {
      Alert.alert(
        'Incomplete report',
        'Please correct the highlighted fields before submitting.'
      );
      return;
    }

    /*
      The report is not being sent to a backend yet.
      We currently navigate to the success screen with the
      selected retrieval location and Student ID.
    */

    router.push({
      pathname: '/report-submitted',
      params: {
        location: retrievalLocation,
        studentId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title="Report" />

          <Text style={styles.heading}>
            Help a Student Recover their ID
          </Text>

          <Text style={styles.intro}>
            Fill in the details below and submit the Student ID
            to the selected retrieval location.
          </Text>

          <View style={styles.photoSection}>
            <Pressable
              style={[
                styles.uploadBox,
                errors.photo ? styles.uploadBoxError : null,
              ]}
              onPress={showPhotoOptions}
            >
              {photo ? (
                <>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.photoPreview}
                    resizeMode="cover"
                  />

                  <View style={styles.photoOverlay}>
                    <Ionicons
                      name="camera-outline"
                      size={22}
                      color={COLORS.surface}
                    />

                    <Text style={styles.replacePhotoText}>
                      Tap to replace photo
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Ionicons
                    name="camera-outline"
                    size={30}
                    color={COLORS.text}
                  />

                  <Text style={styles.uploadTitle}>
                    Upload ID Photo
                  </Text>

                  <Text style={styles.uploadHint}>
                    Take a clear photo of the front of the ID card.
                  </Text>

                  <View style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>
                      Upload Photo
                    </Text>
                  </View>
                </>
              )}
            </Pressable>

            {photo ? (
              <Pressable
                style={styles.removePhotoButton}
                onPress={() => setPhoto(null)}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={COLORS.danger}
                />

                <Text style={styles.removePhotoText}>
                  Remove photo
                </Text>
              </Pressable>
            ) : null}

            {errors.photo ? (
              <Text style={styles.sectionError}>
                {errors.photo}
              </Text>
            ) : null}
          </View>

          <View style={styles.fields}>
            <FormInput
              label="Enter Student ID Number"
              value={studentId}
              onChangeText={handleStudentIdChange}
              keyboardType="number-pad"
              maxLength={8}
              placeholder="e.g. 11124499"
              error={errors.studentId}
            />

            <FormInput
              label="Confirm Student ID Number"
              value={confirmStudentId}
              onChangeText={handleConfirmStudentIdChange}
              keyboardType="number-pad"
              maxLength={8}
              placeholder="Re-enter the Student ID"
              error={errors.confirmStudentId}
            />

            <FormInput
              label="Your Contact"
              value={contact}
              onChangeText={handleContactChange}
              keyboardType="phone-pad"
              maxLength={15}
              placeholder="e.g. 0240000000"
              error={errors.contact}
            />

            <FormInput
              label="Your Email (optional)"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                clearError('email');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="e.g. student@email.com"
              error={errors.email}
            />

            <FormInput
              label="Found Location (optional)"
              value={foundLocation}
              onChangeText={setFoundLocation}
              autoCapitalize="words"
              placeholder="e.g. Balme Library"
            />
          </View>

          <View
            style={[
              styles.locationCard,
              errors.retrievalLocation
                ? styles.locationCardError
                : null,
            ]}
          >
            <Text style={styles.locationTitle}>
              Select Retrieval Location
            </Text>

            <Text style={styles.locationHint}>
              Choose where you will submit the physical Student ID.
            </Text>

            <Pressable
              style={styles.locationOption}
              onPress={() => setLocationModalVisible(true)}
            >
              <Text
                style={[
                  styles.locationOptionText,
                  !retrievalLocation
                    ? styles.locationPlaceholder
                    : null,
                ]}
              >
                {retrievalLocation || 'Select from list'}
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color={COLORS.text}
              />
            </Pressable>

            <Text style={styles.or}>OR</Text>

            <Pressable
              style={styles.locationOption}
              onPress={findNearestLocation}
            >
              <View style={styles.nearestRow}>
                <Ionicons
                  name="locate-outline"
                  size={20}
                  color={COLORS.text}
                />

                <Text style={styles.locationOptionText}>
                  Find Nearest Location
                </Text>
              </View>
            </Pressable>

            {errors.retrievalLocation ? (
              <Text style={styles.locationError}>
                {errors.retrievalLocation}
              </Text>
            ) : null}
          </View>

          <Pressable
            style={styles.confirmRow}
            onPress={() => {
              setConfirmed((currentValue) => !currentValue);
              clearError('confirmed');
            }}
          >
            <View
              style={[
                styles.checkbox,
                confirmed ? styles.checked : null,
                errors.confirmed ? styles.checkboxError : null,
              ]}
            >
              {confirmed ? (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={COLORS.surface}
                />
              ) : null}
            </View>

            <Text style={styles.confirmText}>
              I confirm that I will submit the physical ID to the
              selected retrieval location.
            </Text>
          </Pressable>

          {errors.confirmed ? (
            <Text style={styles.confirmError}>
              {errors.confirmed}
            </Text>
          ) : null}

          <AppButton
            title="Submit Report"
            onPress={submitReport}
            style={styles.submit}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={locationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackground}
            onPress={() => setLocationModalVisible(false)}
          />

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select Retrieval Location
              </Text>

              <Pressable
                onPress={() => setLocationModalVisible(false)}
                hitSlop={10}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={COLORS.text}
                />
              </Pressable>
            </View>

            {RETRIEVAL_LOCATIONS.map((location) => {
                  const isSelected =
                  retrievalLocation === location.name;

              return (
                <Pressable
                  key={location.id}
                  style={styles.modalLocationRow}
                  onPress={() =>
                    selectRetrievalLocation(location.name)
                  }
                >
                  <View style={styles.modalLocationLeft}>
                    <Ionicons
                      name="location-outline"
                      size={21}
                      color={COLORS.primary}
                    />

                    <Text style={styles.modalLocationText}>
                      {location.name}
                    </Text>
                  </View>

                  {isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={23}
                      color={COLORS.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 50,
  },

  heading: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },

  intro: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    marginTop: 18,
    maxWidth: 330,
  },

  photoSection: {
    marginTop: 38,
  },

  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: RADIUS.large,
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    overflow: 'hidden',
  },

  uploadBoxError: {
    borderColor: COLORS.danger,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: COLORS.text,
  },

  uploadHint: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    color: COLORS.text,
  },

  uploadButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: 14,
  },

  uploadButtonText: {
    color: COLORS.surface,
    fontWeight: '500',
  },

  photoPreview: {
    width: '100%',
    height: 230,
  },

  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 48,
    backgroundColor: 'rgba(17, 24, 39, 0.72)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  replacePhotoText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '500',
  },

  removePhotoButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 4,
  },

  removePhotoText: {
    color: COLORS.danger,
    fontSize: 13,
  },

  sectionError: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
  },

  fields: {
    gap: 24,
    marginTop: 38,
  },

  locationCard: {
    marginTop: 38,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.large,
    padding: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  locationCardError: {
    borderColor: COLORS.danger,
  },

  locationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },

  locationHint: {
    fontSize: 14,
    lineHeight: 19,
    color: COLORS.text,
    marginTop: 15,
  },

  locationOption: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    marginTop: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  locationOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },

  locationPlaceholder: {
    color: COLORS.muted,
  },

  or: {
    textAlign: 'center',
    color: COLORS.text,
    marginTop: 12,
  },

  nearestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  locationError: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 10,
  },

  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 34,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#596170',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  checkboxError: {
    borderColor: COLORS.danger,
  },

  confirmText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text,
  },

  confirmError: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 32,
  },

  submit: {
    marginTop: 34,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },

  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 36,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.text,
  },

  modalLocationRow: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalLocationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  modalLocationText: {
    color: COLORS.text,
    fontSize: 15,
    flex: 1,
  },
});