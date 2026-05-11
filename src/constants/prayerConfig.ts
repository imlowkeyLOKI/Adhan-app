export type CalculationMethodKey =
  | 'NorthAmerica'
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey';

export const CALCULATION_METHODS: { key: CalculationMethodKey; label: string; region: string }[] = [
  { key: 'NorthAmerica', label: 'ISNA', region: 'North America' },
  { key: 'MuslimWorldLeague', label: 'Muslim World League', region: 'Europe, Far East, parts of USA' },
  { key: 'Egyptian', label: 'Egyptian General Authority', region: 'Africa, Syria, Lebanon, Malaysia' },
  { key: 'Karachi', label: 'University of Islamic Sciences', region: 'Pakistan, Bangladesh, India, Afghanistan' },
  { key: 'UmmAlQura', label: 'Umm al-Qura', region: 'Arabian Peninsula' },
  { key: 'Dubai', label: 'Dubai', region: 'UAE' },
  { key: 'MoonsightingCommittee', label: 'Moonsighting Committee', region: 'UK & Ireland' },
  { key: 'Kuwait', label: 'Kuwait', region: 'Kuwait' },
  { key: 'Qatar', label: 'Qatar', region: 'Qatar' },
  { key: 'Singapore', label: 'Singapore', region: 'Singapore, Malaysia, Indonesia' },
  { key: 'Tehran', label: 'Institute of Geophysics, Tehran', region: 'Iran, some Shia communities' },
  { key: 'Turkey', label: 'Diyanet İşleri Başkanlığı', region: 'Turkey' },
];

export const PRAYER_NAMES: Record<string, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export const PRAYER_ORDER = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerKey = typeof PRAYER_ORDER[number];
