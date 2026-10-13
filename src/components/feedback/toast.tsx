import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  description?: string;
  type?: ToastType;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions | string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<(ToastOptions & { id: number }) | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(-20));
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setToast(null));
  }, [fadeAnim, translateY]);

  const showToast = useCallback(
    (options: ToastOptions | string) => {
      const opts: ToastOptions = typeof options === 'string' ? { message: options } : options;
      const id = Date.now();
      setToast({ ...opts, id });

      fadeAnim.setValue(0);
      translateY.setValue(-20);

      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      const duration = opts.durationMs ?? 3500;
      setTimeout(() => {
        setToast((current) => {
          if (current?.id === id) {
            hideToast();
          }
          return current;
        });
      }, duration);
    },
    [fadeAnim, translateY, hideToast]
  );

  const type = toast?.type ?? 'info';
  const statusColor = palette.status[type];

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.wrapper,
            {
              top: Math.max(insets.top, 16) + 8,
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={hideToast}
            style={[
              styles.container,
              {
                backgroundColor: palette.background.surface,
                borderColor: statusColor.main,
                shadowColor: palette.border.strong,
              },
            ]}>
            <View style={[styles.badge, { backgroundColor: statusColor.main }]}>
              <Text style={styles.badgeText}>{ICONS[type]}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.message, { color: palette.text.primary }]}>
                {toast.message}
              </Text>
              {toast.description ? (
                <Text style={[styles.description, { color: palette.text.secondary }]}>
                  {toast.description}
                </Text>
              ) : null}
            </View>

            <Text style={[styles.closeIcon, { color: palette.text.disabled }]}>×</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    maxWidth: 480,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  closeIcon: {
    fontSize: 20,
    marginLeft: 8,
    fontWeight: '300',
  },
});
