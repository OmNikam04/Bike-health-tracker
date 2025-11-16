/**
 * Fuel Log Store (Zustand)
 * Manages fuel log state and CRUD operations
 */

import { create } from 'zustand';
import {
  FuelLog,
  CreateFuelLogRequest,
  UpdateFuelLogRequest,
  FuelStats,
} from '../types/models.types';
import * as fuelLogApi from '../api/fuelLog.api';
import { ApiError } from '../types/api.types';

interface FuelLogState {
  // State
  fuelLogs: FuelLog[];
  selectedFuelLog: FuelLog | null;
  fuelStats: FuelStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFuelLogs: (bikeId: string) => Promise<void>;
  createFuelLog: (bikeId: string, fuelLogData: CreateFuelLogRequest) => Promise<FuelLog>;
  getFuelLog: (bikeId: string, fuelLogId: string) => Promise<void>;
  updateFuelLog: (
    bikeId: string,
    fuelLogId: string,
    fuelLogData: UpdateFuelLogRequest
  ) => Promise<FuelLog>;
  deleteFuelLog: (bikeId: string, fuelLogId: string) => Promise<void>;
  fetchFuelStats: (bikeId: string) => Promise<void>;
  setSelectedFuelLog: (fuelLog: FuelLog | null) => void;
  clearError: () => void;
  clearFuelLogs: () => void;
}

export const useFuelLogStore = create<FuelLogState>((set, get) => ({
  // Initial state
  fuelLogs: [],
  selectedFuelLog: null,
  fuelStats: null,
  isLoading: false,
  error: null,

  // Fetch all fuel logs for a bike
  fetchFuelLogs: async (bikeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fuelLogApi.listFuelLogs(bikeId);
      set({
        fuelLogs: response.fuel_logs,
        isLoading: false,
        error: null,
      });
      console.log('✅ Fetched fuel logs:', response.total);
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to fetch fuel logs',
      });
      console.error('❌ Fetch fuel logs failed:', apiError.message);
      throw error;
    }
  },

  // Create a new fuel log
  createFuelLog: async (bikeId: string, fuelLogData: CreateFuelLogRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newFuelLog = await fuelLogApi.createFuelLog(bikeId, fuelLogData);
      set((state) => ({
        fuelLogs: [newFuelLog, ...state.fuelLogs],
        isLoading: false,
        error: null,
      }));
      console.log('✅ Fuel log created:', newFuelLog.id);
      return newFuelLog;
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to create fuel log',
      });
      console.error('❌ Create fuel log failed:', apiError.message);
      throw error;
    }
  },

  // Get a specific fuel log
  getFuelLog: async (bikeId: string, fuelLogId: string) => {
    set({ isLoading: true, error: null });
    try {
      const fuelLog = await fuelLogApi.getFuelLog(bikeId, fuelLogId);
      set({
        selectedFuelLog: fuelLog,
        isLoading: false,
        error: null,
      });
      console.log('✅ Fetched fuel log:', fuelLogId);
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to fetch fuel log',
      });
      console.error('❌ Fetch fuel log failed:', apiError.message);
      throw error;
    }
  },

  // Update a fuel log
  updateFuelLog: async (
    bikeId: string,
    fuelLogId: string,
    fuelLogData: UpdateFuelLogRequest
  ) => {
    set({ isLoading: true, error: null });
    try {
      const updatedFuelLog = await fuelLogApi.updateFuelLog(bikeId, fuelLogId, fuelLogData);
      set((state) => ({
        fuelLogs: state.fuelLogs.map((log) =>
          log.id === fuelLogId ? updatedFuelLog : log
        ),
        selectedFuelLog: updatedFuelLog,
        isLoading: false,
        error: null,
      }));
      console.log('✅ Fuel log updated:', fuelLogId);
      return updatedFuelLog;
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to update fuel log',
      });
      console.error('❌ Update fuel log failed:', apiError.message);
      throw error;
    }
  },

  // Delete a fuel log
  deleteFuelLog: async (bikeId: string, fuelLogId: string) => {
    set({ isLoading: true, error: null });
    try {
      await fuelLogApi.deleteFuelLog(bikeId, fuelLogId);
      set((state) => ({
        fuelLogs: state.fuelLogs.filter((log) => log.id !== fuelLogId),
        selectedFuelLog: null,
        isLoading: false,
        error: null,
      }));
      console.log('✅ Fuel log deleted:', fuelLogId);
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to delete fuel log',
      });
      console.error('❌ Delete fuel log failed:', apiError.message);
      throw error;
    }
  },

  // Fetch fuel statistics
  fetchFuelStats: async (bikeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await fuelLogApi.getFuelStats(bikeId);
      set({
        fuelStats: stats,
        isLoading: false,
        error: null,
      });
      console.log('✅ Fetched fuel stats for bike:', bikeId);
    } catch (error: any) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to fetch fuel stats',
      });
      console.error('❌ Fetch fuel stats failed:', apiError.message);
      throw error;
    }
  },

  // Set selected fuel log
  setSelectedFuelLog: (fuelLog: FuelLog | null) => {
    set({ selectedFuelLog: fuelLog });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Clear fuel logs (when switching bikes)
  clearFuelLogs: () => {
    set({ fuelLogs: [], selectedFuelLog: null, fuelStats: null });
  },
}));

