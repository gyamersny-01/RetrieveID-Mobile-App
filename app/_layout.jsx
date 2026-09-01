import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { COLORS } from '../constants/theme';

import {
  AuthProvider,
  useAuth,
} from '../context/AuthContext';

function AppNavigator() {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />

        <View style={styles.logoContainer}>
          <Text style={styles.appName}>
            RetrieveID
          </Text>

          <Text style={styles.loadingText}>
            Loading your information...
          </Text>
        </View>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor:
              COLORS.background,
          },
          animation:
            'slide_from_right',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logoContainer: {
    alignItems: 'center',
  },

  appName: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '700',
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 10,
  },

  loader: {
    marginTop: 26,
  },
});