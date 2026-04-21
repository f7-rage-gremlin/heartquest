// ============================================
// HeartQuest Monsters - Sci-Fi Fantasy Bestiary
// ============================================

import { Monster } from '../types';

export const MONSTERS: Record<string, Monster> = {
  // ============ COMMON MONSTERS ============
  glitch_sprite: {
    id: 'glitch_sprite',
    name: 'Glitch Sprite',
    description: 'A corrupted fragment of code given life. Annoying, but rarely dangerous.',
    type: 'neutral',
    level: 1,
    icon: '👾',
    stats: { health: 30, maxHealth: 30, attack: 3, defense: 2, speed: 5, luck: 5, charisma: 0, detection: 10 },
    drops: [
      { itemId: 'monster_core', chance: 80, quantity: [1, 2] },
    ],
    xpReward: 10,
    goldReward: [5, 15],
    aggroRange: 20,
    behavior: 'wander',
  },
  neon_slime: {
    id: 'neon_slime',
    name: 'Neon Slime',
    description: 'A blob of radioactive gelatin. Absorbs color and light. Sticky situation.',
    type: 'neutral',
    level: 2,
    icon: '🟢',
    stats: { health: 40, maxHealth: 40, attack: 5, defense: 5, speed: 2, luck: 3, charisma: 0, detection: 5 },
    drops: [
      { itemId: 'monster_core', chance: 70, quantity: [1, 3] },
      { itemId: 'nano_potion', chance: 10, quantity: [1, 1] },
    ],
    xpReward: 15,
    goldReward: [10, 25],
    aggroRange: 15,
    behavior: 'wander',
  },
  hologram_wisp: {
    id: 'hologram_wisp',
    name: 'Hologram Wisp',
    description: 'A flickering spirit trapped between dimensions. Seeks a physical form.',
    type: 'neutral',
    level: 3,
    icon: '👻',
    stats: { health: 35, maxHealth: 35, attack: 6, defense: 1, speed: 10, luck: 8, charisma: 0, detection: 15 },
    drops: [
      { itemId: 'monster_core', chance: 60, quantity: [1, 2] },
      { itemId: 'rare_essence', chance: 5, quantity: [1, 1] },
    ],
    xpReward: 20,
    goldReward: [15, 30],
    behavior: 'wander',
  },
  
  // ============ UNCOMMON MONSTERS ============
  cyber_wolf: {
    id: 'cyber_wolf',
    name: 'Cyber Wolf',
    description: 'A wolf with cybernetic enhancements. Hunts in packs. Avoid eye contact.',
    type: 'aggressive',
    level: 5,
    icon: '🐺',
    stats: { health: 80, maxHealth: 80, attack: 12, defense: 8, speed: 15, luck: 5, charisma: 0, detection: 30 },
    drops: [
      { itemId: 'monster_core', chance: 90, quantity: [2, 4] },
      { itemId: 'rare_essence', chance: 15, quantity: [1, 1] },
      { itemId: 'neural_implant', chance: 3, quantity: [1, 1] },
    ],
    xpReward: 50,
    goldReward: [30, 60],
    aggroRange: 50,
    behavior: 'patrol',
  },
  arcane_drone: {
    id: 'arcane_drone',
    name: 'Arcane Drone',
    description: 'A surveillance drone possessed by ancient magic. Shoots bolts of raw chaos.',
    type: 'aggressive',
    level: 6,
    icon: '🤖',
    stats: { health: 60, maxHealth: 60, attack: 15, defense: 5, speed: 12, luck: 10, charisma: 0, detection: 40 },
    drops: [
      { itemId: 'monster_core', chance: 85, quantity: [2, 3] },
      { itemId: 'stellar_shard', chance: 5, quantity: [1, 1] },
    ],
    xpReward: 60,
    goldReward: [40, 80],
    aggroRange: 60,
    behavior: 'stationary',
  },
  crystal_golem: {
    id: 'crystal_golem',
    name: 'Crystal Golem',
    description: 'Animated crystalline structure. Slow, but hits like a falling building.',
    type: 'aggressive',
    level: 8,
    icon: '🗿',
    stats: { health: 150, maxHealth: 150, attack: 20, defense: 20, speed: 2, luck: 0, charisma: 0, detection: 20 },
    drops: [
      { itemId: 'stellar_shard', chance: 25, quantity: [1, 2] },
      { itemId: 'crystal_staff', chance: 2, quantity: [1, 1] },
    ],
    xpReward: 100,
    goldReward: [80, 150],
    aggroRange: 30,
    behavior: 'stationary',
  },
  
  // ============ RARE MONSTERS ============
  void_stalker: {
    id: 'void_stalker',
    name: 'Void Stalker',
    description: 'A predator from beyond the dimensional veil. Teleports. Rarely alone.',
    type: 'rare',
    level: 12,
    icon: '🌀',
    stats: { health: 200, maxHealth: 200, attack: 30, defense: 15, speed: 25, luck: 15, charisma: 0, detection: 50 },
    drops: [
      { itemId: 'stellar_shard', chance: 50, quantity: [2, 4] },
      { itemId: 'void_whip', chance: 8, quantity: [1, 1] },
      { itemId: 'phantom_cloak', chance: 5, quantity: [1, 1] },
    ],
    xpReward: 250,
    goldReward: [200, 400],
    aggroRange: 100,
    behavior: 'wander',
  },
  prism_dragon: {
    id: 'prism_dragon',
    name: 'Prism Dragon',
    description: 'A small dragon whose scales refract light into deadly beams. Beautiful and deadly.',
    type: 'rare',
    level: 15,
    icon: '🐉',
    stats: { health: 300, maxHealth: 300, attack: 35, defense: 25, speed: 18, luck: 20, charisma: 10, detection: 60 },
    drops: [
      { itemId: 'stellar_shard', chance: 60, quantity: [3, 5] },
      { itemId: 'dragonscale_mesh', chance: 10, quantity: [1, 1] },
      { itemId: 'dragons_heart', chance: 1, quantity: [1, 1] },
    ],
    xpReward: 400,
    goldReward: [300, 600],
    aggroRange: 80,
    behavior: 'wander',
  },
  
  // ============ BOSS MONSTERS ============
  techno_lich: {
    id: 'techno_lich',
    name: 'Techno Lich',
    description: 'An ancient sorcerer who transferred their consciousness into a machine. Undeath.exe.',
    type: 'boss',
    level: 20,
    icon: '💀',
    stats: { health: 500, maxHealth: 500, attack: 50, defense: 35, speed: 15, luck: 25, charisma: 0, detection: 80 },
    drops: [
      { itemId: 'soul_reaver', chance: 15, quantity: [1, 1] },
      { itemId: 'quantum_cleaver', chance: 25, quantity: [1, 1] },
      { itemId: 'stellar_shard', chance: 100, quantity: [5, 10] },
    ],
    xpReward: 1000,
    goldReward: [1000, 2000],
    behavior: 'stationary',
  },
  stellar_serpent: {
    id: 'stellar_serpent',
    name: 'Stellar Serpent',
    description: 'A cosmic being that swims through space-time. Its scales are made of crystallized starlight.',
    type: 'boss',
    level: 25,
    icon: '🌌',
    stats: { health: 800, maxHealth: 800, attack: 60, defense: 45, speed: 30, luck: 30, charisma: 20, detection: 100 },
    drops: [
      { itemId: 'aether_heart_shield', chance: 10, quantity: [1, 1] },
      { itemId: 'cosmic_compass', chance: 20, quantity: [1, 1] },
      { itemId: 'stellar_shard', chance: 100, quantity: [10, 20] },
    ],
    xpReward: 2500,
    goldReward: [3000, 5000],
    behavior: 'stationary',
  },
  
  // ============ WORLD EVENT BOSSES ============
  the_glitch_king: {
    id: 'the_glitch_king',
    name: 'The Glitch King',
    description: 'A legendary entity born from the combined errors of a billion programs. Reality bends around it.',
    type: 'boss',
    level: 50,
    icon: '👑',
    stats: { health: 2000, maxHealth: 2000, attack: 100, defense: 80, speed: 50, luck: 50, charisma: 30, detection: 150 },
    drops: [
      { itemId: 'cloak_of_deception', chance: 5, quantity: [1, 1] },
      { itemId: 'soul_reaver', chance: 20, quantity: [1, 1] },
      { itemId: 'stellar_shard', chance: 100, quantity: [20, 50] },
    ],
    xpReward: 10000,
    goldReward: [10000, 20000],
    behavior: 'stationary',
  },
};

export const getMonsterById = (id: string): Monster | undefined => MONSTERS[id];
export const getMonstersByType = (type: Monster['type']): Monster[] =>
  Object.values(MONSTERS).filter(m => m.type === type);
export const getMonstersByLevelRange = (min: number, max: number): Monster[] =>
  Object.values(MONSTERS).filter(m => m.level >= min && m.level <= max);
