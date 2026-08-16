// ============================================
// HeartQuest Proximity Service
// Detect nearby players and potential matches
// ============================================

import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

// Distance calculation using Haversine formula (no external packages!)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Proximity thresholds
export const PROXIMITY_THRESHOLDS = {
  veryClose: 100,    // 100m - "Someone is very close!"
  close: 500,        // 500m - "Someone nearby"
  nearby: 2000,      // 2km - "In your area"
  far: 10000,        // 10km - Max detection range
} as const;

export interface ProximityAlert {
  playerId: string;
  playerName: string;
  distance: number;
  threshold: keyof typeof PROXIMITY_THRESHOLDS;
  timestamp: number;
}

// Check if location permissions are granted
export async function checkLocationPermission(): Promise<boolean> {
  try {
    const status = await Geolocation.checkPermissions();
    return status.location === 'granted';
  } catch {
    // Web fallback - always allowed
    return true;
  }
}

// Request location permissions
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const status = await Geolocation.requestPermissions();
    return status.location === 'granted';
  } catch {
    // Web fallback
    return true;
  }
}

// Get current position
export async function getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.error('Failed to get location:', error);
    return null;
  }
}

// Watch position changes (for real-time tracking)
export async function watchPosition(
  callback: (position: { latitude: number; longitude: number }) => void,
  errorCallback?: (error: Error) => void
): Promise<string> {
  try {
    const watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 30000,
      },
      (position, err) => {
        if (err) {
          errorCallback?.(err);
          return;
        }
        if (position) {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      }
    );
    return watchId;
  } catch (error) {
    errorCallback?.(error as Error);
    return '';
  }
}

// Stop watching position
export async function stopWatching(watchId: string): Promise<void> {
  try {
    await Geolocation.clearWatch({ id: watchId });
  } catch {
    // Ignore errors
  }
}

// Send local notification for proximity alert
export async function sendProximityNotification(alert: ProximityAlert): Promise<void> {
  try {
    // Check if notifications are supported
    const hasPermission = await LocalNotifications.checkPermissions();

    if (hasPermission.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }

    const distanceText = alert.distance < 1000
      ? `${Math.round(alert.distance)}m away`
      : `${(alert.distance / 1000).toFixed(1)}km away`;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title: '💜 Someone nearby!',
          body: `${alert.playerName} is ${distanceText}`,
          schedule: { at: new Date(Date.now() + 100) },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: { playerId: alert.playerId },
        },
      ],
    });
  } catch (error) {
    // Notifications might not be available - that's okay
    console.log('Could not send notification:', error);
  }
}

// Determine proximity threshold
export function getProximityThreshold(distance: number): keyof typeof PROXIMITY_THRESHOLDS | null {
  if (distance <= PROXIMITY_THRESHOLDS.veryClose) return 'veryClose';
  if (distance <= PROXIMITY_THRESHOLDS.close) return 'close';
  if (distance <= PROXIMITY_THRESHOLDS.nearby) return 'nearby';
  if (distance <= PROXIMITY_THRESHOLDS.far) return 'far';
  return null;
}
