import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, RADIUS } from '../constants/theme';

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <ScreenHeader title="Notifications" showBell={false} />
        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="card-outline" size={25} color={COLORS.primary} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>Your Student ID has been found</Text>
            <Text style={styles.body}>It is available for collection at Evandy Hostel.</Text>
            <Text style={styles.time}>Just now</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 8 },
  card: { flexDirection: 'row', gap: 14, backgroundColor: COLORS.surface, padding: 16, borderRadius: RADIUS.medium, borderWidth: 1, borderColor: COLORS.border },
  icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  textBlock: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 14, lineHeight: 20, color: COLORS.muted, marginTop: 5 },
  time: { fontSize: 12, color: COLORS.primary, marginTop: 8 },
});
