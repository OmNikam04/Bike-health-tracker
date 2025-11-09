/**
 * Theme Constants
 * Modern color scheme with blue/teal palette for a tech-forward look
 * Supports both light and dark modes
 */

// Light Theme Colors
export const LightColors = {
  // Primary Colors
  primary: '#0066FF',        // Vibrant Blue
  primaryLight: '#3385FF',   // Lighter Blue
  primaryDark: '#0052CC',    // Darker Blue

  // Secondary Colors
  secondary: '#00D9FF',      // Bright Teal
  secondaryLight: '#33E0FF', // Lighter Teal
  secondaryDark: '#00B8D9',  // Darker Teal

  // Accent Colors
  accent: '#FF6B35',         // Energetic Orange
  accentLight: '#FF8A5C',    // Lighter Orange
  accentDark: '#E65A2E',     // Darker Orange

  // Neutral Colors
  background: '#F8F9FA',     // Light Gray Background
  surface: '#FFFFFF',        // White Surface
  surfaceVariant: '#F1F3F5', // Slightly darker surface

  // Text Colors
  text: '#1C1C1E',           // Dark Text
  textSecondary: '#6C757D',  // Gray Text
  textLight: '#ADB5BD',      // Light Gray Text
  textOnPrimary: '#FFFFFF',  // White text on primary

  // Status Colors
  success: '#34C759',        // Green
  error: '#FF3B30',          // Red
  warning: '#FFCC00',        // Yellow
  info: '#007AFF',           // Blue

  // Border & Divider
  border: '#E9ECEF',         // Light border
  divider: '#DEE2E6',        // Divider

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// Dark Theme Colors - Modern Dark Slate with Vibrant Orange Accents
export const DarkColors = {
  // Primary Colors - Vibrant Orange (Main brand color in dark mode)
  primary: '#FF6B35',        // Vibrant Orange (main accent)
  primaryLight: '#FF8A5C',   // Lighter Orange
  primaryDark: '#E65A2E',    // Darker Orange

  // Secondary Colors - Warm Coral/Peach
  secondary: '#FF9E6D',      // Warm Coral
  secondaryLight: '#FFB088', // Light Peach
  secondaryDark: '#FF7A47',  // Deep Coral

  // Accent Colors - Electric Orange
  accent: '#FF5722',         // Electric Orange (for CTAs)
  accentLight: '#FF7043',    // Bright Orange
  accentDark: '#E64A19',     // Deep Orange

  // Neutral Colors - Dark Slate/Charcoal
  background: '#0F0F0F',     // Almost Black (OLED friendly)
  surface: '#1A1A1A',        // Dark Charcoal
  surfaceVariant: '#252525', // Lighter Charcoal

  // Text Colors
  text: '#FFFFFF',           // Pure White
  textSecondary: '#B8B8B8',  // Light Gray
  textLight: '#8A8A8A',      // Medium Gray
  textOnPrimary: '#FFFFFF',  // White on orange

  // Status Colors
  success: '#4CAF50',        // Green
  error: '#FF5252',          // Bright Red
  warning: '#FFC107',        // Amber
  info: '#2196F3',           // Blue

  // Border & Divider
  border: '#2A2A2A',         // Subtle border
  divider: '#333333',        // Divider

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.85)',
  overlayLight: 'rgba(0, 0, 0, 0.6)',
};

// Default to light colors for backward compatibility
export const Colors = LightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const Typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Layout = {
  screenPadding: Spacing.md,
  containerMaxWidth: 600,
};

// Helper function to get colors based on theme mode
export const getColors = (isDark: boolean) => isDark ? DarkColors : LightColors;

// Export default theme object
export const Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
  shadows: Shadows,
  layout: Layout,
};

export default Theme;

