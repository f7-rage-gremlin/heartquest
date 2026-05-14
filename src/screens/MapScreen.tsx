import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore, useGameStore } from '../store';
import { MONSTERS, getMonsterById } from '../constants/monsters';
import styles from './MapScreen.module.css';

export default function MapScreen() {
  const navigate = useNavigate();
  const player = usePlayerStore(state => state.player);
  const startCombat = useGameStore(state => state.startCombat);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyMonsters, setNearbyMonsters] = useState<typeof MONSTERS[string][]>([]);
  
  useEffect(() => {
    // Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Location permission denied')
      );
    }
    
    // Simulate nearby monsters
    const randomMonsters = Object.values(MONSTERS)
      .filter(m => m.type !== 'boss')
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    setNearbyMonsters(randomMonsters);
  }, []);
  
  if (!player) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  const handleCombat = (monsterId: string) => {
    const monster = getMonsterById(monsterId);
    if (monster) {
      startCombat(monster);
      navigate('/combat');
    }
  };
  
  const xpPercent = (player.xp / player.xpToNextLevel) * 100;
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.playerInfo}>
          <span className={styles.avatar}>{player.avatar}</span>
          <div>
            <div className={styles.playerName}>{player.displayName}</div>
            <div className={styles.playerLevel}>Lv. {player.level}</div>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>💰</span>
            <span>{player.gold}</span>
          </div>
          <div className={styles.statItem}>
            <span>💎</span>
            <span>{player.gems}</span>
          </div>
        </div>
      </div>
      
      {/* XP Bar */}
      <div className={styles.xpContainer}>
        <div className={styles.xpBar}>
          <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
        </div>
        <div className={styles.xpText}>{player.xp} / {player.xpToNextLevel} XP</div>
      </div>
      
      {/* Map Area */}
      <div className={styles.mapArea}>
        <div className={styles.mapPlaceholder}>
          <span className={styles.mapEmoji}>🗺️</span>
          <span className={styles.mapText}>
            Location: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Unknown'}
          </span>
        </div>
      </div>
      
      {/* Nearby Monsters */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>⚔️ Nearby Monsters</h3>
        <div className={styles.monsterList}>
          {nearbyMonsters.map(monster => (
            <button
              key={monster.id}
              className={`${styles.monsterCard} ${styles[`rarity-${monster.type}`]}`}
              onClick={() => handleCombat(monster.id)}
            >
              <span className={styles.monsterIcon}>{monster.icon}</span>
              <span className={styles.monsterName}>{monster.name}</span>
              <span className={styles.monsterLevel}>Lv. {monster.level}</span>
              <span className={styles.monsterType}>{monster.type.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button className={styles.navItem} onClick={() => navigate('/inventory')}>
          <span className={styles.navIcon}>🎒</span>
          <span className={styles.navLabel}>Inventory</span>
        </button>
        <button className={styles.navItem} onClick={() => navigate('/profile')}>
          <span className={styles.navIcon}>👤</span>
          <span className={styles.navLabel}>Profile</span>
        </button>
        <button className={styles.navItem}>
          <span className={styles.navIcon}>⚔️</span>
          <span className={styles.navLabel}>Rivals</span>
        </button>
        <button className={styles.navItem}>
          <span className={styles.navIcon}>💬</span>
          <span className={styles.navLabel}>Chat</span>
        </button>
      </nav>
    </div>
  );
}
