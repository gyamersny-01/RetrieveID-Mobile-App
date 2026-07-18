import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { COLORS } from '../constants/theme';

export default function AccountCreatedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={38} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Account Created!</Text>
        <Text style={styles.body}>
          Your account has been successfully created and your Student ID has been linked to your profile.
        </Text>
        <Text style={styles.body}>
          You’ll receive a notification if your ID card is reported as found.
        </Text>
        <AppButton
          title="Continue to Home"
          onPress={() => router.replace('/(tabs)')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 46, paddingTop: 130 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1.5,
    borderColor: COLORS.text, alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
  },
  title: { fontSize: 23, fontWeight: '500', textAlign: 'center', marginTop: 26, color: COLORS.text },
  body: { fontSize: 19, lineHeight: 27, color: COLORS.text, marginTop: 38 },
  button: { marginTop: 58 },
});
