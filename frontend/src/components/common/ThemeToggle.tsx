import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Menu, useTheme, SegmentedButtons } from 'react-native-paper';
import { useThemeStore, useIsDarkMode } from '../../store/themeStore';

export const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);

  // In light mode: selected = white text on slate 900 background
  // In dark mode: selected = dark text on slate 50 background
  const checkedColor = isDarkMode ? '#0F172A' : '#FFFFFF'; // Dark text in dark mode, white in light mode
  const uncheckedColor = theme.colors.onSurface; // Normal text for unselected

  return (
    <SegmentedButtons
      value={themeMode}
      onValueChange={(value) => setThemeMode(value as 'light' | 'dark' | 'auto')}
      buttons={[
        {
          value: 'light',
          label: 'Light',
          icon: 'weather-sunny',
          checkedColor: checkedColor,
          uncheckedColor: uncheckedColor,
          style: themeMode === 'light' ? { backgroundColor: theme.colors.primary } : undefined,
        },
        {
          value: 'dark',
          label: 'Dark',
          icon: 'weather-night',
          checkedColor: checkedColor,
          uncheckedColor: uncheckedColor,
          style: themeMode === 'dark' ? { backgroundColor: theme.colors.primary } : undefined,
        },
        {
          value: 'auto',
          label: 'Auto',
          icon: 'theme-light-dark',
          checkedColor: checkedColor,
          uncheckedColor: uncheckedColor,
          style: themeMode === 'auto' ? { backgroundColor: theme.colors.primary } : undefined,
        },
      ]}
      style={{ backgroundColor: theme.colors.surface }}
    />
  );
};

