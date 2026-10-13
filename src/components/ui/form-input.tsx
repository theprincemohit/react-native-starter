import React, { forwardRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isLoading,
      style,
      placeholderTextColor,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

    const hasError = Boolean(error);
    const borderColor = hasError
      ? palette.status.error.main
      : palette.border.default;

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: palette.text.secondary }]}>
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: palette.background.surface,
              borderColor,
            },
          ]}>
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: palette.text.primary,
              },
              style,
            ]}
            placeholderTextColor={
              placeholderTextColor ?? palette.text.disabled
            }
            {...props}
          />

          {isLoading ? (
            <ActivityIndicator size="small" color={palette.primary.main} />
          ) : (
            rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>
          )}
        </View>

        {hasError ? (
          <Text style={[styles.helper, { color: palette.status.error.main }]}>
            {error}
          </Text>
        ) : helperText ? (
          <Text style={[styles.helper, { color: palette.text.disabled }]}>
            {helperText}
          </Text>
        ) : null}
      </View>
    );
  }
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  leftIconWrapper: {
    marginRight: 10,
  },
  rightIconWrapper: {
    marginLeft: 10,
  },
  helper: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default FormInput;
