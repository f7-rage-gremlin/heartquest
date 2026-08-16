// ============================================
// HeartQuest Game Store - State Management with Persistence
// ============================================

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Player, Monster, CombatState, SpawnPoint, RivalRelationship } from '../types';
import { getItemById } from '../constants/items';

// Simple localStorage adapter (works on web and Capacitor)
const storage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Ignore errors
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Ignore errors
    }
  },
};

// ============ PLAYER STORE ============
interface PlayerState {
  player: Player | null;
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  initPlayer: (id: string, displayName: string, starterWeaponId?: string) => void;
  loadPlayer: (player: Player) => void;
  resetPlayer: () => void;
  addXp: (amount: number) => void;
  addGold: (amount: number) => void;
  addGems: (amount: number) => void;
  levelUp: () => void;
  updateStats: (stats: Partial<Player['stats']>) => void;
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  equipItem: (itemId: string, slot: keyof Player['equippedItems']) => void;
  unequipItem: (slot: keyof Player['equippedItems']) => void;
  useConsumable: (itemId: string) => void;
  updateLocation: (latitude: number, longitude: number) => void;
  addRival: (playerId: string) => void;
  updateRivalStatus: (playerId: string, status: RivalRelationship['status']) => void;
  incrementMonstersKilled: () => void;
  incrementPlayersDefeated: () => void;
  incrementItemsFound: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: null,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      initPlayer: (id, displayName, starterWeaponId = 'starter_blade') => {
        const newPlayer: Player = {
          id,
          displayName,
          avatar: ['🧙', '🧝', '🧛', '🧟', '🤖', '👻', '🦸', '🦹'][Math.floor(Math.random() * 8)],
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          gold: 50,
          gems: 5,
          stats: {
            health: 100,
            maxHealth: 100,
            attack: 10,
            defense: 5,
            speed: 10,
            luck: 5,
            charisma: 5,
            detection: 10,
          },
          inventory: [{ itemId: starterWeaponId, quantity: 1 }],
          equippedItems: { weapon: starterWeaponId },
          rivals: [],
          monstersKilled: 0,
          playersDefeated: 0,
          itemsFound: 0,
          isFounder: true,
          createdAt: Date.now(),
          lastActive: Date.now(),
        };
        set({ player: newPlayer });
      },

      loadPlayer: (player) => set({ player }),
      resetPlayer: () => set({ player: null }),

      addXp: (amount) => {
        const player = get().player;
        if (!player) return;

        let newXp = player.xp + amount;
        let newLevel = player.level;
        let newXpToNext = player.xpToNextLevel;

        while (newXp >= newXpToNext) {
          newXp -= newXpToNext;
          newLevel++;
          newXpToNext = Math.floor(newXpToNext * 1.5);
        }

        set({
          player: {
            ...player,
            xp: newXp,
            level: newLevel,
            xpToNextLevel: newXpToNext,
          },
        });
      },

      addGold: (amount) => {
        const player = get().player;
        if (!player) return;
        set({ player: { ...player, gold: player.gold + amount } });
      },

      addGems: (amount) => {
        const player = get().player;
        if (!player) return;
        set({ player: { ...player, gems: player.gems + amount } });
      },

      levelUp: () => {
        const player = get().player;
        if (!player) return;
        set({
          player: {
            ...player,
            level: player.level + 1,
            stats: {
              ...player.stats,
              maxHealth: player.stats.maxHealth + 10,
              health: player.stats.maxHealth + 10,
              attack: player.stats.attack + 2,
              defense: player.stats.defense + 1,
            },
          },
        });
      },

      updateStats: (stats) => {
        const player = get().player;
        if (!player) return;
        set({
          player: {
            ...player,
            stats: { ...player.stats, ...stats },
          },
        });
      },

      addItem: (itemId, quantity = 1) => {
        const player = get().player;
        if (!player) return;

        const existingIndex = player.inventory.findIndex(i => i.itemId === itemId);
        if (existingIndex >= 0) {
          const newInventory = [...player.inventory];
          newInventory[existingIndex].quantity += quantity;
          set({ player: { ...player, inventory: newInventory } });
        } else {
          set({
            player: {
              ...player,
              inventory: [...player.inventory, { itemId, quantity }],
            },
          });
        }
      },

      removeItem: (itemId, quantity = 1) => {
        const player = get().player;
        if (!player) return;

        const existingIndex = player.inventory.findIndex(i => i.itemId === itemId);
        if (existingIndex < 0) return;

        const newInventory = [...player.inventory];
        newInventory[existingIndex].quantity -= quantity;

        if (newInventory[existingIndex].quantity <= 0) {
          newInventory.splice(existingIndex, 1);
        }

        set({ player: { ...player, inventory: newInventory } });
      },

      equipItem: (itemId, slot) => {
        const player = get().player;
        if (!player) return;

        const item = getItemById(itemId);
        if (!item) return;

        set({
          player: {
            ...player,
            equippedItems: { ...player.equippedItems, [slot]: itemId },
          },
        });
      },

