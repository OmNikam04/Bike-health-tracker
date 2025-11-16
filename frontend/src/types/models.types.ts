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

// Fuel Log Model (matches backend FuelLogResponse)
export interface FuelLog {
  id: string; // UUID
  bike_id: string; // UUID
  date: string; // ISO 8601 datetime
  odometer_reading: number;
  liters: number;
  price_per_liter: number;
  total_cost: number; // calculated
  fuel_type: string; // "petrol", "diesel"
  mileage?: number | null; // calculated
  distance_covered?: number | null; // calculated
  is_full_tank: boolean;
  location: string;
  notes: string;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

// Create Fuel Log Request
export interface CreateFuelLogRequest {
  date: string; // ISO 8601 datetime
  odometer_reading: number; // required, min=0
  liters: number; // required, min=0
  price_per_liter: number; // required, min=0
  fuel_type?: string; // "petrol" | "diesel"
  is_full_tank?: boolean;
  location?: string;
  notes?: string;
}

// Update Fuel Log Request (all fields optional)
export interface UpdateFuelLogRequest {
  date?: string; // ISO 8601 datetime
  odometer_reading?: number;
  liters?: number;
  price_per_liter?: number;
  fuel_type?: string;
  is_full_tank?: boolean;
  location?: string;
  notes?: string;
}

// Fuel Log List Response Data
export interface FuelLogListResponseData {
  fuel_logs: FuelLog[];
  total: number;
}

// Fuel Stats Response
export interface FuelStats {
  bike_id: string; // UUID
  total_fuel_logs: number;
  total_liters: number;
  total_cost: number;
  total_distance: number;
  average_mileage?: number | null;
  latest_mileage?: number | null;
  best_mileage?: number | null;
  worst_mileage?: number | null;
  average_cost_per_km?: number | null;
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

// Signup Response Data (inside SuccessResponse.data)
export interface SignupResponseData {
  user: User;
  token: string;
  refresh_token: string;
}

// Signup Response (full response from backend)
export interface SignupResponse {
  success: boolean;
  data: SignupResponseData;
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

