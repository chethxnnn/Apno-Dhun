import { useState, useEffect } from 'react';
import './Header.css';
import CircularVibeNav from './CircularVibeNav';

const INSTAGRAM_URL = 'https://instagram.com/apna.culturez';

function getOrdinalDate(date = new Date()) {
  const day = date.getDate();
  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const month = fullMonths[date.getMonth()];
  const year = date.getFullYear();

  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) suffix = 'st';
  else if (day % 10 === 2 && day !== 12) suffix = 'nd';
  else if (day % 10 === 3 && day !== 13) suffix = 'rd';

  return `${day}${suffix} ${month}, ${year}`;
}

export default function Header({ currentMode, onModeChange, listenerCount = null }) {
  const [timeStr, setTimeStr] = useState('');
  const [secStr, setSecStr] = useState('');
  const [ampmStr, setAmpmStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [simpleMobileTime, setSimpleMobileTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'pm' : 'am';
      const h12 = h % 12 || 12;

      setTimeStr(`${h12.toString().padStart(2, '0')}:${m}`);
      setSecStr(s);
      setAmpmStr(ampm);
      setDateStr(getOrdinalDate(now));
      setSimpleMobileTime(`${h12}:${m} ${ampm}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="hdr">
        {/* Top-Left Corner: Royal Crest Mark (Desktop/iPad) OR Date/Time (Mobile) */}
        <div className="hdr-left">
          {/* Desktop/iPad: Royal Crest Badge */}
          <div className="royal-crest-wrap desktop-crest">
            <span className="royal-crest-text">AD</span>
          </div>

          {/* Mobile Top-Left: Date display */}
          <div className="mobile-top-date">
            <span className="mobile-date-text">{dateStr}</span>
          </div>
        </div>

        {/* Center: Mode (Vibe) Pill Navigation (Desktop/iPad only) */}
        <div className="hdr-center desktop-nav">
          <nav className="mode-nav" aria-label="Music Modes">
            <CircularVibeNav currentMode={currentMode} onModeChange={onModeChange} isMobile={false} />
          </nav>
        </div>

        {/* Mobile Top-Center Block: Time on top + Mehmaan directly below */}
        <div className="mobile-header-center">
          <span className="mobile-center-time">{simpleMobileTime}</span>
          {listenerCount ? (
            <div className="mobile-center-listeners">
              <img
                src="/safa-icon.png"
                alt="Safa"
                className="mobile-safa-icon"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
              <span className="mobile-listeners-text">
                <strong className="mobile-listeners-bold">{listenerCount}</strong> Mehmaan
              </span>
            </div>
          ) : null}
        </div>

        {/* Top-Right Corner: Clock (Desktop/iPad) OR Apna Culturez Logo (Mobile) */}
        <div className="hdr-right">
          {/* Mobile Top-Right: Apna Culturez Logo */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-top-apna-logo"
            aria-label="Apna Culturez on Instagram"
          >
            <img
              src="/logo.png"
              alt="Apna Culturez"
              className="mobile-apna-logo-img"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </a>

          {/* Stretched Bebas Neue Clock Block for Desktop and iPad */}
          <div className="clock-block-responsive">
            <div className="clock-time-main">
              <span className="time-digits">{timeStr}</span>
              <div className="time-sub-stack">
                <span className="time-sec-sup">{secStr}</span>
                <span className="time-ampm">{ampmStr}</span>
              </div>
            </div>
            <div className="clock-date-sub">
              <span>{dateStr}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & iPad Footer Infinite Circular Ring Navigation */}
      <footer className="mobile-footer">
        <nav className="hdr-nav mobile-only-nav">
          <CircularVibeNav currentMode={currentMode} onModeChange={onModeChange} isMobile={true} />
        </nav>
      </footer>
    </>
  );
}
