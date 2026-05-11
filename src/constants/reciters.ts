export type ReciterKey =
  | 'adhan_mishary'
  | 'adhan_abdul_basit'
  | 'adhan_makkah'
  | 'adhan_madinah'
  | 'adhan_sudais'
  | 'adhan_ali_ahmed_mulla'
  | 'adhan_hafiz_mustafa'
  | 'adhan_ibrahim_jibreen'
  | 'adhan_saber_muataz'
  | 'adhan_fares_abbad';

export type Reciter = {
  key: ReciterKey;
  name: string;
  description: string;
  file: string;
};

export const RECITERS: Reciter[] = [
  {
    key: 'adhan_mishary',
    name: 'Mishary Rashid Al-Afasy',
    description: 'Kuwait — warm, melodic style',
    file: 'adhan_mishary.wav',
  },
  {
    key: 'adhan_abdul_basit',
    name: 'Abdul Basit Abdul Samad',
    description: 'Egypt — classic, traditional style',
    file: 'adhan_abdul_basit.wav',
  },
  {
    key: 'adhan_makkah',
    name: 'Makkah (Masjid al-Haram)',
    description: 'Saudi Arabia — Grand Mosque, Makkah',
    file: 'adhan_makkah.wav',
  },
  {
    key: 'adhan_madinah',
    name: 'Madinah (Al-Masjid an-Nabawi)',
    description: "Saudi Arabia — Prophet's Mosque, Madinah",
    file: 'adhan_madinah.wav',
  },
  {
    key: 'adhan_sudais',
    name: 'Abdul Rahman Al-Sudais',
    description: 'Saudi Arabia — Imam of Masjid al-Haram',
    file: 'adhan_sudais.wav',
  },
  {
    key: 'adhan_ali_ahmed_mulla',
    name: 'Ali Ahmed Mulla',
    description: 'Bahrain — powerful, resonant style',
    file: 'adhan_ali_ahmed_mulla.wav',
  },
  {
    key: 'adhan_hafiz_mustafa',
    name: 'Hafiz Mustafa Özcan Günesdogdu',
    description: 'Turkey — Ottoman traditional style',
    file: 'adhan_hafiz_mustafa.wav',
  },
  {
    key: 'adhan_ibrahim_jibreen',
    name: 'Ibrahim Al-Jibreen',
    description: 'Saudi Arabia — clear, strong delivery',
    file: 'adhan_ibrahim_jibreen.wav',
  },
  {
    key: 'adhan_saber_muataz',
    name: 'Saber Muataz',
    description: 'Egypt — deep, traditional Egyptian style',
    file: 'adhan_saber_muataz.wav',
  },
  {
    key: 'adhan_fares_abbad',
    name: 'Fares Abbad',
    description: 'Algeria — rich, melodic North African style',
    file: 'adhan_fares_abbad.wav',
  },
];

export const DEFAULT_RECITER: ReciterKey = 'adhan_mishary';
