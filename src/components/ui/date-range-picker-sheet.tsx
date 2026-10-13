import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppButton } from './app-button';
import { BottomSheet } from './bottom-sheet';

export type DateFilterPreset = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'last_month' | 'all';

export interface DateRangePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPreset: DateFilterPreset;
  onSelectPreset: (preset: DateFilterPreset) => void;
}

export function DateRangePickerSheet({
  isOpen,
  onClose,
  selectedPreset,
  onSelectPreset,
}: DateRangePickerSheetProps) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

  const [active, setActive] = useState<DateFilterPreset>(selectedPreset);

  const presets: { label: string; preset: DateFilterPreset; desc: string; icon: string }[] = [
    { label: 'Today', preset: 'today', desc: 'Current calendar day', icon: '📅' },
    { label: 'Yesterday', preset: 'yesterday', desc: 'Previous 24-hour cycle', icon: '⏪' },
    { label: 'This Week', preset: 'this_week', desc: 'Monday through Sunday', icon: '📊' },
    { label: 'This Month', preset: 'this_month', desc: '1st of current month to today', icon: '📆' },
    { label: 'Last Month', preset: 'last_month', desc: 'Entire previous month', icon: '🗓️' },
    { label: 'All Time', preset: 'all', desc: 'Complete historical timeline', icon: '♾️' },
  ];

  const handleApply = () => {
    onSelectPreset(active);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filter by Date"
      subtitle="Select a date preset for transactions & diary entries">
      <View style={styles.container}>
        <View style={styles.grid}>
          {presets.map((item) => {
            const isSelected = active === item.preset;
            return (
              <TouchableOpacity
                key={item.preset}
                activeOpacity={0.7}
                style={[
                  styles.presetCard,
                  {
                    backgroundColor: isSelected
                      ? palette.primary.main
                      : palette.background.elevated,
                    borderColor: isSelected
                      ? palette.primary.main
                      : palette.border.default,
                  },
                ]}
                onPress={() => setActive(item.preset)}>
                <Text style={styles.presetIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.presetLabel,
                    { color: isSelected ? '#FFFFFF' : palette.text.primary },
                  ]}>
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.presetDesc,
                    {
                      color: isSelected
                        ? 'rgba(255, 255, 255, 0.85)'
                        : palette.text.secondary,
                    },
                  ]}>
                  {item.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actionRow}>
          <AppButton
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={styles.flexBtn}
          />
          <AppButton
            title="Apply Filter"
            variant="primary"
            onPress={handleApply}
            style={styles.flexBtn}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  presetIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  presetLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  presetDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  flexBtn: {
    flex: 1,
  },
});

export default DateRangePickerSheet;
