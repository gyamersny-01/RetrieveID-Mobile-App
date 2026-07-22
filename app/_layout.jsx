import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/theme';
import { AuthProvider } from '../context/AuthContext';
import {
  AppDataProvider,
} from '../context/AppDataContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: COLORS.background,
            },
            animation: 'slide_from_right',
          }}
        />
      </AppDataProvider>
    </AuthProvider>
  );
}
