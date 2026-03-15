# Sajdah App Design

## Overview
Sajdah is an Islamic spiritual companion app — prayer times, Quran reader, Qibla compass, daily inspiration, and journaling. iOS-first, free + premium subscription model.

**Tagline**: "From the Heart"

## Architecture
Clone of Alathan (`/Users/ryanz/clawd/alathan/`) with Sajdah's Stitch-designed UI and merged best features from both apps.

### Stack
- Expo SDK 54 + expo-router (file-based routing)
- expo-location, expo-sensors, expo-sqlite, expo-av, expo-notifications, expo-haptics
- expo-blur, expo-linear-gradient
- Lucide React Native icons
- AsyncStorage for user state
- adhan v4.4.3 for prayer time calculations
- EAS Build + Submit to App Store

### Apple Developer
- Account: ryan haddaoui
- Team ID: X7U8JVG72M
- Bundle ID: com.sajdah.app

## Design System (from Stitch exports)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| primary | #006D44 | Deep green, prayer cards, headers |
| primaryLight | #19e680 | Bright mint accent, active tabs, CTAs |
| background | #FBFBF9 | Main background |
| backgroundDark | #0A1A14 | Dark mode background |
| surface | #F3F5F2 | Cards, sections |
| surfaceElevated | #FFFFFF | Elevated cards |
| textPrimary | #1E293B (slate-800) | Headings |
| textSecondary | #64748B (slate-500) | Body text |
| gold | #C9A24A | Premium accents |

### Typography
- Font family: Manrope (200-800 weights)
- Display: 56px, Hero: 48px, H1: 32px, H2: 24px, Body: 16px
- Arabic text: System Arabic (SF Arabic for iOS)

### Spacing
8-point grid: xs(8), sm(16), md(24), lg(32), xl(40), xxl(48)

## Navigation

```
Stack (root, headerShown: false)
├── index.js          → Onboarding gate (checks AsyncStorage)
├── onboarding.js     → 3-step flow
└── (tabs)/
    ├── _layout.js    → 5-tab bar
    ├── index.js      → Home (dashboard)
    ├── prayer.js     → Prayer times + notifications
    ├── qibla.js      → Compass + city search
    ├── quran.js      → Surah browser + reader + audio
    └── settings.js   → Preferences + premium
```

### Tab Bar
| Tab | Icon | Label |
|-----|------|-------|
| Home | Home | HOME |
| Prayer | Clock | PRAYER |
| Qibla | Compass (centered, elevated) | QIBLA |
| Quran | BookOpen | QURAN |
| Settings | Settings | SETTINGS |

## Screens

### 1. Splash Screen
- Full green gradient (#006D44 → #004D31)
- Mosque icon (circular, semi-transparent bg)
- "SAJDAH" in Manrope 800, letter-spaced
- Underline accent in #19e680
- "FROM THE HEART" subtitle

### 2. Onboarding (3 steps)
**Step 1 — Welcome**: Garden image, "Welcome to your spiritual companion", Get Started CTA
**Step 2 — Location + Notifications**: Request permissions for prayer times and reminders
**Step 3 — Spiritual Intent**: Daily reminders toggle, content focus selection, Finish Setup

### 3. Home Dashboard (from Stitch premium design)
- Header: Profile avatar + "Peaceful Home" + date + notification bell
- **Prayer Card**: Green gradient, current prayer name (large), start time, next prayer countdown, "Go to Prayer Times" CTA
- **Quick Actions**: Prayers, Quran, Qibla, Reflection (icon row)
- **Daily Ayah**: Arabic text + English translation + Surah reference + share button
- **Reflect Section**: Journal prompt + "Journal Thoughts" CTA
- **Bottom Tab Bar**

### 4. Prayer Times
- Hijri date display
- All 5 prayers with times, highlight current
- Notification toggles per prayer
- Calculation method selector (from Alathan)
- Countdown to next prayer

### 5. Qibla Compass (from Stitch design)
- Header with back + title + location button
- Search bar: "Search for a city manually" + recent cities
- Current location: city name + accuracy
- Compass: outer ring with N/S/E/W, degree display (e.g. 215), direction label (SOUTH WEST)
- Kaaba icon on compass needle line
- Distance to Mecca + Direction cards
- Calibration hint: "Move your phone in a figure-8 to calibrate"

### 6. Quran Reader (from Stitch + Alathan)
- Search bar (surah, juz, or verse)
- "Continue Reading" card (last position)
- Tabs: Surah | Juz | Bookmarks
- Surah list: number, English name, Arabic name, type (Meccan/Medinan), verse count
- Reader view: Arabic text (large) + transliteration + English translation
- Per-ayah: share, play audio, bookmark icons
- Audio playback: 4 reciters (from Alathan audioPlayer.js)

### 7. Settings
- Profile section
- Prayer calculation method
- Notification preferences
- Theme (light/dark)
- Language
- Premium upgrade CTA
- About / Rate / Share

## Data Layer (reuse from Alathan)
- `data/surahs.js` — 114 surahs metadata
- `data/ayahs.js` — Quranic text (Arabic + English)
- `data/duas.js` — Dua categories
- `data/hadith.js` — Daily hadith
- `data/names.js` — 99 Names of Allah

## Utilities (reuse from Alathan)
- `utils/prayer.js` — adhan library wrapper
- `utils/storage.js` — AsyncStorage CRUD
- `utils/quranLoader.js` — static → cache → API pipeline
- `utils/notifications.js` — prayer reminder scheduling
- `utils/audioPlayer.js` — Expo AV for Quran recitation
- `utils/hijri.js` — Hijri calendar conversion
- `utils/atmosphere.js` — time-of-day UI theming

## Monetization
- **Free**: Prayer times, Quran (Arabic + translation), Qibla, notifications, daily ayah
- **Premium** ($2.99/mo or $19.99/yr): Ad-free, extra adhan sounds, custom themes, advanced tafsir

## Build Order
1. Project scaffold (clone Alathan structure, swap theme/config)
2. Splash + Onboarding flow
3. Home dashboard (prayer card + daily ayah + journal)
4. Prayer times screen (reuse Alathan engine)
5. Qibla compass (new, from Stitch design)
6. Quran reader (merge Alathan data + Stitch UI)
7. Settings screen
8. Assets (icon, splash, screenshots from Stitch PNGs)
9. EAS build + TestFlight
10. App Store submission

## Reference
- Stitch export: `/Users/ryanz/sajda/stitch_home_dashboard/`
- Alathan source: `/Users/ryanz/clawd/alathan/`
- App Store Connect: Salat (Waiting for Review), Sakinah (Prepare for Submission)
- Stitch project: https://stitch.withgoogle.com/projects/1875707831074917806
