# Adding 3 New Unique Athan Recordings

## Current Status
- ✅ 6 unique athans exist
- ✅ Removed 3 duplicates (nafees, zahrani, turkish)
- 🎯 Need 3 NEW unique recordings

## Recommended New Athans

### 1. **Abdul Basit Athan** (Egyptian style)
- **Name**: `adhan-basit.mp3`
- **Source**: https://archive.org/details/adhan-abdul-basit
- **Style**: Classic Egyptian recitation
- **Duration**: ~3-4 minutes

### 2. **Sudais Athan** (Makkah - different from current)
- **Name**: `adhan-sudais.mp3`
- **Source**: https://archive.org/details/adhan-sudais-makkah
- **Style**: Sheikh Sudais from Masjid al-Haram
- **Duration**: ~3-4 minutes

### 3. **Egyptian Traditional** (Alternative)
- **Name**: `adhan-egypt.mp3`
- **Source**: https://www.islamicity.org/audio/adhan/
- **Style**: Traditional Egyptian melodic
- **Duration**: ~3-4 minutes

## Alternative Sources

### Free & Legal Sources:
1. **IslamiCity**: https://www.islamicity.org/audio/adhan/
2. **Archive.org**: https://archive.org (search "adhan" or "azan")
3. **Freesound.org**: https://freesound.org (Creative Commons)
4. **YouTube Audio Library**: Download and convert (check license)

### Requirements:
- ✅ High quality (192kbps or higher)
- ✅ MP3 format
- ✅ 3-5 minutes duration
- ✅ Clear, authentic recitation
- ✅ No background music
- ✅ Free for commercial use OR public domain

## How to Add New Athans

### Step 1: Get MP3 Files
```bash
# Download your chosen athans
# Place in: /Users/ryanz/sajda-app/assets/audio/

adhan-basit.mp3
adhan-sudais.mp3
adhan-egypt.mp3
```

### Step 2: Convert to CAF (iOS notification format)
```bash
# Install ffmpeg if not already installed
brew install ffmpeg

# Convert each MP3 to CAF
cd assets/audio/notif/

ffmpeg -i ../adhan-basit.mp3 -acodec pcm_s16le -ar 44100 -ac 1 adhan-basit-notif.caf
ffmpeg -i ../adhan-sudais.mp3 -acodec pcm_s16le -ar 44100 -ac 1 adhan-sudais-notif.caf
ffmpeg -i ../adhan-egypt.mp3 -acodec pcm_s16le -ar 44100 -ac 1 adhan-egypt-notif.caf
```

### Step 3: Update Code (I'll do this automatically)
The code updates needed:
1. `utils/notifications.js` - Add to ADHAN_SOUND_MAP
2. `app/(tabs)/you.js` - Add to ADHAN_SOUNDS array

## Quick Download Commands

```bash
# Example: Download from Archive.org
cd /Users/ryanz/sajda-app/assets/audio/

# Abdul Basit
curl -L "https://archive.org/download/adhan-collection/abdul-basit.mp3" -o adhan-basit.mp3

# Sudais
curl -L "https://archive.org/download/adhan-collection/sudais.mp3" -o adhan-sudais.mp3

# Egyptian
curl -L "https://archive.org/download/adhan-collection/egypt.mp3" -o adhan-egypt.mp3

# Convert to CAF
cd notif/
for file in basit sudais egypt; do
  ffmpeg -i ../adhan-${file}.mp3 -acodec pcm_s16le -ar 44100 -ac 1 adhan-${file}-notif.caf
done
```

## After Adding Files

Run this to update the app:
```bash
cd /Users/ryanz/sajda-app
git add assets/audio/
git commit -m "Add 3 new unique athan recordings"
```

Then I'll automatically update the code to reference them.
