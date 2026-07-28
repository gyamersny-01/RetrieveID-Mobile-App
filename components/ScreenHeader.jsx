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

export default function ScreenHeader({
  title,
  showBack = true,
  showBell = true,
}) {
  const router = useRouter();

  const { notifications } = useAppData();
  const { user, isAuthenticated } = useAuth();

  const unreadCount = isAuthenticated
    ? notifications.filter(
        (notification) =>
          notification.studentId === user.studentId &&
          !notification.isRead
      ).length
    : 0;

  const badgeText =
    unreadCount > 99 ? '99+' : unreadCount.toString();

  const openNotifications = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    router.push('/notifications');
  };

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.text}
            />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={[styles.side, styles.right]}>
        {showBell ? (
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
                  {badgeText}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  side: {
    width: 42,
    justifyContent: 'center',
  },

  right: {
    alignItems: 'flex-end',
  },

  title: {
    flex: 1,
    fontSize: 25,
    fontWeight: '500',
    color: COLORS.text,
  },

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
    lineHeight: 12,
  },
});