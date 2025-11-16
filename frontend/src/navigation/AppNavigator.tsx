/**
 * App Navigator
 * Navigation stack for authenticated app screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import TabNavigator from './TabNavigator';
import AddBikeScreen from '../screens/bikes/AddBikeScreen';
import BikeDetailsScreen from '../screens/bikes/BikeDetailsScreen';
import AddFuelLogScreen from '../screens/fuel/AddFuelLogScreen';
import FuelLogDetailsScreen from '../screens/fuel/FuelLogDetailsScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerShadowVisible: false,
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />

      {/* Bike Management Screens */}
      <Stack.Screen
        name="AddBike"
        component={AddBikeScreen}
        options={{
          title: 'Add Bike',
          headerStyle: {
            backgroundColor: theme.colors.background, // Blend with background
          },
          headerTintColor: theme.colors.onBackground,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="BikeDetails"
        component={BikeDetailsScreen}
        options={{
          title: 'Bike Details',
          headerStyle: {
            backgroundColor: theme.colors.background, // Blend with background
          },
          headerTintColor: theme.colors.onBackground,
          headerShadowVisible: false,
        }}
      />

      {/* Fuel Log Management Screens */}
      <Stack.Screen
        name="AddFuelLog"
        component={AddFuelLogScreen}
        options={{
          title: 'Add Fuel Log',
          headerStyle: {
            backgroundColor: theme.colors.background, // Blend with background
          },
          headerTintColor: theme.colors.onBackground,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="FuelLogDetails"
        component={FuelLogDetailsScreen}
        options={{
          title: 'Fuel Log Details',
          headerStyle: {
            backgroundColor: theme.colors.background, // Blend with background
          },
          headerTintColor: theme.colors.onBackground,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

