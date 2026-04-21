// ============================================
// HeartQuest Item Detail Screen
// ============================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePlayerStore } from '../store';
import { COLORS, SPACING, RADIUS, getRarityColor, getRarityGradient } from '../constants/theme';
import { getItemById } from '../constants/items';
import { RootStackParamList } from '../App';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type ItemDetailRoute = RouteProp<RootStackParamList, 'ItemDetail'>;

export default function ItemDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ItemDetailRoute>();
  const player = usePlayerStore(state => state.player);
  const equipItem = usePlayerStore(state => state.equipItem);
  const unequipItem = usePlayerStore(state => state.unequipItem);
  const useConsumable = usePlayerStore(state => state.useConsumable);
  
  const { itemId } = route.params;
  const item = getItemById(itemId);
  
  if (!item || !player) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const isEquipped = Object.values(player.equippedItems).includes(itemId);
  const inventoryItem = player.inventory.find(i => i.itemId === itemId);
  const quantity = inventoryItem?.quantity || 0;
  
  const getEquipSlot = (): string | null => {
    if (item.type === 'weapon') return 'weapon';
    if (item.type === 'armor') return 'armor';
    if (item.type === 'accessory') {
      if (!player.equippedItems.accessory1) return 'accessory1';
      if (!player.equippedItems.accessory2) return 'accessory2';
      return 'accessory1';
    }
    return null;
  };
  
  const handleEquip = () => {
    const slot = getEquipSlot();
    if (slot) {
      equipItem(itemId, slot as keyof typeof player.equippedItems);
    }
  };
  
  const handleUnequip = () => {
    const slot = Object.entries(player.equippedItems).find(([_, id]) => id === itemId)?.[0];
    if (slot) {
      unequipItem(slot as keyof typeof player.equippedItems);
    }
  };
  
  const handleUse = () => {
    useConsumable(itemId);
    navigation.goBack();
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: getRarityColor(item.rarity) }]}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={[styles.name, { color: getRarityColor(item.rarity) }]}>{item.name}</Text>
        <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
          <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
        </View>
      </View>
      
      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      
      {/* Stats */}
      {item.stats && Object.keys(item.stats).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Stats</Text>
          <View style={styles.statsGrid}>
            {Object.entries(item.stats).map(([stat, value]) => (
              <View key={stat} style={styles.statRow}>
                <Text style={styles.statName}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</Text>
                <Text style={[styles.statValue, { color: value && value > 0 ? COLORS.heal : COLORS.damage }]}>
                  {value && value > 0 ? `+${value}` : value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Effect */}
      {item.effect && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Special Effect</Text>
          <View style={styles.effectBox}>
            <Text style={styles.effectText}>
              {item.effect.type.charAt(0).toUpperCase() + item.effect.type.slice(1).replace('_', ' ')}
              {item.effect.value && ` ${item.effect.value}`}
              {item.effect.duration && ` for ${item.effect.duration}s`}
            </Text>
          </View>
        </View>
      )}
      
      {/* Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type</Text>
          <Text style={styles.infoValue}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gold Value</Text>
          <Text style={styles.infoValue}>{item.goldValue > 0 ? `${item.goldValue} 💰` : 'Priceless'}</Text>
        </View>
        {item.uses && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Uses</Text>
            <Text style={styles.infoValue}>{item.uses}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Owned</Text>
          <Text style={styles.infoValue}>{quantity}</Text>
        </View>
      </View>
      
      {/* Actions */}
      <View style={styles.section}>
        {item.type === 'consumable' && quantity > 0 && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.heal }]} onPress={handleUse}>
            <Text style={styles.actionIcon}>🧪</Text>
            <Text style={styles.actionLabel}>Use Item</Text>
          </TouchableOpacity>
        )}
        
        {['weapon', 'armor', 'accessory'].includes(item.type) && !isEquipped && quantity > 0 && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={handleEquip}>
            <Text style={styles.actionIcon}>⚔️</Text>
            <Text style={styles.actionLabel}>Equip</Text>
          </TouchableOpacity>
        )}
        
        {isEquipped && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.secondary }]} onPress={handleUnequip}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionLabel}>Unequip</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignSelf: 'center',
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 3,
    backgroundColor: COLORS.surface,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  rarityBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  rarityText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  statsGrid: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  statName: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  effectBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  effectText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  actionLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
