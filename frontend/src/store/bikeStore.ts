/**
 * Bike Store (Zustand)
 * Manages bike state and CRUD operations
 */

import { create } from 'zustand';
import { Bike, CreateBikeRequest, UpdateBikeRequest } from '../types/models.types';
import * as bikeApi from '../api/bike.api';
import { ApiError } from '../types/api.types';

interface BikeState {
  // State
  bikes: Bike[];
  selectedBike: Bike | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBikes: () => Promise<void>;
  createBike: (bikeData: CreateBikeRequest) => Promise<Bike>;
  getBike: (bikeId: string) => Promise<void>;
  updateBike: (bikeId: string, bikeData: UpdateBikeRequest) => Promise<Bike>;
  deleteBike: (bikeId: string) => Promise<void>;
  setSelectedBike: (bike: Bike | null) => void;
  clearError: () => void;
}

export const useBikeStore = create<BikeState>((set, get) => ({
  // Initial State
  bikes: [],
  selectedBike: null,
  isLoading: false,
  error: null,

  // Fetch all bikes for the current user
  fetchBikes: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await bikeApi.listMyBikes();
      
      set({
        bikes: response.bikes,
        isLoading: false,
        error: null,
      });

      console.log('✅ Fetched bikes:', response.total);
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to fetch bikes',
      });
      console.error('❌ Fetch bikes failed:', apiError.message);
      throw error;
    }
  },

  // Create a new bike
  createBike: async (bikeData: CreateBikeRequest) => {
    set({ isLoading: true, error: null });

    try {
      const newBike = await bikeApi.createBike(bikeData);

      // Add the new bike to the list
      set((state) => ({
        bikes: [newBike, ...state.bikes],
        isLoading: false,
        error: null,
      }));

      console.log('✅ Bike created:', newBike.id);
      return newBike;
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to create bike',
      });
      console.error('❌ Create bike failed:', apiError.message);
      throw error;
    }
  },

  // Get a specific bike by ID
  getBike: async (bikeId: string) => {
    set({ isLoading: true, error: null });

    try {
      const bike = await bikeApi.getBike(bikeId);

      set({
        selectedBike: bike,
        isLoading: false,
        error: null,
      });

      console.log('✅ Fetched bike:', bike.id);
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to fetch bike',
      });
      console.error('❌ Get bike failed:', apiError.message);
      throw error;
    }
  },

  // Update a bike
  updateBike: async (bikeId: string, bikeData: UpdateBikeRequest) => {
    set({ isLoading: true, error: null });

    try {
      const updatedBike = await bikeApi.updateBike(bikeId, bikeData);

      // Update the bike in the list
      set((state) => ({
        bikes: state.bikes.map((bike) =>
          bike.id === bikeId ? updatedBike : bike
        ),
        selectedBike: state.selectedBike?.id === bikeId ? updatedBike : state.selectedBike,
        isLoading: false,
        error: null,
      }));

      console.log('✅ Bike updated:', updatedBike.id);
      return updatedBike;
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to update bike',
      });
      console.error('❌ Update bike failed:', apiError.message);
      throw error;
    }
  },

  // Delete a bike
  deleteBike: async (bikeId: string) => {
    set({ isLoading: true, error: null });

    try {
      await bikeApi.deleteBike(bikeId);

      // Remove the bike from the list
      set((state) => ({
        bikes: state.bikes.filter((bike) => bike.id !== bikeId),
        selectedBike: state.selectedBike?.id === bikeId ? null : state.selectedBike,
        isLoading: false,
        error: null,
      }));

      console.log('✅ Bike deleted:', bikeId);
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to delete bike',
      });
      console.error('❌ Delete bike failed:', apiError.message);
      throw error;
    }
  },

  // Set selected bike
  setSelectedBike: (bike: Bike | null) => {
    set({ selectedBike: bike });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

