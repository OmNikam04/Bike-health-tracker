/**
 * App Entry Point
 * Main application component with theme and navigation
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme, MD3DarkTheme, Portal } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useIsDarkMode } from './src/store/themeStore';
import { LightColors, DarkColors } from './src/constants/theme';
import RootNavigator from './src/navigation/RootNavigator';

// Custom Light Theme (Shadcn/UI Inspired)
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: LightColors.primary,           // Slate 900
    primaryContainer: '#F1F5F9',            // Slate 100 Container
    secondary: LightColors.secondary,       // Zinc 900
    secondaryContainer: '#F4F4F5',          // Zinc 100
    tertiary: LightColors.accent,           // Neutral 500
    tertiaryContainer: '#F5F5F5',           // Neutral 100
    surface: '#FFFFFF',                     // White (cards in shadcn)
    surfaceVariant: LightColors.surfaceVariant, // Slate 100
    background: LightColors.background,     // White
    error: LightColors.error,               // Red 500
    errorContainer: '#FEE2E2',              // Red 100
    onPrimary: '#F8FAFC',                   // Slate 50 on dark
    onPrimaryContainer: '#0F172A',          // Slate 900 on light
    onSecondary: '#FAFAFA',                 // Zinc 50 on dark
    onSecondaryContainer: '#18181B',        // Zinc 900 on light
    onTertiary: '#FFFFFF',                  // White on neutral
    onTertiaryContainer: '#525252',         // Neutral 600 on light
    onSurface: LightColors.text,            // Slate 950
    onSurfaceVariant: LightColors.textSecondary, // Slate 500
    onError: '#FFFFFF',                     // White on red
    onErrorContainer: '#7F1D1D',            // Dark red on light red
    onBackground: LightColors.text,         // Slate 950 on white
    outline: '#E2E8F0',                     // Slate 200 (shadcn border)
    outlineVariant: '#CBD5E1',              // Slate 300
    inverseSurface: '#1E293B',              // Slate 800
    inverseOnSurface: '#F8FAFC',            // Slate 50
    inversePrimary: '#64748B',              // Slate 500
    shadow: '#0F172A',                      // Slate 900
    scrim: '#020617',                       // Slate 950
    backdrop: 'rgba(15, 23, 42, 0.5)',      // Slate 900 overlay
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',                    // White cards
      level2: '#FFFFFF',                    // White cards
      level3: '#FFFFFF',                    // White cards
      level4: '#FFFFFF',                    // White cards
      level5: '#FFFFFF',                    // White cards
    },
  },
};

// Custom Dark Theme (Shadcn/UI Exact Match)
const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: DarkColors.primary,
    primaryContainer: '#27272A',      // Zinc 800 Container
    secondary: DarkColors.secondary,
    secondaryContainer: '#3F3F46',    // Zinc 700 Container
    tertiary: DarkColors.accent,
    tertiaryContainer: '#52525B',     // Zinc 600 Container
    surface: '#18181B',               // Zinc 900 (cards - shadcn exact)
    surfaceVariant: '#27272A',        // Zinc 800 (elevated cards)
    background: '#09090B',            // Zinc 950 (background - shadcn exact)
    error: DarkColors.error,
    errorContainer: '#7F1D1D',        // Dark Red Container
    onPrimary: '#09090B',             // Zinc 950 on light
    onPrimaryContainer: '#FAFAFA',    // Zinc 50 on dark
    onSecondary: '#09090B',           // Zinc 950 on light
    onSecondaryContainer: '#F5F5F5',  // Neutral 100 on dark
    onTertiary: '#09090B',            // Zinc 950 on light
    onTertiaryContainer: '#E5E5E5',   // Neutral 200 on dark
    onSurface: DarkColors.text,       // Zinc 50
    onSurfaceVariant: DarkColors.textSecondary, // Zinc 400
    onError: '#FFFFFF',
    onErrorContainer: '#FEE2E2',      // Light red text on dark red
    onBackground: DarkColors.text,    // Zinc 50
    outline: '#27272A',               // Zinc 800 (barely visible border)
    outlineVariant: '#3F3F46',        // Zinc 700
    inverseSurface: '#FAFAFA',
    inverseOnSurface: '#09090B',
    inversePrimary: DarkColors.primaryDark,
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(9, 9, 11, 0.8)',
    elevation: {
      level0: 'transparent',
      level1: '#18181B',              // Zinc 900 cards (shadcn exact)
      level2: '#18181B',              // Zinc 900 cards
      level3: '#27272A',              // Zinc 800 elevated cards
      level4: '#27272A',              // Zinc 800 elevated cards
      level5: '#27272A',              // Zinc 800 elevated cards
    },
  },
};

function AppContent() {
  const isDarkMode = useIsDarkMode();
  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  return (
    <PaperProvider theme={theme}>
      <Portal.Host>
        <RootNavigator />
        {/* Auto status bar adapts to theme */}
        <StatusBar style="auto" />
      </Portal.Host>
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
