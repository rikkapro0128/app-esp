/// <reference types="@capacitor/splash-screen" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Smart Miru',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  },
  loggingBehavior: 'production',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchFadeOutDuration: 0,
      launchAutoHide: true,
    }
  }
};

export default config;
