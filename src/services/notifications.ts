import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { calculatePrayerTimes } from './prayerTimes';
import { PRAYER_NAMES, PRAYER_ORDER, CalculationMethodKey } from '../constants/prayerConfig';

const REMINDER_MINUTES = 15;
const DAYS_TO_SCHEDULE = 3;

export async function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('adhan', {
      name: 'Adhan — Call to Prayer',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'adhan_mishary.wav',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#c8a96e',
    });
    await Notifications.setNotificationChannelAsync('reminder', {
      name: 'Prayer Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return status === 'granted';
}

export async function scheduleAllNotifications(
  latitude: number,
  longitude: number,
  methodKey: CalculationMethodKey,
  selectedReciter: string = 'adhan_mishary'
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();

  for (let dayOffset = 0; dayOffset < DAYS_TO_SCHEDULE; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(0, 0, 0, 0);

    const schedule = calculatePrayerTimes(latitude, longitude, date, methodKey);

    for (const prayerKey of PRAYER_ORDER) {
      const prayerTime = schedule[prayerKey];
      if (prayerTime <= now) continue;

      const timeString = prayerTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // 15-minute reminder
      const reminderTime = new Date(prayerTime.getTime() - REMINDER_MINUTES * 60 * 1000);
      if (reminderTime > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${PRAYER_NAMES[prayerKey]} in 15 minutes`,
            body: `Prayer time at ${timeString}`,
            sound: 'default',
            ...(Platform.OS === 'android' && { channelId: 'reminder' }),
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminderTime },
        });
      }

      // On-time notification with Adhan sound
      // Custom sound works in a dev build (Phase 4). Falls back to default in Expo Go.
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${PRAYER_NAMES[prayerKey]}`,
          body: 'Time for prayer',
          sound: `${selectedReciter}.wav`,
          ...(Platform.OS === 'android' && { channelId: 'adhan' }),
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: prayerTime },
      });
    }
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledCount(): Promise<number> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
}
