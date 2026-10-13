import Constants from 'expo-constants';

export type Environment = 'development' | 'staging' | 'production';

interface AppConfig {
  env: Environment;
  appName: string;
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableDebugLogging: boolean;
  version: string;
}

const extra = Constants.expoConfig?.extra ?? {};

const ENV: Environment = (process.env.EXPO_PUBLIC_APP_ENV as Environment) || 'development';

export const Env: AppConfig = {
  env: ENV,
  appName: process.env.EXPO_PUBLIC_APP_NAME || 'Expo Starter',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl || '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.supabaseAnonKey || '',
  enableDebugLogging: ENV !== 'production',
  version: Constants.expoConfig?.version || '1.0.0',
};

export default Env;
