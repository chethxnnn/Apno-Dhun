import { useRef, useCallback, useState } from 'react';
import './Player.css';

const modeSeekPointerImages = {
  wedding: '/player-icons/groom.png',
  folk: '/player-icons/dhol.png',
  trending: '/player-icons/fire.png',
  devotional: null,
};

export default function Player({
  currentMode = 'wedding',
  currentTrack,
  isPlaying,
  isBuffering,
  isMuted,
  isShuffle,
  volume = 100,
  currentTime,
  duration,
  isQueueOpen,
  onTogglePlay,
  onToggleMute,
  onToggleShuffle,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleQueue,
  onOpenPatrika,
  onPlayGhungroo,
}) {
  const seekRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVolHovered, setIsVolHovered] = useState(false);

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const seekFromX = useCallback(
    (clientX) => {
      if (!seekRef.current || !duration) return;
      const r = seekRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  const handleSeekClick = useCallback(
    (e) => {
      seekFromX(e.clientX);
    },
    [seekFromX]
  );

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
      seekFromX(e.clientX);

      const onMouseMove = (ev) => seekFromX(ev.clientX);
      const onMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [seekFromX]
  );

  const handleTouchStart = useCallback(
    (e) => {
      setIsDragging(true);
      const touch = e.touches[0];
      seekFromX(touch.clientX);
    },
    [seekFromX]
  );

  const handleTouchMove = useCallback(
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      seekFromX(touch.clientX);
    },
    [seekFromX]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const thumb = currentTrack
    ? `https://img.youtube.com/vi/${currentTrack.id}/mqdefault.jpg`
    : null;
  if (!currentTrack) return null;

  const pointerImg = modeSeekPointerImages[currentMode];
  const isWedding = currentMode === 'wedding';
  const showLoading = isPlaying && isBuffering;

  return (
    <div className="player-dock capsule-dock">
      {/* Dynamic Aura Glow */}
      <div className={`player-glow ${isPlaying ? 'on' : ''}`} />

      <div className="player-glass capsule-glass">
        {/* Top Block: Vinyl Disc + Track Info + Seek Line */}
        <div className="player-top-block">
          <div className="art-disc-wrap">
            <div className={`art-disc ${isPlaying ? 'spin' : ''}`}>
              {thumb && <img src={thumb} alt="" className="art-disc-img" />}
            </div>
            <div className="art-hole" />
          </div>

          <div className="player-content">
            <div className="info-row">
              <p className="track-name">{currentTrack.title}</p>
              <p className="track-artist">{currentTrack.artist}</p>
            </div>

            {/* Golden Gota-Patti Seek Line */}
            <div className="seek-with-time-wrap">
              <span className="time-inline time-inline-left">{fmt(currentTime)}</span>
              <div
                className={`seek-bar gota-seek-bar ${isDragging ? 'dragging' : ''}`}
                ref={seekRef}
                onClick={handleSeekClick}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pct)}
              >
                <div className="seek-track gota-track">
                  <div className="seek-fill gota-fill" style={{ width: `${pct}%` }} />
                </div>

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
              <span className="time-inline time-inline-right">{fmt(duration)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Block / Controls Row: Patrika - Shuffle - Prev - Play - Next - Vol - Queue */}
        <div className="player-bottom-block">
          <div className="ctrl-row capsule-ctrls">
            {/* Royal Patrika Button (Far Left / Swapped) */}
            <button
              className="ctrl patrika-btn"
              onClick={onOpenPatrika}
              aria-label="Royal Patrika"
              title="Royal Patrika (P)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </button>

            {/* Shuffle Toggle */}
            <button
              className={`ctrl shuffle ${isShuffle ? 'active' : ''}`}
              onClick={onToggleShuffle}
              aria-label={isShuffle ? 'Disable Shuffle' : 'Enable Shuffle'}
              title={isShuffle ? 'Shuffle ON (S)' : 'Shuffle OFF (S)'}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
              </svg>
            </button>

            {/* Previous */}
            <button className="ctrl prev" onClick={onPrev} aria-label="Previous" title="Previous (←)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            {/* Solid White Circle Play/Pause Button */}
            <button
              className={`ctrl play solid-white-play ${showLoading ? 'loading' : ''}`}
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {showLoading ? (
                <div className="spinner-dark" />
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#0c0c10"
                  className={`play-icon-svg ${isPlaying ? 'is-playing' : ''}`}
                >
                  {isPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              )}
            </button>

            {/* Next */}
            <button className="ctrl next" onClick={onNext} aria-label="Next" title="Next (→)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6h2v12h-2zm-2 6L5.5 6v12z" />
              </svg>
            </button>

            {/* Volume Container */}
            <div
              className={`vol-container ${isVolHovered ? 'expanded' : ''}`}
              onMouseEnter={() => setIsVolHovered(true)}
              onMouseLeave={() => setIsVolHovered(false)}
            >
              <button
                className={`ctrl mute ${isMuted ? 'muted' : ''}`}
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute (M)' : 'Volume (M)'}
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
              <div className="vol-slider-wrap">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange && onVolumeChange(Number(e.target.value))}
                  className="vol-slider"
                  aria-label="Volume"
                />
              </div>
            </div>

            {/* Queue Toggle Button (Far Right / Swapped) */}
            <button
              className={`ctrl queue-btn ${isQueueOpen ? 'open-close-active' : ''}`}
              onClick={onToggleQueue}
              aria-label={isQueueOpen ? 'Close Queue' : 'Open Queue'}
              title={isQueueOpen ? 'Close Queue (Q)' : 'Geet Maala Queue (Q)'}
            >
              {isQueueOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="queue-toggle-icon">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="queue-toggle-icon">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
