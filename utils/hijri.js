// Hijri date using Intl.DateTimeFormat (Umm al-Qura calendar)

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah',
];

const MONTH_MAP = {};
HIJRI_MONTHS.forEach((name, i) => {
  MONTH_MAP[name.toLowerCase()] = i + 1;
});
// Handle Intl variations in month names
MONTH_MAP['rabiʻ i'] = 3;
MONTH_MAP['rabiʻ ii'] = 4;
MONTH_MAP['rabi\u02bb i'] = 3;
MONTH_MAP['rabi\u02bb ii'] = 4;
MONTH_MAP['jumada i'] = 5;
MONTH_MAP['jumada ii'] = 6;
MONTH_MAP['dhu\u02bbl-qi\u02bbdah'] = 11;
MONTH_MAP['dhu\u02bbl-hijjah'] = 12;
MONTH_MAP['dhuʻl-qiʻdah'] = 11;
MONTH_MAP['dhuʻl-hijjah'] = 12;

function parseIntlHijri(date) {
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  let day = 1, month = 1, year = 1447, monthName = '';

  for (const p of parts) {
    if (p.type === 'day') day = parseInt(p.value, 10);
    if (p.type === 'year') year = parseInt(p.value, 10);
    if (p.type === 'month') monthName = p.value;
  }

  // Try exact match first, then fuzzy match
  const lower = monthName.toLowerCase();
  if (MONTH_MAP[lower]) {
    month = MONTH_MAP[lower];
  } else {
    // Fuzzy: find which Hijri month name is contained in the Intl output
    const idx = HIJRI_MONTHS.findIndex(m => lower.includes(m.toLowerCase().split(' ')[0]));
    if (idx !== -1) month = idx + 1;
  }

  return { year, month, day, monthName };
}

export function gregorianToHijri(gDate = new Date()) {
  const { year, month, day } = parseIntlHijri(gDate);
  return { year, month, day };
}

export function formatHijriDate(gDate = new Date()) {
  const { day, month, year, monthName } = parseIntlHijri(gDate);
  // Use Intl month name if available, fall back to our list
  const displayMonth = HIJRI_MONTHS[month - 1] || monthName;
  return `${day} ${displayMonth}, ${year} AH`;
}

export function getHijriMonthName(month) {
  return HIJRI_MONTHS[month - 1] || '';
}
