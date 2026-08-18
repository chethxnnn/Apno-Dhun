import { useState, useEffect, useRef } from 'react';
import './InstallPwaBanner.css';

const SHOW_DURATION_MS = 10000; // Visible for 10 seconds
const REPEAT_INTERVAL_MS = 10 * 60 * 1000; // Comes every 10 minutes
const INITIAL_DELAY_MS = 6000; // 6 seconds on initial visit

export default function InstallPwaBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const hideTimerRef = useRef(null);
  const closeAnimTimerRef = useRef(null);

  const triggerClose = () => {
    setIsClosing(true);
    if (closeAnimTimerRef.current) clearTimeout(closeAnimTimerRef.current);
    closeAnimTimerRef.current = setTimeout(() => {
      setShowBanner(false);
      setIsClosing(false);
    }, 350);
  };

  useEffect(() => {
    // If running in standalone mode (already installed), do not show
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    // Show initial banner after a short delay
    const initialTimer = setTimeout(() => {
      setShowBanner(true);
      setIsClosing(false);
    }, INITIAL_DELAY_MS);

    // Repeat every 10 minutes
    const repeatInterval = setInterval(() => {
      setShowBanner(true);
      setIsClosing(false);
    }, REPEAT_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(repeatInterval);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (closeAnimTimerRef.current) clearTimeout(closeAnimTimerRef.current);
    };
  }, []);

  // Whenever banner is shown, auto-hide it after 10 seconds
  useEffect(() => {
    if (showBanner && !isClosing) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        triggerClose();
      }, SHOW_DURATION_MS);
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [showBanner, isClosing]);

  const handleDismiss = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    triggerClose();
  };

  if (!showBanner) return null;

  return (
    <div className={`pwa-banner mobile-only-pwa ${isClosing ? 'pwa-banner-closing' : ''}`}>
      <img src="/favicon.png" alt="Apno Dhun" className="pwa-logo-left" />

      <div className="pwa-text-lines">
        <p className="pwa-line-1">Keep Apno Dhun on your home screen</p>
        <p className="pwa-line-2">
          Tap{' '}
          <span className="pwa-share-icon-inline">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 5l-1.42 1.42-1.59-1.59V16h-2V4.83L9.42 6.42 8 5l5-5 5 5zm4 7v9H4v-9H2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-9h-2z" />
            </svg>
          </span>{' '}
          then add to home screen
        </p>
      </div>

      <button className="pwa-close-btn subtle-close-btn" onClick={handleDismiss} aria-label="Close">
        ✕
      </button>
    </div>
  );
}
