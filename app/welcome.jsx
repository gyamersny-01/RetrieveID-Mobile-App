import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import LogoMark from '../components/LogoMark';
import { COLORS } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.curve} />
      <Pressable style={styles.close} onPress={() => router.replace('/login')} hitSlop={12}>
        <Ionicons name="close" size={30} color={COLORS.text} />
      </Pressable>

      <View style={styles.content}>
        <LogoMark size={132} />
        <Text style={styles.name}>RetrieveID</Text>
        <Text style={styles.tagline}>Find. Report. Retrieve.</Text>
      </View>

      <View style={styles.actions}>
        <AppButton title="GET STARTED" onPress={() => router.push('/signup')} />
        <AppButton
          title="I ALREADY HAVE AN ACCOUNT"
          variant="outline"
          onPress={() => router.push('/login')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 26 },
  curve: {
    position: 'absolute',
    top: 15,
    left: -35,
    right: -35,
    height: 80,
    borderTopWidth: 1.3,
    borderColor: COLORS.text,
    borderRadius: 120,
  },
  close: { position: 'absolute', right: 24, top: 58, zIndex: 3 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 90 },
  name: { fontSize: 27, color: COLORS.text, marginTop: 14, fontWeight: '500' },
  tagline: { fontSize: 14, color: COLORS.text, marginTop: 18 },
  actions: { gap: 20, paddingBottom: 86 },
});
