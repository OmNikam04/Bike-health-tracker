/**
 * Auth API
 * Authentication endpoints
 */

import axios from 'axios';
import apiClient, { handleApiError } from './client';
import { API_CONFIG } from '../constants/config';
import {
  LoginRequest,
  SignupRequest,
  RefreshTokenRequest,
} from '../types/api.types';
import {
  LoginResponse,
  SignupResponse,
  RefreshTokenResponse,
  User,
} from '../types/models.types';

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
export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await apiClient.post('/user/logout', {
      refresh_token: refreshToken,
    });
  } catch (error) {
    // Even if logout fails on server, we'll clear local data
    console.error('Logout error:', error);
    throw error;
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
    // Remove /api/v1 from base URL to get the root health endpoint
    const baseUrl = API_CONFIG.BASE_URL.replace('/api/v1', '');
    const healthUrl = `${baseUrl}/health`;

    console.log('🔍 Health check URL:', healthUrl);
    console.log('🔍 API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);

    const response = await axios.get(healthUrl);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

