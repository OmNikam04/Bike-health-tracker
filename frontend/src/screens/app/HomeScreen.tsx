/**
 * Home Screen
 * Main screen for authenticated users
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, useTheme, Divider } from 'react-native-paper';
import { useAuthStore, useUser } from '../../store/authStore';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export default function HomeScreen() {
  const theme = useTheme();
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            Welcome! 🎉
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
            {user?.name}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {user?.email}
          </Text>
        </Surface>

        {/* Theme Toggle */}
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Theme Settings
          </Text>
          <ThemeToggle />
        </Surface>

        {/* User Info */}
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Account Information
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              User ID:
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {user?.id}
            </Text>
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Member since:
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </Surface>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
          buttonColor={theme.colors.error}
        >
          Logout
        </Button>

        {/* Coming Soon */}
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            🚧 More features coming soon! 🚧
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}>
            Bike management, fuel logs, and more...
          </Text>
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  surface: {
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

