import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, RADIUS } from '../constants/theme';

export default function SearchScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');

  const search = () => {
    const value = studentId.trim();
    if (!value) {
      Alert.alert('Student ID required', 'Enter your Student ID number before searching.');
      return;
    }
    router.push(value === '11124499' ? '/search-found' : '/search-not-found');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <ScreenHeader title="Search" />
        <Text style={styles.label}>Enter Your Student ID</Text>
        <TextInput
          value={studentId}
          onChangeText={setStudentId}
          keyboardType="number-pad"
          style={styles.input}
          maxLength={12}
        />
        <AppButton
          title="Search ID"
          icon={<Ionicons name="search-outline" size={21} color={COLORS.surface} />}
          onPress={search}
          style={styles.button}
        />
        <Text style={styles.demo}>Demo: enter 11124499 to show the found state.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  label: { fontSize: 16, color: COLORS.text, marginTop: 20, marginBottom: 10 },
  input: {
    height: 52, borderWidth: 1, borderColor: '#8A93A3', borderRadius: RADIUS.small,
    backgroundColor: COLORS.surface, paddingHorizontal: 14, fontSize: 17, color: COLORS.text,
  },
  button: { marginTop: 24 },
  demo: { marginTop: 14, fontSize: 12, color: COLORS.muted, textAlign: 'center' },
});
