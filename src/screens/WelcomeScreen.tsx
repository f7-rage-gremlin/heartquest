// ============================================
// HeartQuest Welcome Screen - Onboarding
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePlayerStore } from '../store';
import { COLORS, SPACING, RADIUS, getRarityColor } from '../constants/theme';
import { getItemById, ITEMS } from '../constants/items';
import { Item } from '../types';

const { width, height } = Dimensions.get('window');

type Step = 'welcome' | 'name' | 'starter' | 'tutorial';

// Starter weapons to choose from
const STARTER_WEAPONS: Item[] = [
  ITEMS.plasma_dagger,
  ITEMS.neon_katana,
  ITEMS.void_whip,
];

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const initPlayer = usePlayerStore(state => state.initPlayer);
  const addItem = usePlayerStore(state => state.addItem);
  
  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Pulse animation for icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const handleNameSubmit = () => {
    if (playerName.trim().length >= 2) {
      setStep('starter');
    }
  };
  
  const handleWeaponSelect = (weaponId: string) => {
    setSelectedWeapon(weaponId);
  };
  
  const handleStartGame = () => {
    if (!selectedWeapon) return;
    
    // Create player
    const playerId = 'player_' + Date.now();
    initPlayer(playerId, playerName.trim());
    
    // Give starter weapon
    setTimeout(() => {
      addItem(selectedWeapon, 1);
      onComplete();
    }, 100);
  };
  
  const TUTORIAL_STEPS = [
    {
      icon: '🗺️',
      title: 'Explore the World',
      description: 'Walk around your real-world location to discover monsters, items, and other players.',
    },
    {
      icon: '⚔️',
      title: 'Fight Monsters',
      description: 'Battle creatures for XP and gold. The stronger you get, the rarer the loot!',
    },
    {
      icon: '👥',
      title: 'Meet Rivals',
      description: 'Other players roam the world too. Choose to be friendly or hostile—but watch out for deception!',
    },
    {
      icon: '🎒',
      title: 'Collect Items',
      description: 'Find rare weapons, armor, and magical artifacts. Some can even be combined into more powerful versions!',
    },
  ];
  
  // Welcome step
  if (step === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View 
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.heroSection}>
            <Animated.Text style={[styles.logo, { transform: [{ scale: pulseAnim }] }]}>
              ⚔️
            </Animated.Text>
            <Text style={styles.title}>HeartQuest</Text>
            <Text style={styles.subtitle}>Where player two becomes player one</Text>
          </View>
          
          <View style={styles.taglineSection}>
            <Text style={styles.tagline}>
              A world of monsters, magic, and maybe... love?
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setStep('name')}
          >
            <Text style={styles.primaryButtonText}>Begin Your Quest</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>✨ Sci-Fi Fantasy RPG ✨</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Name input step
  if (step === 'name') {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.stepTitle}>What shall we call you?</Text>
          <Text style={styles.stepSubtitle}>Your name will be seen by other players</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name..."
              placeholderTextColor={COLORS.textMuted}
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
              autoCapitalize="words"
              autoFocus
            />
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setStep('welcome')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.primaryButton, 
                playerName.trim().length < 2 && styles.disabledButton
              ]}
              onPress={handleNameSubmit}
              disabled={playerName.trim().length < 2}
            >
              <Text style={styles.primaryButtonText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }
  
  // Starter weapon selection
  if (step === 'starter') {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.stepTitle}>Choose Your First Weapon</Text>
          <Text style={styles.stepSubtitle}>This will help you in your first battles</Text>
          
          <View style={styles.weaponGrid}>
            {STARTER_WEAPONS.map(weapon => (
              <TouchableOpacity
                key={weapon.id}
                style={[
                  styles.weaponCard,
                  selectedWeapon === weapon.id && styles.selectedWeapon,
                  { borderColor: getRarityColor(weapon.rarity) }
                ]}
                onPress={() => handleWeaponSelect(weapon.id)}
              >
                <Text style={styles.weaponIcon}>{weapon.icon}</Text>
                <Text style={[styles.weaponName, { color: getRarityColor(weapon.rarity) }]}>
                  {weapon.name}
                </Text>
                <Text style={styles.weaponRarity}>{weapon.rarity.toUpperCase()}</Text>
                <View style={styles.weaponStats}>
                  {weapon.stats && Object.entries(weapon.stats).map(([stat, value]) => (
                    <Text key={stat} style={styles.weaponStat}>
                      +{value} {stat}
                    </Text>
                  ))}
                </View>
                <Text style={styles.weaponDesc} numberOfLines={2}>
                  {weapon.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setStep('name')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.primaryButton, 
                !selectedWeapon && styles.disabledButton
              ]}
              onPress={() => setStep('tutorial')}
              disabled={!selectedWeapon}
            >
              <Text style={styles.primaryButtonText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }
  
  // Tutorial step
  if (step === 'tutorial') {
    const currentTutorial = TUTORIAL_STEPS[tutorialStep];
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.progressDots}>
            {TUTORIAL_STEPS.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  index === tutorialStep && styles.activeDot,
                  index < tutorialStep && styles.completedDot
                ]} 
              />
            ))}
          </View>
          
          <Animated.Text style={[styles.tutorialIcon, { transform: [{ scale: pulseAnim }] }]}>
            {currentTutorial.icon}
          </Animated.Text>
          
          <Text style={styles.tutorialTitle}>{currentTutorial.title}</Text>
          <Text style={styles.tutorialDesc}>{currentTutorial.description}</Text>
          
          <View style={styles.buttonRow}>
            {tutorialStep > 0 && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setTutorialStep(tutorialStep - 1)}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
            )}
            
            {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => setTutorialStep(tutorialStep + 1)}
              >
                <Text style={styles.primaryButtonText}>Next →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: COLORS.accent }]}
                onPress={handleStartGame}
              >
                <Text style={styles.primaryButtonText}>🎮 Start Quest!</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  taglineSection: {
    marginBottom: SPACING.xxl,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  footer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: SPACING.xl,
  },
  nameInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  weaponGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  weaponCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    maxWidth: 110,
  },
  selectedWeapon: {
    backgroundColor: COLORS.surfaceLight,
    transform: [{ scale: 1.05 }],
  },
  weaponIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  weaponName: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  weaponRarity: {
    fontSize: 8,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  weaponStats: {
    marginBottom: SPACING.xs,
  },
  weaponStat: {
    fontSize: 9,
    color: COLORS.heal,
  },
  weaponDesc: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.surface,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.2 }],
  },
  completedDot: {
    backgroundColor: COLORS.accent,
  },
  tutorialIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  tutorialDesc: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
});
