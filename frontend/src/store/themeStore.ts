import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// Create the theme store with persistence
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'auto',
      
      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
      },
      
      toggleTheme: () => {
        const currentMode = get().themeMode;
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        set({ themeMode: newMode });
      },
    }),
    {
      name: 'theme-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook to get the actual dark mode state (considering 'auto' mode)
export const useIsDarkMode = (): boolean => {
  const themeMode = useThemeStore((state) => state.themeMode);
  const systemColorScheme = useColorScheme();
  
  if (themeMode === 'auto') {
    return systemColorScheme === 'dark';
  }
  
  return themeMode === 'dark';
};

