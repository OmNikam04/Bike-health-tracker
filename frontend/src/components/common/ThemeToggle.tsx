import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { useThemeStore, useIsDarkMode } from '../../store/themeStore';
import { getColors } from '../../constants/theme';

export const ThemeToggle: React.FC = () => {
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const isDarkMode = useIsDarkMode();
  const colors = getColors(isDarkMode);
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleThemeChange = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
    closeMenu();
  };

  const getIcon = () => {
    if (themeMode === 'auto') return 'theme-light-dark';
    return isDarkMode ? 'weather-night' : 'weather-sunny';
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon={getIcon()}
            size={24}
            onPress={openMenu}
            iconColor={colors.text}
          />
        }
      >
        <Menu.Item
          onPress={() => handleThemeChange('light')}
          title="Light"
          leadingIcon="weather-sunny"
          trailingIcon={themeMode === 'light' ? 'check' : undefined}
        />
        <Menu.Item
          onPress={() => handleThemeChange('dark')}
          title="Dark"
          leadingIcon="weather-night"
          trailingIcon={themeMode === 'dark' ? 'check' : undefined}
        />
        <Menu.Item
          onPress={() => handleThemeChange('auto')}
          title="Auto"
          leadingIcon="theme-light-dark"
          trailingIcon={themeMode === 'auto' ? 'check' : undefined}
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 10,
    zIndex: 1000,
  },
});

