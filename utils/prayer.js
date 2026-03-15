import { Coordinates, PrayerTimes, CalculationMethod, SunnahTimes } from 'adhan';

const METHODS = {
  MWL: CalculationMethod.MuslimWorldLeague,
  ISNA: CalculationMethod.NorthAmerica,
  Egyptian: CalculationMethod.Egyptian,
  Karachi: CalculationMethod.Karachi,
  Dubai: CalculationMethod.Dubai,
  Qatar: CalculationMethod.Qatar,
  Kuwait: CalculationMethod.Kuwait,
  Singapore: CalculationMethod.Singapore,
  Turkey: CalculationMethod.Turkey,
  Tehran: CalculationMethod.Tehran,
};

export function getPrayerTimes(latitude, longitude, date = new Date(), method = 'ISNA') {
  const coordinates = new Coordinates(latitude, longitude);
  const params = METHODS[method] ? METHODS[method]() : CalculationMethod.NorthAmerica();
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const sunnah = new SunnahTimes(prayerTimes);

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
    qiyam: sunnah.middleOfTheNight,
  };
}

export function getNextPrayer(prayerTimes) {
  const now = new Date();
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Sunrise', time: prayerTimes.sunrise },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
    { name: 'Qiyam', time: prayerTimes.qiyam },
  ];

  for (const prayer of prayers) {
    if (prayer.time > now) return prayer;
  }
  return prayers[0]; // wrap to Fajr
}

export function getCurrentPrayer(prayerTimes) {
  const now = new Date();
  const prayers = [
    { name: 'Qiyam', time: prayerTimes.qiyam },
    { name: 'Isha', time: prayerTimes.isha },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Sunrise', time: prayerTimes.sunrise },
    { name: 'Fajr', time: prayerTimes.fajr },
  ];

  for (const prayer of prayers) {
    if (now >= prayer.time) return prayer;
  }
  return { name: 'Isha', time: prayerTimes.isha };
}

export function formatTime(date) {
  if (!date) return '--:--';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return { hours: 0, minutes: 0, text: 'Now' };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const text = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  return { hours, minutes, text };
}

export function getAvailableMethods() {
  return Object.keys(METHODS);
}
