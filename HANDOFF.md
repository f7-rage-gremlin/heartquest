# HeartQuest handoff

Last updated: 16 August 2026

## What HeartQuest is now

HeartQuest is a sci-fi/fantasy dating RPG prototype with cyberpunk technology, magic, exploration, monsters, items, combat, proximity gameplay, and future rival/co-op mechanics.

The project has moved from Expo/React Native to **Vite + React + Capacitor**. The intended product is one codebase that runs in a browser and can also be wrapped as an Android app.

## Current working areas

- Vite web build succeeds with `npm run build`.
- Web dev server is `npm run dev` or `npm start`.
- Capacitor configuration and Android project exist locally.
- Zustand stores the game state.
- Browser persistence uses `localStorage`; native persistence uses the storage adapter with AsyncStorage fallback.
- Onboarding includes player name and starter weapon selection.
- Monster combat, inventory, equipment, profile, item rarities, XP, gold, and gems are present.
- Proximity gameplay tooling has been added in `src/hooks/useProximity.ts` and `src/services/proximity.ts`.
- Supabase schema and client helpers exist, but production backend configuration still needs to be supplied and tested.

## Current verification state

- `npm run build`: passes.
- `npx tsc --noEmit`: currently fails and needs cleanup before calling the project release-ready.
- The Vite build emits a non-blocking warning because the current React SWC/Vite configuration still uses a deprecated `esbuild` option.
- The Nix flake is intentionally small: it provides Node.js 22 and Git. It does not currently provide the Android SDK or Gradle.
- `flake.lock` should be generated on NixOS and committed once the flake is confirmed working there.

## Important unfinished work

### 1. Make the codebase type-clean

The remaining TypeScript errors include missing CSS-module declarations, missing `@types/react-dom`, stale item data that does not satisfy the current `Item`/`Stats` types, proximity data that is not a complete `Player`, unused imports/variables, and missing Vite environment typings.

Do this before adding a large new feature. It will catch mobile and browser regressions early.

### 2. Make local APK builds reproducible

The Capacitor scripts currently assume paths such as `/opt/android-sdk` and `/usr/lib/jvm/java-21-openjdk-amd64`, which are not guaranteed on NixOS. Replace those hard-coded paths with environment variables or tool discovery, then add an Android SDK/Gradle solution to the flake or document the user's NixOS configuration as the source of those tools.

The Android directory is ignored by Git, so a fresh clone must run `npx cap add android` before `npx cap sync android`.

### 3. Test on real Android hardware

The practical acceptance test is:

```bash
npm run build
npx cap add android       # first time only
npx cap sync android
cd android
./gradlew assembleDebug
```

Then install the debug APK with ADB or copy it to the phone. Test permissions, storage across restarts, touch targets, back navigation, location-denied behaviour, and offline launch.

### 4. Clarify the backend boundary

For an early prototype, local persistence is enough. Supabase should be introduced when accounts, shared rivals, proximity visibility, matchmaking, cloud saves, and anti-cheat rules are ready to be designed together. Do not trust the client with authoritative combat, loot, gold, or PvP outcomes in the multiplayer version.

### 5. Design safety into rival gameplay

The rival system needs explicit consent and safeguards before implementation: opt-in PvP, block/report, safe zones, cooldowns, no real-world precision exposure, anti-stalking limits, faint recovery rules, and no mechanic that encourages chasing or confronting someone physically. Friendly/hostile state and deception should be game-state signals, not permission to expose a person's location.

## Product direction to preserve

- Do not advertise monetisation or veteran advantages on the landing page unless deliberately revisited.
- Items are central. Players should be able to earn useful items through play; paid items may exist but must not be required to play.
- The world should feel like magic fused with technology: neon ruins, enchanted circuitry, strange monsters, romantic quests, and playful adventure.
- Prefer handwritten game logic and UI. Keep existing packages unless they cause a concrete problem; replace them only when a small handwritten solution is clearly safer or simpler.

## First session after the handoff

1. Pull the latest GitHub commit.
2. Enter `nix develop` and commit the generated `flake.lock`.
3. Run `npm install`.
4. Run `npm run build` and `npx tsc --noEmit`.
5. Fix all TypeScript errors.
6. Make the APK toolchain work on NixOS without hard-coded foreign paths.
7. Build and install a debug APK before expanding the game.
