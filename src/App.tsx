import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { usePlayerStore } from './store';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import CombatScreen from './screens/CombatScreen';
import InventoryScreen from './screens/InventoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import './styles/global.css';

export default function App() {
  const [isHydrated, setIsHydrated] = useState(false);
  const player = usePlayerStore((state) => state.player);

  // Wait for zustand persist to hydrate
  useEffect(() => {
    const unsubscribe = usePlayerStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    return unsubscribe;
  }, []);

  if (!isHydrated) {
    return (
      <div className="app-loading">
        <span>⚔️ Loading HeartQuest...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* New player sees welcome screen */}
          {!player ? (
            <>
              <Route path="/" element={<WelcomeScreen onComplete={() => {}} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<MapScreen />} />
              <Route path="/combat" element={<CombatScreen />} />
              <Route path="/inventory" element={<InventoryScreen />} />
              <Route path="/inventory/:itemId" element={<ItemDetailScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}
