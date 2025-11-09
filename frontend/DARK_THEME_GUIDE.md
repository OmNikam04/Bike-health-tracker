# 🌙 Dark Theme Guide

## Overview

The Bike Health Tracker app now supports **Light**, **Dark**, and **Auto** theme modes!

## Features

### 🎨 Theme Modes

1. **☀️ Light Mode**
   - Bright, clean interface
   - White backgrounds
   - Dark text on light surfaces

2. **🌙 Dark Mode**
   - Easy on the eyes in low light
   - Dark backgrounds
   - Light text on dark surfaces
   - OLED-friendly (true black backgrounds)

3. **🔄 Auto Mode** (Default)
   - Automatically follows your phone's system theme
   - Switches between light/dark based on time of day
   - Respects system-wide dark mode settings

## How to Use

### Toggle Theme

1. **Tap the theme icon** in the top-right corner (☀️ or 🌙)
2. **Select your preference**:
   - Light
   - Dark
   - Auto

Your preference is **saved automatically** and persists across app restarts!

## Color Schemes

### Light Theme Colors
```
Primary:    #0066FF (Vibrant Blue)
Secondary:  #00D9FF (Bright Teal)
Accent:     #FF6B35 (Energetic Orange)
Background: #F8F9FA (Light Gray)
Surface:    #FFFFFF (White)
Text:       #1C1C1E (Dark)
```

### Dark Theme Colors - Modern Dark Slate with Vibrant Orange 🔥
```
Primary:    #FF6B35 (Vibrant Orange - main brand color)
Secondary:  #FF9E6D (Warm Coral)
Accent:     #FF5722 (Electric Orange - for CTAs)
Background: #0F0F0F (Almost Black - OLED friendly)
Surface:    #1A1A1A (Dark Charcoal)
Text:       #FFFFFF (Pure White)

This creates a stunning, modern look with:
- Deep, rich dark backgrounds (charcoal/slate)
- Vibrant orange accents that pop
- Excellent contrast and readability
- OLED-friendly true blacks
```

## For Developers

### Using Theme in Your Components

```typescript
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/theme';

function MyComponent() {
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        This text adapts to the theme!
      </Text>
    </View>
  );
}
```

### Theme Context API

```typescript
const {
  themeMode,      // 'light' | 'dark' | 'auto'
  isDarkMode,     // boolean - true if dark mode is active
  setThemeMode,   // (mode: ThemeMode) => void
  toggleTheme,    // () => void - toggles between light/dark
} = useTheme();
```

### Getting Theme Colors

```typescript
import { getColors, LightColors, DarkColors } from '../constants/theme';

// Get colors based on current theme
const colors = getColors(isDarkMode);

// Or use specific theme colors
const lightColors = LightColors;
const darkColors = DarkColors;
```

## Implementation Details

### Theme Persistence
- Theme preference is saved to **AsyncStorage**
- Automatically loads on app start
- Key: `@bike_health_tracker:theme_mode`

### System Theme Detection
- Uses React Native's `useColorScheme()` hook
- Detects system-wide dark mode setting
- Only applies when theme mode is set to "Auto"

### Status Bar
- Automatically adjusts based on theme
- Light status bar in dark mode
- Dark status bar in light mode

## Benefits

### For Users
- ✅ Reduced eye strain in low light
- ✅ Better battery life on OLED screens (dark mode)
- ✅ Personalization options
- ✅ Automatic adaptation to environment

### For Development
- ✅ Consistent theming across all screens
- ✅ Easy to add new themed components
- ✅ Centralized color management
- ✅ Type-safe theme values

## Testing Dark Theme

1. **Manual Toggle**: Tap theme icon and select "Dark"
2. **System Theme**: 
   - Set theme to "Auto"
   - Change your phone's system theme
   - App will automatically update
3. **Persistence**: 
   - Change theme
   - Close and reopen app
   - Theme preference is remembered

## Future Enhancements (Phase 2+)

- [ ] Custom color schemes
- [ ] Schedule-based theme switching
- [ ] Per-screen theme overrides
- [ ] Theme animations/transitions
- [ ] High contrast mode

## Troubleshooting

### Theme not changing?
- Make sure you've selected a theme from the menu
- Try closing and reopening the app
- Check if AsyncStorage permissions are granted

### Colors look wrong?
- Verify you're using `getColors(isDarkMode)` in your components
- Check that you're wrapping components in `ThemeProvider`
- Ensure you're using the `useTheme()` hook correctly

---

**Status**: Dark Theme Support ✅ Complete  
**Available in**: Phase 1 and all future phases

