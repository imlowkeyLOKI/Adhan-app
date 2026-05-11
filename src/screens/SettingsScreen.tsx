import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { CALCULATION_METHODS, CalculationMethodKey } from '../constants/prayerConfig';
import { getCalculationMethod, saveCalculationMethod } from '../services/storage';
import { colors, spacing, fonts } from '../constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<CalculationMethodKey>('NorthAmerica');

  useEffect(() => {
    getCalculationMethod().then(setSelected);
  }, []);

  async function select(key: CalculationMethodKey) {
    setSelected(key);
    await saveCalculationMethod(key);
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg }]}
    >
      <Text style={styles.heading}>Settings</Text>

      <Text style={styles.sectionLabel}>Calculation Method</Text>
      <Text style={styles.sectionSubLabel}>
        Different regions follow different standards for calculating prayer times. Pick the one used in your area.
      </Text>

      <View style={styles.list}>
        {CALCULATION_METHODS.map(method => {
          const isSelected = selected === method.key;
          return (
            <TouchableOpacity
              key={method.key}
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => select(method.key)}
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
