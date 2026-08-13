import { useEffect, useRef } from 'react';

export function useShake(onShake, enabled = true) {
  const lastX = useRef(null);
  const lastY = useRef(null);
  const lastZ = useRef(null);
  const lastShakeTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const SHAKE_THRESHOLD = 16; // Threshold for natural phone shake
    const MIN_TIME_BETWEEN_SHAKES = 1000; // 1 second debounce

    const handleMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;

      if (lastX.current === null) {
        lastX.current = x;
        lastY.current = y;
        lastZ.current = z;
        return;
      }

      const deltaX = Math.abs(lastX.current - x);
      const deltaY = Math.abs(lastY.current - y);
      const deltaZ = Math.abs(lastZ.current - z);

      lastX.current = x;
      lastY.current = y;
      lastZ.current = z;

      const totalDelta = deltaX + deltaY + deltaZ;

      if (totalDelta > SHAKE_THRESHOLD) {
        const now = Date.now();
        if (now - lastShakeTime.current > MIN_TIME_BETWEEN_SHAKES) {
          lastShakeTime.current = now;

          // Haptic vibration feedback on supported phones
          if (navigator.vibrate) {
            try {
              navigator.vibrate([40, 30, 40]);
            } catch (e) {}
          }

          if (onShake) {
            onShake();
          }
        }
      }
    };

    // Request permission on iOS 13+ if required
    const initShake = async () => {
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function'
      ) {
        try {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handleMotion, false);
          }
        } catch (e) {
          // Fall back to standard listener
          window.addEventListener('devicemotion', handleMotion, false);
        }
      } else {
        window.addEventListener('devicemotion', handleMotion, false);
      }
    };

    initShake();

    return () => {
      window.removeEventListener('devicemotion', handleMotion, false);
    };
  }, [onShake, enabled]);
}
