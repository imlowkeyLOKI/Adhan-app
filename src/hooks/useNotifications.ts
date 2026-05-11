import { useState, useEffect } from 'react';
import {
  requestNotificationPermissions,
  scheduleAllNotifications,
  cancelAllNotifications,
  getScheduledCount,
} from '../services/notifications';
import { getNotificationsEnabled, saveNotificationsEnabled, getCalculationMethod } from '../services/storage';
import { getUserLocation } from '../services/location';
import { CalculationMethodKey } from '../constants/prayerConfig';

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

  async function reschedule(methodOverride?: CalculationMethodKey) {
    try {
      const [location, methodKey] = await Promise.all([
        getUserLocation(),
        methodOverride ? Promise.resolve(methodOverride) : getCalculationMethod(),
      ]);
      await scheduleAllNotifications(location.latitude, location.longitude, methodKey);
      const count = await getScheduledCount();
      setScheduledCount(count);
    } catch (e) {
      console.warn('Failed to schedule notifications:', e);
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

  return { enabled, permissionGranted, scheduledCount, toggle, reschedule };
}
