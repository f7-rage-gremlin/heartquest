import { useNavigate, useParams } from 'react-router-dom';
import { usePlayerStore } from '../store';
import { getItemById } from '../constants/items';
import styles from './ItemDetailScreen.module.css';

export default function ItemDetailScreen() {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const player = usePlayerStore(state => state.player);
  
  const item = itemId ? getItemById(itemId) : null;
  const ownedItem = player?.inventory.find(i => i.itemId === itemId);
  
  if (!item || !player) {
    return (
      <div className={styles.container}>
        <p>Item not found</p>
        <button onClick={() => navigate('/inventory')}>Back</button>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
      </header>
      
      <div className={`${styles.itemCard} ${styles[`rarity-${item.rarity}`]}`}>
        <span className={styles.icon}>{item.icon}</span>
        <h1 className={styles.name}>{item.name}</h1>
        <p className={styles.type}>{item.type.toUpperCase()}</p>
        <p className={`${styles.rarity} ${styles[`rarity-color-${item.rarity}`]}`}>
          {item.rarity.toUpperCase()}
        </p>
      </div>
      
      <div className={styles.section}>
        <p className={styles.description}>{item.description}</p>
      </div>
      
      {item.stats && Object.keys(item.stats).length > 0 && (
        <div className={styles.section}>
          <h3>Stats</h3>
          {Object.entries(item.stats).map(([stat, value]) => (
            <div key={stat} className={styles.statRow}>
              <span className={styles.statName}>{stat}</span>
              <span className={`${styles.statValue} ${value > 0 ? styles.positive : styles.negative}`}>
                {value > 0 ? '+' : ''}{value}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {ownedItem && (
        <div className={styles.section}>
          <p className={styles.quantity}>Owned: {ownedItem.quantity}</p>
        </div>
      )}
    </div>
  );
}
