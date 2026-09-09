import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  Redirect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import { COLORS, RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function SearchNotFoundScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  const studentId = Array.isArray(params.studentId)
    ? params.studentId[0]
    : params.studentId;

  if (!isAuthReady) {
  return null;
}

if (!isAuthenticated) {
  return <Redirect href="/welcome" />;
}

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <ScreenHeader title="Search Result" />

        <View style={styles.iconCircle}>
          <Ionicons
            name="search-outline"
            size={46}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.heading}>No match found</Text>

        <Text style={styles.message}>
          We could not find a reported ID matching Student ID
          number {studentId || ''}.
        </Text>

        <View style={styles.infoCard}>
          <Ionicons
            name="notifications-outline"
            size={25}
            color={COLORS.primary}
          />

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Stay updated automatically
            </Text>

            <Text style={styles.infoText}>
              You’ll receive a notification when your linked
              Student ID is reported as found.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.searchAgainButton}
          onPress={() => router.replace('/search')}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color={COLORS.surface}
          />

          <Text style={styles.searchAgainText}>
            Search Again
          </Text>
        </Pressable>

        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>
            Return to Home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'center',
    marginTop: 45,
    alignItems: 'center',
    justifyContent: 'center',
},

  heading: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 22,
  },

  message: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 18,
    marginTop: 10,
  },

  infoCard: {
    marginTop: 36,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.large,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },

  infoText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  searchAgainButton: {
    minHeight: 52,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.large,
    marginTop: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  searchAgainText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },

  homeButton: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.large,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});