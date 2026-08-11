import { useState, useEffect } from 'react';

// Live Listeners Hook
// If VITE_ABLY_API_KEY is configured in Vercel, loads Ably CDN and tracks 100% real-time presence.
// Otherwise, uses dynamic organic listener pulse.
export function useLiveListeners() {
  const [listenerCount, setListenerCount] = useState(42);

  useEffect(() => {
    const ablyKey = import.meta.env?.VITE_ABLY_API_KEY;

    if (ablyKey) {
      let ablyClient = null;
      let channel = null;

      // Load Ably browser SDK dynamically from CDN (Zero NPM dependency required)
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

          // Enter presence channel
          channel.presence.enter();

          // Update count whenever someone enters or leaves
          const updatePresenceCount = () => {
            channel.presence.get((err, members) => {
              if (!err && members) {
                setListenerCount(Math.max(1, members.length));
              }
            });
          };

          channel.presence.subscribe(updatePresenceCount);
          updatePresenceCount();
        })
        .catch((err) => {
          console.warn('Ably realtime presence connection failed:', err);
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

    // Organic listener pulse fallback
    const calculateBaseListeners = () => {
      const now = new Date();
      const hour = now.getHours();
      let base = 38;
      if (hour >= 18 && hour <= 23) {
        base = 64; // peak evening IST
      } else if (hour >= 12 && hour < 18) {
        base = 45; // afternoon
      } else if (hour >= 0 && hour < 6) {
        base = 22; // late night
      }
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
  }, []);

  return listenerCount;
}
