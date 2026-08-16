// ============================================
// HeartQuest Proximity Hook
// React hook for location tracking & nearby detection
// ============================================

import { useEffect, useCallback, useState, useRef } from 'react';
import { usePlayerStore, useGameStore } from '../store';
import {
  getNearbyPlayers,
  updatePlayerLocation as updateLocationInDb,
  calculateDistanceKm,
  isBackendConfigured
} from '../utils/supabase';
import {
  checkLocationPermission,
  requestLocationPermission,
  getCurrentPosition,
  watchPosition,
  stopWatching,
  sendProximityNotification,
  getProximityThreshold,
  PROXIMITY_THRESHOLDS,
  ProximityAlert,
} from '../services/proximity';

interface NearbyPlayer {
  id: string;
  displayName: string;
  avatar: string;
  level: number;
  distance: number;
  threshold: 'veryClose' | 'close' | 'nearby' | 'far';
}

interface UseProximityOptions {
  enabled?: boolean;
  updateInterval?: number;
  notifyOnProximity?: boolean;
  onNearbyPlayer?: (player: NearbyPlayer) => void;
}

export function useProximity(options: UseProximityOptions = {}) {
  const {
    enabled = true,
    updateInterval = 30000,
    notifyOnProximity = true,
    onNearbyPlayer,
  } = options;

  const player = usePlayerStore((state) => state.player);
  const updateLocation = usePlayerStore((state) => state.updateLocation);
  const setNearbyPlayers = useGameStore((state) => state.setNearbyPlayers);

  const [isTracking, setIsTracking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [nearbyPlayers, setLocalNearbyPlayers] = useState<NearbyPlayer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<string>('');
  const lastPositionRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const lastAlertsRef = useRef<Map<string, number>>(new Map());

  // Check and request permissions
  const ensurePermission = useCallback(async () => {
    let granted = await checkLocationPermission();
    if (!granted) {
      granted = await requestLocationPermission();
    }
    setPermissionGranted(granted);
    return granted;
  }, []);

  // Update player location
  const updatePlayerLocation = useCallback(async () => {
    if (!player) return null;

    try {
      const position = await getCurrentPosition();
      if (position) {
        updateLocation(position.latitude, position.longitude);
        // Only update backend if configured
        if (isBackendConfigured()) {
          await updateLocationInDb(position.latitude, position.longitude).catch(() => {});
        }
        return position;
      }
    } catch (e) {
      console.error('Location error:', e);
    }
    return null;
  }, [player, updateLocation]);

  // Check for nearby players
  const checkNearbyPlayers = useCallback(async (myLat: number, myLon: number) => {
    // Skip if backend not configured - return empty array
    if (!isBackendConfigured()) {
      setLocalNearbyPlayers([]);
      setNearbyPlayers([]);
      return [];
    }

    try {
      const nearbyData = await getNearbyPlayers(myLat, myLon, 10);

      const nearbyWithDistance: NearbyPlayer[] = nearbyData
        .map(p => {
          const distance = calculateDistanceKm(myLat, myLon, p.latitude, p.longitude) * 1000;
          const threshold = getProximityThreshold(distance);
          return {
            id: p.id,
            displayName: p.display_name || 'Unknown',
            avatar: p.avatar || '👤',
            level: p.level || 1,
            distance,
            threshold: threshold || 'far',
          } as NearbyPlayer;
        })
        .filter(p => p.threshold !== null)
        .sort((a, b) => a.distance - b.distance);

      setLocalNearbyPlayers(nearbyWithDistance);
      setNearbyPlayers(nearbyWithDistance.map(p => ({
        id: p.id,
        displayName: p.displayName,
        avatar: p.avatar,
        level: p.level,
      })));

      // Send notifications for nearby players
      if (notifyOnProximity) {
        const now = Date.now();
        for (const nearby of nearbyWithDistance) {
          if (nearby.distance <= PROXIMITY_THRESHOLDS.close) {
            const lastAlert = lastAlertsRef.current.get(nearby.id) || 0;
            if (now - lastAlert > 5 * 60 * 1000) {
              await sendProximityNotification({
                playerId: nearby.id,
                playerName: nearby.displayName,
                distance: nearby.distance,
                threshold: nearby.threshold,
                timestamp: now,
              }).catch(() => {});
              lastAlertsRef.current.set(nearby.id, now);
              onNearbyPlayer?.(nearby);
            }
          }
        }
      }

      return nearbyWithDistance;
    } catch (error) {
      console.error('Error checking nearby players:', error);
      return [];
    }
  }, [notifyOnProximity, onNearbyPlayer, setNearbyPlayers]);

  // Start tracking
  const startTracking = useCallback(async () => {
    if (!enabled || !player) return;

    setError(null);

    const granted = await ensurePermission();
    if (!granted) {
      setError('Location permission denied');
      return;
    }

    setIsTracking(true);

    const position = await updatePlayerLocation();
    if (position && isBackendConfigured()) {
      await checkNearbyPlayers(position.latitude, position.longitude);
    }

    watchIdRef.current = await watchPosition(
      async (pos) => {
        // Throttle: only update if moved >10m or >10s since last update
        const now = Date.now();
        const last = lastPositionRef.current;
        const MIN_DISTANCE = 10; // meters
        const MIN_TIME = 10000; // 10 seconds

        if (last) {
          const dist = Math.sqrt(
            Math.pow(pos.latitude - last.lat, 2) +
            Math.pow(pos.longitude - last.lng, 2)
          ) * 111000; // rough meters
          if (dist < MIN_DISTANCE && now - last.time < MIN_TIME) {
            return; // Skip this update
          }
        }

        lastPositionRef.current = { lat: pos.latitude, lng: pos.longitude, time: now };
        updateLocation(pos.latitude, pos.longitude);

        if (isBackendConfigured()) {
          await checkNearbyPlayers(pos.latitude, pos.longitude);
        }
      },
      (err) => {
        console.error('Position watch error:', err);
        setError(err.message);
      }
    );
  }, [enabled, player, ensurePermission, updatePlayerLocation, updateLocation, checkNearbyPlayers]);

  // Stop tracking
  const stopTracking = useCallback(async () => {
    if (watchIdRef.current) {
      await stopWatching(watchIdRef.current);
      watchIdRef.current = '';
    }
    setIsTracking(false);
  }, []);

  // Auto-start/stop
  useEffect(() => {
    if (enabled && player) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enabled, player, startTracking, stopTracking]);

  return {
    isTracking,
    permissionGranted,
    nearbyPlayers,
    error,
    startTracking,
    stopTracking,
    updatePlayerLocation,
    refreshNearby: async () => {
      const pos = await updatePlayerLocation();
      if (pos && isBackendConfigured()) {
        return checkNearbyPlayers(pos.latitude, pos.longitude);
      }
      return [];
    },
  };
}
