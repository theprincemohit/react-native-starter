import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilterButton?: boolean;
  filterActive?: boolean;
  style?: ViewStyle;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onFilterPress,
  showFilterButton = false,
  filterActive = false,
  style,
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: palette.background.surface,
            borderColor: palette.border.default,
          },
        ]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.text.disabled}
          style={[styles.input, { color: palette.text.primary }]}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {value.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.clearButton, { backgroundColor: palette.background.elevated }]}
            onPress={handleClear}>
            <Text style={[styles.clearText, { color: palette.text.secondary }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showFilterButton && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.filterButton,
            {
              backgroundColor: filterActive
                ? palette.primary.main
                : palette.background.surface,
              borderColor: filterActive ? palette.primary.main : palette.border.default,
            },
          ]}
          onPress={onFilterPress}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    paddingVertical: 0,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 11,
    fontWeight: '700',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 18,
  },
});

export default SearchBar;
