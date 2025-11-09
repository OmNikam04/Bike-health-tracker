/**
 * Data Models
 * TypeScript interfaces for backend models
 */

// User Model
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
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

// Login Response
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Signup Response
export interface SignupResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Refresh Token Response
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

