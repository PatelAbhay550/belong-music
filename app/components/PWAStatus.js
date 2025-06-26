"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if PWA is installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = window.navigator.standalone;
      setIsInstalled(isStandalone || isIOS);
    };

    // Check online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check for service worker updates
    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.addEventListener('updatefound', () => {
            setUpdateAvailable(true);
          });
        }
      }
    };

    checkInstallStatus();
    handleOnlineStatus();
    checkForUpdates();

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  };

  if (!isInstalled) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {/* Online/Offline Status */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          isOnline 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}
      >
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </motion.div>

      {/* Update Available */}
      {updateAvailable && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-xs"
        >
          <div className="flex items-center justify-between space-x-2">
            <span>Update available</span>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              Update
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
