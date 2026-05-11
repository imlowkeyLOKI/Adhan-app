import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculationMethodKey } from '../constants/prayerConfig';

const KEYS = {
  calculationMethod: 'calculationMethod',
};

export async function getCalculationMethod(): Promise<CalculationMethodKey> {
  const value = await AsyncStorage.getItem(KEYS.calculationMethod);
  return (value as CalculationMethodKey) ?? 'NorthAmerica';
}

export async function saveCalculationMethod(method: CalculationMethodKey): Promise<void> {
  await AsyncStorage.setItem(KEYS.calculationMethod, method);
}
