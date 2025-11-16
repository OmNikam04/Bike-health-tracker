/**
 * App Entry Point
 * Main application component with theme and navigation
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useIsDarkMode } from './src/store/themeStore';
import { getColors } from './src/constants/theme';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  const isDarkMode = useIsDarkMode();

  return (
    <PaperProvider>
      <RootNavigator />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
