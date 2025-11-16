/**
 * Root Navigator
 * Switches between Auth and App navigators based on authentication state
 */

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme, adaptNavigationTheme } from 'react-native-paper';
import { useIsAuthenticated } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Adapt React Navigation themes to work with Paper
const { LightTheme, DarkTheme: PaperDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  reactNavigationDark: DarkTheme,
});

export default function RootNavigator() {
  const theme = useTheme();
  const isAuthenticated = useIsAuthenticated();

  // Use the adapted theme based on dark mode
  const navigationTheme = theme.dark ? PaperDarkTheme : LightTheme;

  // Merge with custom colors from Paper theme
  const customNavigationTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      notification: theme.colors.error,
    },
  };

  return (
    <NavigationContainer theme={customNavigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

