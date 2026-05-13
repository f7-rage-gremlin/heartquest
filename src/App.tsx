// ============================================
// HeartQuest App - Main Entry Point
// ============================================

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import CombatScreen from './screens/CombatScreen';
import InventoryScreen from './screens/InventoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import { COLORS } from './constants/theme';
import { usePlayerStore } from './store';

export type RootStackParamList = {
  Map: undefined;
  Combat: { monsterId: string };
  Inventory: undefined;
  Profile: undefined;
  ItemDetail: { itemId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Loading screen while hydrating
function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 48, marginBottom: 20 }}>⚔️</Text>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={{ color: COLORS.textSecondary, marginTop: 16 }}>Loading HeartQuest...</Text>
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPlayer, setIsNewPlayer] = useState(true);
  
  const player = usePlayerStore((state) => state.player);
  const hasHydrated = usePlayerStore((state) => state._hasHydrated);
  const setHasHydrated = usePlayerStore((state) => state.setHasHydrated);
  
  useEffect(() => {
    // Wait for hydration to complete
    if (hasHydrated) {
      setIsLoading(false);
      setIsNewPlayer(!player);
    }
  }, [hasHydrated, player]);
  
  // Show loading until hydrated
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }
  
  // Show welcome for new players
  if (isNewPlayer) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <WelcomeScreen onComplete={() => setIsNewPlayer(false)} />
      </SafeAreaProvider>
    );
  }
  
  // Main app
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Map"
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerTintColor: COLORS.textPrimary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: COLORS.background,
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Combat"
            component={CombatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Inventory"
            component={InventoryScreen}
            options={{ title: '🎒 Inventory' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: '👤 Profile' }}
          />
          <Stack.Screen
            name="ItemDetail"
            component={ItemDetailScreen}
            options={({ route }) => ({ title: 'Item Details' })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
