// ============================================
// HeartQuest Theme - Sci-Fi Fantasy Aesthetics
// ============================================

import { ItemRarity } from '../types';

// ============ COLORS ============
export const COLORS = {
  // Primary
  primary: '#8B5CF6',      // Vivid purple
  secondary: '#06B6D4',    // Cyan
  accent: '#F59E0B',        // Amber
  
  // Backgrounds
  background: '#0F0F1A',    // Deep space purple-black
  surface: '#1A1A2E',       // Surface purple
  surfaceLight: '#252542',  // Lighter surface
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#606070',
  
  // Rarity Colors
  rarity: {
    common: '#9CA3AF',      // Gray
    uncommon: '#22C55E',    // Green
    rare: '#3B82F6',        // Blue
    epic: '#A855F7',        // Purple
    legendary: '#F59E0B',   // Gold/Amber
    mythic: '#EC4899',      // Pink (gradient to purple)
  },
  
  // Status
  health: '#EF4444',       // Red
  mana: '#3B82F6',         // Blue
  stamina: '#22C55E',      // Green
  xp: '#A855F7',           // Purple
  
  // Combat
  damage: '#EF4444',
  heal: '#22C55E',
  critical: '#F59E0B',
  
  // Social
  friendly: '#22C55E',
  hostile: '#EF4444',
  neutral: '#9CA3AF',
};

// ============ GRADIENTS ============
export const GRADIENTS = {
  primary: ['#8B5CF6', '#6366F1'],
  secondary: ['#06B6D4', '#0EA5E9'],
  accent: ['#F59E0B', '#F97316'],
  mythic: ['#EC4899', '#8B5CF6'],
  legendary: ['#F59E0B', '#FCD34D'],
  background: ['#0F0F1A', '#1A1A2E', '#0F0F1A'],
  card: ['#1A1A2E', '#252542'],
};

// ============ RARITY HELPERS ============
export const getRarityColor = (rarity: ItemRarity): string => COLORS.rarity[rarity];

export const getRarityGradient = (rarity: ItemRarity): string[] => {
  switch (rarity) {
    case 'mythic':
      return ['#EC4899', '#8B5CF6'];
    case 'legendary':
      return ['#F59E0B', '#FCD34D'];
    case 'epic':
      return ['#A855F7', '#9333EA'];
    case 'rare':
      return ['#3B82F6', '#2563EB'];
    case 'uncommon':
      return ['#22C55E', '#16A34A'];
    default:
      return ['#6B7280', '#4B5563'];
  }
};

// ============ TYPOGRAPHY ============
export const FONTS = {
  regular: 'System',
  bold: 'System',
  mono: 'Courier',
};

// ============ SPACING ============
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ============ BORDER RADIUS ============
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ============ SHADOWS ============
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  }),
};
