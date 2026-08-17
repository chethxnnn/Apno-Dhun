import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './GeetMaalaModal.css';
import { getActiveNewVibeKey } from '../data/newVibeConfig';
import { trackMatchesQuery, vibeLabelMap } from '../data/searchAliases';

// Helper: Try to get a richer playlist for a vibe from localStorage cache
function getCachedPlaylist(vibeKey) {
  try {
    const cacheKey = `apno_dhun_yt_cache_${vibeKey}`;
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cachedData = JSON.parse(cachedStr);
      if (Array.isArray(cachedData.items) && cachedData.items.length > 0) {
        return cachedData.items;
      }
    }
  } catch (e) {
    /* ignore */
  }
  return null;
}

export default function GeetMaalaModal({
  isOpen,
  onClose,
  playlist = [],
  allPlaylists = {},
  currentTrackIndex = 0,
  isPlaying = false,
  currentMode = 'wedding',
  onSelectTrack,
  onModeChange,
}) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const closeTimer = useRef(null);
  const activeItemRef = useRef(null);
  const searchInputRef = useRef(null);
  const queueContainerRef = useRef(null);

  // Build enriched playlists map — merge activePlaylists with localStorage cache
  const enrichedPlaylists = useMemo(() => {
    const vibeKeys = ['folk', 'wedding', 'dhh', 'trending', 'devotional'];
    const enriched = {};
    vibeKeys.forEach((key) => {
      const fromProps = allPlaylists[key];
      const fromCache = getCachedPlaylist(key);
      // Use whichever has more songs (richer data)
      if (fromProps && fromCache) {
        enriched[key] = fromProps.length >= fromCache.length ? fromProps : fromCache;
      } else {
        enriched[key] = fromProps || fromCache || [];
      }
    });
    return enriched;
  }, [allPlaylists]);

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

  // Clear search when queue closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setIsSearchFocused(false);
      setKeyboardOffset(0);
    }
  }, [isOpen]);

  // Smooth keyboard-aware repositioning for mobile/iPad
  useEffect(() => {
    if (!isSearchFocused || !window.visualViewport) {
      setKeyboardOffset(0);
      return;
    }

    const viewport = window.visualViewport;
    const fullHeight = window.innerHeight;

    const handleResize = () => {
      const keyboardHeight = fullHeight - viewport.height;
      // Only adjust if keyboard is meaningfully open (> 100px)
      if (keyboardHeight > 100) {
        setKeyboardOffset(keyboardHeight);
      } else {
        setKeyboardOffset(0);
      }
    };

    viewport.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, [isSearchFocused]);

  // Generate random placeholder from a DIFFERENT vibe's songs
  const randomPlaceholder = useMemo(() => {
    const otherVibeKeys = Object.keys(enrichedPlaylists).filter((k) => k !== currentMode);
    if (otherVibeKeys.length === 0) return 'Search songs...';

    // Collect all songs from other vibes
    const otherSongs = [];
    otherVibeKeys.forEach((key) => {
      const pl = enrichedPlaylists[key];
      if (pl && pl.length > 0) {
        pl.forEach((track) => {
          if (track.title) otherSongs.push(track.title);
        });
      }
    });

    if (otherSongs.length === 0) return 'Search songs...';

    const randomTitle = otherSongs[Math.floor(Math.random() * otherSongs.length)];
    // Truncate if too long
    const truncated = randomTitle.length > 24 ? randomTitle.substring(0, 24) + '…' : randomTitle;
    return `Search ${truncated}`;
  }, [enrichedPlaylists, currentMode, isOpen]); // regenerate each time queue opens

  // Build cross-vibe search results
  const searchResults = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return null; // null means "show normal playlist"

    const results = [];
    const vibeOrder = ['folk', 'wedding', 'dhh', 'trending', 'devotional'];

    // Search current vibe first — use `playlist` (resolvedPlaylist with enriched titles)
    playlist.forEach((track, idx) => {
      if (trackMatchesQuery(track, query)) {
        results.push({
          track,
          vibeKey: currentMode,
          trackIndex: idx,
          isCrossVibe: false,
        });
      }
    });

    // Then search other vibes using enrichedPlaylists (includes localStorage cache)
    vibeOrder.forEach((vibeKey) => {
      if (vibeKey === currentMode) return;
      const pl = enrichedPlaylists[vibeKey];
      if (!pl || !Array.isArray(pl) || pl.length === 0) return;
      pl.forEach((track, idx) => {
        if (trackMatchesQuery(track, query)) {
          results.push({
            track,
            vibeKey,
            trackIndex: idx,
            isCrossVibe: true,
          });
        }
      });
    });

    return results;
  }, [searchQuery, enrichedPlaylists, currentMode, playlist]);

  // Handle clicking a search result (same-vibe or cross-vibe)
  const handleResultClick = useCallback(
    (result) => {
      if (!isOpen || isClosing) return;

      if (result.isCrossVibe) {
        // Switch vibe first, then select track after brief delay for smooth animation
        onModeChange && onModeChange(result.vibeKey);
        setTimeout(() => {
          onSelectTrack && onSelectTrack(result.trackIndex);
        }, 150);
      } else {
        onSelectTrack && onSelectTrack(result.trackIndex);
      }

      // Clear search after selection
      setSearchQuery('');
      setIsSearchFocused(false);
      if (searchInputRef.current) searchInputRef.current.blur();
    },
    [isOpen, isClosing, onModeChange, onSelectTrack]
  );

  const handleClearSearch = useCallback((e) => {
    e.stopPropagation();
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

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

  // Determine what to render: search results or normal playlist
  const isSearching = searchQuery.trim().length > 0;
  const displayList = isSearching ? searchResults : null;

  return (
    <div
      className={`queue-backdrop-fade ${isClosing ? 'closing' : ''}`}
      onClick={onClose}
    >
      <div
        ref={queueContainerRef}
        className={`queue-fixed-attached queue-mode-${currentMode} ${isClosing ? 'closing' : ''} ${keyboardOffset > 0 ? 'keyboard-open' : ''}`}
        style={keyboardOffset > 0 ? { bottom: `${keyboardOffset + 12}px` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="queue-card">
          {/* Top Vibe Navigation Tabs & Meta Header */}
          <div className="queue-tabs-row">
            <div className="queue-tabs">
              {modeTabs.map((tab) => {
                const isActive = currentMode === tab.key;
                const activeNewVibeKey = getActiveNewVibeKey();
                return (
                  <button
                    key={tab.key}
                    className={`queue-tab ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (!isOpen || isClosing) return;
                      setSearchQuery(''); // Clear search when switching tabs
                      onModeChange && onModeChange(tab.key);
                    }}
                  >
                    <span>{tab.label}</span>
                    {activeNewVibeKey && tab.key === activeNewVibeKey && (
                      <span className="tab-new-badge">NEW</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="queue-meta-right">
              <span className="tracks-count">{playlist.length} tracks</span>
            </div>
          </div>

          {/* Apple-Style Search Bar */}
          <div className={`queue-search-wrap ${isSearchFocused ? 'focused' : ''}`}>
            <svg
              className="search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              className="queue-search-input"
              type="text"
              placeholder={randomPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onMouseDown={handleClearSearch}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Track List — Normal or Search Results */}
          <div className="queue-list">
            {isSearching ? (
              // Search Results View
              displayList && displayList.length > 0 ? (
                displayList.map((result, idx) => {
                  const { track, vibeKey, isCrossVibe } = result;
                  const isCurrent =
                    !isCrossVibe && result.trackIndex === currentTrackIndex;
                  const thumb = `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`;

                  return (
                    <div
                      key={`search-${track.id}-${vibeKey}-${idx}`}
                      className={`queue-item ${isCurrent ? 'active-card' : ''} ${isCrossVibe ? 'cross-vibe-item' : ''}`}
                      onClick={() => handleResultClick(result)}
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
                        <p className="queue-title-bold">
                          {track.title || 'Rajasthani Track'}
                        </p>
                        <p className="queue-artist-sub">
                          {track.artist || 'Apna Culturez'}
                          {isCrossVibe && (
                            <span className={`queue-vibe-badge vibe-badge-${vibeKey}`}>
                              {vibeLabelMap[vibeKey] || vibeKey.toUpperCase()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="queue-no-results">
                  <span className="no-results-emoji">🔍</span>
                  <p className="no-results-text">
                    No tracks found for "<strong>{searchQuery}</strong>"
                  </p>
                  <p className="no-results-hint">Try searching in Hindi or English</p>
                </div>
              )
            ) : (
              // Normal Playlist View
              playlist.map((track, idx) => {
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
                      <p className="queue-title-bold">
                        {track.title || 'Rajasthani Track'}
                      </p>
                      <p className="queue-artist-sub">
                        {track.artist || 'Apna Culturez'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
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
