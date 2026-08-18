import { useRef, useCallback, useState, useEffect } from 'react';
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
  volume = 100,
  currentTime,
  duration,
  isQueueOpen,
  isPanchayatOpen = false,
  unreadPanchayatCount = 0,
  onTogglePlay,
  onToggleMute,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleQueue,
  onOpenPatrika,
  onTogglePanchayat,
}) {
  const seekRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVolHovered, setIsVolHovered] = useState(false);
  const [isArtExpanded, setIsArtExpanded] = useState(false);
  const prevQueueOpenRef = useRef(isQueueOpen);

  // Automatically collapse art when queue list or panchayat opens
  useEffect(() => {
    if ((isQueueOpen && !prevQueueOpenRef.current) || isPanchayatOpen) {
      setIsArtExpanded(false);
    }
    prevQueueOpenRef.current = isQueueOpen;
  }, [isQueueOpen, isPanchayatOpen]);

  // Reset art expansion on window resize if resizing back to desktop (> 1366px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1366 && isArtExpanded) {
        setIsArtExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isArtExpanded]);

  // When art is expanded, touching or clicking anywhere outside the player dock collapses it
  useEffect(() => {
    if (!isArtExpanded) return;

    const handleOutsideClick = (e) => {
      // Do not collapse if tapping/clicking anywhere inside the player dock
      if (e.target.closest && e.target.closest('.player-dock')) {
        return;
      }
      setIsArtExpanded(false);
    };

    const timer = setTimeout(() => {
      document.addEventListener('touchstart', handleOutsideClick, { passive: true });
      document.addEventListener('mousedown', handleOutsideClick);
    }, 60);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isArtExpanded]);

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const toggleArtExpanded = useCallback(() => {
    // If the queue list is currently open, close queue list first
    if (isQueueOpen && onToggleQueue) {
      onToggleQueue();
    }
    // If Panchayat chat is currently open, close chat first
    if (isPanchayatOpen && onTogglePanchayat) {
      onTogglePanchayat();
    }
    setIsArtExpanded((prev) => !prev);
  }, [isQueueOpen, onToggleQueue, isPanchayatOpen, onTogglePanchayat]);

  const handleQueueToggleClick = useCallback(() => {
    // If art is expanded, close art first and then open queue list!
    if (isArtExpanded) {
      setIsArtExpanded(false);
    }
    if (onToggleQueue) {
      onToggleQueue();
    }
  }, [isArtExpanded, onToggleQueue]);

  const handlePanchayatClick = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      // If art is expanded, collapse art smoothly first
      if (isArtExpanded) {
        setIsArtExpanded(false);
      }
      if (onTogglePanchayat) {
        onTogglePanchayat();
      }
    },
    [isArtExpanded, onTogglePanchayat]
  );

  const isDraggingRef = useRef(false);

  const seekFromX = useCallback(
    (clientX, isDirectClick = false) => {
      if (typeof clientX !== 'number' || isNaN(clientX)) return;
      if (!seekRef.current || !duration || duration <= 0) return;
      const r = seekRef.current.getBoundingClientRect();
      if (!r.width || r.width <= 0) return;

      // If it's a direct click (not an active continuous drag), ensure the tap/click was actually on or adjacent to the seekbar
      if (isDirectClick) {
        if (clientX < r.left - 12 || clientX > r.right + 12) return;
      }

      const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      if (isNaN(ratio)) return;
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  const handleSeekClick = useCallback(
    (e) => {
      if (isDraggingRef.current) return;
      if (e && typeof e.clientX === 'number' && !isNaN(e.clientX)) {
        seekFromX(e.clientX, true);
      }
    },
    [seekFromX]
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return; // Only left-click drag
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      setIsDragging(true);
      if (e && typeof e.clientX === 'number' && !isNaN(e.clientX)) {
        seekFromX(e.clientX, true);
      }

      const onMouseMove = (ev) => {
        if (!isDraggingRef.current) return;
        if (ev && typeof ev.clientX === 'number' && !isNaN(ev.clientX)) {
          seekFromX(ev.clientX, false);
        }
      };

      const onMouseUp = () => {
        isDraggingRef.current = false;
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
      if (!e.touches || !e.touches[0]) return;
      e.stopPropagation();
      isDraggingRef.current = true;
      setIsDragging(true);
      const touch = e.touches[0];
      if (touch && typeof touch.clientX === 'number' && !isNaN(touch.clientX)) {
        seekFromX(touch.clientX, true);
      }

      const onTouchMove = (ev) => {
        if (!isDraggingRef.current) return;
        if (ev.cancelable) ev.preventDefault();
        ev.stopPropagation();
        if (ev.touches && ev.touches[0]) {
          const t = ev.touches[0];
          if (t && typeof t.clientX === 'number' && !isNaN(t.clientX)) {
            seekFromX(t.clientX, false);
          }
        }
      };

      const onTouchEnd = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
      };

      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    },
    [seekFromX]
  );

  const thumb = currentTrack
    ? `https://img.youtube.com/vi/${currentTrack.id}/hqdefault.jpg`
    : null;
  if (!currentTrack) return null;

  const pointerImg = modeSeekPointerImages[currentMode];
  const isWedding = currentMode === 'wedding';
  const showLoading = isPlaying && isBuffering;

  return (
    <div className={`player-dock capsule-dock mode-${currentMode} ${isArtExpanded ? 'dock-expanded' : ''}`}>
      {/* Dynamic Aura Glow */}
      <div className={`player-glow ${isPlaying ? 'on' : ''}`} />

      <div className={`player-glass capsule-glass ${isArtExpanded ? 'glass-expanded' : ''}`}>
        {/* Left Column: Vinyl Disc (or Expanded Large Card on Mobile/iPad) + Mobile Panchayat Button */}
        <div className={`player-left-col ${isArtExpanded ? 'left-col-expanded' : ''}`}>
          <div
            className={`art-disc-wrap ${isArtExpanded ? 'art-wrap-expanded' : ''}`}
            onClick={toggleArtExpanded}
            role="button"
            tabIndex={0}
            aria-label={isArtExpanded ? 'Close artwork' : 'Expand artwork'}
            title={isArtExpanded ? 'Click to close artwork' : 'Click to expand artwork'}
          >
            <div className={`art-disc ${isPlaying && !isArtExpanded ? 'spin' : ''} ${isArtExpanded ? 'as-card' : ''}`}>
              {thumb && (
                <img
                  src={thumb}
                  alt=""
                  className="art-disc-img"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                />
              )}
            </div>
            {!isArtExpanded && <div className="art-hole" />}
            {isArtExpanded && (
              <button
                className="art-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleArtExpanded();
                }}
                aria-label="Close artwork"
                title="Close"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Mobile-Only Circular Panchayat Button stacked below the CD thumbnail */}
          {!isArtExpanded && (
            <button
              className={`panchayat-circle-btn mobile-only-panchayat ${isPanchayatOpen ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePanchayat && onTogglePanchayat();
              }}
              aria-label="Panchayat Chat"
              title="Panchayat Chat (C)"
            >
              <svg
                className="panchayat-btn-svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              {unreadPanchayatCount > 0 && !isPanchayatOpen && (
                <span className="panchayat-unread-dot" />
              )}
            </button>
          )}
        </div>

        {/* Main Body (Track name + controls on top, seekbar below from CD to end when collapsed; or Name, Seek, Justified Controls when expanded) */}
        <div className={`player-body-wrap ${isArtExpanded ? 'body-expanded' : ''}`}>
          {/* Upper Row: Track Info + Controls (when collapsed on Desktop/iPad) */}
          <div className={`player-top-row ${isArtExpanded ? 'top-row-expanded' : ''}`}>
            <div className="info-row">
              <p className="track-name">{currentTrack.title}</p>
              <p className="track-artist">{currentTrack.artist}</p>
            </div>

            {/* Control Buttons */}
            <div className={`player-ctrls-wrap ${isArtExpanded ? 'ctrls-expanded' : ''}`}>
              <div className="ctrl-row capsule-ctrls">
                {/* Pill-Shaped Dhun Button */}
                <button
                  className="dhun-pill-btn"
                  onClick={onOpenPatrika}
                  aria-label="Dhun Card"
                  title="Dhun Card (P)"
                >
                  <img
                    src="/dhun-button.png"
                    alt=""
                    className="dhun-pill-icon"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <span className="dhun-pill-text">Dhun</span>
                </button>

                {/* Circular Panchayat Button right next to Dhun Button */}
                <button
                  className={`ctrl panchayat-circle-btn dock-panchayat-btn ${isPanchayatOpen ? 'active' : ''}`}
                  onClick={handlePanchayatClick}
                  aria-label="Panchayat Chat"
                  title="Panchayat Chat (C)"
                >
                  <svg
                    className="panchayat-btn-svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  {unreadPanchayatCount > 0 && !isPanchayatOpen && (
                    <span className="panchayat-unread-dot" />
                  )}
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
                      fill="currentColor"
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
                      style={{ '--vol-pct': `${isMuted ? 0 : volume}%` }}
                      aria-label="Volume"
                    />
                  </div>
                </div>

                {/* Queue Toggle Button */}
                <button
                  className={`ctrl queue-btn ${isQueueOpen ? 'open-close-active' : ''}`}
                  onClick={handleQueueToggleClick}
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

          {/* Golden Gota-Patti Seek Line: extending all the way across below track name & buttons! */}
          <div className={`seek-with-time-wrap ${isArtExpanded ? 'seek-expanded' : ''}`}>
            <span className="time-inline time-inline-left">{fmt(currentTime)}</span>
            <div
              className={`seek-bar gota-seek-bar ${isDragging ? 'dragging' : ''}`}
              ref={seekRef}
              onClick={handleSeekClick}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
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
                    onContextMenu={(e) => e.preventDefault()}
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
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : currentMode === 'devotional' ? (
                  <span className="seek-icon">🪔</span>
                ) : (
                  <span className="default-circle-pointer" />
                )}
              </div>
            </div>
            <span className="time-inline time-inline-right">{fmt(duration)}</span>
          </div>
        </div>

        {/* Desktop-Only Matching Circular Panchayat Disc Button (Symmetrical with Left Art Disc!) */}
        <button
          className={`desktop-panchayat-disc ${isPanchayatOpen ? 'active' : ''}`}
          onClick={handlePanchayatClick}
          aria-label="Panchayat Chat"
          title="Panchayat Chat (C)"
        >
          <div className="desktop-panchayat-inner">
            <svg
              className="desktop-panchayat-svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            {unreadPanchayatCount > 0 && !isPanchayatOpen && (
              <span className="panchayat-unread-dot" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
