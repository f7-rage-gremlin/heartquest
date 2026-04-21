// ============================================
// HeartQuest Inventory Screen - Item Management
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePlayerStore } from '../store';
import { COLORS, SPACING, RADIUS, getRarityColor } from '../constants/theme';
import { getItemById } from '../constants/items';
import { Item, ItemRarity } from '../types';
import { RootStackParamList } from '../App';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

type TabType = 'all' | 'weapons' | 'armor' | 'accessories' | 'consumables' | 'materials';

export default function InventoryScreen() {
  const navigation = useNavigation<Navigation>();
  const player = usePlayerStore(state => state.player);
  const equipItem = usePlayerStore(state => state.equipItem);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '📦' },
    { key: 'weapons', label: 'Weapons', icon: '⚔️' },
    { key: 'armor', label: 'Armor', icon: '🛡️' },
    { key: 'accessories', label: 'Accessories', icon: '💍' },
    { key: 'consumables', label: 'Items', icon: '🧪' },
    { key: 'materials', label: 'Mats', icon: '💎' },
  ];
  
  const getItems = (): (Item & { quantity: number })[] => {
    if (!player) return [];
    
    return player.inventory
      .map(inv => {
        const item = getItemById(inv.itemId);
        if (!item) return null;
        return { ...item, quantity: inv.quantity };
      })
      .filter((item): item is Item & { quantity: number } => item !== null)
      .filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'weapons') return item.type === 'weapon';
        if (activeTab === 'armor') return item.type === 'armor';
        if (activeTab === 'accessories') return item.type === 'accessory';
        if (activeTab === 'consumables') return item.type === 'consumable';
        if (activeTab === 'materials') return item.type === 'material';
        return true;
      });
  };
  
  const items = getItems();
  
  const renderItem = ({ item }: { item: Item & { quantity: number } }) => {
    const isEquipped = Object.values(player?.equippedItems || {}).includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.itemCard, { borderColor: getRarityColor(item.rarity) }]}
        onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
      >
        <View style={styles.itemIconContainer}>
          <Text style={styles.itemIcon}>{item.icon}</Text>
          {isEquipped && <View style={styles.equippedBadge} />}
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: getRarityColor(item.rarity) }]}>
            {item.name}
          </Text>
          <Text style={styles.itemType}>{item.type.toUpperCase()}</Text>
          {item.stats && (
            <View style={styles.statsContainer}>
              {Object.entries(item.stats).slice(0, 3).map(([stat, value]) => (
                <Text key={stat} style={styles.statText}>
                  +{value} {stat}
                </Text>
              ))}
            </View>
          )}
        </View>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>x{item.quantity}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  if (!player) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading inventory...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Stats Summary */}
      <View style={styles.statsSummary}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{player.gold}</Text>
          <Text style={styles.statLabel}>💰 Gold</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{player.gems}</Text>
          <Text style={styles.statLabel}>💎 Gems</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{player.inventory.length}</Text>
          <Text style={styles.statLabel}>📦 Items</Text>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Item List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>No items in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  list: {
    padding: SPACING.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  itemIcon: {
    fontSize: 28,
  },
  equippedBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemType: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  statsContainer: {
    marginTop: SPACING.xs,
  },
  statText: {
    color: COLORS.heal,
    fontSize: 11,
  },
  quantityContainer: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm,
  },
  quantityText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
