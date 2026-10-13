import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components/feedback/toast';
import { AppButton } from '@/components/ui/app-button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { DateFilterPreset, DateRangePickerSheet } from '@/components/ui/date-range-picker-sheet';
import { EmptyState } from '@/components/ui/empty-state';
import { FormInput } from '@/components/ui/form-input';
import { ReusableList } from '@/components/ui/reusable-list';
import { SearchBar } from '@/components/ui/search-bar';
import { SettingRow } from '@/components/ui/setting-row';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ComponentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;
  const { showToast } = useToast();

  const [inputText, setInputText] = useState('');
  const [errorInputText, setErrorInputText] = useState('invalid_value');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDatePreset, setSelectedDatePreset] = useState<DateFilterPreset>('this_month');
  const [searchQuery, setSearchQuery] = useState('');
  const [demoToggle, setDemoToggle] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);
  const [listData, setListData] = useState<Array<{ id: string; title: string; amount: string; category: string }>>([
    { id: '1', title: 'Grocery Shopping', amount: '-$64.50', category: 'Food & Dining' },
    { id: '2', title: 'Freelance Project Payout', amount: '+$850.00', category: 'Income' },
    { id: '3', title: 'Internet Utility Bill', amount: '-$49.99', category: 'Utilities' },
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background.default }]}>
      {/* Top Navigation Bar with Back Button */}
      <View style={[styles.navHeader, { borderBottomColor: palette.border.subtle }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.backButton, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}
          onPress={() => router.back()}>
          <Text style={[styles.backButtonText, { color: palette.text.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.navHeaderTitle, { color: palette.text.primary }]}>Component Library</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: palette.text.primary }]}>
            UI Component Library
          </Text>
          <Text style={[styles.screenSubtitle, { color: palette.text.secondary }]}>
            Showcase of design tokens, interactive components, and feedback systems.
          </Text>
        </View>

        {/* Section 1: Buttons */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            AppButton Variants
          </Text>

          <View style={styles.row}>
            <AppButton
              title="Primary Button"
              variant="primary"
              onPress={() => showToast({ message: 'Primary button clicked', type: 'info' })}
              style={styles.flexButton}
            />
          </View>

          <View style={styles.row}>
            <AppButton
              title="Secondary Button"
              variant="secondary"
              onPress={() => showToast({ message: 'Secondary button clicked', type: 'success' })}
              style={styles.flexButton}
            />
          </View>

          <View style={styles.row}>
            <AppButton
              title="Outline Button"
              variant="outline"
              onPress={() => showToast({ message: 'Outline button clicked', type: 'warning' })}
              style={styles.flexButton}
            />
          </View>

          <View style={styles.row}>
            <AppButton
              title="Ghost Button"
              variant="ghost"
              onPress={() => showToast({ message: 'Ghost button clicked', type: 'info' })}
              style={styles.flexButton}
            />
          </View>

          <View style={styles.row}>
            <AppButton
              title="Loading State"
              variant="primary"
              isLoading={true}
              style={styles.flexButton}
            />
            <AppButton
              title="Disabled State"
              variant="primary"
              disabled={true}
              style={styles.flexButton}
            />
          </View>
        </View>

        {/* Section 2: Form Inputs */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            FormInput Components
          </Text>

          <FormInput
            label="Standard Input"
            placeholder="Type something here..."
            value={inputText}
            onChangeText={setInputText}
            helperText="This is standard helper text below the input"
          />

          <FormInput
            label="Error State Input"
            placeholder="Required value"
            value={errorInputText}
            onChangeText={setErrorInputText}
            error="This input has a validation error"
          />

          <FormInput
            label="Secure Password Input"
            placeholder="Enter password"
            secureTextEntry
            value="mypassword123"
          />
        </View>

        {/* Section 3: Toast System */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            Toast Notification System
          </Text>

          <View style={styles.grid}>
            <AppButton
              title="Success Toast"
              variant="secondary"
              onPress={() =>
                showToast({
                  type: 'success',
                  message: 'Operation Successful!',
                  description: 'All changes have been saved to local SQLite.',
                })
              }
              style={styles.gridButton}
            />
            <AppButton
              title="Error Toast"
              variant="outline"
              onPress={() =>
                showToast({
                  type: 'error',
                  message: 'Network Error',
                  description: 'Unable to reach the server. Retrying offline.',
                })
              }
              style={styles.gridButton}
            />
            <AppButton
              title="Warning Toast"
              variant="outline"
              onPress={() =>
                showToast({
                  type: 'warning',
                  message: 'Storage Alert',
                  description: 'Local cache limit reached. Purging old logs.',
                })
              }
              style={styles.gridButton}
            />
            <AppButton
              title="Info Toast"
              variant="ghost"
              onPress={() =>
                showToast({
                  type: 'info',
                  message: 'Sync in Progress',
                  description: 'Synchronizing with remote Supabase endpoint.',
                })
              }
              style={styles.gridButton}
            />
          </View>
        </View>

        {/* Section 4: SettingRow Showcase */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            SettingRow (ListTile)
          </Text>
          <SettingRow
            icon="🔔"
            title="Push Notifications"
            subtitle="Receive alerts for transactions"
            isSwitch
            switchValue={demoToggle}
            onSwitchChange={setDemoToggle}
          />
          <SettingRow
            icon="💳"
            title="Payment Method"
            subtitle="Default account for quick checkout"
            badge="VISA • 4242"
            onPress={() => showToast({ message: 'Clicked Payment Method', type: 'info' })}
          />
          <SettingRow
            icon="🗑️"
            title="Delete Diary Data"
            subtitle="Permanently wipe transaction history"
            isDestructive
            onPress={() => setIsDialogOpen(true)}
          />
        </View>

        {/* Section 5: SearchBar Showcase */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            SearchBar Component
          </Text>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search diary entries, contacts..."
            showFilterButton
            filterActive={selectedDatePreset !== 'all'}
            onFilterPress={() => setIsDatePickerOpen(true)}
          />
          {searchQuery.length > 0 && (
            <Text style={{ fontSize: 13, color: palette.text.secondary }}>
              Searching for: "{searchQuery}"
            </Text>
          )}
        </View>

        {/* Section 6: DateRangePickerSheet Trigger */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            DateRangePickerSheet
          </Text>
          <Text style={{ color: palette.text.secondary, fontSize: 13 }}>
            Current Filter Preset: <Text style={{ fontWeight: '700', color: palette.primary.main }}>{selectedDatePreset.toUpperCase()}</Text>
          </Text>
          <AppButton
            title="Open Date Filter Sheet"
            variant="secondary"
            onPress={() => setIsDatePickerOpen(true)}
          />
        </View>

        {/* Section 7: Skeleton Loading Placeholders */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            Skeleton Loader & Shimmer
          </Text>
          <SkeletonCard />
        </View>

        {/* Section 8: EmptyState Component */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            EmptyState Component
          </Text>
          <EmptyState
            icon="💸"
            title="No Transactions Found"
            description="You haven't recorded any income or expense entries for this period."
            actionTitle="+ Add First Transaction"
            onActionPress={() => showToast({ message: 'Create transaction clicked', type: 'success' })}
          />
        </View>

        {/* Section 9: ReusableList Component */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            ReusableList Component
          </Text>
          <Text style={{ color: palette.text.secondary, fontSize: 13, marginBottom: 4 }}>
            Built-in skeleton loading, empty state fallback, separators & refresh controls.
          </Text>

          <View style={styles.row}>
            <AppButton
              title={listData.length > 0 ? "Simulate Empty" : "Restore Data"}
              variant="outline"
              onPress={() => {
                if (listData.length > 0) {
                  setListData([]);
                } else {
                  setListData([
                    { id: '1', title: 'Grocery Shopping', amount: '-$64.50', category: 'Food & Dining' },
                    { id: '2', title: 'Freelance Project Payout', amount: '+$850.00', category: 'Income' },
                    { id: '3', title: 'Internet Utility Bill', amount: '-$49.99', category: 'Utilities' },
                  ]);
                }
              }}
              style={styles.flexButton}
            />
            <AppButton
              title="Toggle Loading"
              variant="secondary"
              onPress={() => {
                setIsListLoading(true);
                setTimeout(() => setIsListLoading(false), 1200);
              }}
              style={styles.flexButton}
            />
          </View>

          <ReusableList
            data={listData}
            isLoading={isListLoading}
            skeletonCount={2}
            scrollEnabled={false}
            showSeparators
            emptyTitle="Diary List is Empty"
            emptyDescription="Use the restore button above to populate demo transactions."
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: palette.text.primary }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: palette.text.secondary }}>
                    {item.category}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: item.amount.startsWith('+')
                      ? palette.status.success.main
                      : palette.text.primary,
                  }}>
                  {item.amount}
                </Text>
              </View>
            )}
          />
        </View>

        {/* Section 10: Bottom Sheet Showcase */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            BottomSheet (Reusable Component)
          </Text>
          <AppButton
            title="Open Interactive Bottom Sheet"
            variant="primary"
            onPress={() => setIsBottomSheetOpen(true)}
            style={styles.gridButton}
          />
        </View>

        {/* Section 10: Palette Tokens */}
        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <Text style={[styles.sectionTitle, { color: palette.text.primary }]}>
            Active Theme Tokens ({colorScheme === 'dark' ? 'Dark' : 'Light'})
          </Text>

          <View style={styles.colorPillContainer}>
            <View style={[styles.colorPill, { backgroundColor: palette.primary.main }]}>
              <Text style={styles.colorPillText}>Primary Main</Text>
            </View>
            <View style={[styles.colorPill, { backgroundColor: palette.secondary.main }]}>
              <Text style={styles.colorPillText}>Secondary Main</Text>
            </View>
            <View style={[styles.colorPill, { backgroundColor: palette.status.success.main }]}>
              <Text style={styles.colorPillText}>Success</Text>
            </View>
            <View style={[styles.colorPill, { backgroundColor: palette.status.warning.main }]}>
              <Text style={styles.colorPillText}>Warning</Text>
            </View>
            <View style={[styles.colorPill, { backgroundColor: palette.status.error.main }]}>
              <Text style={styles.colorPillText}>Error</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Interactive BottomSheet Demo */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="Reusable Bottom Sheet"
        subtitle="Swipe down or tap close/backdrop to dismiss">
        <View style={{ gap: 14, paddingTop: 4 }}>
          <Text style={{ color: palette.text.primary, fontSize: 15, lineHeight: 22 }}>
            This component supports headers, drag gestures, swipe down to dismiss, snap heights, and customized children content.
          </Text>
          <AppButton
            title="Confirm Action"
            variant="primary"
            onPress={() => {
              setIsBottomSheetOpen(false);
              showToast({ message: 'Action confirmed inside bottom sheet!', type: 'success' });
            }}
          />
          <AppButton
            title="Close Sheet"
            variant="outline"
            onPress={() => setIsBottomSheetOpen(false)}
          />
        </View>
      </BottomSheet>

      {/* Confirmation Dialog Demo */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Delete Diary Data"
        message="This action cannot be undone. All offline transaction logs and categories will be permanently erased."
        confirmText="Delete Everything"
        variant="danger"
        icon="🗑️"
        onConfirm={() => {
          setIsDialogOpen(false);
          showToast({ message: 'Deleted successfully (Demo)', type: 'error' });
        }}
      />

      {/* DateRangePickerSheet Demo */}
      <DateRangePickerSheet
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedPreset={selectedDatePreset}
        onSelectPreset={(preset) => {
          setSelectedDatePreset(preset);
          showToast({ message: `Filtered by: ${preset}`, type: 'info' });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  navHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  backPlaceholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flexButton: {
    flex: 1,
  },
  grid: {
    gap: 10,
  },
  gridButton: {
    width: '100%',
  },
  colorPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
