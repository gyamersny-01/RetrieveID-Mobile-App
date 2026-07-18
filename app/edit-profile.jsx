import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, RADIUS } from '../constants/theme';

export default function Page() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <ScreenHeader title="Edit Profile" showBell={false} />
        <View style={styles.card}>
          <Text style={styles.body}>Profile editing fields will be connected to the user account in the next stage.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 8 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.medium, borderWidth: 1, borderColor: COLORS.border, padding: 20 },
  body: { fontSize: 16, lineHeight: 24, color: COLORS.text },
});
