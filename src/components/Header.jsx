import { useState, useEffect } from 'react';
import './Header.css';
import { modeConfig } from '../data/playlists';

const INSTAGRAM_URL = 'https://instagram.com/apna.culturez';
const SPOTIFY_URL = 'https://open.spotify.com';
const YT_MUSIC_URL = 'https://music.youtube.com';

const leftModes = ['folk', 'wedding'];
const rightModes = ['trending', 'devotional'];

function getOrdinalDate(date = new Date(), shortMonth = false) {
  const day = date.getDate();
  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const shortMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = shortMonth ? shortMonths[date.getMonth()] : fullMonths[date.getMonth()];
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
      setDateStr(getOrdinalDate(now, false));
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
        {/* Top-Left: Simple Time on Mobile, Bebas Neue Clock & Date on Desktop/iPad */}
        <div className="hdr-left">
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

        {/* Desktop Center nav */}
        <nav className="hdr-nav desktop-only-nav">
          {renderNav()}
        </nav>

        {/* Top-Right: Social Links (Spotify + YT Music) */}
        <div className="hdr-right-links">
          <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" className="hdr-link" aria-label="Spotify">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            <span className="link-label">Spotify</span>
            <svg className="link-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>

          <a href={YT_MUSIC_URL} target="_blank" rel="noopener noreferrer" className="hdr-link" aria-label="YouTube Music">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/></svg>
            <span className="link-label">YT Music</span>
            <svg className="link-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
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
