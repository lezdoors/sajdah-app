# Athan Alert Fix Plan

## Issues Found

### 1. 🚨 CRITICAL: Notifications Never Scheduled
- `scheduleAllPrayerNotifications()` exists but is NEVER called
- Permissions are requested but scheduling never happens
- Users get NO prayer alerts

**Fix:**
- Call `scheduleAllPrayerNotifications()` when location is obtained in home screen
- Re-schedule daily using AppState listener
- Add background task to refresh notifications

### 2. 🔊 Duplicate Athan Sounds (Confirmed via MD5)
- `adhan-default.mp3` = `adhan-nafees.mp3` (DUPLICATE)
- `adhan-madinah.mp3` = `adhan-zahrani.mp3` (DUPLICATE)
- `adhan-alaqsa.mp3` = `adhan-turkish.mp3` (DUPLICATE)
- **Result**: Only 6 unique athans instead of 9

**Fix:**
- Remove duplicates: nafees, zahrani, turkish
- Add 3 NEW unique athan recordings
- Update `ADHAN_SOUND_MAP` in notifications.js

### 3. 🎵 Missing CAF Files
- nafees, turkish, zahrani missing .caf versions (iOS notification sounds)
- These won't work for iOS background notifications

**Fix:**
- Convert remaining MP3s to CAF format
- OR remove these duplicates entirely

### 4. ✨ Full Athan Playback
- Code EXISTS for full playback when app is open (line 96-98 in notifications.js)
- Should work but needs testing

## Implementation Order

1. **IMMEDIATE**: Fix notification scheduling (add to home screen)
2. **HIGH**: Remove duplicate athans, add new unique ones
3. **MEDIUM**: Convert missing CAF files
4. **LOW**: Test full athan playback (may already work)

## New Athan Suggestions

Replace duplicates with:
1. **Abdul Basit** - Classic Egyptian reciter
2. **Sudais** - Imam of Masjid al-Haram
3. **Ghamdi** - Popular modern reciter

Or regional varieties:
1. **Egyptian** style
2. **Turkish** style (unique recording, not duplicate)
3. **Indonesian** style