      unequipItem: (slot) => {
        const player = get().player;
        if (!player) return;

        const newEquipped = { ...player.equippedItems };
        delete newEquipped[slot];
        set({ player: { ...player, equippedItems: newEquipped } });
      },

      useConsumable: (itemId) => {
        const player = get().player;
        if (!player) return;

        const item = getItemById(itemId);
        if (!item || item.type !== 'consumable') return;

        if (item.effect?.type === 'heal') {
          const healAmount = item.effect.value || 50;
          set({
            player: {
              ...player,
              stats: {
                ...player.stats,
                health: Math.min(player.stats.maxHealth, player.stats.health + healAmount),
              },
            },
          });
        }

        get().removeItem(itemId, 1);
      },

      updateLocation: (latitude, longitude) => {
        const player = get().player;
        if (!player) return;
        set({
          player: {
            ...player,
            location: { latitude, longitude, lastUpdated: Date.now() },
          },
        });
      },

      addRival: (playerId) => {
        const player = get().player;
        if (!player) return;
        if (player.rivals.find(r => r.playerId === playerId)) return;

        set({
          player: {
            ...player,
            rivals: [...player.rivals, { playerId, status: 'neutral', battles: 0, wins: 0, losses: 0 }],
          },
        });
      },

      updateRivalStatus: (playerId, status) => {
        const player = get().player;
        if (!player) return;

        set({
          player: {
            ...player,
            rivals: player.rivals.map(r =>
              r.playerId === playerId ? { ...r, status } : r
            ),
          },
        });
      },

      incrementMonstersKilled: () => {
        const player = get().player;
        if (!player) return;
        set({ player: { ...player, monstersKilled: player.monstersKilled + 1 } });
      },

      incrementPlayersDefeated: () => {
        const player = get().player;
        if (!player) return;
        set({ player: { ...player, playersDefeated: player.playersDefeated + 1 } });
      },

