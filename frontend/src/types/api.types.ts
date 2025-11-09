/**
 * API Request/Response Types
 */

// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Generic API Error
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Bike Request Types
export interface CreateBikeRequest {
  name: string;
  model: string;
  registrationNumber: string;
  purchaseDate: string;
  initialOdometer: number;
}

export interface UpdateBikeRequest {
  name?: string;
  model?: string;
  registrationNumber?: string;
  purchaseDate?: string;
  initialOdometer?: number;
}

// Fuel Log Request Types
export interface CreateFuelLogRequest {
  bikeId: number;
  date: string;
  odometer: number;
  fuelAmount: number;
  cost: number;
  fuelType: string;
  notes?: string;
}

export interface UpdateFuelLogRequest {
  date?: string;
  odometer?: number;
  fuelAmount?: number;
  cost?: number;
  fuelType?: string;
  notes?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

