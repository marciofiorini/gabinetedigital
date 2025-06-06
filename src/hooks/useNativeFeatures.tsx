
import { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const useNativeFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({ connected: true, connectionType: 'wifi' });

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    
    if (Capacitor.isNativePlatform()) {
      initializeNativeFeatures();
    }
  }, []);

  const initializeNativeFeatures = async () => {
    try {
      // Hide splash screen after app loads
      await SplashScreen.hide();

      // Configure status bar
      await StatusBar.setStyle({ style: 'DEFAULT' });
      await StatusBar.setBackgroundColor({ color: '#8B5CF6' });

      // Listen for network changes
      const networkListener = await Network.addListener('networkStatusChange', (status) => {
        setNetworkStatus({
          connected: status.connected,
          connectionType: status.connectionType
        });
      });

      // Get initial network status
      const status = await Network.getStatus();
      setNetworkStatus({
        connected: status.connected,
        connectionType: status.connectionType
      });

      // Handle app state changes
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      // Handle back button
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });

      return () => {
        networkListener.remove();
      };
    } catch (error) {
      console.error('Error initializing native features:', error);
    }
  };

  const hideKeyboard = async () => {
    if (isNative) {
      await Keyboard.hide();
    }
  };

  const showKeyboard = async () => {
    if (isNative) {
      await Keyboard.show();
    }
  };

  const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      await Haptics.impact({ style });
    }
  };

  const shareContent = async (title: string, text: string, url?: string) => {
    if (isNative) {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: title
      });
    } else {
      // Fallback for web
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        // Copy to clipboard as fallback
        await navigator.clipboard.writeText(`${title}\n${text}\n${url || ''}`);
      }
    }
  };

  const exitApp = async () => {
    if (isNative) {
      await App.exitApp();
    }
  };

  return {
    isNative,
    networkStatus,
    hideKeyboard,
    showKeyboard,
    hapticFeedback,
    shareContent,
    exitApp
  };
};
