import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import {
  COLORS,
  RADIUS,
} from '../constants/theme';

export default function HelpScreen() {
  const {
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <ScreenHeader
          title="Help & FAQs"
          showBell={false}
        />

        <View style={styles.card}>
          <Text style={styles.body}>
            Frequently asked questions and support
            information will appear here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
});