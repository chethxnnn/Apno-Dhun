import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import BackgroundLayer from './components/BackgroundLayer';
import TitleDisplay from './components/TitleDisplay';
import Player from './components/Player';
import YouTubeEmbed from './components/YouTubeEmbed';
import LiveListeners from './components/LiveListeners';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useLiveListeners } from './hooks/useLiveListeners';
import { playlists, modeConfig } from './data/playlists';

export default function App() {
  const [currentMode, setCurrentMode] = useState('wedding');
  const [cinemaMode, setCinemaMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const listenerCount = useLiveListeners();

  const {
    containerRef,
    isPlaying,
    isBuffering,
    isMuted,
    currentTime,
    duration,
    currentTrack,
    togglePlay,
    toggleMute,
    nextTrack,
    prevTrack,
    seekTo,
    loadNewPlaylist,
  } = useYouTubePlayer(playlists[currentMode]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  }, []);

  const handleModeChange = useCallback(
    (mode) => {
      if (mode === currentMode) return;
      setCurrentMode(mode);
      loadNewPlaylist(playlists[mode]);
    },
    [currentMode, loadNewPlaylist]
  );

  // Pro Interactivity Shortcuts: Space, M, F, Escape, Left Arrow, Right Arrow
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
          showToast(isPlaying ? '⏸ Paused' : '▶ Playing');
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          showToast(isMuted ? '🔊 Unmuted' : '🔇 Muted');
          break;

        case 'ArrowRight':
          e.preventDefault();
          nextTrack();
          showToast('⏭ Next Track');
          break;

        case 'ArrowLeft':
          e.preventDefault();
          prevTrack();
          showToast('⏮ Previous Track');
          break;

        case 'KeyF':
          e.preventDefault();
          setCinemaMode((prev) => {
            const next = !prev;
            showToast(next ? '🎬 Cinema Mode ON (Press F to exit)' : '📺 Cinema Mode OFF');
            return next;
          });
          break;

        case 'Escape':
          e.preventDefault();
          setCinemaMode((prev) => {
            if (prev) {
              showToast('📺 Cinema Mode OFF');
              return false;
            }
            return prev;
          });
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, nextTrack, prevTrack, isPlaying, isMuted, showToast]);

  const config = modeConfig[currentMode];

  return (
    <main className={`app ${cinemaMode ? 'cinema-active' : ''}`}>
      <YouTubeEmbed containerRef={containerRef} />
      <BackgroundLayer src={config.bg} bgPosition={config.bgPosition} />

      {/* Floating Shortcut Toast Notification */}
      {toastMessage && <div className="shortcut-toast">{toastMessage}</div>}

      <Header currentMode={currentMode} onModeChange={handleModeChange} />

      {/* Live Listeners Counter below Header */}
      <LiveListeners count={listenerCount} />

      <TitleDisplay
        titleImg={config.titleImg}
        position={config.titlePosition}
      />

      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onNext={nextTrack}
        onPrev={prevTrack}
        onSeek={seekTo}
      />
    </main>
  );
}
