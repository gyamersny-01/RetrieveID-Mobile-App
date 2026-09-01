import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  usePathname,
  useRouter,
} from 'expo-router';

import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function NotificationBell() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    token,
    isAuthenticated,
  } = useAuth();

  const [unreadCount, setUnreadCount] =
    useState(0);

  const loadUnreadCount = useCallback(
  async () => {
    if (
      !isAuthenticated ||
      !token
    ) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await apiRequest(
        '/api/notifications',
        {
          method: 'GET',
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(
        data.unreadCount || 0
      );
    } catch (error) {
      console.error(
        'Unable to load notification count:',
        error
      );

      setUnreadCount(0);
    }
  },
  [
    token,
    isAuthenticated,
  ]
);

  useEffect(() => {
  loadUnreadCount();
}, [
  loadUnreadCount,
  pathname,
]);

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
            {unreadCount > 99
              ? '99+'
              : unreadCount}
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