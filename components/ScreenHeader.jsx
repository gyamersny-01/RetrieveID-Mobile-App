import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

export default function ScreenHeader({ title, showBack = true, showBell = true }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.side, styles.right]}>
        {showBell ? (
          <Pressable onPress={() => router.push('/notifications')} hitSlop={12}>
            <Ionicons name="notifications-outline" size={25} color={COLORS.text} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  side: { width: 42, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  title: { flex: 1, fontSize: 25, fontWeight: '500', color: COLORS.text },
});
