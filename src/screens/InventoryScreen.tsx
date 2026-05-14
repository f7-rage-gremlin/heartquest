import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store';
import { getItemById } from '../constants/items';
import styles from './InventoryScreen.module.css';

export default function InventoryScreen() {
  const navigate = useNavigate();
  const player = usePlayerStore(state => state.player);
  
  if (!player) {
    return <div className={styles.container}>Loading...</div>;
  }
  
  const items = player.inventory
    .map(inv => ({ ...getItemById(inv.itemId)!, quantity: inv.quantity }))
    .filter(item => item.id);
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
        <h1>🎒 Inventory</h1>
      </header>
      
      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{player.gold}</span>
          <span className={styles.statLabel}>💰 Gold</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{player.gems}</span>
          <span className={styles.statLabel}>💎 Gems</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{items.length}</span>
          <span className={styles.statLabel}>📦 Items</span>
        </div>
      </div>
      
      <div className={styles.itemList}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📦</span>
            <p>No items yet</p>
            <p className={styles.emptyHint}>Defeat monsters to find loot!</p>
          </div>
        ) : (
          items.map(item => (
            <button
              key={item.id}
              className={`${styles.itemCard} ${styles[`rarity-${item.rarity}`]}`}
              onClick={() => navigate(`/inventory/${item.id}`)}
            >
              <span className={styles.itemIcon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemType}>{item.type}</span>
              </div>
              <span className={styles.quantity}>x{item.quantity}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
