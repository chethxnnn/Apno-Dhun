import { useState, useEffect } from 'react';

// Live Listeners Hook
// Handles Ably Realtime Presence with automatic fallback to organic pulse if key is invalid/missing.
export function useLiveListeners() {
  const ablyKey = import.meta.env?.VITE_ABLY_API_KEY;
  const [listenerCount, setListenerCount] = useState(38);

  useEffect(() => {
    // Dynamic organic fallback interval generator
    const calculateBaseListeners = () => {
      const now = new Date();
      const hour = now.getHours();
      let base = 38;
      if (hour >= 18 && hour <= 23) base = 64;
      else if (hour >= 12 && hour < 18) base = 45;
      else if (hour >= 0 && hour < 6) base = 22;
      return base + Math.floor(Math.random() * 6);
    };

    const startFallbackInterval = () => {
      setListenerCount(calculateBaseListeners());
      return setInterval(() => {
        setListenerCount((prev) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          return Math.max(18, prev + delta);
        });
      }, 4000);
    };

    if (ablyKey && ablyKey.includes(':')) {
      let ablyClient = null;
      let channel = null;
      let fallbackTimer = null;

      console.log('[LiveListeners] VITE_ABLY_API_KEY detected. Initializing Realtime Presence...');

      // Load Ably browser SDK from CDN
      const loadAblyScript = () => {
        return new Promise((resolve, reject) => {
          if (window.Ably) {
            resolve(window.Ably);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://cdn.ably.com/lib/ably.min-1.js';
          script.onload = () => resolve(window.Ably);
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      loadAblyScript()
        .then((Ably) => {
          try {
            const clientId = `user-${Math.random().toString(36).substring(2, 9)}`;
            ablyClient = new Ably.Realtime({ key: ablyKey, clientId });
            channel = ablyClient.channels.get('apno-dhun-listeners');

            const fetchCurrentMembers = () => {
              channel.presence.get((err, members) => {
                if (!err && members) {
                  console.log('[LiveListeners] Realtime active listeners count:', members.length);
                  setListenerCount(Math.max(1, members.length));
                }
              });
            };

            // Enter presence channel
            channel.presence.enter(null, (err) => {
              if (err) {
                console.warn('[LiveListeners] Ably presence enter error:', err);
                fallbackTimer = startFallbackInterval();
              } else {
                fetchCurrentMembers();
              }
            });

            // Subscribe to all presence events
            channel.presence.subscribe(() => {
              fetchCurrentMembers();
            });
          } catch (err) {
            console.warn('[LiveListeners] Ably initialization exception:', err);
            fallbackTimer = startFallbackInterval();
          }
        })
        .catch((err) => {
          console.warn('[LiveListeners] Ably script load error:', err);
          fallbackTimer = startFallbackInterval();
        });

      return () => {
        if (fallbackTimer) clearInterval(fallbackTimer);
        if (channel) {
          try {
            channel.presence.leave();
          } catch (e) {}
        }
        if (ablyClient) {
          try {
            ablyClient.close();
          } catch (e) {}
        }
      };
    }

    // If no valid Ably key (must contain a colon ':'), use organic pulse fallback
    if (ablyKey && !ablyKey.includes(':')) {
      console.warn('[LiveListeners] VITE_ABLY_API_KEY is invalid (must be in format appId.keyId:secret). Falling back to organic counter.');
    }

    const fallbackTimer = startFallbackInterval();
    return () => clearInterval(fallbackTimer);
  }, [ablyKey]);

  return listenerCount;
}
