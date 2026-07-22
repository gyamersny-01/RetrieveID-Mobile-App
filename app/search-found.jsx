import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, RADIUS } from '../constants/theme';

export default function SearchFoundScreen() {
  const {
    studentId,
    retrievalLocation,
    foundLocation,
    dateReported,
    status,
  } = useLocalSearchParams();

  const openDirections = async () => {
    const destination =
      typeof retrievalLocation === 'string'
        ? retrievalLocation
        : 'University of Ghana';

    const encodedDestination = encodeURIComponent(destination);

    const mapsUrl =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${encodedDestination}`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;

    try {
      const supported = await Linking.canOpenURL(mapsUrl);

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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Search Result" />

        <View style={styles.successIcon}>
          <Ionicons
            name="checkmark-circle"
            size={58}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.heading}>Good news!</Text>

        <Text style={styles.message}>
          Your Student ID has been reported as found.
        </Text>

        <View style={styles.detailsCard}>
          <DetailRow
            icon="card-outline"
            label="Student ID"
            value={studentId || 'Not available'}
          />

          <DetailRow
            icon="location-outline"
            label="Retrieval Location"
            value={retrievalLocation || 'Not available'}
          />

          <DetailRow
            icon="navigate-outline"
            label="Found At"
            value={foundLocation || 'Not provided'}
          />

          <DetailRow
            icon="calendar-outline"
            label="Date Reported"
            value={dateReported || 'Not available'}
          />

          <DetailRow
            icon="information-circle-outline"
            label="Status"
            value={status || 'Awaiting collection'}
            last
          />
        </View>

        <View style={styles.noticeCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={23}
            color={COLORS.primary}
          />

          <Text style={styles.noticeText}>
            Take a valid form of identification when collecting
            the card.
          </Text>
        </View>

        <AppButton
          title="Get Directions"
          onPress={openDirections}
          style={styles.directionsButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  last = false,
}) {
  return (
    <View
      style={[
        styles.detailRow,
        last ? styles.lastDetailRow : null,
      ]}
    >
      <View style={styles.detailIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },

  successIcon: {
    alignItems: 'center',
    marginTop: 36,
  },

  heading: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 14,
  },

  message: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.muted,
    marginTop: 8,
    paddingHorizontal: 22,
  },

  detailsCard: {
    marginTop: 34,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.large,
    overflow: 'hidden',
  },

  detailRow: {
    minHeight: 82,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  lastDetailRow: {
    borderBottomWidth: 0,
  },

  detailIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailContent: {
    flex: 1,
    marginLeft: 14,
  },

  detailLabel: {
    color: COLORS.muted,
    fontSize: 13,
  },

  detailValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },

  noticeCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.large,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginTop: 24,
  },

  noticeText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
  },

  directionsButton: {
    marginTop: 30,
  },
});