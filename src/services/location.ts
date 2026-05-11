import * as Location from 'expo-location';

export type UserLocation = {
  latitude: number;
  longitude: number;
  city?: string;
};

export async function getUserLocation(): Promise<UserLocation> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = location.coords;

  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    const city = place?.city || place?.subregion || place?.region || undefined;
    return { latitude, longitude, city };
  } catch {
    return { latitude, longitude };
  }
}
