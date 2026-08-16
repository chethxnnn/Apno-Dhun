import { useState, useEffect, useRef } from 'react';
import './GeetMaalaModal.css';

export default function GeetMaalaModal({
  isOpen,
  onClose,
  playlist = [],
  currentTrackIndex = 0,
  isPlaying = false,
  currentMode = 'wedding',
  onSelectTrack,
  onModeChange,
}) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeTimer = useRef(null);
  const activeItemRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setIsMounted(true);
      setIsClosing(false);

      // Auto-scroll the currently playing song into view smoothly
      const scrollTimer = setTimeout(() => {
        if (activeItemRef.current) {
          activeItemRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }, 120);

      return () => clearTimeout(scrollTimer);
    } else if (isMounted && !isClosing) {
      setIsClosing(true);
      closeTimer.current = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, 260);
    } else if (!isOpen && !isMounted) {
      setIsClosing(false);
    }

    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [isOpen, isMounted, isClosing, currentTrackIndex]);

  if (!isOpen && !isMounted) return null;
  if (!isMounted) return null;

  const modeTabs = [
    { key: 'folk', label: 'LOK' },
    { key: 'wedding', label: 'BYAAV' },
    { key: 'dhh', label: 'DHH' },
    { key: 'trending', label: 'TREND' },
    { key: 'devotional', label: 'BHAKTI' },
  ];

  const handleShareClick = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: 'Apno Dhun | अपणो धुन',
      text: 'Listen to authentic Rajasthani music on Apno Dhun',
      url: window.location.origin || 'https://apnodhun.in',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Native share failed, falling back to clipboard:', err);
        } else {
          return;
        }
      }
    }

    // Fallback: Copy URL to Clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <div
      className={`queue-backdrop-fade ${isClosing ? 'closing' : ''}`}
      onClick={onClose}
    >
      <div
        className={`queue-fixed-attached queue-mode-${currentMode} ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="queue-card">
          {/* Top Vibe Navigation Tabs & Meta Header */}
          <div className="queue-tabs-row">
            <div className="queue-tabs">
              {modeTabs.map((tab) => {
                const isActive = currentMode === tab.key;
                return (
                  <button
                    key={tab.key}
                    className={`queue-tab ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (!isOpen || isClosing) return;
                      onModeChange && onModeChange(tab.key);
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="queue-meta-right">
              <span className="tracks-count">{playlist.length} tracks</span>
            </div>
          </div>

          {/* Track List Drawer matching busdriver.wtf exact layout & fonts */}
          <div className="queue-list">
            {playlist.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              const thumb = `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`;

              return (
                <div
                  key={`${track.id}-${idx}`}
                  ref={isCurrent ? activeItemRef : null}
                  className={`queue-item ${isCurrent ? 'active-card' : ''}`}
                  onClick={() => {
                    if (!isOpen || isClosing) return;
                    onSelectTrack(idx);
                  }}
                >
                  <div className="queue-left-lead">
                    {isCurrent ? (
                      <span className="eq-orange-dots">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      <span className="queue-num-idx">{idx + 1}</span>
                    )}

                    <img
                      src={thumb}
                      alt=""
                      className="queue-thumb-art"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>

                  <div className="queue-info-col">
                    <p className="queue-title-bold">{track.title || 'Rajasthani Track'}</p>
                    <p className="queue-artist-sub">{track.artist || 'Apna Culturez'}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Functional Share Button */}
          <div className="queue-footer">
            <button
              className={`queue-share-card ${copied ? 'copied-active' : ''}`}
              onClick={handleShareClick}
              title="Click to Share Website Link"
            >
              <div className="share-icon-wrap">
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 5l-1.42 1.42-1.59-1.59V16h-2V4.83L9.42 6.42 8 5l5-5 5 5zm4 7v9H4v-9H2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-9h-2z" />
                  </svg>
                )}
              </div>
              <div className="queue-share-meta">
                <span className="share-heading">
                  {copied ? 'Link Copied to Clipboard!' : 'Share Apno Dhun'}
                </span>
                <span className="share-subdomain">apnodhun.in</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
