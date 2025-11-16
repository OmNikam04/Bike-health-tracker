/**
 * Fuel Log API Client
 * Handles all fuel log-related API calls
 */

import apiClient, { handleApiError } from './client';
import {
  FuelLog,
  CreateFuelLogRequest,
  UpdateFuelLogRequest,
  FuelLogListResponseData,
  FuelStats,
  BackendSuccessResponse,
} from '../types/models.types';

/**
 * Create a new fuel log
 * POST /api/v1/bikes/:bike_id/fuel-logs
 */
export const createFuelLog = async (
  bikeId: string,
  fuelLogData: CreateFuelLogRequest
): Promise<FuelLog> => {
  try {
    const response = await apiClient.post<BackendSuccessResponse<FuelLog>>(
      `/bikes/${bikeId}/fuel-logs`,
      fuelLogData
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Create fuel log error:', apiError.message);
    throw apiError;
  }
};

/**
 * Get all fuel logs for a bike
 * GET /api/v1/bikes/:bike_id/fuel-logs
 */
export const listFuelLogs = async (bikeId: string): Promise<FuelLogListResponseData> => {
  try {
    const response = await apiClient.get<BackendSuccessResponse<FuelLogListResponseData>>(
      `/bikes/${bikeId}/fuel-logs`
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ List fuel logs error:', apiError.message);
    throw apiError;
  }
};

/**
 * Get a specific fuel log by ID
 * GET /api/v1/bikes/:bike_id/fuel-logs/:id
 */
export const getFuelLog = async (bikeId: string, fuelLogId: string): Promise<FuelLog> => {
  try {
    const response = await apiClient.get<BackendSuccessResponse<FuelLog>>(
      `/bikes/${bikeId}/fuel-logs/${fuelLogId}`
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Get fuel log error:', apiError.message);
    throw apiError;
  }
};

/**
 * Update a fuel log
 * PUT /api/v1/bikes/:bike_id/fuel-logs/:id
 */
export const updateFuelLog = async (
  bikeId: string,
  fuelLogId: string,
  fuelLogData: UpdateFuelLogRequest
): Promise<FuelLog> => {
  try {
    const response = await apiClient.put<BackendSuccessResponse<FuelLog>>(
      `/bikes/${bikeId}/fuel-logs/${fuelLogId}`,
      fuelLogData
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Update fuel log error:', apiError.message);
    throw apiError;
  }
};

/**
 * Delete a fuel log
 * DELETE /api/v1/bikes/:bike_id/fuel-logs/:id
 */
export const deleteFuelLog = async (bikeId: string, fuelLogId: string): Promise<void> => {
  try {
    await apiClient.delete(`/bikes/${bikeId}/fuel-logs/${fuelLogId}`);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Delete fuel log error:', apiError.message);
    throw apiError;
  }
};

/**
 * Get fuel statistics for a bike
 * GET /api/v1/bikes/:bike_id/fuel-stats
 */
export const getFuelStats = async (bikeId: string): Promise<FuelStats> => {
  try {
    const response = await apiClient.get<BackendSuccessResponse<FuelStats>>(
      `/bikes/${bikeId}/fuel-stats`
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Get fuel stats error:', apiError.message);
    throw apiError;
  }
};

