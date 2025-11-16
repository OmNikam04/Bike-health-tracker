/**
 * Data Models
 * TypeScript interfaces for backend models
 */

// User Model
export interface User {
  id: string; // UUID from backend
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Bike Model
export interface Bike {
  id: number;
  userId: number;
  name: string;
  model: string;
  registrationNumber: string;
  purchaseDate: string;
  initialOdometer: number;
  createdAt: string;
  updatedAt: string;
}

// Fuel Log Model
export interface FuelLog {
  id: number;
  bikeId: number;
  date: string;
  odometer: number;
  fuelAmount: number;
  cost: number;
  fuelType: string;
  notes?: string;
  mileage?: number;
  createdAt: string;
  updatedAt: string;
}

// Auth Tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Backend wraps responses in this format
export interface BackendSuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Login Response Data (inside SuccessResponse.data)
export interface LoginResponseData {
  user: User;
  token: string;
  refresh_token: string;
}

// Login Response (full response from backend)
export interface LoginResponse {
  success: boolean;
  data: LoginResponseData;
  message?: string;
}

// Signup Response (full response from backend)
// Note: Backend only returns user data, not tokens
// Tokens are obtained via separate login call
export interface SignupResponse {
  success: boolean;
  data: User; // Backend returns User directly, not wrapped
  message?: string;
}

// Refresh Token Response Data
export interface RefreshTokenResponseData {
  token: string;
  refresh_token: string;
}

// Refresh Token Response (full response from backend)
export interface RefreshTokenResponse {
  success: boolean;
  data: RefreshTokenResponseData;
  message?: string;
}

