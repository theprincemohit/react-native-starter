import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function AppButton({
  title,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  disabled,
  ...props
}: AppButtonProps) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

  const isDisabled = disabled || isLoading;

  let backgroundColor = palette.primary.main;
  let textColor = palette.primary.contrastText;
  let borderColor = 'transparent';

  switch (variant) {
    case 'secondary':
      backgroundColor = palette.secondary.main;
      textColor = palette.secondary.contrastText;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = palette.primary.main;
      borderColor = palette.primary.main;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = palette.primary.main;
      break;
  }

  if (isDisabled) {
    backgroundColor = variant === 'outline' || variant === 'ghost' ? 'transparent' : palette.border.default;
    textColor = palette.text.disabled;
    if (variant === 'outline') {
      borderColor = palette.border.default;
    }
  }

  const containerStyle: ViewStyle = {
    backgroundColor,
    borderColor,
    borderWidth: variant === 'outline' ? 1.5 : 0,
    opacity: isDisabled ? 0.65 : 1,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[styles.button, containerStyle, style]}
      {...props}>
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppButton;
