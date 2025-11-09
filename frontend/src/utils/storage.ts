/**
 * Secure Storage Utilities
 * Handles token storage using Expo SecureStore
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

/**
 * Secure Token Storage (uses SecureStore for sensitive data)
 */

export const saveAccessToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('Failed to save access token:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Failed to save refresh token:', error);
    throw error;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await Promise.all([
      saveAccessToken(accessToken),
      saveRefreshToken(refreshToken),
    ]);
  } catch (error) {
    console.error('Failed to save tokens:', error);
    throw error;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
    ]);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
    throw error;
  }
};

/**
 * User Data Storage (uses AsyncStorage for non-sensitive data)
 */

export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to save user data:', error);
    throw error;
  }
};

export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.USER_DATA);
  } catch (error) {
    console.error('Failed to clear user data:', error);
    throw error;
  }
};

/**
 * Clear all auth data
 */
export const clearAllAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      clearTokens(),
      clearUserData(),
    ]);
  } catch (error) {
    console.error('Failed to clear all auth data:', error);
    throw error;
  }
};

