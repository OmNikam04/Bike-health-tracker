/**
 * Navigation Types
 * Type definitions for React Navigation
 */

// Auth Stack (Login, Signup)
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// App Stack (Main app screens - authenticated)
export type AppStackParamList = {
  MainTabs: undefined;
  AddBike: undefined;
  BikeDetails: { bikeId: string };
  AddFuelLog: { bikeId: string };
  FuelLogDetails: { bikeId: string; fuelLogId: string };
};

// Root Stack (Auth or App)
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

