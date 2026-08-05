import {
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
  useAppData,
} from '../context/AppDataContext';
import {
  useAuth,
} from '../context/AuthContext';
import {
  COLORS,
  RADIUS,
} from '../constants/theme';

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAppData();

  const studentId = user?.studentId;

  const userNotifications = notifications.filter(
    (notification) =>
    studentId &&
    notification.studentId === studentId
  );

  const unreadCount = userNotifications.filter(
    (notification) => !notification.isRead
  ).length;

  const openNotification = (notification) => {
    markNotificationAsRead(notification.id);

    router.push({
      pathname: '/search-found',
      params: {
        studentId: notification.studentId,
        retrievalLocation:
          notification.retrievalLocation ||
          'Not provided',
        foundLocation:
          notification.foundLocation ||
          'Not provided',
        dateReported:
          notification.createdAt ||
          'Not provided',
        status:
          notification.status ||
          'Awaiting collection',
        reportId:
          notification.reportId || '',
      },
    });
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
                onPress={() =>
                  markAllNotificationsAsRead(user?.studentId)
                }
              >
              <Text style={styles.markAllText}>
                Mark all as read
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
});