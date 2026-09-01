import {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  Redirect,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';

import {
  useAuth,
} from '../context/AuthContext';
import { apiRequest } from '../services/api';

import {
  COLORS,
  RADIUS,
} from '../constants/theme';

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    token,
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  const [notifications, setNotifications] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isMarkingAll, setIsMarkingAll] =
    useState(false);
  
  const loadNotifications = async () => {
  if (!token) {
    return;
  }

  try {
    setIsLoading(true);

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

    setNotifications(
      data.notifications || []
    );
  } catch (error) {
    Alert.alert(
      'Unable to Load Notifications',
      error.message ||
        'Please try again.'
    );
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  if (
    isAuthReady &&
    isAuthenticated &&
    token
  ) {
    loadNotifications();
  }
}, [
  isAuthReady,
  isAuthenticated,
  token,
]);
  

  const userNotifications = notifications;

  const unreadCount = userNotifications.filter(
    (notification) => !notification.isRead
  ).length;

  const openNotification = async (
  notification
) => {
  try {
    if (!notification.isRead) {
      await apiRequest(
        `/api/notifications/${notification.id}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (item) =>
              item.id === notification.id
                ? {
                    ...item,
                    isRead: true,
                    readAt:
                      new Date().toISOString(),
                  }
                : item
          )
      );
    }

    router.push({
      pathname: '/search-found',
      params: {
        reportId:
          notification.reportId,
        studentId:
          notification.studentId,
        retrievalLocation:
          notification.retrievalLocation ||
          'Not provided',
        foundLocation:
          notification.foundLocation ||
          'Not provided',
        dateReported:
          notification.dateReported ||
          'Not provided',
        status:
          notification.status ===
          'AWAITING_COLLECTION'
            ? 'Awaiting collection'
            : notification.status ===
                'COLLECTED'
              ? 'Collected'
              : notification.status,
      },
    });
  } catch (error) {
    Alert.alert(
      'Unable to Open Notification',
      error.message ||
        'Please try again.'
    );
  }
};

const handleMarkAllAsRead = async () => {
  if (
    unreadCount === 0 ||
    isMarkingAll
  ) {
    return;
  }

  try {
    setIsMarkingAll(true);

    await apiRequest(
      '/api/notifications/read-all',
      {
        method: 'PATCH',
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const readTime =
      new Date().toISOString();

    setNotifications(
      (currentNotifications) =>
        currentNotifications.map(
          (notification) => ({
            ...notification,
            isRead: true,
            readAt:
              notification.readAt ||
              readTime,
          })
        )
    );
  } catch (error) {
    Alert.alert(
      'Unable to Update Notifications',
      error.message ||
        'Please try again.'
    );
  } finally {
    setIsMarkingAll(false);
  }
};

  if (!isAuthReady) {
  return null;
}

if (!isAuthenticated) {
  return <Redirect href="/welcome" />;
}

if (
  isAuthenticated &&
  isLoading
) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading notifications...
        </Text>
      </View>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Notifications"
          showBell={false}
        />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            {unreadCount === 0
              ? 'You have no unread notifications.'
              : `${unreadCount} unread ${
                  unreadCount === 1
                    ? 'notification'
                    : 'notifications'
                }`}
          </Text>

          {unreadCount > 0 ? (
            <Pressable
                onPress={handleMarkAllAsRead}
              >
              <Text style={styles.markAllText}>
                {isMarkingAll
                  ? 'Updating...'
                  : 'Mark all as read'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {userNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-outline"
                size={42}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No notifications yet
            </Text>

            <Text style={styles.emptyText}>
              You will receive an alert when your linked
              Student ID is reported as found.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationList}>
            {userNotifications.map((notification) => (
              <Pressable
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.isRead
                    ? styles.unreadCard
                    : null,
                ]}
                onPress={() =>
                  openNotification(notification)
                }
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="card-outline"
                    size={23}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>

                    {!notification.isRead ? (
                      <View style={styles.unreadDot} />
                    ) : null}
                  </View>

                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>

                  <Text style={styles.notificationDate}>
                    {notification.createdAt}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
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

  summaryRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },

  summaryText: {
    color: COLORS.muted,
    fontSize: 13,
    flex: 1,
  },

  markAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  notificationList: {
    gap: 14,
    marginTop: 24,
  },

  notificationCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.large,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  unreadCard: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationContent: {
    flex: 1,
    marginLeft: 13,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  notificationTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  notificationMessage: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },

  notificationDate: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 10,
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 22,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 9,
  },

  loadingContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},

loadingText: {
  color: COLORS.muted,
  fontSize: 14,
  marginTop: 12,
},
});