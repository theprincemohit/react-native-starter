import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components/feedback/toast';
import { AppButton } from '@/components/ui/app-button';
import { FormInput } from '@/components/ui/form-input';
import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth-store';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;
  const { sendPasswordReset } = useAuthStore();
  const { showToast } = useToast();

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    const { error: resetError } = await sendPasswordReset(email);
    setIsSubmitting(false);

    if (resetError) {
      showToast({
        type: 'error',
        message: 'Request Failed',
        description: resetError.message,
      });
    } else {
      setIsSent(true);
      showToast({
        type: 'success',
        message: 'Reset Email Sent',
        description: 'Check your inbox for password recovery instructions.',
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background.default }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[styles.title, { color: palette.text.primary }]}>
              Reset Password
            </Text>
            <Text style={[styles.subtitle, { color: palette.text.secondary }]}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: palette.background.surface, borderColor: palette.border.subtle }]}>
            {isSent ? (
              <View style={styles.sentContainer}>
                <Text style={styles.sentIcon}>✉️</Text>
                <Text style={[styles.sentTitle, { color: palette.text.primary }]}>
                  Check Your Inbox
                </Text>
                <Text style={[styles.sentMessage, { color: palette.text.secondary }]}>
                  We sent recovery instructions to{' '}
                  <Text style={{ fontWeight: '600', color: palette.text.primary }}>{email}</Text>.
                </Text>
                <AppButton
                  title="Resend Link"
                  variant="outline"
                  onPress={handleReset}
                  isLoading={isSubmitting}
                  style={styles.resendButton}
                />
              </View>
            ) : (
              <>
                <FormInput
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(undefined);
                  }}
                  error={error}
                />

                <AppButton
                  title="Send Reset Link"
                  onPress={handleReset}
                  isLoading={isSubmitting}
                  style={styles.button}
                />
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={[styles.boldLink, { color: palette.primary.main }]}>
                ← Back to Sign In
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      },
    }),
  },
  button: {
    marginTop: 8,
  },
  sentContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  sentIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  sentTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  sentMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  resendButton: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 28,
  },
  boldLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
