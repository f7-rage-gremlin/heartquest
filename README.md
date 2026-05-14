# HeartQuest 🎮

A sci-fi fantasy RPG dating game where player two b's stuck on the shelf find each other.

## Tech Stack

- **Vite + React** (pure, no React Native)
- **Capacitor** (native mobile wrapper)
- **Zustand** (state management)
- **CSS Modules** (styling)

## 🏠 Nix/NixOS Setup

```bash
# Clone
git clone https://github.com/f7-rage-gremlin/heartquest
cd heartquest

# Enter dev environment (pure Nix!)
nix develop

# Install dependencies
npm install

# Run web version
npm start
```

## 📱 Build APK (Android)

```bash
# Build web app
npm run build

# Add Android platform (first time)
npx cap add android

# Sync to Android
npx cap sync android

# Open in Android Studio (for debug build)
npx cap open android

# OR build release APK directly
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

## 🌐 Web Only

```bash
npm run build
npm run preview  # Preview production build
```

## Project Structure

```
heartquest/
├── src/
│   ├── screens/        # App screens (React + CSS)
│   ├── store/          # Zustand state
│   ├── constants/      # Items, monsters, theme
│   ├── styles/         # Global CSS
│   └── types/          # TypeScript types
├── capacitor.config.ts # Capacitor config
└── vite.config.ts      # Vite bundler config
```

## Features

- ⚔️ Turn-based combat with monsters
- 🎒 Inventory system with item rarities
- 📍 Location-based gameplay
- 💾 Persistent save via AsyncStorage
- 🎭 Legendary "Cloak of Deception" for PvP deception

---

Made with ❤️ for the shelf dwellers
