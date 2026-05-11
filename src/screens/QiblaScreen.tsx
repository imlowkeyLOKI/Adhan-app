import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQibla } from '../hooks/useQibla';
import { colors, spacing, fonts } from '../constants/theme';

export default function QiblaScreen() {
  const insets = useSafeAreaInsets();
  const { arrowAngle, distance, city, loading, error } = useQibla();

  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Finding Qibla direction…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.heading}>Qibla</Text>
      {city ? <Text style={styles.city}>{city}</Text> : null}

      {/* Compass */}
      <View style={styles.compassContainer}>
        {/* Cardinal directions */}
        <Text style={[styles.cardinal, styles.north]}>N</Text>
        <Text style={[styles.cardinal, styles.south]}>S</Text>
        <Text style={[styles.cardinal, styles.east]}>E</Text>
        <Text style={[styles.cardinal, styles.west]}>W</Text>

        {/* Compass ring */}
        <View style={styles.ring} />

        {/* Qibla arrow — rotates to point toward Mecca */}
        <View style={[styles.arrowContainer, { transform: [{ rotate: `${arrowAngle}deg` }] }]}>
          {/* Arrowhead */}
          <View style={styles.arrowHead} />
          {/* Shaft */}
          <View style={styles.arrowShaft} />
          {/* Tail */}
          <View style={styles.arrowTail} />
        </View>

        {/* Kaaba icon at center */}
        <Text style={styles.centerIcon}>🕋</Text>
      </View>

      {/* Distance */}
      {distance !== null && (
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Distance to Mecca</Text>
          <Text style={styles.infoValue}>
            {distance.toLocaleString()} <Text style={styles.infoUnit}>km</Text>
          </Text>
        </View>
      )}

      <Text style={styles.note}>
        Hold your phone flat and level for accurate readings.
      </Text>
    </View>
  );
}

const COMPASS_SIZE = 280;
const ARROW_LENGTH = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: spacing.lg,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },

  heading: { fontSize: fonts.size.xl, color: colors.text, fontWeight: '700', marginBottom: 2 },
  city: { fontSize: fonts.size.sm, color: colors.textMuted, marginBottom: spacing.xl },

  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  ring: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.surfaceLight,
    backgroundColor: colors.surface,
  },

  cardinal: {
    position: 'absolute',
    fontSize: fonts.size.sm,
    fontWeight: '700',
    color: colors.textMuted,
  },
  north: { top: 10, color: colors.accent },
  south: { bottom: 10 },
  east: { right: 10 },
  west: { left: 10 },

  arrowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: ARROW_LENGTH * 2,
    width: 20,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.accent,
  },
  arrowShaft: {
    width: 4,
    flex: 1,
    backgroundColor: colors.accent,
    opacity: 0.7,
  },
  arrowTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surfaceLight,
  },

  centerIcon: { position: 'absolute', fontSize: 22 },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginBottom: spacing.xl,
  },
  infoLabel: { fontSize: fonts.size.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  infoValue: { fontSize: fonts.size.xl, color: colors.text, fontWeight: '700', marginTop: 2 },
  infoUnit: { fontSize: fonts.size.md, color: colors.textMuted, fontWeight: '400' },

  note: { fontSize: fonts.size.xs, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl },
  loadingText: { fontSize: fonts.size.sm, color: colors.textMuted },
  errorText: { fontSize: fonts.size.md, color: colors.text, textAlign: 'center', paddingHorizontal: spacing.xl },
});
