/**
 * App Configuration
 * Central configuration for the application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.17:8080/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_DATA_KEY: 'user_data',
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Bike Health Tracker',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
};

export default {
  API_CONFIG,
  TOKEN_CONFIG,
  APP_CONFIG,
  VALIDATION,
  DATE_FORMATS,
};

