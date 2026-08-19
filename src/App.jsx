import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import BackgroundLayer from './components/BackgroundLayer';
import TitleDisplay from './components/TitleDisplay';
import Player from './components/Player';
import YouTubeEmbed from './components/YouTubeEmbed';
import LiveListeners from './components/LiveListeners';
import GeetMaalaModal from './components/GeetMaalaModal';
import PatrikaModal from './components/PatrikaModal';
import VibeAnnouncementModal from './components/VibeAnnouncementModal';
import InstallPwaBanner from './components/InstallPwaBanner';
import KeycapLegendBar from './components/KeycapLegendBar';
import PanchayatDrawer from './components/PanchayatDrawer';
import OpenInChromeBanner from './components/OpenInChromeBanner';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useLiveListeners } from './hooks/useLiveListeners';
import { useShake } from './hooks/useShake';
import { playlists as initialPlaylists, modeConfig } from './data/playlists';
import { isNewVibeActive, latestVibeAnnouncement, getActiveNewVibeKey } from './data/newVibeConfig';
import { fetchAllLivePlaylists } from './services/youtubeApi';
import { getIdentity } from './data/rajasthaniNames';
import { joinPanchayat, leavePanchayat, onMessage, sendTextMessage, sendSongShare } from './services/panchayatChat';
import { Analytics } from '@vercel/analytics/react';

const GHUNGROO_VIDEO_ID = 'CvCD8ZEoIes';

