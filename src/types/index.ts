// ============================================
// HeartQuest Types - Sci-Fi Fantasy RPG
// ============================================

// --- Core Stats ---
export interface Stats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  luck: number;
  charisma: number; // For dating/social
  detection: number; // For finding hidden things
}

// --- Items ---
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  icon: string; // Emoji or icon name
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'special';
  
  // Stat bonuses
  stats?: Partial<Stats>;
  
  // Special effects
  effect?: ItemEffect;
  
  // For consumables
  uses?: number;
  
  // Crafting
  craftable?: boolean;
  craftMaterials?: { itemId: string; quantity: number }[];
  
  // Value
  goldValue: number;
}

export interface ItemEffect {
  type: 'lifesteal' | 'critical' | 'stun' | 'poison' | 'burn' | 'heal' | 'shield' | 'stealth' | 'detection' | 'boost_xp' | 'boost_gold' | 'teleport' | 'reveal';
  value?: number;
  duration?: number; // In seconds
}

// --- Inventory ---
export interface InventoryItem {
  itemId: string;
  quantity: number;
  equipped?: boolean;
}

// --- Monsters ---
export type MonsterType = 'neutral' | 'aggressive' | 'boss' | 'rare';

export interface Monster {
  id: string;
  name: string;
  description: string;
  type: MonsterType;
  level: number;
  icon: string;
  
  stats: Stats;
  
  // Drops
  drops: { itemId: string; chance: number; quantity: [number, number] }[];
  xpReward: number;
  goldReward: [number, number];
  
  // Behavior
  aggroRange?: number; // Meters
  behavior?: 'wander' | 'stationary' | 'patrol';
}

// --- Player ---
export interface Player {
  id: string;
  displayName: string;
  avatar: string; // Emoji avatar for now
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  gems: number; // Premium currency (earned slowly, can buy)
  
  stats: Stats;
  inventory: InventoryItem[];
  equippedItems: {
    weapon?: string;
    armor?: string;
    accessory1?: string;
    accessory2?: string;
  };
  
  // Dating profile
  profile?: {
    bio: string;
    interests: string[];
    age: number;
    pronouns: string;
    lookingFor: string[];
  };
  
  // Location
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: number;
  };
  
  // Rival system
  rivals: RivalRelationship[];
  
  // Stats
  monstersKilled: number;
  playersDefeated: number;
  itemsFound: number;
  
  // Founder status
  isFounder: boolean;
  founderTier?: 'supporter' | 'champion' | 'legend';
  
  createdAt: number;
  lastActive: number;
}

// --- Rival System ---
export interface RivalRelationship {
  playerId: string;
  status: 'friendly' | 'hostile' | 'neutral';
  battles: number;
  wins: number;
  losses: number;
  lastEncounter?: number;
}

// --- Combat ---
export interface CombatState {
  playerTurn: boolean;
  playerHealth: number;
  enemyHealth: number;
  playerMaxHealth: number;
  enemyMaxHealth: number;
  log: CombatLogEntry[];
  status?: {
    player?: StatusEffect[];
    enemy?: StatusEffect[];
  };
}

export interface StatusEffect {
  type: 'poison' | 'burn' | 'stun' | 'shield' | 'stealth';
  value: number;
  duration: number;
}

export interface CombatLogEntry {
  turn: number;
  actor: 'player' | 'enemy';
  action: string;
  damage?: number;
  healing?: number;
  critical?: boolean;
}

// --- World ---
export interface SpawnPoint {
  id: string;
  type: 'monster' | 'resource' | 'player';
  latitude: number;
  longitude: number;
  radius: number; // Meters
  monsterId?: string;
  respawnTime: number; // Seconds
  lastCollected?: number;
}

export interface WorldEvent {
  id: string;
  type: 'boss_spawn' | 'treasure_drop' | 'rival_invasion' | 'double_xp';
  latitude: number;
  longitude: number;
  startTime: number;
  endTime: number;
  rewards?: Item[];
}

// --- Chat/Matching ---
export interface Match {
  id: string;
  players: [string, string];
  createdAt: number;
  status: 'active' | 'ended';
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'quest_invite' | 'gift';
}

// --- Auth ---
export interface User {
  id: string;
  email: string;
  createdAt: number;
}
