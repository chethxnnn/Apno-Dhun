import { useState, useEffect } from 'react';
import './InstallPwaBanner.css';

export default function InstallPwaBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 900;
    if (!isMobile) return;

    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="pwa-banner mobile-only-pwa">
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
