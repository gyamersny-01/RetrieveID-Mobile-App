import { Linking, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { COLORS, RADIUS } from '../constants/theme';

export default function ReportSubmittedScreen() {
  const router = useRouter();
  const { location = 'Evandy Hostel' } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Report Submitted Successfully!</Text>
        <Text style={styles.body}>Thank you for reporting the found ID.</Text>
        <Text style={styles.body}>Please submit the physical Student ID to the retrieval location below.</Text>
        <View style={styles.locationCard}>
          <Text style={styles.label}>Retrieval Location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={27} color={COLORS.text} />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
        <AppButton
          title="Get Directions"
          icon={<Ionicons name="navigate-outline" size={21} color={COLORS.surface} />}
          onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(location))}`)}
          style={styles.directions}
        />
        <AppButton title="Done" variant="outline" onPress={() => router.replace('/(tabs)')} style={styles.done} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 38, paddingTop: 58 },
  iconCircle: { width: 58, height: 58, borderRadius: 29, borderWidth: 1.2, borderColor: COLORS.text, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  title: { fontSize: 20, fontWeight: '500', textAlign: 'center', color: COLORS.text, marginTop: 22 },
  body: { fontSize: 18, lineHeight: 25, color: COLORS.text, marginTop: 28 },
  locationCard: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.large, padding: 18, marginTop: 28 },
  label: { fontSize: 13, color: COLORS.primary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 },
  location: { fontSize: 21, fontWeight: '500', color: COLORS.text },
  directions: { marginTop: 44 },
  done: { marginTop: 24 },
});
