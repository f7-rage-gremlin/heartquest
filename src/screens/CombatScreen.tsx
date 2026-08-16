import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store';
import styles from './CombatScreen.module.css';

export default function CombatScreen() {
  const navigate = useNavigate();
  const combatState = useGameStore(state => state.combatState);
  const activeMonster = useGameStore(state => state.activeMonster);
  const attack = useGameStore(state => state.attack);
  const defend = useGameStore(state => state.defend);
  const flee = useGameStore(state => state.flee);

  if (!combatState || !activeMonster) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
      }}>
        <h2>⚔️ No Active Combat</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#6c5ce7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Back to Map
        </button>
      </div>
    );
  }

  const { playerHealth, enemyHealth, playerMaxHealth, enemyMaxHealth, log } = combatState;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>⚔️ Combat!</h1>

      <div className={styles.arena}>
        <div className={styles.combatant}>
          <span className={styles.icon}>🧑‍🚀</span>
          <div className={styles.hpBar}>
            <div className={styles.hpFill} style={{ width: `${Math.max(0, (playerHealth / playerMaxHealth) * 100)}%` }} />
          </div>
          <span>HP: {playerHealth}/{playerMaxHealth}</span>
        </div>

        <div className={styles.vs}>VS</div>

        <div className={styles.combatant}>
          <span className={styles.icon}>{activeMonster.icon}</span>
          <span>{activeMonster.name}</span>
          <div className={styles.hpBar}>
            <div className={`${styles.hpFill} ${styles.enemy}`} style={{ width: `${Math.max(0, (enemyHealth / enemyMaxHealth) * 100)}%` }} />
          </div>
          <span>HP: {enemyHealth}/{enemyMaxHealth}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={attack}>⚔️ Attack</button>
        <button className={styles.actionBtn} onClick={defend}>🛡️ Defend</button>
        <button className={styles.actionBtn} onClick={() => navigate('/')}>🏃 Flee</button>
      </div>

      <div className={styles.log}>
        {log.slice(-5).map((entry, i) => (
          <p key={i}>{entry.action} {entry.damage ? `- ${entry.damage} damage` : ''}</p>
        ))}
      </div>
    </div>
  );
}
