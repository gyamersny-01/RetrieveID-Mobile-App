import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  style,
}) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isOutline ? styles.outline : styles.primary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, isOutline ? styles.outlineText : styles.primaryText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
  },
  primary: { backgroundColor: COLORS.primary },
  outline: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
  text: { fontSize: 16, fontWeight: '600' },
  primaryText: { color: COLORS.surface },
  outlineText: { color: COLORS.primary },
});
