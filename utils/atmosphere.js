// Time-of-Day UI Atmosphere System
// Shifts color temperature based on current prayer time / hour

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 6) return 'dawn';
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 20) return 'evening';
  return 'night';
}

// Returns greeting text based on time of day
export function getGreeting() {
  const tod = getTimeOfDay();
  switch (tod) {
    case 'dawn': return 'Assalamu Alaikum';
    case 'morning': return 'Assalamu Alaikum';
    case 'afternoon': return 'Assalamu Alaikum';
    case 'evening': return 'Assalamu Alaikum';
    case 'night': return 'Assalamu Alaikum';
    default: return 'Assalamu Alaikum';
  }
}

// Returns whether to use dark or light hero treatment
export function getHeroMode() {
  const tod = getTimeOfDay();
  if (tod === 'night' || tod === 'evening') return 'dark';
  return 'light';
}