      incrementItemsFound: () => {
        const player = get().player;
        if (!player) return;
        set({ player: { ...player, itemsFound: player.itemsFound + 1 } });
      },
    }),
    {
      name: 'heartquest-player',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// ============ GAME STORE (not persisted) ============
interface GameState {
  spawns: SpawnPoint[];
  activeMonster: Monster | null;
  nearbyPlayers: Player[];
  inCombat: boolean;
  combatState: CombatState | null;
  currentScreen: 'map' | 'combat' | 'inventory' | 'profile' | 'chat' | 'settings';

  setSpawns: (spawns: SpawnPoint[]) => void;
  addSpawn: (spawn: SpawnPoint) => void;
  removeSpawn: (id: string) => void;
  startCombat: (monster: Monster) => void;
  endCombat: (won: boolean) => void;
  attack: () => void;
  defend: () => void;
  useItem: (itemId: string) => void;
  flee: () => void;
  setNearbyPlayers: (players: Player[]) => void;
  setScreen: (screen: GameState['currentScreen']) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  spawns: [],
  activeMonster: null,
  nearbyPlayers: [],
  inCombat: false,
  combatState: null,
  currentScreen: 'map',

  setSpawns: (spawns) => set({ spawns }),
  addSpawn: (spawn) => set(state => ({ spawns: [...state.spawns, spawn] })),
  removeSpawn: (id) => set(state => ({
    spawns: state.spawns.filter(s => s.id !== id),
  })),

  startCombat: (monster) => {
    const player = usePlayerStore.getState().player;
    if (!player) return;

    let playerStats = { ...player.stats };
    Object.values(player.equippedItems).forEach(itemId => {
      if (!itemId) return;
      const item = getItemById(itemId);
      if (item?.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          playerStats[stat as keyof typeof playerStats] += value || 0;
        });
      }
    });

    set({
      inCombat: true,
      activeMonster: monster,
      combatState: {
        playerTurn: true,
        playerHealth: playerStats.health,
        enemyHealth: monster.stats.health,
        playerMaxHealth: playerStats.maxHealth,
        enemyMaxHealth: monster.stats.maxHealth,
        log: [],
      },
    });
  },

  endCombat: (won) => {
    const player = usePlayerStore.getState().player;
    const monster = get().activeMonster;

    if (won && player && monster) {
      usePlayerStore.getState().addXp(monster.xpReward);
      const goldAmount = monster.goldReward[0] + Math.floor(Math.random() * (monster.goldReward[1] - monster.goldReward[0]));
      usePlayerStore.getState().addGold(goldAmount);

      monster.drops.forEach(drop => {
        if (Math.random() * 100 < drop.chance) {
          const quantity = drop.quantity[0] + Math.floor(Math.random() * (drop.quantity[1] - drop.quantity[0] + 1));
          usePlayerStore.getState().addItem(drop.itemId, quantity);
          usePlayerStore.getState().incrementItemsFound();
        }
      });

      usePlayerStore.getState().incrementMonstersKilled();
    }

    set({ inCombat: false, activeMonster: null, combatState: null });
  },

  attack: () => {
    const { combatState, activeMonster } = get();
    const player = usePlayerStore.getState().player;
    if (!combatState || !activeMonster || !player) return;

    const playerStats = player.stats;
    const baseDamage = playerStats.attack;
    const defense = activeMonster.stats.defense;
    const damage = Math.max(1, baseDamage - defense + Math.floor(Math.random() * 10));
    const critical = Math.random() < playerStats.luck / 100;
    const finalDamage = critical ? damage * 2 : damage;

    const newEnemyHealth = combatState.enemyHealth - finalDamage;

    const newLog = [...combatState.log, {
      turn: combatState.log.length + 1,
      actor: 'player' as const,
      action: 'Attack',
      damage: finalDamage,
      critical,
    }];

    if (newEnemyHealth <= 0) {
      set({ combatState: { ...combatState, enemyHealth: 0, log: newLog } });
      setTimeout(() => get().endCombat(true), 1000);
      return;
    }

    const enemyDamage = Math.max(1, activeMonster.stats.attack - playerStats.defense + Math.floor(Math.random() * 5));
    const newPlayerHealth = combatState.playerHealth - enemyDamage;

    newLog.push({
      turn: combatState.log.length + 1,
      actor: 'enemy' as const,
      action: activeMonster.name + ' strikes back',
      damage: enemyDamage,
    });

    if (newPlayerHealth <= 0) {
      set({ combatState: { ...combatState, playerHealth: 0, enemyHealth: newEnemyHealth, log: newLog } });
      setTimeout(() => get().endCombat(false), 1000);
      return;
    }

    set({
      combatState: {
        ...combatState,
        playerHealth: newPlayerHealth,
        enemyHealth: newEnemyHealth,
        log: newLog,
      },
    });
  },

  defend: () => {
    const { combatState, activeMonster } = get();
    const player = usePlayerStore.getState().player;
    if (!combatState || !activeMonster || !player) return;

    const reducedDamage = Math.max(1, Math.floor(activeMonster.stats.attack / 2) - player.stats.defense);
    const newPlayerHealth = combatState.playerHealth - reducedDamage;

    const newLog = [...combatState.log, {
      turn: combatState.log.length + 1,
      actor: 'player' as const,
      action: 'Defend',
    }, {
      turn: combatState.log.length + 2,
      actor: 'enemy' as const,
      action: activeMonster.name + ' attacks (blocked)',
      damage: reducedDamage,
    }];

    if (newPlayerHealth <= 0) {
      set({ combatState: { ...combatState, playerHealth: 0, log: newLog } });
      setTimeout(() => get().endCombat(false), 1000);
      return;
    }

    set({ combatState: { ...combatState, playerHealth: newPlayerHealth, log: newLog } });
  },

  useItem: (itemId) => {
    const { combatState } = get();
    const player = usePlayerStore.getState().player;
    if (!combatState || !player) return;

    const item = getItemById(itemId);
    if (!item) return;

    if (item.effect?.type === 'heal') {
      const healAmount = item.effect.value || 50;
      const newHealth = Math.min(combatState.playerMaxHealth, combatState.playerHealth + healAmount);

      const newLog = [...combatState.log, {
        turn: combatState.log.length + 1,
        actor: 'player' as const,
        action: 'Used ' + item.name,
        healing: healAmount,
      }];

      set({ combatState: { ...combatState, playerHealth: newHealth, log: newLog } });
      usePlayerStore.getState().removeItem(itemId, 1);
    }
  },

  flee: () => {
    const { combatState, activeMonster } = get();
    if (!combatState || !activeMonster) return;

    const escaped = Math.random() > 0.5;

    const newLog = [...combatState.log, {
      turn: combatState.log.length + 1,
      actor: 'player' as const,
      action: escaped ? 'Fled successfully!' : 'Failed to flee!',
    }];

    if (escaped) {
      set({ combatState: { ...combatState, log: newLog } });
      setTimeout(() => set({ inCombat: false, activeMonster: null, combatState: null }), 500);
    } else {
      const player = usePlayerStore.getState().player;
      if (!player) return;

      const damage = Math.max(1, activeMonster.stats.attack - player.stats.defense);
      const newHealth = combatState.playerHealth - damage;

      newLog.push({
        turn: combatState.log.length + 2,
        actor: 'enemy' as const,
        action: activeMonster.name + ' strikes as you flee',
        damage,
      });

      set({ combatState: { ...combatState, playerHealth: Math.max(0, newHealth), log: newLog } });

      if (newHealth <= 0) {
        setTimeout(() => get().endCombat(false), 500);
      }
    }
  },

  setNearbyPlayers: (players) => set({ nearbyPlayers: players }),
  setScreen: (screen) => set({ currentScreen: screen }),
}));
