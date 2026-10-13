import { useColorScheme as useRNColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/theme-store';

/**
 * Returns 'light' or 'dark' taking into account user theme preference ('system' | 'light' | 'dark').
 */
export function useColorScheme(): 'light' | 'dark' {
  const systemScheme = useRNColorScheme() ?? 'light';
  const themePreference = useThemeStore((s) => s.themePreference);

  if (themePreference === 'dark') {
    return 'dark';
  }
  if (themePreference === 'light') {
    return 'light';
  }

  return systemScheme === 'dark' ? 'dark' : 'light';
}
