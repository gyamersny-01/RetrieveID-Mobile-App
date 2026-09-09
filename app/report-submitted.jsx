import {
  Alert,
  Linking,
  Platform,
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

import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import {
  COLORS,
  RADIUS,
} from '../constants/theme';

function getParamValue(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default function ReportSubmittedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  const location =
    getParamValue(params.location) ||
    'Not available';

  const from = getParamValue(params.from);
  const cameFromReport = from === 'report';

  const openDirections = async () => {
    const encodedLocation =
      encodeURIComponent(
        String(location)
      );

    const mapsUrl =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${encodedLocation}`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;

    try {
      const supported =
        await Linking.canOpenURL(mapsUrl);

      if (!supported) {
        Alert.alert(
          'Directions unavailable',
          'A supported maps application could not be opened.'
        );

        return;
      }

      await Linking.openURL(mapsUrl);
    } catch {
      Alert.alert(
        'Unable to open directions',
        'Please try again later.'
      );
    }
  };

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  if (!cameFromReport) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="checkmark"
            size={36}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.title}>
          Report Submitted Successfully!
        </Text>

        <Text style={styles.body}>
          Thank you for reporting the found ID.
        </Text>

        <Text style={styles.body}>
          Please submit the physical Student ID to
          the retrieval location below.
        </Text>

        <View style={styles.locationCard}>
          <Text style={styles.label}>
            Retrieval Location
          </Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location"
              size={27}
              color={COLORS.text}
            />

            <Text style={styles.location}>
              {location}
            </Text>
          </View>
        </View>

        <AppButton
          title="Get Directions"
          icon={
            <Ionicons
              name="navigate-outline"
              size={21}
              color={COLORS.surface}
            />
          }
          onPress={openDirections}
          style={styles.directions}
        />

        <AppButton
          title="Done"
          variant="outline"
          onPress={() =>
            router.replace('/(tabs)')
          }
          style={styles.done}
        />
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
    paddingHorizontal: 38,
    paddingTop: 58,
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.2,
    borderColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS.text,
    marginTop: 22,
  },

  body: {
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.text,
    marginTop: 24,
  },

  locationCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.large,
    padding: 18,
    marginTop: 28,
  },

  label: {
    fontSize: 13,
    color: COLORS.primary,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 9,
  },

  location: {
    flex: 1,
    fontSize: 21,
    fontWeight: '500',
    color: COLORS.text,
  },

  directions: {
    marginTop: 36,
  },

  done: {
    marginTop: 24,
  },
});