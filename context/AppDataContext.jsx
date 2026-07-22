import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

const AppDataContext = createContext(null);

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
    retrievalLocation: 'Balme Library Security Post',
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
    studentId: '11124499',
    title: 'Your Student ID has been found',
    message:
      'Your Student ID was reported as found and is awaiting collection at Evandy Hostel.',
    retrievalLocation: 'Evandy Hostel',
    createdAt: '18 July 2026',
    isRead: false,
  },
];

export function AppDataProvider({ children }) {
  const [reports, setReports] = useState(initialReports);
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const addReport = (reportDetails) => {
    const newReport = {
      id: `report-${Date.now()}`,
      studentId: reportDetails.studentId,
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
      finderEmail: reportDetails.finderEmail || '',
    };

    setReports((currentReports) => [
      newReport,
      ...currentReports,
    ]);

    return newReport;
  };

  const findReportByStudentId = (studentId) => {
    return reports.find(
      (report) =>
        report.studentId === studentId &&
        report.status !== 'Collected'
    );
  };

  const createNotification = ({
    studentId,
    report,
  }) => {
    const newNotification = {
      id: `notification-${Date.now()}`,
      studentId,
      title: 'Your Student ID has been found',
      message: `Your Student ID was reported as found and is awaiting collection at ${report.retrievalLocation}.`,
      retrievalLocation:
        report.retrievalLocation,
      createdAt: report.dateReported,
      isRead: false,
    };

    setNotifications((currentNotifications) => [
      newNotification,
      ...currentNotifications,
    ]);

    return newNotification;
  };

  const markNotificationAsRead = (
    notificationId
  ) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const value = useMemo(
    () => ({
      reports,
      notifications,
      addReport,
      findReportByStudentId,
      createNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
    }),
    [reports, notifications]
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