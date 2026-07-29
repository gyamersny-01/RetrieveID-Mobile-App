import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../constants/theme';

import NotificationBell from '../../components/NotificationBell';

function ActionCard({ primary = false, icon, title, description, buttonLabel, onPress }) {
  return (
    <View style={[styles.card, primary ? styles.primaryCard : styles.outlineCard]}>
      <View style={[styles.iconCircle, primary ? styles.primaryIconCircle : styles.outlineIconCircle]}>
        <Ionicons name={icon} size={29} color={primary ? COLORS.primary : COLORS.primary} />
      </View>
      <View style={styles.cardText}>
        <Text style={[styles.cardTitle, primary && styles.whiteText]}>{title}</Text>
        <Text style={[styles.cardDescription, primary && styles.whiteText]}>{description}</Text>
      </View>
      <Pressable style={[styles.smallButton, primary ? styles.whiteButton : styles.blueButton]} onPress={onPress}>
        <Text style={[styles.smallButtonText, primary ? styles.blueText : styles.whiteText]}>{buttonLabel}</Text>
        <Ionicons name="arrow-forward" size={18} color={primary ? COLORS.primary : COLORS.surface} />
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome to{`\n`}RetrieveID</Text>
          <NotificationBell />
        </View>

        <ActionCard
          primary
          icon="search-outline"
          title="Search Lost ID"
          description="Check whether your student ID has been reported as found."
          buttonLabel="Search Now"
          onPress={() => router.push('/search')}
        />

        <ActionCard
          icon="push-outline"
          title="Report Found ID"
          description="Found someone’s ID? Help them recover it."
          buttonLabel="Report Now"
          onPress={() => router.push('/(tabs)/report')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 34, gap: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, overflow: 'visible',
  zIndex: 10 },
  welcome: { fontSize: 27, lineHeight: 30, fontWeight: '500', color: COLORS.text },
  card: { minHeight: 220, borderRadius: RADIUS.medium, padding: 20 },
  primaryCard: { backgroundColor: COLORS.primary },
  outlineCard: { backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.primary },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  primaryIconCircle: { backgroundColor: COLORS.surface },
  outlineIconCircle: { backgroundColor: COLORS.surface, borderWidth: 1.2, borderColor: COLORS.primary },
  cardText: { marginLeft: 68, marginTop: -46, paddingRight: 4 },
  cardTitle: { fontSize: 18, fontWeight: '500', color: COLORS.text },
  cardDescription: { fontSize: 15, lineHeight: 20, color: COLORS.text, marginTop: 14, maxWidth: 220 },
  whiteText: { color: COLORS.surface },
  smallButton: {
    alignSelf: 'flex-start', marginTop: 34, minHeight: 39, borderRadius: 11,
    paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  whiteButton: { backgroundColor: COLORS.surface },
  blueButton: { backgroundColor: COLORS.primary },
  smallButtonText: { fontSize: 14, fontWeight: '500' },
  blueText: { color: COLORS.primary },
});
