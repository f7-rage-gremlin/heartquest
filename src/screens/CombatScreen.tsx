import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store';
import styles from './CombatScreen.module.css';

export default function CombatScreen() {
  const navigate = useNavigate();
  const combatState = useGameStore(state => state.combatState);
  const executePlayerAction = useGameStore(state => state.executePlayerAction);
  
  if (!combatState) {
    return (
      <div className={styles.container}>
        <h2>No active combat</h2>
        <button onClick={() => navigate('/')}>Back to Map</button>
      </div>
    );
  }
  
  const { monster, playerHp, monsterHp, log } = combatState;
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>⚔️ Combat!</h1>
      
      <div className={styles.arena}>
        <div className={styles.combatant}>
          <span className={styles.icon}>🧑‍🚀</span>
          <div className={styles.hpBar}>
            <div className={styles.hpFill} style={{ width: `${(playerHp / 100) * 100}%` }} />
          </div>
          <span>HP: {playerHp}</span>
        </div>
        
        <div className={styles.vs}>VS</div>
        
        <div className={styles.combatant}>
          <span className={styles.icon}>{monster.icon}</span>
          <span>{monster.name}</span>
          <div className={styles.hpBar}>
            <div className={`${styles.hpFill} ${styles.enemy}`} style={{ width: `${(monsterHp / monster.hp) * 100}%` }} />
          </div>
          <span>HP: {monsterHp}/{monster.hp}</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={() => executePlayerAction('attack')}>⚔️ Attack</button>
        <button className={styles.actionBtn} onClick={() => executePlayerAction('defend')}>🛡️ Defend</button>
        <button className={styles.actionBtn} onClick={() => executePlayerAction('skill')}>✨ Skill</button>
        <button className={styles.actionBtn} onClick={() => navigate('/')}>🏃 Flee</button>
      </div>
      
      <div className={styles.log}>
        {log.slice(-5).map((entry, i) => (
          <p key={i}>{entry.action} - {entry.damage ? `${entry.damage} damage` : ''}</p>
        ))}
      </div>
    </div>
  );
}
