import { calculatePrayerTimes, formatTime } from './prayerTimes';
import { getUserLocation } from './location';
import { getCalculationMethod } from './storage';
import { PRAYER_NAMES, PRAYER_ORDER, PrayerKey } from '../constants/prayerConfig';

export type WidgetPrayerEntry = {
  name: string;
  time: string;
  key: PrayerKey;
};

export type WidgetData = {
  prayers: WidgetPrayerEntry[];
  date: string;
  city: string;
};

export async function buildWidgetData(): Promise<WidgetData> {
  const [location, methodKey] = await Promise.all([
    getUserLocation(),
    getCalculationMethod(),
  ]);

  const schedule = calculatePrayerTimes(location.latitude, location.longitude, new Date(), methodKey);

  const prayers: WidgetPrayerEntry[] = PRAYER_ORDER.map(key => ({
    key,
    name: PRAYER_NAMES[key],
    time: formatTime(schedule[key]),
  }));

  const date = new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return { prayers, date, city: location.city ?? '' };
}
