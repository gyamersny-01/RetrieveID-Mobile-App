import { Linking, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, RADIUS } from '../constants/theme';

export default function SearchFoundScreen() {
  const openDirections = () => {
    Linking.openURL('https://www.google.com/maps/search/?api=1&query=Evandy+Hostel+University+of+Ghana');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <ScreenHeader title="Search" />
        <View style={styles.successCard}>
          <View style={styles.successHeading}>
            <Ionicons name="checkmark-circle-outline" size={28} color={COLORS.success} />
            <Text style={styles.heading}>Good news!</Text>
          </View>
          <Text style={styles.body}>Your ID has been found.</Text>
          <Text style={styles.label}>Retrieval location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={27} color={COLORS.text} />
            <Text style={styles.location}>Evandy Hostel</Text>
          </View>
        </View>
        <AppButton
          title="Get Directions"
          icon={<Ionicons name="navigate-outline" size={21} color={COLORS.surface} />}
          onPress={openDirections}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  successCard: {
    marginTop: 90, padding: 22, borderRadius: RADIUS.large,
    backgroundColor: COLORS.successLight, borderWidth: 1, borderColor: '#B7E7C6',
  },
  successHeading: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  heading: { fontSize: 19, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 17, color: COLORS.text, marginTop: 20 },
  label: { fontSize: 13, color: COLORS.primary, marginTop: 34 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  location: { fontSize: 21, color: COLORS.text, fontWeight: '500' },
  button: { marginTop: 32 },
});
