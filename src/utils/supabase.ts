// ============================================
// HeartQuest Supabase Configuration
// ============================================

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get credentials from env or use placeholder
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if credentials are configured
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Check if backend is configured
export const isBackendConfigured = (): boolean => {
  return SUPABASE_URL !== '' && SUPABASE_URL !== 'YOUR_SUPABASE_URL';
};

// ============================================
// Auth Helper Functions (safe fallbacks)
// ============================================

export const signInAnonymously = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data;
};

export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ============================================
// Player Data Functions (safe fallbacks)
// ============================================

export const savePlayer = async (player: any) => {
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('players')
    .upsert({
      id: user.id,
      ...player,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
  return data;
};

export const loadPlayer = async () => {
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const saveInventory = async (inventory: any[]) => {
  if (!supabase) return;
  const user = await getCurrentUser();
  if (!user) throw new Error('No authenticated user');

  await supabase
    .from('inventory')
    .delete()
    .eq('player_id', user.id);

  if (inventory.length > 0) {
    const { error } = await supabase
      .from('inventory')
      .insert(
        inventory.map(item => ({
          player_id: user.id,
          item_id: item.itemId,
          quantity: item.quantity,
          equipped_slot: item.equipped ? item.equipped : null,
        }))
      );

    if (error) throw error;
  }
};

export const loadInventory = async () => {
  if (!supabase) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('player_id', user.id);

  if (error) throw error;
  return data?.map(item => ({
    itemId: item.item_id,
    quantity: item.quantity,
    equipped: item.equipped_slot,
  })) || [];
};

// ============================================
// Location & Proximity Functions (safe fallbacks)
// ============================================

export const updatePlayerLocation = async (latitude: number, longitude: number) => {
  if (!supabase) return;
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabase
    .from('players')
    .update({
      latitude,
      longitude,
      location_updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) console.error('Failed to update location:', error);
};

export const getNearbyPlayers = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<any[]> => {
  if (!supabase) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const latDelta = radiusKm / 111;
  const lonDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

  const { data, error } = await supabase
    .from('players')
    .select('id, display_name, avatar, level, latitude, longitude')
    .neq('id', user.id)
    .gte('latitude', latitude - latDelta)
    .lte('latitude', latitude + latDelta)
    .gte('longitude', longitude - lonDelta)
    .lte('longitude', longitude + lonDelta)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .limit(50);

  if (error) {
    console.error('Error fetching nearby players:', error);
    return [];
  }

  return data || [];
};

export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
