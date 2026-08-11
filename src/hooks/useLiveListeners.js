import { useState, useEffect } from 'react';

// Live Listeners Hook (Hardcoded / Dynamic pulse for local development)
export function useLiveListeners() {
  const [listenerCount, setListenerCount] = useState(42);

  useEffect(() => {
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
        const delta = Math.floor(Math.random() * 5) - 2; // gentle -2 to +2 fluctuation
        return Math.max(18, prev + delta);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return listenerCount;
}
