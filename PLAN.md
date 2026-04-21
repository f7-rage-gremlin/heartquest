# HeartQuest Development Plan

## Current Status: 🚧 In Progress

---

## Phase 1: Fix Remaining Issues ✅ DONE
**Goal:** App runs cleanly without errors

- [x] Fix import paths and missing exports
- [x] Wire up navigation types correctly
- [x] Add missing helper functions (getItemById, getMonsterById)
- [x] Create placeholder screens that render without crashing
- [x] Create ItemDetailScreen for item viewing
- [x] Update root App.tsx to use src/App.tsx
- [x] TypeScript compiles without errors

---

## Phase 2: Welcome/Onboarding Screen
**Goal:** First-time players get a great intro experience

- [ ] Create WelcomeScreen with animated hero
- [ ] Player name input
- [ ] Starter item selection (choose 1 of 3 starter weapons)
- [ ] Brief tutorial/explanation of game mechanics
- [ ] Save new player to state

---

## Phase 3: Supabase Backend Setup
**Goal:** Player data persists across sessions

- [ ] Create Supabase project configuration
- [ ] Set up database schema (players, inventory, rivals)
- [ ] Create auth flow (anonymous or email)
- [ ] Wire up player save/load functions
- [ ] Test persistence works

---

## Notes
- Using Expo (React Native) + TypeScript
- Zustand for local state, Supabase for persistence
- Theme: Sci-fi fantasy + cyberpunk + Adventure Time vibes
