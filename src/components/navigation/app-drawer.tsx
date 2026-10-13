import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth-store';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;
  const { user, signOut } = useAuthStore();

  const navigateTo = (path: '/' | '/explore' | '/components' | '/settings' | '/(auth)/login') => {
    onClose();
    router.push(path as any);
  };

  const navItems = [
    { label: 'Home', icon: '🏠', path: '/' as const },
    { label: 'Component Library', icon: '🧩', path: '/components' as const, badge: 'NEW' },
    { label: 'Explore', icon: '🔍', path: '/explore' as const },
  ];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            styles.drawerContent,
            {
              backgroundColor: palette.background.surface,
              paddingTop: Math.max(insets.top, 24) + 12,
              paddingBottom: Math.max(insets.bottom, 20),
              borderRightColor: palette.border.default,
            },
          ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: palette.primary.main }]}>
              <Text style={styles.avatarText}>
                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: palette.text.primary }]}>
                {user?.email ? user.email.split('@')[0] : 'Guest User'}
              </Text>
              <Text style={[styles.userEmail, { color: palette.text.secondary }]}>
                {user?.email ?? 'Not signed in'}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: palette.border.subtle }]} />

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Navigation Items */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: palette.text.disabled }]}>
                NAVIGATION & SHOWCASE
              </Text>

              {navItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.7}
                  style={[styles.navItem, { borderColor: palette.border.subtle }]}
                  onPress={() => navigateTo(item.path)}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <Text style={[styles.itemText, { color: palette.text.primary }]}>
                    {item.label}
                  </Text>
                  {item.badge && (
                    <View style={[styles.badge, { backgroundColor: palette.primary.main }]}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Preferences & Settings */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: palette.text.disabled }]}>
                PREFERENCES
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.navItem, { borderColor: palette.border.subtle }]}
                onPress={() => navigateTo('/settings')}>
                <Text style={styles.itemIcon}>⚙️</Text>
                <Text style={[styles.itemText, { color: palette.text.primary }]}>
                  Settings
                </Text>
                <Text style={[styles.chevron, { color: palette.text.secondary }]}>›</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer Auth Action */}
          <View style={styles.footer}>
            {user ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.authButton, { backgroundColor: palette.background.default }]}
                onPress={async () => {
                  onClose();
                  await signOut();
                }}>
                <Text style={[styles.authButtonText, { color: palette.status.error.main }]}>
                  🚪 Log Out
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.authButton, { backgroundColor: palette.primary.main }]}
                onPress={() => navigateTo('/(auth)/login')}>
                <Text style={[styles.authButtonText, { color: '#FFFFFF' }]}>
                  🔐 Sign In
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flexDirection: 'row',
  },
  drawerContent: {
    width: Math.min(Dimensions.get('window').width * 0.82, 340),
    height: '100%',
    paddingHorizontal: 20,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 12,
  },
  section: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 12,
  },
  itemIcon: {
    fontSize: 20,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  footer: {
    paddingTop: 16,
  },
  authButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default AppDrawer;
