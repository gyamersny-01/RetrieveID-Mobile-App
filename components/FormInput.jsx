import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

export default function FormInput({
  label,
  error,
  containerStyle,
  inputStyle,
  ...props
}) {
  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        placeholderTextColor="#9CA3AF"
        style={[
          styles.input,
          error ? styles.inputError : null,
          inputStyle,
        ]}
        {...props}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 9,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#9AA3B2',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.small,
    paddingHorizontal: 14,
    fontSize: 16,
    color: COLORS.text,
  },

  inputError: {
    borderColor: COLORS.danger,
  },

  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
  },
});