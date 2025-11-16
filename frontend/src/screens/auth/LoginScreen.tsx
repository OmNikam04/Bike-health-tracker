/**
 * Login Screen
 * Beautiful login UI with form validation
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { validateLoginForm } from '../../utils/validation';
import type { LoginFormData, LoginFormErrors } from '../../types/api.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const theme = useTheme();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Clear previous errors
    clearError();
    setErrors({});

    // Validate form
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Attempt login
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      // Navigation will be handled by RootNavigator based on auth state
    } catch (error) {
      // Error is already set in the store
      console.log('Login failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={2}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
              Welcome Back
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Sign in to continue
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!errors.email}
              disabled={isLoading}
              left={<TextInput.Icon icon="email" />}
            />
            {errors.email && (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.email}
              </Text>
            )}

            {/* Password Input */}
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              error={!!errors.password}
              disabled={isLoading}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {errors.password && (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.password}
              </Text>
            )}

            {/* API Error */}
            {authError && (
              <Surface style={[styles.errorSurface, { backgroundColor: theme.colors.errorContainer }]} elevation={0}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                  {authError}
                </Text>
              </Surface>
            )}

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Don't have an account?{' '}
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Signup')}
                disabled={isLoading}
                compact
              >
                Sign Up
              </Button>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    borderRadius: 16,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  form: {
    gap: 16,
  },
  errorText: {
    marginTop: -12,
    marginLeft: 12,
  },
  errorSurface: {
    padding: 12,
    borderRadius: 8,
  },
  loginButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});

