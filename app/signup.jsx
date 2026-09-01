import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  Redirect,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS } from '../constants/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const {
    register,
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCreatingAccount, setIsCreatingAccount] =
    useState(false);

  const clearError = (field) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleStudentIdChange = (value) => {
    const numbersOnly = value
      .replace(/\D/g, '')
      .slice(0, 8);

    setStudentId(numbersOnly);
    clearError('studentId');
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

    if (!/^\d{8}$/.test(studentId)) {
      nextErrors.studentId =
        'Student ID must contain exactly 8 digits.';
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

    if (password.length < 6) {
      nextErrors.password =
        'Password must contain at least 6 characters.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        'Please confirm your password.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword =
        'The passwords do not match.';
    }

    if (!agreed) {
      nextErrors.agreed =
        'You must agree to the Terms and Privacy Policy.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const createAccount = async () => {
  if (!validateForm()) {
    return;
  }

  setIsCreatingAccount(true);

  try {
    await register({
      fullName,
      studentId,
      email,
      phone,
      password,
    });

    router.replace({
      pathname: '/account-created',
      params: {
        from: 'signup',
      },
    });
  } catch (error) {
    setIsCreatingAccount(false);

    Alert.alert(
      'Account Creation Failed',
      error.message ||
        'Unable to create your account. Please try again.'
    );
  }
};

  if (!isAuthReady) {
  return null;
  }

  if (
    isAuthenticated &&
    !isCreatingAccount
  ) {
  return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Sign Up</Text>

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
            label="Student ID Number"
            value={studentId}
            onChangeText={handleStudentIdChange}
            keyboardType="number-pad"
            maxLength={8}
            placeholder="e.g. 11124499"
            error={errors.studentId}
          />

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
            label="Phone Number"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={15}
            placeholder="e.g. 0240000000"
            error={errors.phone}
          />

          <FormInput
            label="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              clearError('password');
            }}
            secureTextEntry
            placeholder="Create a password"
            error={errors.password}
          />

          <FormInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              clearError('confirmPassword');
            }}
            secureTextEntry
            placeholder="Re-enter your password"
            error={errors.confirmPassword}
          />
        </View>

        <Pressable
          style={styles.terms}
          onPress={() => {
            setAgreed((currentValue) => !currentValue);
            clearError('agreed');
          }}
        >
          <View
            style={[
              styles.checkbox,
              agreed && styles.checkboxChecked,
              errors.agreed && styles.checkboxError,
            ]}
          >
            {agreed ? (
              <Ionicons
                name="checkmark"
                size={17}
                color={COLORS.surface}
              />
            ) : null}
          </View>

          <Text style={styles.termsText}>
            I agree to the Terms & Privacy
          </Text>
        </Pressable>

        {errors.agreed ? (
          <Text style={styles.termsError}>
            {errors.agreed}
          </Text>
        ) : null}

        <AppButton
          title="Create Account"
          onPress={createAccount}
          style={styles.createButton}
        />

        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.switchText}>
            Already have an account?{' '}
            <Text style={styles.link}>Login</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },

  content: {
    paddingHorizontal: 38,
    paddingTop: 120,
    paddingBottom: 80,
  },

  circleTop: {
    position: 'absolute',
    top: -110,
    left: -85,
    width: 285,
    height: 285,
    borderRadius: 143,
    backgroundColor: COLORS.decorative,
  },

  circleBottom: {
    position: 'absolute',
    right: -72,
    bottom: -72,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.decorative,
  },

  title: {
    fontSize: 30,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 25,
  },

  fields: {
    gap: 18,
  },

  terms: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginTop: 28,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5E6674',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  checkboxError: {
    borderColor: COLORS.danger,
  },

  termsText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },

  termsError: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 7,
    marginLeft: 35,
  },

  createButton: {
    width: 180,
    alignSelf: 'center',
    marginTop: 26,
    borderRadius: RADIUS.pill,
  },

  switchText: {
    textAlign: 'center',
    marginTop: 24,
    color: COLORS.muted,
  },

  link: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});