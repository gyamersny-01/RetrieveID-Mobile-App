import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';

export default function SearchNotFoundScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <ScreenHeader title="Search" />
        <View style={styles.divider} />
        <View style={styles.resultTitle}>
          <Ionicons name="close" size={30} color={COLORS.text} />
          <Text style={styles.heading}>No match found</Text>
        </View>
        <Text style={styles.body}>We couldn’t find your ID.</Text>
        <Text style={styles.subheading}>Want to stay updated?</Text>
        <Text style={styles.body}>
          We’ll notify you automatically when your Student ID is reported as found.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  divider: { height: 1, backgroundColor: '#767E8B', marginTop: 110, marginHorizontal: -24 },
  resultTitle: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 28 },
  heading: { fontSize: 18, fontWeight: '500', color: COLORS.text },
  body: { fontSize: 16, lineHeight: 23, color: COLORS.text, marginLeft: 39, marginTop: 20 },
  subheading: { fontSize: 17, fontWeight: '500', color: COLORS.text, marginLeft: 39, marginTop: 48 },
});
