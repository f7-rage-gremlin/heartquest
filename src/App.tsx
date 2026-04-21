// ============================================
// HeartQuest App - Main Entry Point
// ============================================

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MapScreen from './screens/MapScreen';
import CombatScreen from './screens/CombatScreen';
import InventoryScreen from './screens/InventoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import { COLORS } from './constants/theme';

export type RootStackParamList = {
  Map: undefined;
  Combat: { monsterId: string };
  Inventory: undefined;
  Profile: undefined;
  ItemDetail: { itemId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
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
