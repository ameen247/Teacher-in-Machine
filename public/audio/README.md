# 🎤 Audio Files for Word Pronunciation

Place your pre-recorded audio files here. Each word needs its own MP3 file.

## Required Files

| Filename | Word |
|----------|------|
| `apple.mp3` | Apple |
| `ball.mp3` | Ball |
| `cat.mp3` | Cat |
| `dog.mp3` | Dog |
| `sun.mp3` | Sun |
| `fish.mp3` | Fish |
| `girl.mp3` | Girl |
| `house.mp3` | House |

## How to Create Audio Files

### Option 1: Record with a Real Teacher (Best Quality)
1. Use your phone's voice recorder or a computer microphone
2. Have an Indian female teacher say each word clearly
3. Save as MP3 files with lowercase names (e.g., `apple.mp3`)

### Option 2: Use Free Online TTS
1. Go to one of these free TTS websites:
   - https://ttsmp3.com/ (select "Indian English - Aditi")
   - https://www.naturalreaders.com/online/ (select Indian voice)
   - https://freetts.com/ (select Hindi English)

2. Type each word and download as MP3
3. Rename files to lowercase (e.g., `Apple.mp3` → `apple.mp3`)

### Option 3: Use Google Cloud TTS (High Quality)
```bash
# Requires Google Cloud account
gcloud text-to-speech synthesize-text "Apple" \
  --voice="en-IN-Wavenet-A" \
  --audio-encoding="MP3" \
  --output="apple.mp3"
```

## Audio Settings Recommendations
- **Format:** MP3
- **Sample Rate:** 22050 Hz or higher
- **Bit Rate:** 128 kbps
- **Duration:** 1-2 seconds per word
- **Volume:** Normalized (not too loud/quiet)

## Testing
1. Add your audio files to this folder
2. Refresh the app
3. The app will automatically use your audio files
4. If a file is missing, it falls back to browser TTS

