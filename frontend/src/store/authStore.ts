/**
 * Auth Store (Zustand)
 * Manages authentication state and actions
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginResponse, SignupResponse } from '../types/models.types';
import { LoginRequest, SignupRequest, ApiError } from '../types/api.types';
import * as authApi from '../api/auth.api';
import { saveTokens, clearAllAuthData, saveUserData, getRefreshToken } from '../utils/storage';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login Action
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response: LoginResponse = await authApi.login(credentials);

          // Extract data from backend response
          const { user, token, refresh_token } = response.data;

          // Save tokens securely
          await saveTokens(token, refresh_token);

          // Save user data
          await saveUserData(user);

          // Update state
          set({
            user: user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('✅ Login successful:', user.email);
        } catch (error: any) {
          const apiError = error as ApiError;
          set({
            isLoading: false,
            error: apiError.message || 'Login failed',
            isAuthenticated: false,
            user: null,
          });
          console.error('❌ Login failed:', apiError.message);
          throw error;
        }
      },

      // Signup Action
      signup: async (userData: SignupRequest) => {
        set({ isLoading: true, error: null });

        try {
          // Step 1: Create the user account
          const signupResponse: SignupResponse = await authApi.signup(userData);
          console.log('✅ User account created:', signupResponse.data.email);

          // Step 2: Auto-login with the same credentials
          const loginResponse: LoginResponse = await authApi.login({
            email: userData.email,
            password: userData.password,
          });

          // Extract data from login response
          const { user, token, refresh_token } = loginResponse.data;

          // Save tokens securely
          await saveTokens(token, refresh_token);

          // Save user data
          await saveUserData(user);

          // Update state
          set({
            user: user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('✅ Signup and auto-login successful:', user.email);
        } catch (error: any) {
          const apiError = error as ApiError;
          set({
            isLoading: false,
            error: apiError.message || 'Signup failed',
            isAuthenticated: false,
            user: null,
          });
          console.error('❌ Signup failed:', apiError.message);
          throw error;
        }
      },

      // Logout Action
      logout: async () => {
        set({ isLoading: true });

        try {
          // Get refresh token before clearing
          const refreshToken = await getRefreshToken();
          console.log('🔑 Refresh token for logout:', refreshToken ? 'Found' : 'Not found');

          // Call logout API to revoke refresh token on server
          if (refreshToken) {
            await authApi.logout(refreshToken);
            console.log('✅ Logout API call successful');
          }
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          // Clear all auth data
          await clearAllAuthData();

          // Reset state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          console.log('✅ Logged out successfully');
        }
      },

      // Clear Error
      clearError: () => {
        set({ error: null });
      },

      // Set User (for manual updates)
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user and isAuthenticated (not tokens - they're in SecureStore)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors (for optimized re-renders)
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

