import { useState } from 'react';
import {
  Alert,
  Pressable,
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
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const {
  login,
  isAuthenticated,
  isAuthReady,
} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const clearError = (field) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleLogin = () => {
    const nextErrors = {};

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      nextErrors.email =
        'Please enter a valid email address.';
    }

    if (password.length < 6) {
      nextErrors.password =
        'Password must contain at least 6 characters.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    /*
      Temporary frontend login.

      The backend will later verify the account details.
    */

    login();
    router.replace('/(tabs)');
  };

  if (!isAuthReady) {
  return null;
}

if (isAuthenticated) {
  return <Redirect href="/(tabs)" />;
}
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Login</Text>

        <FormInput
          label="Email"
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
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            clearError('password');
          }}
          secureTextEntry
          placeholder="Enter your password"
          containerStyle={styles.field}
          error={errors.password}
        />

        <Pressable
          style={styles.forgot}
          onPress={() => {
            Alert.alert(
              'Forgot Password',
              'Password recovery will be connected when the backend is developed.'
            );
          }}
        >
          <Text style={styles.forgotText}>
            Forgot your password?
          </Text>
        </Pressable>

        <AppButton
          title="Login"
          onPress={handleLogin}
          style={styles.loginButton}
        />

        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.switchText}>
            Don’t have an account?{' '}
            <Text style={styles.link}>Sign Up</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 90,
  },

  circleTop: {
    position: 'absolute',
    top: -100,
    left: -95,
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: COLORS.decorative,
    opacity: 0.75,
  },

  circleBottom: {
    position: 'absolute',
    right: -70,
    bottom: -70,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.decorative,
  },

  title: {
    fontSize: 30,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 28,
  },

  field: {
    marginTop: 20,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: 18,
  },

  forgotText: {
    color: COLORS.text,
    fontSize: 14,
  },

  loginButton: {
    width: 150,
    alignSelf: 'center',
    marginTop: 32,
  },

  switchText: {
    textAlign: 'center',
    marginTop: 26,
    color: COLORS.muted,
  },

  link: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});