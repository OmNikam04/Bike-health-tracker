/**
 * Auth API
 * Authentication endpoints
 */

import apiClient, { handleApiError } from './client';
import {
  LoginRequest,
  SignupRequest,
  RefreshTokenRequest,
  ApiError,
} from '../types/api.types';
import {
  LoginResponse,
  SignupResponse,
  RefreshTokenResponse,
  User,
} from '../types/models.types';
import axios from 'axios';

/**
 * Login
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/user/login', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Signup
 */
export const signup = async (userData: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await apiClient.post<SignupResponse>('/user/signup', userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Refresh Token
 */
export const refreshToken = async (
  refreshTokenData: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/user/refresh',
      refreshTokenData
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/user/logout');
  } catch (error) {
    // Even if logout fails on server, we'll clear local data
    console.error('Logout error:', error);
  }
};

/**
 * Get Current User
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/user/me');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Health Check (for testing connectivity)
 */
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await axios.get('https://unapposable-uncalmative-willow.ngrok-free.dev/health');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

