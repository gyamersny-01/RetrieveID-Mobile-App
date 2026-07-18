import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function MenuRow({ icon, label, onPress, danger = false, last = false }) {
  const color = danger ? COLORS.danger : COLORS.text;
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && styles.border]}>
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#5E6674" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#727A87' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 15 },
});
