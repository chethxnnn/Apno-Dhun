import { useState, useCallback, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import BackgroundLayer from './components/BackgroundLayer';
import TitleDisplay from './components/TitleDisplay';
import Player from './components/Player';
import YouTubeEmbed from './components/YouTubeEmbed';
import LiveListeners from './components/LiveListeners';
import GeetMaalaModal from './components/GeetMaalaModal';
import PatrikaModal from './components/PatrikaModal';
import InstallPwaBanner from './components/InstallPwaBanner';
import KeycapLegendBar from './components/KeycapLegendBar';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useLiveListeners } from './hooks/useLiveListeners';
import { useShake } from './hooks/useShake';
import { playlists as initialPlaylists, modeConfig } from './data/playlists';
import { fetchAllLivePlaylists } from './services/youtubeApi';

export default function App() {
  const [currentMode, setCurrentMode] = useState('wedding');
  const [activePlaylists, setActivePlaylists] = useState(initialPlaylists);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isPatrikaOpen, setIsPatrikaOpen] = useState(false);

  const listenerCount = useLiveListeners();
  const currentPlaylist = activePlaylists[currentMode] || initialPlaylists[currentMode];

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

  const handleModeChange = useCallback(
    (mode) => {
      if (mode === currentMode) return;
      setCurrentMode(mode);
      const targetPl = activePlaylists[mode] || initialPlaylists[mode];
      loadNewPlaylist(targetPl);
    },
    [currentMode, activePlaylists, loadNewPlaylist]
  );

  // Web Audio Synthesized Ghungroo Chime sound effect
  const playGhungrooSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Shimmering brass metallic bell notes
      const freqs = [1760, 2637, 3520, 4400];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.6);
      });
    } catch (e) {
      /* ignore audio error */
    }
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
    <main className={`app ${cinemaMode ? 'cinema-active' : ''} ${isQueueOpen ? 'queue-active' : ''}`}>
      <YouTubeEmbed containerRef={containerRef} />
      <BackgroundLayer src={config.bg} bgPosition={config.bgPosition} />

      <Header currentMode={currentMode} onModeChange={handleModeChange} />

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
      <KeycapLegendBar />

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
    </main>
  );
}
