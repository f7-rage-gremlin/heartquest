// ============================================
// HeartQuest Combat Screen - Battle Arena
// ============================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { usePlayerStore, useGameStore } from '../store';
import { COLORS, SPACING, RADIUS, getRarityColor, getRarityGradient } from '../constants/theme';
import { getItemById } from '../constants/items';

export default function CombatScreen() {
  const navigation = useNavigation();
  const player = usePlayerStore(state => state.player);
  const combatState = useGameStore(state => state.combatState);
  const activeMonster = useGameStore(state => state.activeMonster);
  const attack = useGameStore(state => state.attack);
  const defend = useGameStore(state => state.defend);
  const useItem = useGameStore(state => state.useItem);
  const endCombat = useGameStore(state => state.endCombat);
  
  const [shakeAnim] = useState(new Animated.Value(0));
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  
  // Check for combat end
  useEffect(() => {
    if (combatState?.playerHealth === 0) {
      setShowDefeat(true);
    } else if (combatState?.enemyHealth === 0) {
      setShowVictory(true);
    }
  }, [combatState?.playerHealth, combatState?.enemyHealth]);
  
  // Shake animation on damage
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };
  
  const handleAttack = () => {
    attack();
    triggerShake();
  };
  
  // Get consumables from inventory
  const consumables = player?.inventory
    .map(inv => ({ ...inv, item: getItemById(inv.itemId) }))
    .filter(inv => inv.item?.type === 'consumable') || [];
  
  if (!combatState || !activeMonster || !player) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No active combat</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Return to Map</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Victory screen
  if (showVictory) {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultEmoji}>🎉</Text>
        <Text style={styles.resultTitle}>VICTORY!</Text>
        <Text style={styles.resultText}>You defeated {activeMonster.name}!</Text>
        <View style={styles.rewards}>
          <Text style={styles.rewardItem}>⭐ +{activeMonster.xpReward} XP</Text>
          <Text style={styles.rewardItem}>💰 +{activeMonster.goldReward[0]}-{activeMonster.goldReward[1]} Gold</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => {
          endCombat(true);
          navigation.goBack();
        }}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Defeat screen
  if (showDefeat) {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultEmoji}>💀</Text>
        <Text style={[styles.resultTitle, { color: COLORS.damage }]}>DEFEATED</Text>
        <Text style={styles.resultText}>{activeMonster.name} was too strong...</Text>
        <TouchableOpacity style={styles.button} onPress={() => {
          endCombat(false);
          navigation.goBack();
        }}>
          <Text style={styles.buttonText}>Return to Map</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Enemy Section */}
      <View style={styles.enemySection}>
        <View style={styles.enemyInfo}>
          <Text style={[styles.monsterRarity, { color: getRarityColor(activeMonster.type === 'rare' ? 'rare' : activeMonster.type === 'boss' ? 'legendary' : 'common') }]}>
            {activeMonster.type.toUpperCase()}
          </Text>
          <Text style={styles.monsterName}>{activeMonster.name}</Text>
          <Text style={styles.monsterLevel}>Level {activeMonster.level}</Text>
        </View>
        
        <Animated.View style={[styles.monsterIconContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <Text style={styles.monsterIcon}>{activeMonster.icon}</Text>
        </Animated.View>
        
        {/* Enemy Health Bar */}
        <View style={styles.healthBarContainer}>
          <View style={styles.healthBar}>
            <View style={[styles.healthFill, { width: `${(combatState.enemyHealth / combatState.enemyMaxHealth) * 100}%`, backgroundColor: COLORS.damage }]} />
          </View>
          <Text style={styles.healthText}>{combatState.enemyHealth} / {combatState.enemyMaxHealth}</Text>
        </View>
      </View>
      
      {/* Combat Log */}
      <View style={styles.logSection}>
        <ScrollView style={styles.logList} ref={ref => { if (ref) ref.scrollToEnd({ animated: true }); }}>
          {combatState.log.slice(-5).map((entry, index) => (
            <View key={index} style={styles.logEntry}>
              <Text style={[styles.logText, entry.critical && styles.criticalText]}>
                {entry.critical && '💥 '}
                {entry.actor === 'player' ? 'You' : activeMonster.name} {entry.action}
                {entry.damage && ` for ${entry.damage} damage`}
                {entry.healing && ` for ${entry.healing} healing`}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* Player Section */}
      <View style={styles.playerSection}>
        {/* Player Health Bar */}
        <View style={styles.healthBarContainer}>
          <View style={styles.healthBar}>
            <View style={[styles.healthFill, { width: `${(combatState.playerHealth / combatState.playerMaxHealth) * 100}%` }]} />
          </View>
          <Text style={styles.healthText}>{combatState.playerHealth} / {combatState.playerMaxHealth}</Text>
        </View>
        
        <Text style={styles.playerName}>{player.avatar} {player.displayName}</Text>
        <Text style={styles.playerLevel}>Level {player.level}</Text>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.damage }]} onPress={handleAttack}>
          <Text style={styles.actionIcon}>⚔️</Text>
          <Text style={styles.actionLabel}>Attack</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.secondary }]} onPress={defend}>
          <Text style={styles.actionIcon}>🛡️</Text>
          <Text style={styles.actionLabel}>Defend</Text>
        </TouchableOpacity>
        
        {consumables.length > 0 && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.heal }]} onPress={() => useItem(consumables[0].itemId)}>
            <Text style={styles.actionIcon}>🧪</Text>
            <Text style={styles.actionLabel}>Use {consumables[0].item?.name}</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.textMuted }]} onPress={() => {
          endCombat(false);
          navigation.goBack();
        }}>
          <Text style={styles.actionIcon}>🏃</Text>
          <Text style={styles.actionLabel}>Flee</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  resultTitle: {
    color: COLORS.textPrimary,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  resultText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: SPACING.xl,
  },
  rewards: {
    marginBottom: SPACING.xl,
  },
  rewardItem: {
    color: COLORS.textPrimary,
    fontSize: 18,
    marginVertical: SPACING.xs,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  enemySection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  enemyInfo: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  monsterRarity: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  monsterName: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  monsterLevel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  monsterIconContainer: {
    marginVertical: SPACING.md,
  },
  monsterIcon: {
    fontSize: 80,
  },
  healthBarContainer: {
    width: '100%',
    maxWidth: 300,
  },
  healthBar: {
    height: 16,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  healthFill: {
    height: '100%',
    backgroundColor: COLORS.health,
    borderRadius: RADIUS.full,
  },
  healthText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  logSection: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  logList: {
    flex: 1,
  },
  logEntry: {
    paddingVertical: SPACING.xs,
  },
  logText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  criticalText: {
    color: COLORS.critical,
    fontWeight: 'bold',
  },
  playerSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  playerName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
  },
  playerLevel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  actionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    width: '45%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  actionLabel: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});
