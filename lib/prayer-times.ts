import { PrayerTimes, Coordinates, CalculationMethod } from 'adhan';

export interface PrayerInfo {
  time: Date;
  type: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
}

export function calculatePrayerTimes(lat: number, lng: number, date: Date) {
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod.MuslimWorldLeague();

  const prayerTimes = new PrayerTimes(coords, date, params);

  const times: PrayerInfo[] = [
    { time: prayerTimes.fajr, type: 'Fajr' },
    { time: prayerTimes.dhuhr, type: 'Dhuhr' },
    { time: prayerTimes.asr, type: 'Asr' },
    { time: prayerTimes.maghrib, type: 'Maghrib' },
    { time: prayerTimes.isha, type: 'Isha' },
  ];

  return times;
}