export default function App() {
  const [currentMode, setCurrentMode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const vibe = (params.get('vibe') || params.get('v') || '').toLowerCase();
        const validModes = ['folk', 'wedding', 'dhh', 'trending', 'devotional'];
        if (validModes.includes(vibe)) {
          return vibe;
        }
      }
    } catch (e) {}
    return 'wedding';
  });
  const [activePlaylists, setActivePlaylists] = useState(initialPlaylists);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isPatrikaOpen, setIsPatrikaOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isPanchayatOpen, setIsPanchayatOpen] = useState(false);
  const [unreadPanchayatCount, setUnreadPanchayatCount] = useState(0);
  const [panchayatMessages, setPanchayatMessages] = useState([]);
  const [panchayatIdentity, setPanchayatIdentity] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const ghungrooContainerRef = useRef(null);
  const ghungrooPlayerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const prevMsgLengthRef = useRef(0);

  // Background Connection to Panchayat Live Chat
  useEffect(() => {
    const id = getIdentity();
    setPanchayatIdentity(id);
    joinPanchayat(id);

    const unsubMsg = onMessage((msg) => {
      setPanchayatMessages((prev) => {
        const next = [...prev, msg];
        if (next.length > 100) return next.slice(next.length - 100);
        return next;
      });
    });

    return () => {
      if (unsubMsg) unsubMsg();
      leavePanchayat();
    };
  }, []);

  // Track unread messages when Panchayat is closed
  useEffect(() => {
    if (isPanchayatOpen) {
      setUnreadPanchayatCount(0);
    } else if (panchayatMessages.length > prevMsgLengthRef.current) {
      const diff = panchayatMessages.length - prevMsgLengthRef.current;
      setUnreadPanchayatCount((prev) => prev + diff);
    }
    prevMsgLengthRef.current = panchayatMessages.length;
  }, [panchayatMessages, isPanchayatOpen]);

  const listenerCount = useLiveListeners();
  const currentPlaylist = activePlaylists[currentMode] || initialPlaylists[currentMode];
  const activeNewVibeKey = getActiveNewVibeKey();

  // Auto-show new vibe announcement popup 6 seconds after user visits the page (Automated 7-Day Expiry)
  useEffect(() => {
    if (!isNewVibeActive() || !latestVibeAnnouncement?.vibeKey) return;
    if (currentMode === latestVibeAnnouncement.vibeKey) return;

    const storageKey = `${latestVibeAnnouncement.vibeKey}_announcement_seen`;
    const alreadyDismissed = sessionStorage.getItem(storageKey);
    if (alreadyDismissed) return;

    const timer = setTimeout(() => {
      setIsAnnouncementOpen(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentMode]);

  // If user navigates/scrolls to the new vibe independently, automatically close the poster
  useEffect(() => {
    if (activeNewVibeKey && currentMode === activeNewVibeKey && isAnnouncementOpen) {
      sessionStorage.setItem(`${activeNewVibeKey}_announcement_seen`, 'true');
      setIsAnnouncementOpen(false);
    }
  }, [currentMode, activeNewVibeKey, isAnnouncementOpen]);

  // When Panchayat chat window or Queue is opened, automatically close and dismiss the announcement banner
  useEffect(() => {
    if ((isPanchayatOpen || isQueueOpen) && isAnnouncementOpen) {
      if (latestVibeAnnouncement?.vibeKey) {
        sessionStorage.setItem(`${latestVibeAnnouncement.vibeKey}_announcement_seen`, 'true');
      }
      setIsAnnouncementOpen(false);
    }
  }, [isPanchayatOpen, isQueueOpen, isAnnouncementOpen]);

  // Mobile / iPad Shake Phone Gesture: Open Dhun Card on shake (disabled when Panchayat chat is open)
  useShake(() => {
    if (!isPanchayatOpen && !isQueueOpen && !isPatrikaOpen) {
      setIsPatrikaOpen(true);
    }
  }, !isPanchayatOpen && !isQueueOpen && !isPatrikaOpen);

  const {
    containerRef,
    isPlaying,
    isBuffering,
    isMuted,
    isShuffle,
    volume,
    currentTime,
    duration,
    currentTrack,
    currentTrackIndex,
    resolvedPlaylist,
    play,
    togglePlay,
    toggleMute,
    toggleShuffle,
    setVolume,
    nextTrack,
    prevTrack,
    seekTo,
    loadTrack,
    loadNewPlaylist,
    loadSpecificTrack,
  } = useYouTubePlayer(currentPlaylist);

  // Initialize dedicated Ghungroo YouTube audio player instance
  useEffect(() => {
    let mounted = true;

    const initGhungroo = () => {
      if (
        mounted &&
        window.YT &&
        window.YT.Player &&
        ghungrooContainerRef.current &&
        !ghungrooPlayerRef.current
      ) {
        try {
          ghungrooPlayerRef.current = new window.YT.Player(ghungrooContainerRef.current, {
            height: '1',
            width: '1',
            videoId: GHUNGROO_VIDEO_ID,
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
            },
            events: {
              onError: (err) => console.warn('Ghungroo sound player error:', err),
            },
          });
        } catch (e) {
          console.warn('Ghungroo player init error:', e);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initGhungroo();
    } else {
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          initGhungroo();
        }
      }, 500);
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      mounted = false;
      if (ghungrooPlayerRef.current) {
        try {
          ghungrooPlayerRef.current.destroy();
        } catch (e) {
          /* ignore */
        }
        ghungrooPlayerRef.current = null;
      }
    };
  }, []);

  // Fetch live YouTube Data API playlists on mount and update activePlaylists state
  useEffect(() => {
    fetchAllLivePlaylists().then((livePlaylists) => {
      if (livePlaylists && Object.keys(livePlaylists).length > 0) {
        setActivePlaylists((prev) => ({
          ...prev,
          ...livePlaylists,
        }));
        // Select a fresh random track across the full live playlist of the active vibe on enter
        const liveCurrentPl = livePlaylists[currentMode];
        if (liveCurrentPl && liveCurrentPl.length > 0) {
          loadNewPlaylist(liveCurrentPl);
        }
      }
    });
  }, []);

  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  const handleModeChange = useCallback(
    (mode) => {
      if (mode === currentMode) return;
      setCurrentMode(mode);
      const targetPl = activePlaylists[mode] || initialPlaylists[mode];
      loadNewPlaylist(targetPl);
    },
    [currentMode, activePlaylists, loadNewPlaylist]
  );

  const ghungrooTimeoutRef = useRef(null);

  // Play Ghungroo Audio from YouTube video ID CvCD8ZEoIes from 1.0s to 5.0s
  const playGhungrooSound = useCallback(() => {
    if (ghungrooPlayerRef.current && typeof ghungrooPlayerRef.current.seekTo === 'function') {
      try {
        if (ghungrooTimeoutRef.current) {
          clearTimeout(ghungrooTimeoutRef.current);
        }
        ghungrooPlayerRef.current.seekTo(1.0, true);
        ghungrooPlayerRef.current.playVideo();

        // Automatically pause and reset at 5.0 seconds (4-second duration from 1.0s)
        ghungrooTimeoutRef.current = setTimeout(() => {
          if (ghungrooPlayerRef.current && typeof ghungrooPlayerRef.current.pauseVideo === 'function') {
            ghungrooPlayerRef.current.pauseVideo();
            ghungrooPlayerRef.current.seekTo(1.0, true);
          }
        }, 4000);
      } catch (e) {
        console.warn('Ghungroo playback error:', e);
      }
    }
  }, []);

  const handleCheckOutNewVibe = useCallback(() => {
    if (latestVibeAnnouncement?.vibeKey) {
      sessionStorage.setItem(`${latestVibeAnnouncement.vibeKey}_announcement_seen`, 'true');
      setIsAnnouncementOpen(false);
      handleModeChange(latestVibeAnnouncement.vibeKey);
    }
  }, [handleModeChange]);

  const handleCloseAnnouncement = useCallback(() => {
    if (latestVibeAnnouncement?.vibeKey) {
      sessionStorage.setItem(`${latestVibeAnnouncement.vibeKey}_announcement_seen`, 'true');
    }
    setIsAnnouncementOpen(false);
  }, []);

  // Play exact shared song from Panchayat Chat (switching vibe + loading track directly)
  const handlePlaySharedSong = useCallback(
    (song) => {
      if (!song) return;
      const targetMode = song.vibeKey || currentMode;
      const targetPl = activePlaylists[targetMode] || initialPlaylists[targetMode];

      let trackIndex = -1;
      if (song.youtubeId) {
        trackIndex = targetPl.findIndex((t) => t.id === song.youtubeId);
      }
      if (trackIndex === -1 && song.title) {
        trackIndex = targetPl.findIndex((t) => t.title.toLowerCase().trim() === song.title.toLowerCase().trim());
      }
      if (trackIndex === -1 && typeof song.trackIndex === 'number') {
        trackIndex = song.trackIndex;
      }
      if (trackIndex < 0 || trackIndex >= targetPl.length) {
        trackIndex = 0;
      }

      if (targetMode !== currentMode) {
        setCurrentMode(targetMode);
      }

      loadSpecificTrack(targetPl, trackIndex, song.youtubeId);
    },
    [currentMode, activePlaylists, loadSpecificTrack]
  );

  // Pro Interactivity Shortcuts: Space, M, S, F, Q, P, G, Escape, Arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElem = document.activeElement;
      const isInputField =
        activeElem &&
        (activeElem.tagName === 'INPUT' ||
          activeElem.tagName === 'TEXTAREA' ||
          activeElem.isContentEditable);

      if (isInputField) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;

        case 'KeyS':
          e.preventDefault();
          toggleShuffle();
          break;

        case 'KeyQ':
          e.preventDefault();
          setIsPanchayatOpen(false);
          setIsPatrikaOpen(false);
          setIsAnnouncementOpen(false);
          setIsQueueOpen((prev) => !prev);
          break;

        case 'KeyP':
          e.preventDefault();
          setIsPanchayatOpen(false);
          setIsQueueOpen(false);
          setIsPatrikaOpen((prev) => !prev);
          break;

        case 'KeyC':
          e.preventDefault();
          setIsQueueOpen(false);
          setIsPatrikaOpen(false);
          setIsPanchayatOpen((prev) => !prev);
          break;

        case 'KeyG':
          e.preventDefault();
          playGhungrooSound();
          break;

        case 'ArrowRight':
        case 'KeyN':
          e.preventDefault();
          nextTrack();
          break;

        case 'ArrowLeft':
          e.preventDefault();
          prevTrack();
          break;

        case 'KeyF':
          e.preventDefault();
          setCinemaMode((prev) => !prev);
          break;

        case 'Escape':
          e.preventDefault();
          setIsQueueOpen(false);
          setIsPatrikaOpen(false);
          setIsAnnouncementOpen(false);
          setIsPanchayatOpen(false);
          setCinemaMode(false);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    toggleMute,
    toggleShuffle,
    nextTrack,
    prevTrack,
    playGhungrooSound,
  ]);

  const config = modeConfig[currentMode];

  return (
    <main
      className={`app ${cinemaMode ? 'cinema-active' : ''} ${isQueueOpen ? 'queue-active' : ''} ${isPanchayatOpen ? 'panchayat-active' : ''}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <YouTubeEmbed containerRef={containerRef} ghungrooRef={ghungrooContainerRef} />
      {/* Background Visual Layer */}
      <BackgroundLayer
        src={config.bg}
        srcMobile={config.bgMobile}
        bgPosition={config.bgPosition}
        currentMode={currentMode}
      />

      <Header currentMode={currentMode} onModeChange={handleModeChange} listenerCount={listenerCount} />

      {/* Live Listeners Counter below Header (Mehmaan with Safa Icon) */}
      <LiveListeners count={listenerCount} />

      <TitleDisplay
        titleImg={config.titleImg}
        position={config.titlePosition}
      />

      {/* Attached Queue Overlay */}
      <GeetMaalaModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        playlist={resolvedPlaylist}
        allPlaylists={activePlaylists}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        currentMode={currentMode}
        onSelectTrack={loadTrack}
        onModeChange={handleModeChange}
      />

      {/* Capsule Glass Player Dock */}
      <Player
        currentMode={currentMode}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        isMuted={isMuted}
        isShuffle={isShuffle}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        isQueueOpen={isQueueOpen}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onToggleShuffle={toggleShuffle}
        onVolumeChange={setVolume}
        onNext={nextTrack}
        onPrev={prevTrack}
        onSeek={seekTo}
        onToggleQueue={() => {
          setIsPanchayatOpen(false);
          setIsPatrikaOpen(false);
          setIsAnnouncementOpen(false);
          setIsQueueOpen((prev) => !prev);
        }}
        onOpenPatrika={() => {
          setIsPanchayatOpen(false);
          setIsQueueOpen(false);
          setIsPatrikaOpen(true);
        }}
        isPanchayatOpen={isPanchayatOpen}
        unreadPanchayatCount={unreadPanchayatCount}
        onTogglePanchayat={() => {
          setIsQueueOpen(false);
          setIsPatrikaOpen(false);
          setIsPanchayatOpen((prev) => !prev);
        }}
        onPlayGhungroo={playGhungrooSound}
      />

      {/* Desktop Floating Keycap Legend Bar */}
      <KeycapLegendBar currentMode={currentMode} onPlayGhungroo={playGhungrooSound} />

      {/* Add to Home Screen PWA Install Banner */}
      <InstallPwaBanner />

      {/* Android Instagram Open in Chrome Banner */}
      <OpenInChromeBanner />

      {/* Royal Patrika Card Generator Modal */}
      <PatrikaModal
        isOpen={isPatrikaOpen}
        onClose={() => setIsPatrikaOpen(false)}
        currentTrack={currentTrack}
        currentMode={currentMode}
        listenerCount={listenerCount}
      />

      {/* 6-Second Automated New Vibe Announcement Popup Modal */}
      {isNewVibeActive() && (
        <VibeAnnouncementModal
          isOpen={isAnnouncementOpen}
          onClose={handleCloseAnnouncement}
          onCheckOut={handleCheckOutNewVibe}
          posterImg={latestVibeAnnouncement?.posterImg}
          vibeTitle={latestVibeAnnouncement?.vibeKey?.toUpperCase()}
        />
      )}

      {/* Panchayat Live Chat Drawer */}
      <PanchayatDrawer
        isOpen={isPanchayatOpen}
        onClose={() => setIsPanchayatOpen(false)}
        identity={panchayatIdentity}
        messages={panchayatMessages}
        onSendMessage={sendTextMessage}
        onSendSong={sendSongShare}
        currentTrack={currentTrack}
        currentMode={currentMode}
        listenerCount={listenerCount}
        onPlaySong={handlePlaySharedSong}
        onModeChange={handleModeChange}
        onSelectTrack={loadTrack}
      />

      {/* Floating Glassmorphic Toast Notification */}
      {toastMessage && <div className="shortcut-toast">{toastMessage}</div>}

      {/* Vercel Web Analytics */}
      <Analytics />
    </main>
  );
}
