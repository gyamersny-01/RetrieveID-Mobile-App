import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS } from '../constants/theme';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const router = useRouter();

  const { notifications } = useAppData();
  const { user, isAuthenticated } = useAuth();

  const unreadCount =
    isAuthenticated && user?.studentId
      ? notifications.filter(
          (notification) =>
            notification.studentId === user.studentId &&
            !notification.isRead
        ).length
      : 0;

  const openNotifications = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    router.push('/notifications');
  };

  return (
    <Pressable
      style={styles.bellButton}
      onPress={openNotifications}
      hitSlop={12}
    >
      <Ionicons
        name={
          unreadCount > 0
            ? 'notifications'
            : 'notifications-outline'
        }
        size={25}
        color={COLORS.text}
      />

      {unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bellButton: {
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },

  badgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '700',
  },
});