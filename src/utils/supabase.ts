// ============================================
// HeartQuest Supabase Configuration
// ============================================

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your Supabase project credentials
// You can find them in your Supabase project settings > API
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Using 'any' for database type to avoid strict typing issues
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ============================================
// Auth Helper Functions
// ============================================

export const signInAnonymously = async () => {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ============================================
// Player Data Functions
// ============================================

export const savePlayer = async (player: any) => {
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
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
};

export const saveInventory = async (inventory: any[]) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('No authenticated user');
  
  // Delete existing inventory
  await supabase
    .from('inventory')
    .delete()
    .eq('player_id', user.id);
  
  // Insert new inventory
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
