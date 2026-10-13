import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { Logger } from '@/services/logger';
import { supabase } from '@/services/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  sendPasswordReset: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        Logger.error('AuthStore', 'Failed to fetch initial session', error);
      }

      set({
        session: data?.session ?? null,
        user: data?.session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      });

      // Listen for subsequent auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });
      });
    } catch (err) {
      Logger.error('AuthStore', 'Unexpected init error', err);
      set({ isLoading: false, isInitialized: true });
    }
  },

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),

  signInWithEmail: async (email, password) => {
    try {
      set({ isLoading: true });

      // If test email/password or Supabase is using default placeholder credentials, mock login immediately
      const isTestAccount = email.trim() === 'test@example.com';
      const isPlaceholderConfig =
        !supabase ||
        (supabase as any).supabaseUrl?.includes('placeholder-url') ||
        process.env.EXPO_PUBLIC_SUPABASE_URL === undefined;

      if (isTestAccount || isPlaceholderConfig) {
        // Simulated network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mockUser: User = {
          id: 'test-user-id-001',
          app_metadata: { provider: 'email' },
          user_metadata: { name: 'Test User' },
          aud: 'authenticated',
          confirmation_sent_at: '',
          recovery_sent_at: '',
          email_change_sent_at: '',
          new_email: '',
          invited_at: '',
          action_link: '',
          email: email.trim() || 'test@example.com',
          phone: '',
          created_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          phone_confirmed_at: '',
          last_sign_in_at: new Date().toISOString(),
          role: 'authenticated',
          updated_at: new Date().toISOString(),
          identities: [],
          factors: [],
        };

        const mockSession: Session = {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: mockUser,
        };

        set({
          session: mockSession,
          user: mockUser,
          isLoading: false,
        });

        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      set({
        session: data.session,
        user: data.user,
        isLoading: false,
      });
      return { error: null };
    } catch (err) {
      set({ isLoading: false });
      return { error: err as Error };
    }
  },

  signUpWithEmail: async (email, password) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      set({
        session: data.session,
        user: data.user,
        isLoading: false,
      });
      return { error: null };
    } catch (err) {
      set({ isLoading: false });
      return { error: err as Error };
    }
  },

  sendPasswordReset: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ user: null, session: null, isLoading: false });
    } catch (err) {
      Logger.error('AuthStore', 'Error signing out', err);
      set({ user: null, session: null, isLoading: false });
    }
  },
}));

export default useAuthStore;
