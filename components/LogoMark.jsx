import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';

export default function LogoMark({ size = 138 }) {
  return (
    <View style={[styles.wrapper, { width: size, height: size }]}> 
      <View style={[styles.card, { width: size * 0.72, height: size * 0.52 }]}> 
        <Ionicons name="person-circle-outline" size={size * 0.34} color={COLORS.surface} />
        <View style={styles.lines}>
          <View style={styles.line} />
          <View style={[styles.line, styles.shortLine]} />
          <View style={styles.line} />
        </View>
      </View>
      <View style={[styles.search, { width: size * 0.38, height: size * 0.38 }]}> 
        <Ionicons name="search" size={size * 0.27} color={COLORS.primary} />
      </View>
      <View style={styles.bell}>
        <Ionicons name="notifications" size={size * 0.17} color={COLORS.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },
  lines: { width: '30%', gap: 5 },
  line: { height: 3, borderRadius: 3, backgroundColor: COLORS.surface },
  shortLine: { width: '70%' },
  search: {
    position: 'absolute',
    right: 5,
    bottom: 9,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    borderWidth: 5,
    borderColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    position: 'absolute',
    right: 25,
    top: 19,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    padding: 2,
  },
});
