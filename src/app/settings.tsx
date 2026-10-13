import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components/feedback/toast';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { SettingRow } from '@/components/ui/setting-row';
import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth-store';
import { ThemePreference, useThemeStore } from '@/stores/theme-store';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;
  const { user, signOut } = useAuthStore();
  const { themePreference, setThemePreference } = useThemeStore();
  const { showToast } = useToast();

  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const themeOptions: { label: string; mode: ThemePreference; icon: string; desc: string }[] = [
    { label: 'Light', mode: 'light', icon: '☀️', desc: 'Always crisp, clear & bright' },
    { label: 'Dark', mode: 'dark', icon: '🌙', desc: 'Sleek dark ocean palette for low light' },
    { label: 'System', mode: 'system', icon: '💻', desc: 'Automatically matches your device system theme' },
  ];

  const currentThemeLabel =
    themePreference === 'light'
      ? 'Light Mode'
      : themePreference === 'dark'
      ? 'Dark Mode'
      : 'System Default';

  const currentThemeIcon =
    themePreference === 'light'
      ? '☀️'
      : themePreference === 'dark'
      ? '🌙'
      : '💻';

  const handleLanguagePress = () => {
    showToast({
      message: 'Multi-language support (i18n) is coming soon in the next update!',
      type: 'info',
    });
  };

  const selectTheme = (mode: ThemePreference) => {
    setThemePreference(mode);
    setIsThemeSheetOpen(false);
    showToast({
      message: `Theme updated to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
      type: 'success',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background.default }]}>
      {/* Top Header Bar */}
      <View style={[styles.navHeader, { borderBottomColor: palette.border.subtle }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.backButton, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}
          onPress={() => router.back()}>
          <Text style={[styles.backButtonText, { color: palette.text.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.navHeaderTitle, { color: palette.text.primary }]}>Settings</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text.secondary }]}>USER PROFILE</Text>
        </View>

        <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: palette.primary.main }]}>
              <Text style={styles.avatarText}>
                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, { color: palette.text.primary }]}>
                {user?.email ? user.email.split('@')[0] : 'Guest User'}
              </Text>
              <Text style={[styles.profileEmail, { color: palette.text.secondary }]}>
                {user?.email ?? 'No account linked'}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: palette.background.elevated }]}>
                <Text style={[styles.roleBadgeText, { color: palette.primary.main }]}>
                  {user ? 'Verified Member' : 'Guest Mode'}
                </Text>
              </View>
            </View>
          </View>

          {user && (
            <View style={[styles.profileMetaList, { borderTopColor: palette.border.subtle }]}>
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: palette.text.secondary }]}>User ID</Text>
                <Text style={[styles.metaValue, { color: palette.text.primary }]} numberOfLines={1}>
                  {user.id.slice(0, 16)}...
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: palette.text.secondary }]}>Joined</Text>
                <Text style={[styles.metaValue, { color: palette.text.primary }]}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recent'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Theme Setting Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text.secondary }]}>THEME & APPEARANCE</Text>
        </View>

        <SettingRow
          icon={currentThemeIcon}
          title="Theme Mode"
          subtitle="Tap to customize app appearance"
          badge={currentThemeLabel}
          onPress={() => setIsThemeSheetOpen(true)}
        />

        {/* Preferences Section: Security & Notifications */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text.secondary }]}>SECURITY & PREFERENCES</Text>
        </View>

        <SettingRow
          icon="🔒"
          title="Biometric App Lock"
          subtitle="Require FaceID / Fingerprint upon opening"
          isSwitch
          switchValue={biometricsEnabled}
          onSwitchChange={(val) => {
            setBiometricsEnabled(val);
            showToast({
              message: val ? 'Biometric security activated' : 'Biometric security turned off',
              type: 'info',
            });
          }}
        />

        {/* Language Setting Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text.secondary }]}>LANGUAGE & LOCALIZATION</Text>
        </View>

        <SettingRow
          icon="🌐"
          title="App Language"
          subtitle="English (Default) • Multi-language coming soon"
          badge="EN"
          onPress={handleLanguagePress}
        />

        {/* Account Actions / Sign Out */}
        <View style={styles.accountActionContainer}>
          {user ? (
            <SettingRow
              icon="🚪"
              title="Sign Out of Account"
              subtitle="Safely log out from this device session"
              isDestructive
              showChevron={false}
              onPress={() => setIsLogoutDialogOpen(true)}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.signInButton, { backgroundColor: palette.primary.main }]}
              onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.signInText}>🔐 Sign In to Your Account</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Confirmation Dialog for Logout */}
      <ConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        title="Sign Out"
        message="Are you sure you want to sign out from your account?"
        confirmText="Sign Out"
        variant="danger"
        icon="🚪"
        onConfirm={async () => {
          setIsLogoutDialogOpen(false);
          await signOut();
          router.replace('/');
        }}
      />

      {/* Theme Selection BottomSheet */}
      <BottomSheet
        isOpen={isThemeSheetOpen}
        onClose={() => setIsThemeSheetOpen(false)}
        title="Select Theme"
        subtitle="Choose your preferred color mode for the app">
        <View style={styles.sheetOptionsList}>
          {themeOptions.map((option) => {
            const isSelected = themePreference === option.mode;
            return (
              <TouchableOpacity
                key={option.mode}
                activeOpacity={0.7}
                style={[
                  styles.sheetOptionItem,
                  {
                    backgroundColor: isSelected
                      ? palette.background.elevated
                      : palette.background.surface,
                    borderColor: isSelected ? palette.primary.main : palette.border.default,
                  },
                ]}
                onPress={() => selectTheme(option.mode)}>
                <View style={styles.sheetOptionLeft}>
                  <View
                    style={[
                      styles.sheetOptionIconWrapper,
                      {
                        backgroundColor: isSelected
                          ? palette.primary.main
                          : palette.background.default,
                      },
                    ]}>
                    <Text style={styles.sheetOptionIcon}>{option.icon}</Text>
                  </View>
                  <View style={styles.sheetOptionTextContainer}>
                    <Text
                      style={[
                        styles.sheetOptionTitle,
                        {
                          color: palette.text.primary,
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.sheetOptionDesc, { color: palette.text.secondary }]}>
                      {option.desc}
                    </Text>
                  </View>
                </View>

                {/* Radio selection circle */}
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? palette.primary.main : palette.border.strong,
                      backgroundColor: isSelected ? palette.primary.main : 'transparent',
                    },
                  ]}>
                  {isSelected && <View style={styles.radioInnerDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>
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
  sectionHeader: {
    marginTop: 6,
    marginBottom: -4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
  },
  cardRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  valueBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 26,
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 14,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  profileMetaList: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  chevronText: {
    fontSize: 18,
    fontWeight: '700',
  },
  accountActionContainer: {
    marginTop: 10,
  },
  signOutButton: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
  },
  signInButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  /* BottomSheet Options Styling */
  sheetOptionsList: {
    gap: 12,
    paddingTop: 6,
    paddingBottom: 12,
  },
  sheetOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  sheetOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sheetOptionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOptionIcon: {
    fontSize: 20,
  },
  sheetOptionTextContainer: {
    flex: 1,
    gap: 2,
  },
  sheetOptionTitle: {
    fontSize: 15,
  },
  sheetOptionDesc: {
    fontSize: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
