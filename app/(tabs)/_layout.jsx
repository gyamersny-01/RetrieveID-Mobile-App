import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const iconFor = (routeName, focused) => {
  if (routeName === 'index') return focused ? 'home' : 'home-outline';
  if (routeName === 'report') return focused ? 'push' : 'push-outline';
  return focused ? 'person-circle' : 'person-circle-outline';
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text,
        tabBarStyle: {
          height: 78,
          paddingTop: 9,
          paddingBottom: 10,
          borderTopWidth: 0,
          backgroundColor: COLORS.surface,
        },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '500' },
        tabBarIcon: ({ focused, color }) => (
          <Ionicons name={iconFor(route.name, focused)} size={29} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="report" options={{ title: 'Report' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
