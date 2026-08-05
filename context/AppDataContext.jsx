import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const AppDataContext = createContext(null);

const STORAGE_KEYS = {
  reports: '@retrieveid_reports',
  notifications: '@retrieveid_notifications',
};

const initialReports = [
  {
    id: 'report-1',
    studentId: '11124499',
    retrievalLocation: 'Evandy Hostel',
    foundLocation: 'Balme Library',
    dateReported: '18 July 2026',
    status: 'Awaiting collection',
    imageUri: null,
    finderContact: '0240000000',
  },
  {
    id: 'report-2',
    studentId: '10987654',
    retrievalLocation:
      'Balme Library Security Post',
    foundLocation: 'JQB Lecture Hall',
    dateReported: '17 July 2026',
    status: 'Awaiting collection',
    imageUri: null,
    finderContact: '0200000000',
  },
];

const initialNotifications = [
  {
    id: 'notification-1',
    reportId: 'report-1',
    studentId: '11124499',
    title: 'Your Student ID has been found',
    message:
      'Your Student ID was reported as found and is awaiting collection at Evandy Hostel.',
    retrievalLocation: 'Evandy Hostel',
    foundLocation: 'Balme Library',
    createdAt: '18 July 2026',
    status: 'Awaiting collection',
    imageUri: null,
    isRead: false,
  },
];

export function AppDataProvider({ children }) {
  const [reports, setReports] =
    useState(initialReports);

  const [notifications, setNotifications] =
    useState(initialNotifications);
  
  const [isDataReady, setIsDataReady] =
    useState(false);

  useEffect(() => {
  const loadStoredData = async () => {
    try {
      const [
        storedReports,
        storedNotifications,
      ] = await Promise.all([
        AsyncStorage.getItem(
          STORAGE_KEYS.reports
        ),
        AsyncStorage.getItem(
          STORAGE_KEYS.notifications
        ),
      ]);

      if (storedReports !== null) {
        const parsedReports =
          JSON.parse(storedReports);

        if (Array.isArray(parsedReports)) {
          setReports(parsedReports);
        }
      }

      if (storedNotifications !== null) {
        const parsedNotifications =
          JSON.parse(storedNotifications);

        if (
          Array.isArray(parsedNotifications)
        ) {
          setNotifications(
            parsedNotifications
          );
        }
      }
    } catch (error) {
      console.error(
        'Unable to load stored app data:',
        error
      );
    } finally {
      setIsDataReady(true);
    }
  };

  loadStoredData();
}, []);

  useEffect(() => {
  if (!isDataReady) {
    return;
  }

  const saveReports = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.reports,
        JSON.stringify(reports)
      );
    } catch (error) {
      console.error(
        'Unable to save reports:',
        error
      );
    }
  };

  saveReports();
}, [reports, isDataReady]);

useEffect(() => {
  if (!isDataReady) {
    return;
  }

  const saveNotifications = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.notifications,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error(
        'Unable to save notifications:',
        error
      );
    }
  };

  saveNotifications();
}, [notifications, isDataReady]);


  const addReport = (reportDetails) => {
    const newReport = {
      id: `report-${Date.now()}`,
      studentId:
        reportDetails.studentId?.trim() || '',
      retrievalLocation:
        reportDetails.retrievalLocation,
      foundLocation:
        reportDetails.foundLocation ||
        'Not provided',
      dateReported: new Date().toLocaleDateString(
        'en-GB',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      ),
      status: 'Awaiting collection',
      imageUri: reportDetails.imageUri || null,
      finderContact:
        reportDetails.finderContact || '',
      finderEmail:
        reportDetails.finderEmail || '',
    };

    setReports((currentReports) => [
      newReport,
      ...currentReports,
    ]);

    return newReport;
  };

  const findReportByStudentId = (studentId) => {
    const normalizedStudentId =
      studentId?.trim();

    return reports.find(
      (report) =>
        report.studentId ===
          normalizedStudentId &&
        report.status !== 'Collected'
    );
  };

  const getReportById = (reportId) => {
  if (!reportId) {
    return null;
  }

  return (
    reports.find(
      (report) => report.id === reportId
    ) || null
  );
  };

  const createNotification = ({
    studentId,
    report,
  }) => {
    const newNotification = {
      id: `notification-${Date.now()}`,
      reportId: report.id,
      studentId: studentId?.trim() || '',
      title: 'Your Student ID has been found',
      message: `Your Student ID was reported as found and is awaiting collection at ${report.retrievalLocation}.`,
      retrievalLocation:
        report.retrievalLocation,
      foundLocation:
        report.foundLocation ||
        'Not provided',
      createdAt: report.dateReported,
      status:
        report.status ||
        'Awaiting collection',
      imageUri: report.imageUri || null,
      isRead: false,
    };

    setNotifications(
      (currentNotifications) => [
        newNotification,
        ...currentNotifications,
      ]
    );

    return newNotification;
  };

  const markNotificationAsRead = (
    notificationId
  ) => {
    setNotifications(
      (currentNotifications) =>
        currentNotifications.map(
          (notification) =>
            notification.id ===
            notificationId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
        )
    );
  };

  const markAllNotificationsAsRead = (
    studentId
  ) => {
    const normalizedStudentId =
      studentId?.trim();

    if (!normalizedStudentId) {
      return;
    }

    setNotifications(
      (currentNotifications) =>
        currentNotifications.map(
          (notification) =>
            notification.studentId ===
            normalizedStudentId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
        )
    );
  };

  const markReportAsCollected = (reportId) => {
  if (!reportId) {
    return;
  }

  setReports((currentReports) =>
    currentReports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            status: 'Collected',
          }
        : report
    )
  );

  setNotifications((currentNotifications) =>
    currentNotifications.map((notification) =>
      notification.reportId === reportId
        ? {
            ...notification,
            status: 'Collected',
            message:
              'Your Student ID report has been marked as collected.',
            isRead: true,
          }
        : notification
    )
  );
};

  const value = useMemo(
    () => ({
      reports,
      notifications,
      isDataReady,
      addReport,
      findReportByStudentId,
      getReportById,
      createNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      markReportAsCollected,
    }),
    [reports, notifications, isDataReady]
    );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error(
      'useAppData must be used inside AppDataProvider'
    );
  }

  return context;
}