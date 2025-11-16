/**
 * Theme Constants - Shadcn/UI Inspired
 * Clean, modern design with excellent contrast and readability
 * Supports both light and dark modes
 */

// Light Theme Colors - Shadcn/UI Inspired (Clean, Modern)
export const LightColors = {
  // Primary Colors - Slate (Shadcn default)
  primary: '#0F172A',        // Slate 900 (main accent)
  primaryLight: '#334155',   // Slate 700
  primaryDark: '#020617',    // Slate 950

  // Secondary Colors - Zinc (Subtle, Professional)
  secondary: '#18181B',      // Zinc 900
  secondaryLight: '#3F3F46', // Zinc 700
  secondaryDark: '#09090B',  // Zinc 950

  // Accent Colors - Neutral (Muted)
  accent: '#737373',         // Neutral 500
  accentLight: '#A3A3A3',    // Neutral 400
  accentDark: '#525252',     // Neutral 600

  // Neutral Colors - Clean & Subtle
  background: '#FFFFFF',     // White
  surface: '#F8FAFC',        // Slate 50 (subtle depth)
  surfaceVariant: '#F1F5F9', // Slate 100 (cards)

  // Text Colors
  text: '#020617',           // Slate 950 (high contrast)
  textSecondary: '#64748B',  // Slate 500 (muted)
  textLight: '#94A3B8',      // Slate 400 (subtle)
  textOnPrimary: '#F8FAFC',  // Slate 50 on dark

  // Status Colors - Shadcn palette
  success: '#22C55E',        // Green 500
  error: '#EF4444',          // Red 500
  warning: '#F59E0B',        // Amber 500
  info: '#3B82F6',           // Blue 500

  // Border & Divider - Very subtle
  border: '#E2E8F0',         // Slate 200
  divider: '#CBD5E1',        // Slate 300

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.5)',      // Slate 900 with opacity
  overlayLight: 'rgba(15, 23, 42, 0.3)',
};

// Dark Theme Colors - Shadcn/UI Exact Match (Elegant, Modern)
export const DarkColors = {
  // Primary Colors - Light accent on dark (shadcn style)
  primary: '#FAFAFA',        // Zinc 50 (main accent in dark)
  primaryLight: '#F4F4F5',   // Zinc 100
  primaryDark: '#E4E4E7',    // Zinc 200

  // Secondary Colors - Muted
  secondary: '#F5F5F5',      // Neutral 100
  secondaryLight: '#E5E5E5', // Neutral 200
  secondaryDark: '#D4D4D4',  // Neutral 300

  // Accent Colors - Subtle
  accent: '#A1A1AA',         // Zinc 400
  accentLight: '#D4D4D8',    // Zinc 300
  accentDark: '#71717A',     // Zinc 500

  // Neutral Colors - Very Dark (Shadcn exact)
  background: '#09090B',     // Zinc 950 (almost black background)
  surface: '#18181B',        // Zinc 900 (cards - slightly lighter than bg)
  surfaceVariant: '#27272A', // Zinc 800 (elevated cards)

  // Text Colors
  text: '#FAFAFA',           // Zinc 50 (high contrast)
  textSecondary: '#A1A1AA',  // Zinc 400 (muted)
  textLight: '#71717A',      // Zinc 500 (subtle)
  textOnPrimary: '#09090B',  // Zinc 950 on light

  // Status Colors - Shadcn palette
  success: '#22C55E',        // Green 500
  error: '#EF4444',          // Red 500
  warning: '#F59E0B',        // Amber 500
  info: '#3B82F6',           // Blue 500

  // Border & Divider - Extremely subtle (key to shadcn look)
  border: '#27272A',         // Zinc 800 (barely visible)
  divider: '#3F3F46',        // Zinc 700

  // Overlay
  overlay: 'rgba(9, 9, 11, 0.85)',       // Zinc 950 with opacity
  overlayLight: 'rgba(9, 9, 11, 0.6)',
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

