import React, { useState, useEffect } from 'react';
import './OpenInChromeBanner.css';

export default function OpenInChromeBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const ua = navigator.userAgent || '';
      const isAndroid = /Android/i.test(ua);
      const isInstagram = /Instagram|FBAN|FBAV/i.test(ua);
      const dismissed = sessionStorage.getItem('dismiss_chrome_banner');

      if (isAndroid && isInstagram && !dismissed) {
        setShow(true);
      }
    } catch (e) {}
  }, []);

  if (!show) return null;

  const handleOpenChrome = () => {
    try {
      const host = window.location.host;
      const path = window.location.pathname;
      const search = window.location.search;
      const intentUrl = `intent://${host}${path}${search}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intentUrl;
    } catch (e) {}
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    try {
      sessionStorage.setItem('dismiss_chrome_banner', 'true');
    } catch (err) {}
    setShow(false);
  };

  return (
    <div className="open-chrome-banner" onClick={handleOpenChrome}>
      <div className="open-chrome-pill">
        <div className="open-chrome-left">
          <span className="chrome-logo-icon">🌐</span>
          <div className="open-chrome-text-col">
            <span className="open-chrome-title">सुणो Google Chrome में</span>
            <span className="open-chrome-sub">For seamless background audio & chat</span>
          </div>
        </div>
        <div className="open-chrome-right">
          <button className="open-chrome-btn" onClick={handleOpenChrome}>
            Open Chrome
          </button>
          <button className="open-chrome-close" onClick={handleDismiss} aria-label="Dismiss">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
