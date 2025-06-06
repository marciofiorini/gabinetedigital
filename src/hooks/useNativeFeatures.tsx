
import { useState, useEffect } from 'react';

export const useNativeFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({ connected: true, connectionType: 'wifi' });

  useEffect(() => {
    // Check if we're in a native environment
    setIsNative(false); // For now, disable native features until Capacitor is properly set up
  }, []);

  const hideKeyboard = async () => {
    // Mock implementation
    console.log('Hide keyboard called');
  };

  const showKeyboard = async () => {
    // Mock implementation
    console.log('Show keyboard called');
  };

  const hapticFeedback = async () => {
    // Mock implementation
    console.log('Haptic feedback called');
  };

  const shareContent = async (title: string, text: string, url?: string) => {
    // Fallback for web
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Copy to clipboard as fallback
      try {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url || ''}`);
        console.log('Content copied to clipboard');
      } catch (error) {
        console.log('Failed to copy to clipboard');
      }
    }
  };

  const exitApp = async () => {
    // Mock implementation
    console.log('Exit app called');
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
