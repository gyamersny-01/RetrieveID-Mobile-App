import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '../../components/AppButton';
import MenuRow from '../../components/MenuRow';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { COLORS, RADIUS } from '../../constants/theme';

function InfoRow({
  icon,
  label,
  value,
  last = false,
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && styles.infoBorder,
      ]}
    >
      <Text style={styles.infoLabel}>{label}</Text>

      <View style={styles.infoValueRow}>
        <Ionicons
          name={icon}
          size={19}
          color={COLORS.text}
        />

        <Text style={styles.infoValue}>
          {value || 'Not provided'}
        </Text>
      </View>
    </View>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Account" />

        <View style={styles.profile}>
          <Ionicons
            name="person-circle-outline"
            size={64}
            color={COLORS.text}
          />

          <Text style={styles.name}>
            {user.fullName}
          </Text>

          <Text style={styles.studentId}>
            Student ID: {user.studentId}
          </Text>

          <AppButton
            title="Edit Profile"
            icon={
              <Ionicons
                name="pencil-outline"
                size={18}
                color={COLORS.surface}
              />
            }
            onPress={() => router.push('/edit-profile')}
            style={styles.editButton}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <View style={styles.infoCard}>
          <InfoRow
            icon="person"
            label="Full Name"
            value={user.fullName}
          />

          <InfoRow
            icon="card"
            label="Student ID"
            value={user.studentId}
          />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={user.email}
          />

          <InfoRow
            icon="call"
            label="Mobile Number"
            value={user.phone}
            last
          />
        </View>

        <Text style={styles.sectionTitle}>Support</Text>

        <View style={styles.menuCard}>
          <MenuRow
            icon="location"
            label="Retrieval Locations"
            onPress={() =>
              router.push('/retrieval-locations')
            }
          />

          <MenuRow
            icon="help-circle-outline"
            label="Help & FAQs"
            onPress={() => router.push('/help')}
          />

          <MenuRow
            icon="information-circle-outline"
            label="About RetrieveID"
            last
            onPress={() => router.push('/about')}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Account actions
        </Text>

        <View style={styles.menuCard}>
          <MenuRow
            icon="log-out-outline"
            label="Log Out"
            danger
            last
            onPress={handleLogout}
          />
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
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 38,
  },

  profile: {
    alignItems: 'center',
    marginTop: -8,
  },

  name: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 6,
  },

  studentId: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
  },

  editButton: {
    minHeight: 43,
    marginTop: 14,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 15,
    color: COLORS.text,
    marginTop: 30,
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: COLORS.cardGray,
    borderRadius: RADIUS.medium,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#2B9AF3',
  },

  infoRow: {
    minHeight: 67,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  infoBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#697180',
  },

  infoLabel: {
    fontSize: 12,
    color: COLORS.text,
  },

  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
  },

  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    flexShrink: 1,
  },

  menuCard: {
    backgroundColor: COLORS.cardGray,
    borderRadius: RADIUS.medium,
    overflow: 'hidden',
  },
});