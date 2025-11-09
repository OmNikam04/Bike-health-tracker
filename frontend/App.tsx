import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme, Text, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useIsDarkMode } from './src/store/themeStore';
import { getColors } from './src/constants/theme';
import { ThemeToggle } from './src/components/common/ThemeToggle';
import { healthCheck } from './src/api/auth.api';
import { useState } from 'react';

function AppContent() {
  const isDarkMode = useIsDarkMode();
  const colors = getColors(isDarkMode);
  const [apiStatus, setApiStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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

  const testBackendConnection = async () => {
    setIsLoading(true);
    setApiStatus('Testing...');

    try {
      const response = await healthCheck();
      setApiStatus(`✅ Connected! ${response.message || 'Backend is healthy'}`);
      console.log('Backend health check:', response);
    } catch (error: any) {
      setApiStatus(`❌ Failed: ${error.message || 'Cannot reach backend'}`);
      console.error('Backend health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemeToggle />
        <Text variant="headlineLarge" style={[styles.title, { color: colors.primary }]}>
          🏍️ Bike Health Tracker
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: colors.textSecondary }]}>
          Phase 2: API Client Setup ⚙️
        </Text>
        <Text variant="bodyMedium" style={[styles.description, { color: colors.textLight }]}>
          Testing Backend Connectivity
        </Text>

        <Button
          mode="contained"
          onPress={testBackendConnection}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Test Backend Connection
        </Button>

        {apiStatus ? (
          <Text
            variant="bodyMedium"
            style={[styles.status, { color: apiStatus.startsWith('✅') ? colors.success : colors.error }]}
          >
            {apiStatus}
          </Text>
        ) : null}

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
  status: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
