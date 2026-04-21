# HeartQuest Setup Guide

## Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/f7-rage-gremlin/heartquest.git
   cd heartquest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Install **Expo Go** on your phone
   - Scan the QR code from the terminal

---

## Supabase Setup (Optional - for persistence)

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### 2. Run the database schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Paste and run it

### 3. Get your credentials

1. Go to **Settings > API**
2. Copy your **Project URL** and **anon public key**

### 4. Create `.env` file

Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Restart the dev server

```bash
npx expo start
```

---

## Project Structure

```
heartquest/
├── src/
│   ├── screens/        # App screens
│   │   ├── WelcomeScreen.tsx   # Onboarding
│   │   ├── MapScreen.tsx       # Main game view
│   │   ├── CombatScreen.tsx    # Battle arena
│   │   ├── InventoryScreen.tsx # Item management
│   │   ├── ProfileScreen.tsx   # Player stats
│   │   └── ItemDetailScreen.tsx
│   ├── store/          # Zustand state management
│   ├── constants/      # Game data
│   │   ├── items.ts    # 30+ items
│   │   ├── monsters.ts # 15+ monsters
│   │   └── theme.ts    # Colors, gradients
│   ├── types/          # TypeScript types
│   └── utils/          # Supabase, helpers
├── supabase/
│   └── schema.sql      # Database setup
└── PLAN.md             # Development roadmap
```

---

## Game Features

- 🗺️ **GPS-based exploration** - Walk around to find monsters
- ⚔️ **Combat system** - Turn-based battles with critical hits
- 👥 **Rival system** - Meet other players, choose friendly/hostile
- 🎭 **Cloak of Deception** - Rare item to hide your true intentions
- 🎒 **30+ items** - Weapons, armor, accessories, consumables
- 👾 **15+ monsters** - From common to legendary bosses
- 💖 **Founder rewards** - Early access bonuses

---

## Build for Android

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

---

## License

MIT
