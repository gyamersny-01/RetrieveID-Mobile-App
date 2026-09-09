import {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  Redirect,
  useLocalSearchParams,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';

import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
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

  function formatDate(value) {
  if (!value || value === 'Not available') {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

  function formatStatus(value) {
  if (
    value === 'AWAITING_COLLECTION' ||
    value === 'Awaiting collection'
  ) {
    return 'Awaiting collection';
  }

  if (
    value === 'COLLECTED' ||
    value === 'Collected'
  ) {
    return 'Collected';
  }

  return value || 'Awaiting collection';
}

export default function SearchFoundScreen() {
  const params = useLocalSearchParams();
  const {
    user,
    token,
    isAuthenticated,
    isAuthReady,
  } = useAuth();



  const reportId =
  getParamValue(params.reportId);

const studentId =
  getParamValue(params.studentId) ||
  'Not available';

const retrievalLocation =
  getParamValue(params.retrievalLocation) ||
  'Not available';

const foundLocation =
  getParamValue(params.foundLocation) ||
  'Not provided';

const rawDateReported =
  getParamValue(params.dateReported);

const dateReported =
  formatDate(rawDateReported);

const initialStatus =
  formatStatus(
    getParamValue(params.status)
  );

const [status, setStatus] =
  useState(initialStatus);

const [isCollecting, setIsCollecting] =
  useState(false);

const [imageUrl, setImageUrl] =
  useState(null);

const [isImageLoading, setIsImageLoading] =
  useState(false);

const [imageError, setImageError] =
  useState('');


const isCollected =
  status === 'Collected' ||
  status === 'COLLECTED';

const canMarkCollected =
  user?.studentId === studentId;


useEffect(() => {
  const loadReportImage = async () => {
    if (!reportId || !token) {
      return;
    }

    try {
      setIsImageLoading(true);
      setImageError('');

      const data = await apiRequest(
        `/api/reports/${reportId}/image`,
        {
          method: 'GET',
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!data?.image?.url) {
        setImageError(
          'No Student ID photo is available.'
        );
        return;
      }

      setImageUrl(data.image.url);
    } catch (error) {
      console.error(
        'Unable to load report image:',
        error
      );

      if (error.status === 403) {
        setImageError(
          'This Student ID photo is only available to the ID owner or the person who reported it.'
        );
      } else if (error.status === 404) {
        setImageError(
          'No Student ID photo is available for this report.'
        );
      } else {
        setImageError(
          'Unable to load the Student ID photo.'
        );
      }
    } finally {
      setIsImageLoading(false);
    }
  };

  loadReportImage();
}, [reportId, token]);

  const openDirections = async () => {
    const destination =
      retrievalLocation !== 'Not available'
        ? retrievalLocation
        : 'University of Ghana';

    const encodedDestination =
      encodeURIComponent(destination);

    const mapsUrl =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${encodedDestination}`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;

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

  const confirmCollection = () => {
  if (!reportId) {
    Alert.alert(
      'Report unavailable',
      'The related report could not be found.'
    );

    return;
  }

  if (!token) {
    Alert.alert(
      'Authentication Required',
      'Please log in again before confirming collection.'
    );

    return;
  }

  if (!canMarkCollected) {
    Alert.alert(
      'Not Authorized',
      'Only the student whose ID is linked to this account can confirm collection.'
    );

    return;
  }

  Alert.alert(
    'Confirm collection',
    'Only mark this Student ID as collected after you have physically received it.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Mark as Collected',

        onPress: async () => {
          try {
            setIsCollecting(true);

            await apiRequest(
              `/api/reports/${reportId}/collect`,
              {
                method: 'PATCH',

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

            setStatus('Collected');

            Alert.alert(
              'Collection confirmed',
              'The Student ID has been marked as collected.'
            );
          } catch (error) {
            Alert.alert(
              'Collection Failed',
              error.message ||
                'Unable to mark the Student ID as collected.'
            );
          } finally {
            setIsCollecting(false);
          }
        },
      },
    ]
  );
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
        <ScreenHeader title="Search Result" />

        <View
          style={[
            styles.successIcon,
            isCollected
              ? styles.collectedIcon
              : null,
          ]}
        >
          <Ionicons
            name={
              isCollected
                ? 'checkmark-done-circle'
                : 'checkmark-circle'
            }
            size={58}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.heading}>
          {isCollected
            ? 'Collection completed'
            : 'Good news!'}
        </Text>

        <Text style={styles.message}>
          {isCollected
            ? 'This Student ID has been marked as collected.'
            : 'Your Student ID has been reported as found.'}
        </Text>


        <View style={styles.imageSection}>
  <Text style={styles.imageSectionTitle}>
    Student ID Photo
  </Text>

  {isImageLoading ? (
    <View style={styles.imageLoadingBox}>
      <ActivityIndicator
        size="small"
        color={COLORS.primary}
      />

      <Text style={styles.imageLoadingText}>
        Loading ID photo...
      </Text>
    </View>
  ) : imageUrl ? (
    <View style={styles.imageCard}>
      <Image
        source={{
          uri: imageUrl,
        }}
        style={styles.idImage}
        resizeMode="contain"
        onError={() => {
          setImageUrl(null);
          setImageError(
            'Unable to display the Student ID photo.'
          );
        }}
      />
    </View>
  ) : (
    <View style={styles.imageUnavailableBox}>
      <Ionicons
        name="image-outline"
        size={28}
        color={COLORS.muted}
      />

      <Text style={styles.imageUnavailableText}>
        {imageError ||
          'No Student ID photo is available.'}
      </Text>
    </View>
  )}
</View>

        <View style={styles.detailsCard}>
          <DetailRow
            icon="card-outline"
            label="Student ID"
            value={studentId}
          />

          <DetailRow
            icon="location-outline"
            label="Retrieval Location"
            value={retrievalLocation}
          />

          <DetailRow
            icon="navigate-outline"
            label="Found Location"
            value={foundLocation}
          />

          <DetailRow
            icon="calendar-outline"
            label="Date Reported"
            value={dateReported}
          />

          <DetailRow
            icon="information-circle-outline"
            label="Status"
            value={status}
            last
          />
        </View>

        <View style={styles.noticeCard}>
          <Ionicons
            name={
              isCollected
                ? 'checkmark-done-outline'
                : 'shield-checkmark-outline'
            }
            size={23}
            color={
              isCollected
                ? COLORS.success
                : COLORS.primary
            }
          />

          <Text style={styles.noticeText}>
            {isCollected
              ? 'This report is now closed and will no longer appear in active Student ID searches.'
              : 'Take a valid form of identification when collecting the card.'}
          </Text>
        </View>

        {!isCollected ? (
  <>
    <AppButton
      title="Get Directions"
      onPress={openDirections}
      style={styles.directionsButton}
    />

    {canMarkCollected ? (
      <Pressable
        style={[
          styles.collectionButton,
          isCollecting
            ? styles.collectionButtonDisabled
            : null,
        ]}
        onPress={confirmCollection}
        disabled={isCollecting}
      >
        <Ionicons
          name="checkmark-done-outline"
          size={21}
          color={COLORS.success}
        />

        <Text
          style={styles.collectionButtonText}
        >
          {isCollecting
            ? 'Updating...'
            : 'Mark as Collected'}
        </Text>
      </Pressable>
    ) : null}
  </>
) : null}
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
        last
          ? styles.lastDetailRow
          : null,
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
        <Text style={styles.detailLabel}>
          {label}
        </Text>

        <Text style={styles.detailValue}>
          {value}
        </Text>
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
    marginTop: 28,
  },

  collectedIcon: {
    opacity: 0.9,
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

  collectionButton: {
    minHeight: 52,
    marginTop: 14,
    borderRadius: RADIUS.large,
    borderWidth: 1,
    borderColor: COLORS.success,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 18,
  },

  collectionButtonText: {
    color: COLORS.success,
    fontSize: 15,
    fontWeight: '600',
  },

  collectionButtonDisabled: {
  opacity: 0.6,
},


  imageSection: {
  marginTop: 30,
},

imageSectionTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: COLORS.text,
  marginBottom: 12,
},

imageCard: {
  width: '100%',
  minHeight: 200,
  backgroundColor: COLORS.surface,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.large,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
},

idImage: {
  width: '100%',
  height: 210,
},

imageLoadingBox: {
  minHeight: 180,
  backgroundColor: COLORS.surface,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.large,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
},

imageLoadingText: {
  color: COLORS.muted,
  fontSize: 13,
},

imageUnavailableBox: {
  minHeight: 150,
  backgroundColor: COLORS.surface,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.large,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 24,
  gap: 10,
},

imageUnavailableText: {
  color: COLORS.muted,
  fontSize: 13,
  lineHeight: 19,
  textAlign: 'center',
},
});