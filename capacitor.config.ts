import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.heartquest.app',
  appName: 'HeartQuest',
  webDir: 'dist',
  plugins: {
    Sentry: {
      dsn: process.env.VITE_SENTRY_DSN || '',
    },
    Geolocation: {
      // Required for proximity detection
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#6c5ce7',
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;
