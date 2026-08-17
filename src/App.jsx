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
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useLiveListeners } from './hooks/useLiveListeners';
import { useShake } from './hooks/useShake';
import { playlists as initialPlaylists, modeConfig } from './data/playlists';
import { isNewVibeActive, latestVibeAnnouncement, getActiveNewVibeKey } from './data/newVibeConfig';
import { fetchAllLivePlaylists } from './services/youtubeApi';
import { Analytics } from '@vercel/analytics/react';

const GHUNGROO_VIDEO_ID = 'CvCD8ZEoIes';

export default function App() {
  const [currentMode, setCurrentMode] = useState('wedding');
  const [activePlaylists, setActivePlaylists] = useState(initialPlaylists);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isPatrikaOpen, setIsPatrikaOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const ghungrooContainerRef = useRef(null);
  const ghungrooPlayerRef = useRef(null);
  const toastTimerRef = useRef(null);

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

  // Mobile / iPad Shake Phone Gesture: Open Dhun Card on shake!
  useShake(() => {
    setIsPatrikaOpen(true);
  }, true);

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
    togglePlay,
    toggleMute,
    toggleShuffle,
    setVolume,
    nextTrack,
    prevTrack,
    seekTo,
    loadTrack,
    loadNewPlaylist,
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
          setIsQueueOpen((prev) => !prev);
          break;

        case 'KeyP':
          e.preventDefault();
          setIsPatrikaOpen((prev) => !prev);
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
      className={`app ${cinemaMode ? 'cinema-active' : ''} ${isQueueOpen ? 'queue-active' : ''}`}
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
        onToggleQueue={() => setIsQueueOpen((prev) => !prev)}
        onOpenPatrika={() => setIsPatrikaOpen(true)}
        onPlayGhungroo={playGhungrooSound}
      />

      {/* Desktop Floating Keycap Legend Bar */}
      <KeycapLegendBar currentMode={currentMode} onPlayGhungroo={playGhungrooSound} />

      {/* Add to Home Screen PWA Install Banner */}
      <InstallPwaBanner />

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

      {/* Floating Glassmorphic Toast Notification */}
      {toastMessage && <div className="shortcut-toast">{toastMessage}</div>}

      {/* Vercel Web Analytics */}
      <Analytics />
    </main>
  );
}
