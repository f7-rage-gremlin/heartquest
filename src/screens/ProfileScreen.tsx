// ============================================
// HeartQuest Profile Screen - Player Stats
// ============================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { usePlayerStore } from '../store';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { getItemById } from '../constants/items';

export default function ProfileScreen() {
  const player = usePlayerStore(state => state.player);
  
  if (!player) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading profile...</Text>
      </View>
    );
  }
  
  // Calculate total stats including equipment
  const getTotalStats = () => {
    const base = { ...player.stats };
    Object.values(player.equippedItems).forEach(itemId => {
      if (!itemId) return;
      const item = getItemById(itemId);
      if (item?.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          base[stat as keyof typeof base] += value || 0;
        });
      }
    });
    return base;
  };
  
  const totalStats = getTotalStats();
  
  const equippedItems = Object.entries(player.equippedItems)
    .filter(([_, itemId]) => itemId)
    .map(([slot, itemId]) => ({ slot, item: getItemById(itemId!) }));
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{player.avatar}</Text>
          {player.isFounder && <View style={styles.founderBadge} />}
        </View>
        <Text style={styles.displayName}>{player.displayName}</Text>
        <Text style={styles.level}>Level {player.level}</Text>
        {player.isFounder && (
          <View style={styles.founderTag}>
            <Text style={styles.founderText}>⭐ FOUNDER</Text>
          </View>
        )}
      </View>
      
      {/* XP Bar */}
      <View style={styles.xpSection}>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${(player.xp / player.xpToNextLevel) * 100}%` }]} />
        </View>
        <Text style={styles.xpText}>{player.xp} / {player.xpToNextLevel} XP to Level {player.level + 1}</Text>
      </View>
      
      {/* Currency */}
      <View style={styles.currencySection}>
        <View style={styles.currencyBox}>
          <Text style={styles.currencyIcon}>💰</Text>
          <Text style={styles.currencyValue}>{player.gold}</Text>
          <Text style={styles.currencyLabel}>Gold</Text>
        </View>
        <View style={styles.currencyBox}>
          <Text style={styles.currencyIcon}>💎</Text>
          <Text style={styles.currencyValue}>{player.gems}</Text>
          <Text style={styles.currencyLabel}>Gems</Text>
        </View>
      </View>
      
      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statName}>Health</Text>
            <Text style={styles.statValue}>{totalStats.health}/{totalStats.maxHealth}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⚔️</Text>
            <Text style={styles.statName}>Attack</Text>
            <Text style={styles.statValue}>{totalStats.attack}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🛡️</Text>
            <Text style={styles.statName}>Defense</Text>
            <Text style={styles.statValue}>{totalStats.defense}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statName}>Speed</Text>
            <Text style={styles.statValue}>{totalStats.speed}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🍀</Text>
            <Text style={styles.statName}>Luck</Text>
            <Text style={styles.statValue}>{totalStats.luck}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>✨</Text>
            <Text style={styles.statName}>Charisma</Text>
            <Text style={styles.statValue}>{totalStats.charisma}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔍</Text>
            <Text style={styles.statName}>Detection</Text>
            <Text style={styles.statValue}>{totalStats.detection}</Text>
          </View>
        </View>
      </View>
      
      {/* Equipped Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎒 Equipped</Text>
        {equippedItems.length > 0 ? (
          equippedItems.map(({ slot, item }) => (
            <View key={slot} style={styles.equippedItem}>
              <Text style={styles.equippedIcon}>{item?.icon}</Text>
              <View style={styles.equippedInfo}>
                <Text style={styles.equippedName}>{item?.name}</Text>
                <Text style={styles.equippedSlot}>{slot.replace(/([A-Z])/g, ' $1').trim()}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No items equipped</Text>
        )}
      </View>
      
      {/* Battle Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Battle Stats</Text>
        <View style={styles.battleStats}>
          <View style={styles.battleStat}>
            <Text style={styles.battleStatValue}>{player.monstersKilled}</Text>
            <Text style={styles.battleStatLabel}>Monsters Killed</Text>
          </View>
          <View style={styles.battleStat}>
            <Text style={styles.battleStatValue}>{player.playersDefeated}</Text>
            <Text style={styles.battleStatLabel}>Rivals Defeated</Text>
          </View>
          <View style={styles.battleStat}>
            <Text style={styles.battleStatValue}>{player.itemsFound}</Text>
            <Text style={styles.battleStatLabel}>Items Found</Text>
          </View>
        </View>
      </View>
      
      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Account</Text>
        <Text style={styles.accountInfo}>Playing since: {new Date(player.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.accountInfo}>Last active: {new Date(player.lastActive).toLocaleDateString()}</Text>
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
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    fontSize: 80,
  },
  founderBadge: {
    position: 'absolute',
    top: 0,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
  },
  displayName: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
  },
  level: {
    color: COLORS.secondary,
    fontSize: 16,
  },
  founderTag: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
  },
  founderText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  xpBar: {
    height: 12,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: COLORS.xp,
  },
  xpText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  currencySection: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  currencyBox: {
    flex: 1,
    alignItems: 'center',
  },
  currencyIcon: {
    fontSize: 24,
  },
  currencyValue: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
  },
  currencyLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  section: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  statIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  statName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  equippedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
  },
  equippedIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  equippedInfo: {
    flex: 1,
  },
  equippedName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  equippedSlot: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  battleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  battleStat: {
    alignItems: 'center',
  },
  battleStatValue: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  battleStatLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  accountInfo: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
});
