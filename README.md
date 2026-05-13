# HeartQuest Setup Guide

## 🏠 Nix/NixOS Setup (Recommended for purity)

If you're on NixOS or have Nix installed, you get a completely isolated, reproducible development environment:

### Option A: Using `nix develop` (one-time command)

```bash
# Enter the pure Nix dev shell
nix develop

# Dependencies auto-install on first run
# Then start the app:
npx expo start --tunnel
```

### Option B: Using `direnv` (automatic loading)

```bash
# Install direnv (if not already)
nix profile install nixpkgs#direnv

# Add direnv to your shell (add to your shellrc)
eval "$(direnv hook bash)"  # or zsh/fish

# Allow the .envrc
direnv allow

# Now whenever you cd into this directory, 
# the environment loads automatically!
```

---

## 📱 Quick Start (Any System)

1. **Enter dev environment**
   ```bash
   # Nix users:
   nix develop
   
   # Or without Nix:
   npm install
   ```

2. **Start the dev server**
   ```bash
   npx expo start --tunnel
   ```

3. **Run on your phone**
   - Install **Expo Go** from Play Store
   - Scan the QR code in the app
   - Play!

---

## 🔧 Building for Production

### Android APK (for Play Store)

```bash
# Enter build environment (has JDK + Gradle)
nix develop .#build

# Install EAS CLI
npm install -g eas-cli

# Build
eas build --platform android --local
```

---

## 🗄️ Backend Setup (Optional - Cloud Save)

HeartQuest works offline first, but you can enable cloud saves with Supabase:

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the SQL schema in `supabase/schema.sql`
3. Copy `.env.example` to `.env.local`
4. Add your Supabase URL and anon key

---

## 🎮 Game Features

- ⚔️ Combat system with 10+ unique monsters
- 🎯 30+ items including legendary gear
- 🗺️ GPS-based exploration
- 💬 Rival system for PvP dating
- 👤 Profile with customizable bio
- 📱 Works offline first

---

## 🧹 Clean Uninstall

On NixOS, nothing touches your system. To remove completely:

```bash
rm -rf ~/projects/heartQuest/heartquest
# That's it! No global packages, no leftover files.
```

---

## Tech Stack

- **Frontend:** Expo (React Native) + TypeScript
- **State:** Zustand (local) + Supabase (cloud)
- **Theme:** Sci-fi fantasy + cyberpunk + Adventure Time vibes

---

Made with ❤️ for the shelf dwellers
