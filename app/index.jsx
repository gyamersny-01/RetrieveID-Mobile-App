import { useEffect } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import LogoMark from '../components/LogoMark';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();

  const {
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/welcome');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [
    isAuthenticated,
    isAuthReady,
    router,
  ]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <LogoMark size={178} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});