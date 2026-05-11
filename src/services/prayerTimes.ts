import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';
import { CalculationMethodKey, PRAYER_ORDER, PrayerKey } from '../constants/prayerConfig';

export type PrayerSchedule = {
  [key in PrayerKey]: Date;
};

export type NextPrayer = {
  name: PrayerKey;
  time: Date;
  minutesUntil: number;
};

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: Date,
  methodKey: CalculationMethodKey
): PrayerSchedule {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod[methodKey]();
  const times = new PrayerTimes(coordinates, date, params);

  return {
    fajr: times.fajr,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
  };
}

export function getNextPrayer(schedule: PrayerSchedule): NextPrayer | null {
  const now = new Date();

  for (const name of PRAYER_ORDER) {
    const time = schedule[name];
    if (time > now) {
      const minutesUntil = Math.floor((time.getTime() - now.getTime()) / 60000);
      return { name, time, minutesUntil };
    }
  }

  return null;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatCountdown(minutesUntil: number): string {
  if (minutesUntil < 60) return `${minutesUntil}m`;
  const h = Math.floor(minutesUntil / 60);
  const m = minutesUntil % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
