# Marigold Magic - Teacher In Machine

A gamified learning platform for Grade 1 students in India, designed for Kiosks/Tablets using simulated Face Authentication.

## Features

- **Cinematic Intro**: Engaging animated introduction sequence
- **Magic Mirror**: Face detection landing page with camera feed
- **Teacher Portal**: Admin dashboard for managing students and classes
- **Student Learning Flow**: Immersive, linear learning experience with:
  - Listen stage: Visual and audio learning
  - Read stage: Text recognition and pronunciation
  - Reward system: Coin collection and progress tracking

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Native CSS Keyframes** for high-performance animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Cinematic Intro**: Wait for the animated intro to complete
2. **Magic Mirror**: Click "Demo Student" to test the app, or "Teacher Access" to manage students
3. **Student Flow**: 
   - View welcome screen with personalized greeting
   - Learn words through Listen and Read stages
   - Collect coins and track progress
4. **Teacher Portal**: 
   - Login with default credentials (teacher@school.com / pass)
   - Add new students
   - View class roster and coin counts

## Project Structure

```
project_application/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS imports
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Curriculum

The app includes 8 words for Grade 1 students:
- Apple (ಸೇಬು)
- Ball (ಚೆಂಡು)
- Cat (ಬೆಕ್ಕು)
- Dog (ನಾಯಿ)
- Sun (ಸೂರ್ಯ)
- Fish (ಮೀನು)
- Girl (ಹುಡುಗಿ)
- House (ಮನೆ)

Each word includes English text, Kannada translation, phonetic pronunciation, and visual emoji representation.

## Notes

- Camera access is required for the Magic Mirror feature
- Speech synthesis is used for audio playback
- The app is designed for tablet/kiosk use with touch interactions
- All animations are CSS-based for optimal performance

## License

This project is for educational purposes.
