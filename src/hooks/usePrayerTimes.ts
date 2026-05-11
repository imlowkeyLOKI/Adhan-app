import { useState, useEffect, useCallback } from 'react';
import { getUserLocation, UserLocation } from '../services/location';
import { calculatePrayerTimes, getNextPrayer, PrayerSchedule, NextPrayer } from '../services/prayerTimes';
import { getCalculationMethod } from '../services/storage';
import { syncWidgetData } from '../services/widgetSync';
import { CalculationMethodKey } from '../constants/prayerConfig';

type State = {
  location: UserLocation | null;
  schedule: PrayerSchedule | null;
  nextPrayer: NextPrayer | null;
  methodKey: CalculationMethodKey;
  loading: boolean;
  error: string | null;
};

export function usePrayerTimes() {
  const [state, setState] = useState<State>({
    location: null,
    schedule: null,
    nextPrayer: null,
    methodKey: 'NorthAmerica',
    loading: true,
    error: null,
  });

  const load = useCallback(async (methodOverride?: CalculationMethodKey) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [location, methodKey] = await Promise.all([
        getUserLocation(),
        methodOverride ? Promise.resolve(methodOverride) : getCalculationMethod(),
      ]);
      const schedule = calculatePrayerTimes(location.latitude, location.longitude, new Date(), methodKey);
      const nextPrayer = getNextPrayer(schedule);
      setState({ location, schedule, nextPrayer, methodKey, loading: false, error: null });
      syncWidgetData();
    } catch (e: any) {
      setState(prev => ({ ...prev, loading: false, error: e.message ?? 'Failed to load prayer times' }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Refresh next prayer every minute
  useEffect(() => {
    if (!state.schedule) return;
    const interval = setInterval(() => {
      const nextPrayer = getNextPrayer(state.schedule!);
      setState(prev => ({ ...prev, nextPrayer }));
    }, 60000);
    return () => clearInterval(interval);
  }, [state.schedule]);

  return { ...state, reload: load };
}
