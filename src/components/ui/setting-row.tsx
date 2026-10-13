import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface SettingRowProps {
  icon?: string | React.ReactNode;
  iconBgColor?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  showChevron?: boolean;
  isDestructive?: boolean;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SettingRow({
  icon,
  iconBgColor,
  title,
  subtitle,
  badge,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  showChevron = true,
  isDestructive = false,
  disabled = false,
  rightElement,
  onPress,
  style,
}: SettingRowProps) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

  const handlePress = () => {
    if (disabled) return;
    if (isSwitch && onSwitchChange) {
      onSwitchChange(!switchValue);
    } else if (onPress) {
      onPress();
    }
  };

  const titleColor = isDestructive
    ? palette.status.error.main
    : disabled
    ? palette.text.disabled
    : palette.text.primary;

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled || (!onPress && !isSwitch)}
      onPress={handlePress}
      style={[
        styles.row,
        {
          backgroundColor: palette.background.surface,
          borderColor: palette.border.default,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}>
      {/* Left: Icon and Titles */}
      <View style={styles.leftContainer}>
        {icon && (
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor:
                  iconBgColor ??
                  (isDestructive
                    ? palette.status.error.background
                    : palette.background.elevated),
              },
            ]}>
            {typeof icon === 'string' ? (
              <Text style={styles.iconText}>{icon}</Text>
            ) : (
              icon
            )}
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.subtitle, { color: palette.text.secondary }]}
              numberOfLines={2}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right: Accessories (Badge, Switch, Custom Element, Chevron) */}
      <View style={styles.rightContainer}>
        {badge && (
          <View
            style={[
              styles.badgeContainer,
              {
                backgroundColor: palette.background.elevated,
                borderColor: palette.border.subtle,
              },
            ]}>
            <Text style={[styles.badgeText, { color: palette.primary.main }]}>
              {badge}
            </Text>
          </View>
        )}

        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            disabled={disabled}
            trackColor={{
              false: palette.border.strong,
              true: palette.primary.main,
            }}
            thumbColor="#FFFFFF"
          />
        ) : rightElement ? (
          rightElement
        ) : showChevron && onPress ? (
          <Text style={[styles.chevron, { color: palette.text.secondary }]}>›</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default SettingRow;
