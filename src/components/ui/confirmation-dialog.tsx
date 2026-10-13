import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppButton } from './app-button';

export type DialogVariant = 'danger' | 'warning' | 'info' | 'neutral';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  isLoading?: boolean;
  icon?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  icon,
}: ConfirmationDialogProps) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

  if (!isOpen) return null;

  const defaultIcon =
    variant === 'danger'
      ? '⚠️'
      : variant === 'warning'
      ? '⚡'
      : variant === 'info'
      ? 'ℹ️'
      : '💬';

  const badgeBg =
    variant === 'danger'
      ? palette.status.error.background
      : variant === 'warning'
      ? palette.status.warning.background
      : variant === 'info'
      ? palette.status.info.background
      : palette.background.elevated;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={isLoading ? undefined : onClose}
      statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={isLoading ? undefined : onClose}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.background.surface,
              borderColor: palette.border.default,
            },
          ]}>
          {/* Header Icon */}
          <View style={[styles.iconCircle, { backgroundColor: badgeBg }]}>
            <Text style={styles.iconText}>{icon ?? defaultIcon}</Text>
          </View>

          {/* Title & Message */}
          <Text style={[styles.title, { color: palette.text.primary }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: palette.text.secondary }]}>
            {message}
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isLoading}
              style={[
                styles.cancelButton,
                {
                  backgroundColor: palette.background.elevated,
                  borderColor: palette.border.default,
                },
              ]}
              onPress={onClose}>
              <Text style={[styles.cancelText, { color: palette.text.primary }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isLoading}
              style={[
                styles.confirmButton,
                {
                  backgroundColor:
                    variant === 'danger'
                      ? palette.status.error.main
                      : variant === 'warning'
                      ? palette.status.warning.main
                      : palette.primary.main,
                },
              ]}
              onPress={onConfirm}>
              <Text style={styles.confirmText}>
                {isLoading ? 'Processing...' : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconText: {
    fontSize: 26,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ConfirmationDialog;
