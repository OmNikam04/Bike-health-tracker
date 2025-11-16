/**
 * Signup Screen
 * Beautiful signup UI with form validation
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { validateSignupForm } from '../../utils/validation';
import type { SignupFormData, SignupFormErrors } from '../../types/api.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const theme = useTheme();
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    // Clear previous errors
    clearError();
    setErrors({});

    // Validate form
    const validationErrors = validateSignupForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Attempt signup
    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      // Navigation will be handled by RootNavigator based on auth state
    } catch (error) {
      // Error is already set in the store
      console.log('Signup failed:', error);
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
              Create Account
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Sign up to get started
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <TextInput
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              mode="outlined"
              autoCapitalize="words"
              autoComplete="name"
              error={!!errors.name}
              disabled={isLoading}
              left={<TextInput.Icon icon="account" />}
            />
            {errors.name && (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.name}
              </Text>
            )}

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
              autoComplete="password-new"
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

            {/* Confirm Password Input */}
            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, confirmPassword: text });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              error={!!errors.confirmPassword}
              disabled={isLoading}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {errors.confirmPassword && (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.confirmPassword}
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

            {/* Signup Button */}
            <Button
              mode="contained"
              onPress={handleSignup}
              loading={isLoading}
              disabled={isLoading}
              style={styles.signupButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Already have an account?{' '}
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                disabled={isLoading}
                compact
              >
                Sign In
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
  signupButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});

