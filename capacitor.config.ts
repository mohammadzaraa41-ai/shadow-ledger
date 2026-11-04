import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mohammadalzaraa.shadowledger',
  appName: 'الكذّاب بيننا',
  webDir: 'dist',
  // Matches the app theme so the webview never flashes white while the bundle loads (iOS and Android).
  backgroundColor: '#1a0b3b',
};

export default config;
