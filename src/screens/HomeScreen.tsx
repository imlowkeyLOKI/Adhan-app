import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '../constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adhan</Text>
      <Text style={styles.subtitle}>Prayer times coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fonts.size.xxl,
    color: colors.accent,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.size.md,
    color: colors.textMuted,
  },
});
