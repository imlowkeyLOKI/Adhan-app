import { Platform, NativeModules } from 'react-native';
import { buildWidgetData } from './widgetData';

// Writes current prayer times into shared storage so the widget can read them.
// On iOS: uses NativeModules.RNCSharedStorage (App Group UserDefaults).
// On Android: react-native-android-widget handles its own data via the task handler.
export async function syncWidgetData(): Promise<void> {
  try {
    const data = await buildWidgetData();

    if (Platform.OS === 'ios') {
      const payload = JSON.stringify(
        data.prayers.map(p => ({ name: p.name, time: p.time }))
      );
      // Requires App Group entitlement + a native module or SharedGroupPreferences library.
      // This will be wired up when we add the @bacons/apple-targets config plugin build.
      NativeModules.SharedGroupPreferences?.setItem('prayerTimes', payload, 'group.com.adhanapp.adhan');
      NativeModules.SharedGroupPreferences?.setItem('city', data.city, 'group.com.adhanapp.adhan');
    }
  } catch (e) {
    // Widget sync is non-critical — don't crash the app if it fails
  }
}
