import { useState, useEffect } from 'react';

// Live Listeners Hook
// If VITE_ABLY_API_KEY is present, connects to Ably Realtime Presence for 100% accurate active visitor count.
export function useLiveListeners() {
  const ablyKey = import.meta.env?.VITE_ABLY_API_KEY;
  const [listenerCount, setListenerCount] = useState(ablyKey ? 1 : 42);

  useEffect(() => {
    if (ablyKey) {
      let ablyClient = null;
      let channel = null;

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
          const clientId = `user-${Math.random().toString(36).substring(2, 9)}`;
          ablyClient = new Ably.Realtime({ key: ablyKey, clientId });
          channel = ablyClient.channels.get('apno-dhun-listeners');

          const fetchCurrentMembers = () => {
            channel.presence.get((err, members) => {
              if (!err && members) {
                console.log('[LiveListeners] Realtime members active:', members.length);
                setListenerCount(Math.max(1, members.length));
              }
            });
          };

          // Enter presence channel
          channel.presence.enter(null, (err) => {
            if (!err) {
              fetchCurrentMembers();
            }
          });

          // Subscribe to all presence events (enter, leave, update, present)
          channel.presence.subscribe(() => {
            fetchCurrentMembers();
          });
        })
        .catch((err) => {
          console.warn('[LiveListeners] Ably initialization error:', err);
        });

      return () => {
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

    // Fallback organic simulation ONLY if VITE_ABLY_API_KEY is not set
    const calculateBaseListeners = () => {
      const now = new Date();
      const hour = now.getHours();
      let base = 38;
      if (hour >= 18 && hour <= 23) base = 64;
      else if (hour >= 12 && hour < 18) base = 45;
      else if (hour >= 0 && hour < 6) base = 22;
      return base + Math.floor(Math.random() * 6);
    };

    setListenerCount(calculateBaseListeners());
    const interval = setInterval(() => {
      setListenerCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(18, prev + delta);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [ablyKey]);

  return listenerCount;
}
