import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { PRAYER_NAMES, PRAYER_ORDER, PrayerKey } from '../constants/prayerConfig';
import { formatTime, formatCountdown } from '../services/prayerTimes';
import { colors, spacing, fonts } from '../constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { schedule, nextPrayer, location, loading, error, reload } = usePrayerTimes();

  const today = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Getting prayer times…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={() => reload()}>Tap to retry</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.md }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => reload()} tintColor={colors.accent} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{today}</Text>
        {location?.city && <Text style={styles.cityText}>{location.city}</Text>}
      </View>

      {/* Next prayer banner */}
      {nextPrayer && (
        <View style={styles.nextPrayerCard}>
          <Text style={styles.nextLabel}>Next Prayer</Text>
          <Text style={styles.nextName}>{PRAYER_NAMES[nextPrayer.name]}</Text>
          <Text style={styles.nextTime}>{formatTime(nextPrayer.time)}</Text>
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownText}>in {formatCountdown(nextPrayer.minutesUntil)}</Text>
          </View>
        </View>
      )}

      {/* All prayer times */}
      <View style={styles.prayerList}>
        {PRAYER_ORDER.map(key => {
          const isNext = nextPrayer?.name === key;
          const isPast = schedule ? schedule[key] < new Date() : false;
          return (
            <PrayerRow
              key={key}
              name={PRAYER_NAMES[key]}
              time={schedule ? formatTime(schedule[key]) : '--:--'}
              isNext={isNext}
              isPast={isPast}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

function PrayerRow({
  name,
  time,
  isNext,
  isPast,
}: {
  name: string;
  time: string;
  isNext: boolean;
  isPast: boolean;
}) {
  return (
    <View style={[styles.prayerRow, isNext && styles.prayerRowNext]}>
      <Text style={[styles.prayerName, isPast && styles.textMuted, isNext && styles.textAccent]}>
        {name}
      </Text>
      <Text style={[styles.prayerTime, isPast && styles.textMuted, isNext && styles.textAccent]}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  centered: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: spacing.md },

  header: { marginBottom: spacing.xl },
  dateText: { fontSize: fonts.size.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  cityText: { fontSize: fonts.size.xl, color: colors.text, fontWeight: '700', marginTop: spacing.xs },

  nextPrayerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  nextLabel: { fontSize: fonts.size.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: spacing.sm },
  nextName: { fontSize: fonts.size.xxl, color: colors.accent, fontWeight: '700' },
  nextTime: { fontSize: fonts.size.xl, color: colors.text, fontWeight: '300', marginTop: spacing.xs },
  countdownBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 100,
  },
  countdownText: { fontSize: fonts.size.sm, color: colors.accentLight },

  prayerList: { gap: spacing.xs },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  prayerRowNext: { borderWidth: 1, borderColor: colors.accent },
  prayerName: { fontSize: fonts.size.md, color: colors.text, fontWeight: '500' },
  prayerTime: { fontSize: fonts.size.md, color: colors.text },
  textMuted: { color: colors.textMuted },
  textAccent: { color: colors.accent },

  loadingText: { color: colors.textMuted, fontSize: fonts.size.sm, marginTop: spacing.sm },
  errorText: { color: colors.text, fontSize: fonts.size.md, textAlign: 'center', paddingHorizontal: spacing.xl },
  retryText: { color: colors.accent, fontSize: fonts.size.sm, marginTop: spacing.sm },
});
