import { useState, useEffect, useRef } from 'react';
import { Magnetometer } from 'expo-sensors';
import { Coordinates, Qibla } from 'adhan';
import { getUserLocation } from '../services/location';

type QiblaState = {
  qiblaBearing: number | null;
  heading: number;
  arrowAngle: number;
  distance: number | null;
  city: string;
  loading: boolean;
  error: string | null;
};

const KAABA = { lat: 21.4225, lon: 39.8262 };
const ALPHA = 0.15; // low-pass filter smoothing (lower = smoother)

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useQibla() {
  const [state, setState] = useState<QiblaState>({
    qiblaBearing: null,
    heading: 0,
    arrowAngle: 0,
    distance: null,
    city: '',
    loading: true,
    error: null,
  });

  const smoothedHeading = useRef(0);
  const qiblaBearingRef = useRef<number | null>(null);

  useEffect(() => {
    let sub: ReturnType<typeof Magnetometer.addListener> | null = null;

    async function init() {
      try {
        const location = await getUserLocation();
        const coords = new Coordinates(location.latitude, location.longitude);
        const bearing = Qibla(coords);
        const distance = haversineKm(location.latitude, location.longitude, KAABA.lat, KAABA.lon);

        qiblaBearingRef.current = bearing;
        setState(prev => ({
          ...prev,
          qiblaBearing: bearing,
          distance: Math.round(distance),
          city: location.city ?? '',
          loading: false,
        }));

        Magnetometer.setUpdateInterval(100);
        sub = Magnetometer.addListener(({ x, y }) => {
          // Convert magnetometer x/y to compass heading (degrees from North, clockwise)
          const raw = (Math.atan2(y, x) * 180) / Math.PI;
          const rawHeading = (90 - raw + 360) % 360;

          // Low-pass filter to smooth jitter
          smoothedHeading.current =
            ALPHA * rawHeading + (1 - ALPHA) * smoothedHeading.current;

          const heading = smoothedHeading.current;
          const qibla = qiblaBearingRef.current ?? 0;
          const arrowAngle = (qibla - heading + 360) % 360;

          setState(prev => ({ ...prev, heading, arrowAngle }));
        });
      } catch (e: any) {
        setState(prev => ({ ...prev, loading: false, error: e.message ?? 'Failed to load Qibla' }));
      }
    }

    init();
    return () => { sub?.remove(); };
  }, []);

  return state;
}
