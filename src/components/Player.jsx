import { useRef, useCallback } from 'react';
import './Player.css';

const modeSeekPointerImages = {
  wedding: '/player-icons/groom.png',   // Groom moving pointer
  folk: '/player-icons/dhol.png',       // Dhol moving pointer
  trending: '/player-icons/fire.png',   // Fire moving pointer
  devotional: null,                    // Diya emoji/glow for Bhakti
};

export default function Player({
  currentMode = 'wedding',
  currentTrack,
  isPlaying,
  isBuffering,
  isMuted,
  currentTime,
  duration,
  onTogglePlay,
  onToggleMute,
  onNext,
  onPrev,
  onSeek,
}) {
  const seekRef = useRef(null);

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = useCallback(
    (e) => {
      if (!seekRef.current || !duration) return;
      const r = seekRef.current.getBoundingClientRect();
      onSeek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration);
    },
    [duration, onSeek]
  );

  const thumb = currentTrack
    ? `https://img.youtube.com/vi/${currentTrack.id}/hqdefault.jpg`
    : null;
  if (!currentTrack) return null;

  const pointerImg = modeSeekPointerImages[currentMode];
  const isWedding = currentMode === 'wedding';

  return (
    <div className="player-dock">
      <div className={`player-glow ${isPlaying ? 'on' : ''}`} />
      <div className="player-glass">
        {/* Album art vinyl */}
        <div className="art-box">
          <div className={`art-disc ${isPlaying ? 'spin' : ''}`}>
            {thumb && <img src={thumb} alt="" className="art-img" />}
          </div>
          <div className="art-hole" />
        </div>

        {/* Info + seek */}
        <div className="info-col">
          <p className="track-name">{currentTrack.title}</p>
          <p className="track-artist">{currentTrack.artist}</p>

          <div
            className="seek-bar"
            ref={seekRef}
            onClick={handleSeek}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
          >
            <div className="seek-track">
              <div className="seek-fill" style={{ width: `${pct}%` }} />
            </div>

            {/* In Byaav mode: Stationary Bride image at 100% (right end of line) */}
            {isWedding && (
              <div className="seek-target-bride">
                <img
                  src="/player-icons/bride.png"
                  alt="Bride"
                  className="bride-seek-img"
                  draggable="false"
                />
              </div>
            )}

            {/* Custom Vibe Moving Seek Pointer */}
            <div
              className={`seek-thumb vibe-thumb-${currentMode}`}
              style={{ left: `${pct}%` }}
            >
              {pointerImg ? (
                <img
                  src={pointerImg}
                  alt=""
                  className={`pointer-img pointer-${currentMode}`}
                  draggable="false"
                />
              ) : (
                <span className="seek-icon">🪔</span>
              )}
            </div>
          </div>

          <div className="time-row">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="ctrl-row">
          {/* Mute button */}
          <button
            className={`ctrl mute ${isMuted ? 'muted' : ''}`}
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>

          <button className="ctrl prev" onClick={onPrev} aria-label="Previous" title="Previous (Left Arrow)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            className={`ctrl play ${isBuffering ? 'loading' : ''}`}
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isBuffering ? (
              <div className="spinner" />
            ) : isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button className="ctrl next" onClick={onNext} aria-label="Next" title="Next (Right Arrow)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6h2v12h-2zm-2 6L5.5 6v12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
