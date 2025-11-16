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
  TextInput,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore, useUser } from '../../store/authStore';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { ConfirmDialog, SuccessSnackbar, ErrorSnackbar } from '../../components/common';
import { APP_CONFIG } from '../../constants/config';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const authError = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  // Dialog states
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Snackbar states
  const [successMessage, setSuccessMessage] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);

  const handleEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const updateData: any = {};

      // Only include fields that have changed
      if (name.trim() !== user?.name) {
        updateData.name = name.trim();
      }
      if (email.trim() !== user?.email) {
        updateData.email = email.trim();
      }
      if (password.trim()) {
        updateData.password = password.trim();
      }

      // If nothing changed, just exit edit mode
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateProfile(updateData);
      setIsEditing(false);
      setPassword('');
      setSuccessMessage('Profile updated successfully!');
      setSuccessVisible(true);
    } catch (error: any) {
      // Error is handled by the store and shown via ErrorSnackbar
    }
  };

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setLogoutDialogVisible(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteDialogVisible(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccount();
      setDeleteDialogVisible(false);
    } catch (error) {
      console.error('Delete account error:', error);
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
          <View style={styles.cardHeader}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="account-circle"
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: 12, fontWeight: 'bold' }}>
                Profile Information
              </Text>
            </View>
            {!isEditing && (
              <Button mode="text" onPress={handleEdit} icon="pencil" compact>
                Edit
              </Button>
            )}
          </View>
          <Divider style={{ marginVertical: 16 }} />

          {!isEditing ? (
            // View Mode
            <View>
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
            </View>
          ) : (
            // Edit Mode
            <View>
              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />
              <TextInput
                label="New Password (optional)"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
              />
              <View style={styles.editActions}>
                <Button mode="outlined" onPress={handleCancelEdit} style={{ flex: 1, marginRight: 8 }}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={isLoading}
                  disabled={isLoading}
                  style={{ flex: 1, marginLeft: 8 }}
                >
                  Save
                </Button>
              </View>
            </View>
          )}
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

      {/* Danger Zone */}
      <Card style={styles.card} mode="elevated" elevation={1}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={24}
              color={theme.colors.error}
            />
            <Text variant="titleMedium" style={{ color: theme.colors.error, marginLeft: 12, fontWeight: 'bold' }}>
              Danger Zone
            </Text>
          </View>
          <Divider style={{ marginVertical: 16 }} />

          <Button
            mode="outlined"
            onPress={handleDeleteAccount}
            icon="delete-forever"
            textColor={theme.colors.error}
            style={styles.dangerButton}
            contentStyle={styles.dangerButtonContent}
          >
            Delete Account
          </Button>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Text>
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
        loading={isLoading}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete Account"
        message="Are you absolutely sure? This will permanently delete your account and all associated data. This action cannot be undone."
        confirmText="Delete Forever"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        onDismiss={() => setDeleteDialogVisible(false)}
        loading={isLoading}
      />

      {/* Success Snackbar */}
      <SuccessSnackbar
        visible={successVisible}
        message={successMessage}
        onDismiss={() => setSuccessVisible(false)}
      />

      {/* Error Snackbar */}
      <ErrorSnackbar
        visible={!!authError}
        message={authError || ''}
        onDismiss={() => useAuthStore.getState().clearError()}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  input: {
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  dangerButton: {
    borderColor: 'transparent',
  },
  dangerButtonContent: {
    paddingVertical: 8,
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

