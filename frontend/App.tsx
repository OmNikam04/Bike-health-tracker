import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme, Text, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useIsDarkMode } from './src/store/themeStore';
import { getColors } from './src/constants/theme';
import { ThemeToggle } from './src/components/common/ThemeToggle';

function AppContent() {
  const isDarkMode = useIsDarkMode();
  const colors = getColors(isDarkMode);

  // Custom theme based on our color scheme
  const theme = {
    ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDarkMode ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: colors.primary,
      secondary: colors.secondary,
      tertiary: colors.accent,
      background: colors.background,
      surface: colors.surface,
      error: colors.error,
      onPrimary: colors.textOnPrimary,
      onSurface: colors.text,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemeToggle />
        <Text variant="headlineLarge" style={[styles.title, { color: colors.primary }]}>
          🏍️ Bike Health Tracker
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: colors.textSecondary }]}>
          Phase 1: Foundation Complete! ✅
        </Text>
        <Text variant="bodyMedium" style={[styles.description, { color: colors.textLight }]}>
          Now with Zustand State Management 🐻
        </Text>
        <Button
          mode="contained"
          onPress={() => console.log('Ready for Phase 2!')}
          style={styles.button}
        >
          Get Started
        </Button>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
});
