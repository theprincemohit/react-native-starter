import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppDrawer } from '@/components/navigation/app-drawer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header with Drawer Hamburger Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.menuButton, { backgroundColor: palette.background.surface, borderColor: palette.border.default }]}
            activeOpacity={0.7}
            onPress={() => setIsDrawerOpen(true)}>
            <Text style={[styles.menuIcon, { color: palette.text.primary }]}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Center Welcome */}
        <View style={styles.centerContent}>
          <ThemedText type="title" style={styles.title}>
            Welcome User
          </ThemedText>
        </View>

        {/* Component Drawer */}
        <AppDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
