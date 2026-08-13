import { useState, useEffect } from 'react';
import './Header.css';
import { modeConfig } from '../data/playlists';

const INSTAGRAM_URL = 'https://instagram.com/apna.culturez';

const leftModes = ['folk', 'wedding'];
const rightModes = ['trending', 'devotional'];

function getOrdinalDate(date = new Date()) {
  const day = date.getDate();
  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = fullMonths[date.getMonth()];
  const year = date.getFullYear();

  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) suffix = 'st';
  else if (day % 10 === 2 && day !== 12) suffix = 'nd';
  else if (day % 10 === 3 && day !== 13) suffix = 'rd';

  return `${day}${suffix} ${month}, ${year}`;
}

export default function Header({ currentMode, onModeChange }) {
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
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const renderNav = () => (
    <>
      {leftModes.map((m) => (
        <button
          key={m}
          className={`nav-btn ${currentMode === m ? 'active' : ''}`}
          onClick={() => onModeChange(m)}
        >
          {modeConfig[m].label}
        </button>
      ))}

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-logo"
        aria-label="Apna Culturez on Instagram"
      >
        <img src="/logo.png" alt="Apna Culturez" className="nav-logo-img" />
      </a>

      {rightModes.map((m) => (
        <button
          key={m}
          className={`nav-btn ${currentMode === m ? 'active' : ''}`}
          onClick={() => onModeChange(m)}
        >
          {modeConfig[m].label}
        </button>
      ))}
    </>
  );

  return (
    <>
      <header className="hdr">
        {/* Top-Left Corner: Exact "Apno Dhun Logo" (apno dhun logo.png) */}
        <div className="hdr-left">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hdr-logo-link"
            aria-label="Apno Dhun Instagram"
          >
            <img src="/apno-dhun-logo.png" alt="Apno Dhun" className="hdr-top-logo" />
          </a>
        </div>

        {/* Desktop Center Nav */}
        <nav className="hdr-nav desktop-only-nav">
          {renderNav()}
        </nav>

        {/* Top-Right Corner: Clock & Date Block */}
        <div className="hdr-right">
          {/* Simple time display for Mobile View */}
          <span className="simple-mobile-time">{simpleMobileTime}</span>

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

      {/* Mobile & iPad Footer Navigation */}
      <footer className="mobile-footer">
        <nav className="hdr-nav mobile-only-nav">
          {renderNav()}
        </nav>
      </footer>
    </>
  );
}
