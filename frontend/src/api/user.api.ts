/**
 * User API Client
 * Handles all user-related API calls
 */

import apiClient, { handleApiError } from './client';
import { UpdateUserRequest } from '../types/api.types';
import { User, BackendSuccessResponse } from '../types/models.types';

/**
 * Update current user profile
 * PUT /api/v1/user/me
 */
export const updateUser = async (userData: UpdateUserRequest): Promise<User> => {
  try {
    const response = await apiClient.put<BackendSuccessResponse<User>>(
      '/user/me',
      userData
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Update user error:', apiError.message);
    throw apiError;
  }
};

/**
 * Delete current user account
 * DELETE /api/v1/user/me
 */
export const deleteUser = async (): Promise<void> => {
  try {
    await apiClient.delete('/user/me');
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('❌ Delete user error:', apiError.message);
    throw apiError;
  }
};

