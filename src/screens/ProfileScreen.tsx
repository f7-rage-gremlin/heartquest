import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store';
import styles from './ProfileScreen.module.css';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const player = usePlayerStore(state => state.player);
  
  if (!player) {
    return <div className={styles.container}>Loading...</div>;
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
        <h1>👤 Profile</h1>
      </header>
      
      <div className={styles.avatarSection}>
        <span className={styles.avatar}>{player.avatar}</span>
        <h2 className={styles.name}>{player.displayName}</h2>
        <p className={styles.level}>Level {player.level}</p>
      </div>
      
      <div className={styles.statsSection}>
        <h3>Stats</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statRow}>
            <span>⚔️ Attack</span>
            <span>{player.stats.attack}</span>
          </div>
          <div className={styles.statRow}>
            <span>🛡️ Defense</span>
            <span>{player.stats.defense}</span>
          </div>
          <div className={styles.statRow}>
            <span>❤️ Health</span>
            <span>{player.stats.health}</span>
          </div>
          <div className={styles.statRow}>
            <span>⚡ Speed</span>
            <span>{player.stats.speed}</span>
          </div>
          <div className={styles.statRow}>
            <span>🍀 Luck</span>
            <span>{player.stats.luck}</span>
          </div>
          <div className={styles.statRow}>
            <span>✨ Charisma</span>
            <span>{player.stats.charisma}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.currencySection}>
        <h3>💰 Wealth</h3>
        <div className={styles.currency}>
          <span>🪙 {player.gold} Gold</span>
          <span>💎 {player.gems} Gems</span>
        </div>
      </div>
    </div>
  );
}
