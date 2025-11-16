/**
 * Profile Screen
 * User profile, settings, and app information
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  List,
  Divider,
  useTheme,
  Button,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore, useUser } from '../../store/authStore';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { ConfirmDialog } from '../../components/common';
import { APP_CONFIG } from '../../constants/config';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setLogoutDialogVisible(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* User Info Card */}
      <Card style={styles.card} mode="elevated" elevation={1}>
        <Card.Content>
          <View style={styles.userHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons
                name="account"
                size={48}
                color={theme.colors.onPrimaryContainer}
              />
            </View>
            <View style={styles.userInfo}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                {user?.name || 'User'}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.email || 'email@example.com'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Theme Settings */}
      <Card style={styles.card} mode="elevated" elevation={1}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="palette"
              size={24}
              color={theme.colors.primary}
            />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: 12, fontWeight: 'bold' }}>
              Theme
            </Text>
          </View>
          <Divider style={{ marginVertical: 16 }} />
          <ThemeToggle />
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.card} mode="elevated" elevation={1}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={theme.colors.primary}
            />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: 12, fontWeight: 'bold' }}>
              App Information
            </Text>
          </View>
          <Divider style={{ marginVertical: 16 }} />
          <List.Item
            title="App Name"
            description={APP_CONFIG.NAME}
            left={(props) => <List.Icon {...props} icon="motorbike" />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <List.Item
            title="Version"
            description={APP_CONFIG.VERSION}
            left={(props) => <List.Icon {...props} icon="tag" />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <List.Item
            title="Environment"
            description={APP_CONFIG.ENVIRONMENT}
            left={(props) => <List.Icon {...props} icon="cog" />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button
        mode="contained"
        onPress={handleLogout}
        icon="logout"
        buttonColor={theme.colors.error}
        textColor={theme.colors.onError}
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
      >
        Logout
      </Button>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        visible={logoutDialogVisible}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onDismiss={() => setLogoutDialogVisible(false)}
        loading={isLoggingOut}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

