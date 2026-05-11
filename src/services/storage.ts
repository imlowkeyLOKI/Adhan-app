import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculationMethodKey } from '../constants/prayerConfig';

const KEYS = {
  calculationMethod: 'calculationMethod',
  notificationsEnabled: 'notificationsEnabled',
};

export async function getCalculationMethod(): Promise<CalculationMethodKey> {
  const value = await AsyncStorage.getItem(KEYS.calculationMethod);
  return (value as CalculationMethodKey) ?? 'NorthAmerica';
}

export async function saveCalculationMethod(method: CalculationMethodKey): Promise<void> {
  await AsyncStorage.setItem(KEYS.calculationMethod, method);
}

export async function getNotificationsEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.notificationsEnabled);
  return value === null ? true : value === 'true';
}

export async function saveNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.notificationsEnabled, String(enabled));
}
