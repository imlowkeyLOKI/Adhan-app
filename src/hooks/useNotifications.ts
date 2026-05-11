import { useState, useEffect } from 'react';
import {
  requestNotificationPermissions,
  scheduleAllNotifications,
  cancelAllNotifications,
  getScheduledCount,
} from '../services/notifications';
import { getNotificationsEnabled, saveNotificationsEnabled, getCalculationMethod, getSelectedReciter, saveSelectedReciter } from '../services/storage';
import { getUserLocation } from '../services/location';
import { CalculationMethodKey } from '../constants/prayerConfig';
import { ReciterKey } from '../constants/reciters';

export function useNotifications() {
  const [enabled, setEnabled] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const [isEnabled, granted] = await Promise.all([
      getNotificationsEnabled(),
      requestNotificationPermissions(),
    ]);

    setEnabled(isEnabled);
    setPermissionGranted(granted);

    if (isEnabled && granted) {
      await reschedule();
    }
  }

  async function reschedule(methodOverride?: CalculationMethodKey, reciterOverride?: ReciterKey) {
    try {
      const [location, methodKey, reciterKey] = await Promise.all([
        getUserLocation(),
        methodOverride ? Promise.resolve(methodOverride) : getCalculationMethod(),
        reciterOverride ? Promise.resolve(reciterOverride) : getSelectedReciter(),
      ]);
      await scheduleAllNotifications(location.latitude, location.longitude, methodKey, reciterKey);
      const count = await getScheduledCount();
      setScheduledCount(count);
    } catch (e) {
      console.warn('Failed to schedule notifications:', e);
    }
  }

  async function selectReciter(reciterKey: ReciterKey) {
    await saveSelectedReciter(reciterKey);
    if (enabled && permissionGranted) {
      await reschedule(undefined, reciterKey);
    }
  }

  async function toggle(value: boolean) {
    setEnabled(value);
    await saveNotificationsEnabled(value);
    if (value && permissionGranted) {
      await reschedule();
    } else {
      await cancelAllNotifications();
      setScheduledCount(0);
    }
  }

  return { enabled, permissionGranted, scheduledCount, toggle, reschedule, selectReciter };
}
