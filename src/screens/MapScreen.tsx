// ============================================
// HeartQuest Map Screen - Main Game View
// ============================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';

import { usePlayerStore, useGameStore } from '../store';
import { COLORS, SPACING, RADIUS, getRarityColor } from '../constants/theme';
import { MONSTERS, getMonsterById } from '../constants/monsters';
import { RootStackParamList } from '../App';

const { width, height } = Dimensions.get('window');

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export default function MapScreen() {
  const navigation = useNavigation<Navigation>();
  const player = usePlayerStore(state => state.player);
  const initPlayer = usePlayerStore(state => state.initPlayer);
  const startCombat = useGameStore(state => state.startCombat);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [nearbyMonsters, setNearbyMonsters] = useState<typeof MONSTERS[string][]>([]);
  
  // Initialize player if new
  useEffect(() => {
    if (!player) {
      initPlayer('player_' + Date.now(), 'Adventurer');
    }
  }, [player, initPlayer]);
  
  // Get location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      // Simulate nearby monsters (in real app, this would be from server)
      const randomMonsters = Object.values(MONSTERS)
        .filter(m => m.type !== 'boss')
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      setNearbyMonsters(randomMonsters);
    })();
  }, []);
  
  if (!player) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  const handleCombat = (monsterId: string) => {
    const monster = getMonsterById(monsterId);
    if (monster) {
      startCombat(monster);
      navigation.navigate('Combat', { monsterId });
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundOverlay} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <Text style={styles.avatar}>{player.avatar}</Text>
          <View>
            <Text style={styles.playerName}>{player.displayName}</Text>
            <Text style={styles.playerLevel}>Lv. {player.level}</Text>
          </View>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>{player.gold}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💎</Text>
            <Text style={styles.statValue}>{player.gems}</Text>
          </View>
        </View>
      </View>
      
      {/* XP Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${(player.xp / player.xpToNextLevel) * 100}%` }]} />
        </View>
        <Text style={styles.xpText}>{player.xp} / {player.xpToNextLevel} XP</Text>
      </View>
      
      {/* Map Area (placeholder for now) */}
      <View style={styles.mapArea}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={styles.mapText}>Location: {location ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 'Unknown'}</Text>
        </View>
      </View>
      
      {/* Nearby Monsters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚔️ Nearby Monsters</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monsterList}>
          {nearbyMonsters.map(monster => (
            <TouchableOpacity
              key={monster.id}
              style={[styles.monsterCard, { borderColor: getRarityColor(monster.type === 'rare' ? 'rare' : monster.type === 'boss' ? 'legendary' : 'common') }]}
              onPress={() => handleCombat(monster.id)}
            >
              <Text style={styles.monsterIcon}>{monster.icon}</Text>
              <Text style={styles.monsterName}>{monster.name}</Text>
              <Text style={styles.monsterLevel}>Lv. {monster.level}</Text>
              <Text style={[styles.monsterType, { color: getRarityColor(monster.type === 'rare' ? 'rare' : monster.type === 'boss' ? 'legendary' : 'common') }]}>
                {monster.type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.navIcon}>🎒</Text>
          <Text style={styles.navLabel}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚔️</Text>
          <Text style={styles.navLabel}>Rivals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
  loadingText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    fontSize: 40,
  },
  playerName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerLevel: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  xpContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  xpBar: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: COLORS.xp,
    borderRadius: RADIUS.full,
  },
  xpText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  mapArea: {
    flex: 1,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapEmoji: {
    fontSize: 64,
  },
  mapText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: SPACING.sm,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  monsterList: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  monsterCard: {
    width: 120,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    alignItems: 'center',
  },
  monsterIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  monsterName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  monsterLevel: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  monsterType: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  navLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
});
