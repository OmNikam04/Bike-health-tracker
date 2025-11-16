/**
 * API Client
 * Axios instance with interceptors for authentication
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../constants/config';
import { getAccessToken, getRefreshToken, saveTokens, clearAllAuthData } from '../utils/storage';
import { ApiError } from '../types/api.types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Request Interceptor
 * Adds access token to all requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles token refresh on 401 errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          // No refresh token, logout user
          await clearAllAuthData();
          processQueue(new Error('No refresh token available'), null);
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/user/refresh`,
          { refresh_token: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { token, refresh_token } = response.data.data;

        // Save new tokens
        await saveTokens(token, refresh_token);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        // Process queued requests
        processQueue(null, token);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        await clearAllAuthData();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

/**
 * Error Handler
 * Converts axios errors to ApiError format
 */
export const handleApiError = (error: any): ApiError => {
  console.log('🔍 API Error Details:', {
    isAxiosError: axios.isAxiosError(error),
    response: error?.response?.data,
    status: error?.response?.status,
    message: error?.message,
  });

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (axiosError.response) {
      // Server responded with error
      const responseData = axiosError.response.data;

      // Try to extract error message from various response formats
      // Priority: error field (backend validation errors) > message field > default
      let errorMessage = 'An error occurred';

      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData?.error) {
        // Backend sends validation errors in 'error' field
        errorMessage = responseData.error;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.errors) {
        // Handle array of errors
        if (Array.isArray(responseData.errors)) {
          errorMessage = responseData.errors.join(', ');
        } else {
          errorMessage = JSON.stringify(responseData.errors);
        }
      }

      console.log('✅ Extracted error message:', errorMessage);

      return {
        message: errorMessage,
        error: responseData?.error,
        statusCode: axiosError.response.status,
      };
    } else if (axiosError.request) {
      // Request made but no response
      return {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      };
    }
  }

  // Unknown error
  return {
    message: error?.message || 'An unexpected error occurred',
  };
};

export default apiClient;

