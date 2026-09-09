import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import {
  COLORS,
  RADIUS,
} from '../constants/theme';

export default function AboutScreen() {
  const {
    isAuthenticated,
    isAuthReady,
  } = useAuth();

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
        <ScreenHeader
          title="About RetrieveID"
          showBell={false}
        />

        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="card-outline"
              size={34}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.appName}>
            RetrieveID
          </Text>

          <Text style={styles.tagline}>
            Helping students recover lost
            Student ID cards more easily.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            About the App
          </Text>

          <Text style={styles.body}>
            RetrieveID is a mobile application
            designed to help students report,
            search for and recover lost Student ID
            cards.
          </Text>

          <Text style={styles.body}>
            When a found ID is reported, the system
            stores the report securely and notifies
            the student whose Student ID is linked
            to a RetrieveID account.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            How It Works
          </Text>

          <InfoItem
            icon="search-outline"
            text="Students can search for active reports using their Student ID number."
          />

          <InfoItem
            icon="camera-outline"
            text="Finders can upload a photo and report where an ID was found."
          />

          <InfoItem
            icon="location-outline"
            text="Found IDs are submitted to approved retrieval locations."
          />

          <InfoItem
            icon="notifications-outline"
            text="Registered owners receive in-app and email notifications when their ID is reported."
          />

          <InfoItem
            icon="shield-checkmark-outline"
            text="Student ID photos are protected and only available to authorized users."
            last
          />
        </View>

        <Text style={styles.version}>
          RetrieveID • Version 1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoItem({
  icon,
  text,
  last = false,
}) {
  return (
    <View
      style={[
        styles.infoItem,
        !last && styles.infoBorder,
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.infoText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 50,
  },

  hero: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 28,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  appName: {
    fontSize: 23,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 14,
  },

  tagline: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 7,
    maxWidth: 280,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.large,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },

  body: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    marginBottom: 10,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  infoBorder: {
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
  },

  version: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8,
  },
});