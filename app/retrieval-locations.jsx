import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS } from '../constants/theme';
import {
  RETRIEVAL_LOCATIONS,
} from '../constants/retrievalLocations';

import {
  calculateDistance,
  formatDistance,
} from '../utils/locationUtils';

/**
 * Calculates the distance between two coordinates using
 * the Haversine formula.
 *
 * The returned value is measured in kilometres.
 */


export default function RetrievalLocationsScreen() {
  const {
    isAuthenticated,
    isAuthReady,
  } = useAuth();
  const [isLocating, setIsLocating] = useState(false);
  const [nearestLocationId, setNearestLocationId] =
    useState(null);
  const [distances, setDistances] = useState({});

  const findNearestLocation = async () => {
    try {
      setIsLocating(true);

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Location permission required',
          'Please allow RetrieveID to use your location so it can identify the nearest retrieval point.'
        );

        return;
      }

      const currentPosition =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      const userLatitude =
        currentPosition.coords.latitude;

      const userLongitude =
        currentPosition.coords.longitude;

      const locationsWithDistance =
        RETRIEVAL_LOCATIONS.map((location) => {
          const distance = calculateDistance(
            userLatitude,
            userLongitude,
            location.latitude,
            location.longitude
          );

          return {
            ...location,
            distance,
          };
        });

      locationsWithDistance.sort(
        (firstLocation, secondLocation) =>
          firstLocation.distance -
          secondLocation.distance
      );

      const nearestLocation =
        locationsWithDistance[0];

      const nextDistances =
        locationsWithDistance.reduce(
          (result, location) => {
            result[location.id] = location.distance;
            return result;
          },
          {}
        );

      setDistances(nextDistances);
      setNearestLocationId(nearestLocation.id);

      Alert.alert(
        'Nearest retrieval location',
        `${nearestLocation.name} is approximately ${formatDistance(
          nearestLocation.distance
        )}.`
      );
    } catch (error) {
      console.error('Location error:', error);

      Alert.alert(
        'Unable to find your location',
        'Please check that location services are enabled and try again.'
      );
    } finally {
      setIsLocating(false);
    }
  };

  const openDirections = async (location) => {
    const destination =
      `${location.latitude},${location.longitude}`;

    const mapsUrl =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${destination}`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

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
    } catch (error) {
      console.error('Maps error:', error);

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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Retrieval Locations" />

        <Text style={styles.intro}>
          Found Student IDs should be submitted to an
          approved retrieval location where the owner can
          collect them.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.nearestButton,
            pressed && !isLocating
              ? styles.buttonPressed
              : null,
            isLocating
              ? styles.buttonDisabled
              : null,
          ]}
          onPress={findNearestLocation}
          disabled={isLocating}
        >
          {isLocating ? (
            <>
              <ActivityIndicator
                size="small"
                color={COLORS.surface}
              />

              <Text style={styles.nearestButtonText}>
                Finding nearest location...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="locate-outline"
                size={21}
                color={COLORS.surface}
              />

              <Text style={styles.nearestButtonText}>
                Find Nearest Location
              </Text>
            </>
          )}
        </Pressable>

        {nearestLocationId ? (
          <View style={styles.locationNotice}>
            <Ionicons
              name="checkmark-circle"
              size={23}
              color={COLORS.success}
            />

            <Text style={styles.locationNoticeText}>
              The closest retrieval location has been
              highlighted below.
            </Text>
          </View>
        ) : null}

        <View style={styles.locations}>
          {RETRIEVAL_LOCATIONS.map((location) => {
            const isNearest =
              nearestLocationId === location.id;

            const distance = distances[location.id];

            return (
              <View
                key={location.id}
                style={[
                  styles.locationCard,
                  isNearest
                    ? styles.nearestLocationCard
                    : null,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.locationIcon}>
                    <Ionicons
                      name="location"
                      size={23}
                      color={COLORS.primary}
                    />
                  </View>

                  <View style={styles.locationHeading}>
                    <Text style={styles.locationName}>
                      {location.name}
                    </Text>

                    {distance !== undefined ? (
                      <Text style={styles.distance}>
                        {formatDistance(distance)}
                      </Text>
                    ) : null}
                  </View>

                  {isNearest ? (
                    <View style={styles.nearestBadge}>
                      <Text style={styles.nearestBadgeText}>
                        Nearest
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.description}>
                  {location.description}
                </Text>

                <Pressable
                  style={styles.directionsButton}
                  onPress={() =>
                    openDirections(location)
                  }
                >
                  <Ionicons
                    name="navigate-outline"
                    size={19}
                    color={COLORS.primary}
                  />

                  <Text style={styles.directionsText}>
                    Get Directions
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 50,
  },

  intro: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 15,
  },

  nearestButton: {
    minHeight: 52,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.large,
    marginTop: 27,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  nearestButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  locationNotice: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.medium,
    padding: 15,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  locationNoticeText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
  },

  locations: {
    gap: 18,
    marginTop: 25,
  },

  locationCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.large,
    padding: 18,
  },

  nearestLocationCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationHeading: {
    flex: 1,
    marginLeft: 13,
  },

  locationName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },

  distance: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },

  nearestBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  nearestBadgeText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: '600',
  },

  description: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 15,
  },

  directionsButton: {
    minHeight: 43,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.large,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  directionsText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});