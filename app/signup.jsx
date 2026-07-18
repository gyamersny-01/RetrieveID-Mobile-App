import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import { COLORS, RADIUS } from '../constants/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.fields}>
          <FormInput label="Full Name" autoCapitalize="words" />
          <FormInput label="Student ID Number" keyboardType="number-pad" />
          <FormInput label="Email Address" keyboardType="email-address" />
          <FormInput label="Phone Number" keyboardType="phone-pad" />
          <FormInput label="Password" secureTextEntry />
          <FormInput label="Confirm Password" secureTextEntry />
        </View>

        <Pressable style={styles.terms} onPress={() => setAgreed((value) => !value)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed ? <Ionicons name="checkmark" size={17} color={COLORS.surface} /> : null}
          </View>
          <Text style={styles.termsText}>I agree to the Terms & Privacy</Text>
        </Pressable>

        <AppButton
          title="Create Account"
          disabled={!agreed}
          onPress={() => router.replace('/account-created')}
          style={styles.createButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background, overflow: 'hidden' },
  content: { paddingHorizontal: 38, paddingTop: 120, paddingBottom: 80 },
  circleTop: {
    position: 'absolute', top: -110, left: -85, width: 285, height: 285,
    borderRadius: 143, backgroundColor: COLORS.decorative,
  },
  circleBottom: {
    position: 'absolute', right: -72, bottom: -72, width: 160, height: 160,
    borderRadius: 80, backgroundColor: COLORS.decorative,
  },
  title: { fontSize: 30, fontWeight: '500', color: COLORS.text, marginBottom: 25 },
  fields: { gap: 18 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 28 },
  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 1,
    borderColor: '#5E6674', alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { fontSize: 14, color: COLORS.text, flex: 1 },
  createButton: { width: 180, alignSelf: 'center', marginTop: 26, borderRadius: RADIUS.pill },
});
