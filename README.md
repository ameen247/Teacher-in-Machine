# 🎓 Teacher In Machine

A gamified English learning platform for Grade 1 students in India. Built with React, featuring speech recognition for pronunciation practice.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4)

## ✨ Features

- 🎮 **Gamified Learning** - Earn coins for correct pronunciation
- 🗣️ **Speech Recognition** - Uses Web Speech API for pronunciation checking
- 🔊 **Text-to-Speech** - Words are spoken aloud for the child to repeat
- 🎯 **Phonetic Matching** - Smart matching that understands "sun" = "son"
- 👶 **Child-Friendly** - No buttons needed, automatic retry on failure
- 🌈 **Beautiful UI** - Colorful, engaging interface with animations
- 📱 **Responsive** - Works on tablets and kiosks

## 🎯 How It Works

1. **Demo Student** - Click to start the learning experience
2. **Listen** - The word is spoken automatically
3. **Speak** - Say the word out loud
4. **Feedback** - Get instant feedback with celebrations for correct answers
5. **Progress** - Move through 8 vocabulary words earning coins

## 📚 Curriculum

| Word | Kannada | Image |
|------|---------|-------|
| Apple | ಸೇಬು | 🍎 |
| Ball | ಚೆಂಡು | ⚽ |
| Cat | ಬೆಕ್ಕು | 🐱 |
| Dog | ನಾಯಿ | 🐕 |
| Sun | ಸೂರ್ಯ | ☀️ |
| Fish | ಮೀನು | 🐟 |
| Girl | ಹುಡುಗಿ | 👧 |
| House | ಮನೆ | 🏠 |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/teacher-in-machine.git
cd teacher-in-machine

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in Chrome (required for speech recognition).

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Web Speech API** - Speech recognition & synthesis

## 🎤 Speech Recognition

The app uses a multi-layer phonetic matching system:

1. **Exact match** - "apple" = "apple" ✅
2. **Phonetic codes** (Soundex) - "sun" = "son" ✅
3. **Sound normalization** - "phone" = "fone" ✅
4. **Partial matching** - "apples" contains "apple" ✅
5. **Levenshtein distance** - 1 letter difference allowed ✅

## 📁 Project Structure

```
├── src/
│   ├── App.jsx      # Main application component
│   ├── main.jsx     # React entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── package.json     # Dependencies
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Edge
- ⚠️ Safari (limited speech recognition)
- ❌ Firefox (no Web Speech API support)

## 📝 License

MIT License - feel free to use for educational purposes!

## 🙏 Acknowledgments

Built for the **Teacher In Machine** project - bringing interactive English learning to schools in India.

---

Made with ❤️ for young learners
