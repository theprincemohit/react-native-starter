import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/theme-store';

/**
 * Web-compatible useColorScheme respecting hydration and manual theme preference.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const themePreference = useThemeStore((s) => s.themePreference);
  const systemScheme = useRNColorScheme() ?? 'light';

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (themePreference === 'dark') {
    return 'dark';
  }
  if (themePreference === 'light') {
    return 'light';
  }

  if (hasHydrated) {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }

  return 'light';
}
