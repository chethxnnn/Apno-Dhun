import { useState, useEffect } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    // Phase 1: At 3.0 seconds, smoothly dissolve red background & glide logo to header position
    const flyTimer = setTimeout(() => {
      setIsFlying(true);
    }, 3000);

    // Phase 2: At 3.95 seconds (as soon as the logo lands in place), hand over cleanly to the header
    const finishTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('apno_dhun_splash_seen', 'true');
      } catch (e) {}
      onComplete && onComplete();
    }, 3950);

    return () => {
      clearTimeout(flyTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen-container ${isFlying ? 'fading-bg' : ''}`}>
      {/* Subtle Golden Ambient Aura */}
      <div className={`splash-aura ${isFlying ? 'hide-elements' : ''}`} aria-hidden="true" />

      {/* Proportional Flying Logo Stage */}
      <div className={`splash-logo-stage ${isFlying ? 'flying-to-header' : ''}`}>
        <img
          src="/apno-dhun-logo.png"
          alt="Apno Dhun"
          className="splash-logo-img"
        />
      </div>

      {/* Bottom Subtitle & Minimalist Loading Progress Bar */}
      <div className={`splash-bottom-wrap ${isFlying ? 'hide-elements' : ''}`}>
        <span className="splash-subtitle-text">
          Rajasthan's First Music Streaming App
        </span>
        <div className="splash-progress-bar-wrap" aria-hidden="true">
          <div className="splash-progress-bar-fill" />
        </div>
      </div>
    </div>
  );
}
