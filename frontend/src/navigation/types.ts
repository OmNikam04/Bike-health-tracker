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
  Home: undefined;
  // Add more screens here as we build them
};

// Root Stack (Auth or App)
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

