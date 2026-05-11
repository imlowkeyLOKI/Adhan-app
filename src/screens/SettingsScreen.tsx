import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { CALCULATION_METHODS, CalculationMethodKey } from '../constants/prayerConfig';
import { getCalculationMethod, saveCalculationMethod } from '../services/storage';
import { useNotifications } from '../hooks/useNotifications';
import { colors, spacing, fonts } from '../constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<CalculationMethodKey>('NorthAmerica');
  const { enabled, permissionGranted, scheduledCount, toggle, reschedule } = useNotifications();

  useEffect(() => {
    getCalculationMethod().then(setSelected);
  }, []);

  async function selectMethod(key: CalculationMethodKey) {
    setSelected(key);
    await saveCalculationMethod(key);
    if (enabled && permissionGranted) {
      await reschedule(key);
    }
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg }]}
    >
      <Text style={styles.heading}>Settings</Text>

      {/* Notifications */}
      <Text style={styles.sectionLabel}>Notifications</Text>
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Prayer Notifications</Text>
            <Text style={styles.toggleSub}>
              {!permissionGranted
                ? 'Permission denied — enable in iOS Settings'
                : enabled
                ? `${scheduledCount} notifications scheduled`
                : 'Notifications off'}
            </Text>
          </View>
          <Switch
            value={enabled && permissionGranted}
            onValueChange={toggle}
            trackColor={{ false: colors.surfaceLight, true: colors.accent }}
            thumbColor={colors.white}
            disabled={!permissionGranted}
          />
        </View>
        {enabled && permissionGranted && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              You'll get a reminder 15 minutes before each prayer, and another notification at prayer time with the Adhan.
            </Text>
            <Text style={styles.infoNote}>
              Note: Custom Adhan audio requires a dev build. Expo Go uses the default sound.
            </Text>
          </View>
        )}
      </View>

      {/* Calculation Method */}
      <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Calculation Method</Text>
      <Text style={styles.sectionSubLabel}>
        Pick the method used in your region. This affects all prayer times and notification schedules.
      </Text>

      <View style={styles.list}>
        {CALCULATION_METHODS.map(method => {
          const isSelected = selected === method.key;
          return (
            <TouchableOpacity
              key={method.key}
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => selectMethod(method.key)}
              activeOpacity={0.7}
            >
              <View style={styles.rowText}>
                <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
                  {method.label}
                </Text>
                <Text style={styles.methodRegion}>{method.region}</Text>
              </View>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },

  heading: { fontSize: fonts.size.xl, color: colors.text, fontWeight: '700', marginBottom: spacing.xl },

  sectionLabel: { fontSize: fonts.size.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.xs },
  sectionSubLabel: { fontSize: fonts.size.sm, color: colors.textMuted, marginBottom: spacing.lg, lineHeight: 20 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  toggleText: { flex: 1 },
  toggleTitle: { fontSize: fonts.size.md, color: colors.text, fontWeight: '500' },
  toggleSub: { fontSize: fonts.size.xs, color: colors.textMuted, marginTop: 2 },
  infoBox: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    padding: spacing.md,
    gap: spacing.xs,
  },
  infoText: { fontSize: fonts.size.sm, color: colors.textMuted, lineHeight: 18 },
  infoNote: { fontSize: fonts.size.xs, color: colors.textMuted, fontStyle: 'italic', lineHeight: 16 },

  list: { gap: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowSelected: { borderColor: colors.accent },
  rowText: { flex: 1 },
  methodLabel: { fontSize: fonts.size.md, color: colors.text, fontWeight: '500' },
  methodLabelSelected: { color: colors.accent },
  methodRegion: { fontSize: fonts.size.xs, color: colors.textMuted, marginTop: 2 },
  checkmark: { color: colors.accent, fontSize: fonts.size.md, fontWeight: '700' },
});
