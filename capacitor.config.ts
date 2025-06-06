
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f0c082214bf34cd9a37a4aba9b6ae123',
  appName: 'gabinetedigital',
  webDir: 'dist',
  server: {
    url: 'https://f0c08221-4bf3-4cd9-a37a-4aba9b6ae123.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#8B5CF6'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  }
};

export default config;
