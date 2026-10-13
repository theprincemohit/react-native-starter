/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export interface ColorPalette {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  background: {
    default: string;
    surface: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  status: {
    success: { main: string; background: string; text: string };
    warning: { main: string; background: string; text: string };
    error: { main: string; background: string; text: string };
    info: { main: string; background: string; text: string };
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
  };
  divider: string;
}

// Theme: "Minimalist Ocean Breeze" (WCAG AA Compliant)
export const lightPalette: ColorPalette = {
  primary: {
    main: '#0E7490',       // Deep Ocean Cyan (~5.4:1 contrast on #FFFFFF)
    light: '#22D3EE',      // Soft Sea Breeze
    dark: '#164E63',       // Abyssal Blue
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#0F766E',       // Coastal Teal (~5.3:1 contrast on #FFFFFF)
    light: '#2DD4BF',      // Aquamarine Tint
    dark: '#134E48',       // Deep Kelp
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',    // Salt Mist Slate
    surface: '#FFFFFF',    // Crisp Foam White
    elevated: '#F1F5F9',   // Gentle Sand Light
  },
  text: {
    primary: '#0F172A',    // Midnight Navy (~16.6:1 contrast on #FFFFFF)
    secondary: '#475569',  // Cool Shore Slate (~6.8:1 contrast on #FFFFFF)
    disabled: '#94A3B8',   // Sea Foam Gray
    inverse: '#FFFFFF',
  },
  status: {
    success: {
      main: '#059669',
      background: '#ECFDF5',
      text: '#064E3B',
    },
    warning: {
      main: '#D97706',
      background: '#FFFBEB',
      text: '#78350F',
    },
    error: {
      main: '#DC2626',
      background: '#FEF2F2',
      text: '#7F1D1D',
    },
    info: {
      main: '#0284C7',
      background: '#F0F9FF',
      text: '#0C4A6E',
    },
  },
  border: {
    default: '#E2E8F0',
    subtle: '#F1F5F9',
    strong: '#CBD5E1',
  },
  divider: '#E2E8F0',
};

export const darkPalette: ColorPalette = {
  primary: {
    main: '#38BDF8',       // Glowing Aqua Wave (~9.2:1 contrast on #0B1219)
    light: '#7DD3FC',      // Crest Highlight
    dark: '#0284C7',       // Sunken Cyan
    contrastText: '#082F49',
  },
  secondary: {
    main: '#2DD4BF',       // Bioluminescent Teal (~10.8:1 contrast on #0B1219)
    light: '#5EEAD4',      // Shallow Aqua
    dark: '#0D9488',       // Marine Depth
    contrastText: '#042F2E',
  },
  background: {
    default: '#0B1219',    // Midnight Trench
    surface: '#111C24',    // Deep Water Surface
    elevated: '#1A2936',   // Submerged Shelf
  },
  text: {
    primary: '#F0F9FF',    // Frosted Sea Spray (~15.2:1 contrast on #0B1219)
    secondary: '#94A3B8',  // Driftwood Slate (~6.2:1 contrast on #0B1219)
    disabled: '#475569',   // Deep Shadow
    inverse: '#0B1219',
  },
  status: {
    success: {
      main: '#34D399',
      background: '#064E3B40',
      text: '#6EE7B7',
    },
    warning: {
      main: '#FBBF24',
      background: '#78350F40',
      text: '#FDE68A',
    },
    error: {
      main: '#F87171',
      background: '#7F1D1D40',
      text: '#FECACA',
    },
    info: {
      main: '#38BDF8',
      background: '#0C4A6E40',
      text: '#BAE6FD',
    },
  },
  border: {
    default: '#1E293B',
    subtle: '#14202C',
    strong: '#334155',
  },
  divider: '#1E293B',
};

export const palettes = {
  light: lightPalette,
  dark: darkPalette,
} as const;

export const Colors = {
  light: {
    text: lightPalette.text.primary,
    background: lightPalette.background.surface,
    backgroundElement: lightPalette.background.default,
    backgroundSelected: lightPalette.background.elevated,
    textSecondary: lightPalette.text.secondary,
    palette: lightPalette,
  },
  dark: {
    text: darkPalette.text.primary,
    background: darkPalette.background.default,
    backgroundElement: darkPalette.background.surface,
    backgroundSelected: darkPalette.background.elevated,
    textSecondary: darkPalette.text.secondary,
    palette: darkPalette,
  },
} as const;

export type ThemeColor = Exclude<keyof typeof Colors.light & keyof typeof Colors.dark, 'palette'>;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
