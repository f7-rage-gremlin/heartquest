import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store';
import { STARTER_WEAPONS } from '../constants/items';
import styles from './WelcomeScreen.module.css';

type Step = 'welcome' | 'name' | 'starter' | 'ready';

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const navigate = useNavigate();
  const initPlayer = usePlayerStore(state => state.initPlayer);

  const [step, setStep] = useState<Step>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);

  const handleStart = () => {
    if (step === 'welcome') {
      setStep('name');
    } else if (step === 'name' && playerName.trim().length >= 2) {
      setStep('starter');
    } else if (step === 'starter' && selectedWeapon) {
      const playerId = 'player_' + Date.now();
      // Initialize player and navigate
      initPlayer(playerId, playerName.trim(), selectedWeapon);
      // Small delay to ensure state is saved
      setTimeout(() => {
        navigate('/');
      }, 100);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Effects */}
      <div className={styles.backgroundGlow} />

      {/* Content */}
      <div className={styles.content}>
        {step === 'welcome' && (
          <div className={styles.step}>
            <div className={styles.logo}>⚔️</div>
            <h1 className={styles.title}>
              <span className={styles.titleGlow}>Heart</span>Quest
            </h1>
            <p className={styles.subtitle}>
              A sci-fi fantasy RPG where player two b{'\''}s stuck on the shelf find each other
            </p>
            <p className={styles.tagline}>
              Adventure awaits in a world where magic meets technology
            </p>
            <button className={styles.startButton} onClick={handleStart}>
              Begin Your Journey
            </button>
          </div>
        )}

        {step === 'name' && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>What shall they call you?</h2>
            <p className={styles.stepDesc}>Enter your adventurer name</p>
            <input
              type="text"
              className={styles.nameInput}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name..."
              maxLength={20}
              autoFocus
            />
            <p className={styles.charCount}>{playerName.length}/20 characters</p>
            <button
              className={styles.continueButton}
              onClick={handleStart}
              disabled={playerName.trim().length < 2}
            >
              Continue
            </button>
          </div>
        )}

        {step === 'starter' && (
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>Choose your weapon</h2>
            <p className={styles.stepDesc}>Each has unique strengths</p>
            <div className={styles.weaponGrid}>
              {STARTER_WEAPONS.map(weapon => (
                <button
                  key={weapon.id}
                  className={`${styles.weaponCard} ${selectedWeapon === weapon.id ? styles.selected : ''}`}
                  onClick={() => setSelectedWeapon(weapon.id)}
                >
                  <span className={styles.weaponIcon}>{weapon.icon}</span>
                  <span className={styles.weaponName}>{weapon.name}</span>
                  <span className={styles.weaponRarity}>{weapon.rarity}</span>
                </button>
              ))}
            </div>
            <button
              className={styles.continueButton}
              onClick={handleStart}
              disabled={!selectedWeapon}
            >
              Start Adventure
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
