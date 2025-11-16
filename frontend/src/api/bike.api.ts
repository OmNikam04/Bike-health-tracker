/**
 * Bike API Client
 * Handles all bike-related API calls
 */

import apiClient, { handleApiError } from './client';
import {
  Bike,
  CreateBikeRequest,
  UpdateBikeRequest,
  BikeListResponseData,
  BackendSuccessResponse,
} from '../types/models.types';

/**
 * Create a new bike
 * POST /api/v1/bikes
 */
export const createBike = async (bikeData: CreateBikeRequest): Promise<Bike> => {
  try {
    const response = await apiClient.post<BackendSuccessResponse<Bike>>(
      '/bikes',
      bikeData
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Create bike error:', apiError.message);
    throw apiError;
  }
};

/**
 * Get all bikes for the current user
 * GET /api/v1/bikes
 */
export const listMyBikes = async (): Promise<BikeListResponseData> => {
  try {
    const response = await apiClient.get<BackendSuccessResponse<BikeListResponseData>>(
      '/bikes'
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ List bikes error:', apiError.message);
    throw apiError;
  }
};

/**
 * Get a specific bike by ID
 * GET /api/v1/bikes/:id
 */
export const getBike = async (bikeId: string): Promise<Bike> => {
  try {
    const response = await apiClient.get<BackendSuccessResponse<Bike>>(
      `/bikes/${bikeId}`
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Get bike error:', apiError.message);
    throw apiError;
  }
};

/**
 * Update a bike
 * PUT /api/v1/bikes/:id
 */
export const updateBike = async (
  bikeId: string,
  bikeData: UpdateBikeRequest
): Promise<Bike> => {
  try {
    const response = await apiClient.put<BackendSuccessResponse<Bike>>(
      `/bikes/${bikeId}`,
      bikeData
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Update bike error:', apiError.message);
    throw apiError;
  }
};

/**
 * Delete a bike
 * DELETE /api/v1/bikes/:id
 */
export const deleteBike = async (bikeId: string): Promise<void> => {
  try {
    await apiClient.delete(`/bikes/${bikeId}`);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Delete bike error:', apiError.message);
    throw apiError;
  }
};

