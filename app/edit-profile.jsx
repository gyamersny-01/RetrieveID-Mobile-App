import {
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Redirect,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS } from '../constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const {
    user,
    updateProfile,
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (!user) {
    return;
  }

  setFullName(user.fullName || '');
  setEmail(user.email || '');
  setPhone(user.phone || '');
  }, [user]);

  const clearError = (field) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handlePhoneChange = (value) => {
    const validCharacters = value
      .replace(/[^\d+]/g, '')
      .slice(0, 15);

    setPhone(validCharacters);
    clearError('phone');
  };

  const validateForm = () => {
    const nextErrors = {};

    if (fullName.trim().length < 3) {
      nextErrors.fullName =
        'Please enter your full name.';
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      nextErrors.email =
        'Please enter a valid email address.';
    }

    const phoneDigits = phone.replace(/\D/g, '');

    if (
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
    ) {
      nextErrors.phone =
        'Please enter a valid phone number.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const saveChanges = () => {
    if (!validateForm()) {
      return;
    }

    updateProfile({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    });

    Alert.alert(
      'Profile Updated',
      'Your profile information has been updated successfully.',
      [
        {
          text: 'OK',
          onPress: () =>
            router.replace('/(tabs)/account'),
        },
      ]
    );
  };

  if (!isAuthReady) {
  return null;
}

if (!isAuthenticated || !user) {
  return <Redirect href="/welcome" />;
}

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title="Edit Profile" />

          <Text style={styles.intro}>
            Update your personal and contact information.
          </Text>

          <View style={styles.fields}>
            <FormInput
              label="Full Name"
              value={fullName}
              onChangeText={(value) => {
                setFullName(value);
                clearError('fullName');
              }}
              autoCapitalize="words"
              placeholder="Enter your full name"
              error={errors.fullName}
            />

            <FormInput
              label="Student ID"
              value={user?.studentId || ''}
              editable={false}
              inputStyle={styles.disabledInput}
            />

            <Text style={styles.studentIdNote}>
              Your Student ID is linked to your account and
              cannot be changed from this screen.
            </Text>

            <FormInput
              label="Email Address"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                clearError('email');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your email address"
              error={errors.email}
            />

            <FormInput
              label="Mobile Number"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={15}
              placeholder="Enter your mobile number"
              error={errors.phone}
            />
          </View>

          <AppButton
            title="Save Changes"
            onPress={saveChanges}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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

  intro: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 15,
  },

  fields: {
    gap: 24,
    marginTop: 34,
  },

  disabledInput: {
    backgroundColor: '#E5E7EB',
    color: COLORS.muted,
  },

  studentIdNote: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -16,
  },

  saveButton: {
    marginTop: 38,
    borderRadius: RADIUS.small,
  },
});