import { useState, useEffect, useRef, useCallback } from 'react';

let apiLoaded = false;
let apiLoadPromise = null;

function loadYouTubeAPI() {
  if (apiLoaded) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;
  apiLoadPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      apiLoaded = true;
      resolve();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const first = document.getElementsByTagName('script')[0];
    if (first && first.parentNode) {
      first.parentNode.insertBefore(tag, first);
    } else {
      document.head.appendChild(tag);
    }

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === 'function') prevReady();
      apiLoaded = true;
      resolve();
    };

    // Polling fallback in case onYouTubeIframeAPIReady already fired or got intercepted in WebViews
    const timer = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(timer);
        apiLoaded = true;
        resolve();
      }
    }, 50);
  });
  return apiLoadPromise;
}

// 1-second tiny silent audio loop to register web app as active audio output in mobile OS
const SILENT_AUDIO_DATA_URI = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

export function useYouTubePlayer(playlist) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const silentAudioRef = useRef(null);
  const pendingPlayRef = useRef(false);

  const getRandomIndex = (len) => (len > 0 ? Math.floor(Math.random() * len) : 0);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolumeState] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => getRandomIndex(playlist.length));
  const [metaCache, setMetaCache] = useState({});

  const playlistRef = useRef(playlist);
  const trackIndexRef = useRef(currentTrackIndex);
  const shuffleRef = useRef(isShuffle);
  const currentTrackRef = useRef(null);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    trackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    shuffleRef.current = isShuffle;
  }, [isShuffle]);

  // Keep-alive silent audio to keep mobile OS audio daemon active when browser is minimized
  const startSilentAudio = useCallback(() => {
    try {
      if (!silentAudioRef.current) {
        const audio = new Audio(SILENT_AUDIO_DATA_URI);
        audio.loop = true;
        audio.volume = 0.01;
        silentAudioRef.current = audio;
      }
      silentAudioRef.current.play().catch(() => {});
    } catch (e) {}
  }, []);

  const stopSilentAudio = useCallback(() => {
    try {
      if (silentAudioRef.current) {
        silentAudioRef.current.pause();
      }
    } catch (e) {}
  }, []);

  // Fetch YouTube Title & Artist using noembed (CORS-enabled public oEmbed)
  const fetchTrackMeta = useCallback((videoId) => {
    if (!videoId) return;
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.title) {
          setMetaCache((prev) => ({
            ...prev,
            [videoId]: {
              title: data.title,
              artist: data.author_name || 'YouTube',
            },
          }));
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch YouTube oembed:', err);
      });
  }, []);

  const updateMetaFromPlayer = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.getVideoData === 'function') {
      try {
        const data = playerRef.current.getVideoData();
        if (data && data.title) {
          const videoId = data.video_id || playlistRef.current[trackIndexRef.current]?.id;
          if (videoId) {
            setMetaCache((prev) => ({
              ...prev,
              [videoId]: {
                title: data.title,
                artist: data.author || 'YouTube',
              },
            }));
          }
        }
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const cur = playerRef.current.getCurrentTime() || 0;
          const dur = playerRef.current.getDuration() || 0;
          setCurrentTime(cur);
          setDuration(dur);
          if (typeof playerRef.current.isMuted === 'function') {
            setIsMuted(playerRef.current.isMuted());
          }
          if (typeof playerRef.current.getVolume === 'function') {
            setVolumeState(playerRef.current.getVolume());
          }

          // Sync lock screen seekbar position state
          if ('mediaSession' in navigator && dur > 0 && typeof navigator.mediaSession.setPositionState === 'function') {
            try {
              navigator.mediaSession.setPositionState({
                duration: Math.max(dur, 0),
                playbackRate: 1,
                position: Math.min(Math.max(cur, 0), dur),
              });
            } catch (e) {}
          }
        } catch (e) {}
      }
    }, 500);
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const loadTrack = useCallback(
    (i) => {
      if (!playlistRef.current[i]) return;
      setCurrentTrackIndex(i);
      setCurrentTime(0);
      setDuration(0);
      const track = playlistRef.current[i];
      if (track?.id) {
        fetchTrackMeta(track.id);
      }
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        try {
          playerRef.current.loadVideoById(playlistRef.current[i].id);
        } catch (e) {
          console.warn('loadVideoById call failed:', e);
        }
      }
    },
    [fetchTrackMeta]
  );

  const getNextTrackIndex = useCallback(() => {
    const len = playlistRef.current.length;
    if (len <= 1) return 0;

    if (shuffleRef.current) {
      let rand = getRandomIndex(len);
      while (rand === trackIndexRef.current) {
        rand = getRandomIndex(len);
      }
      return rand;
    }
    return (trackIndexRef.current + 1) % len;
  }, []);

  // Pre-fetch oEmbed metadata for all playlist items
  useEffect(() => {
    playlist.forEach((track) => {
      if (track?.id && !metaCache[track.id]) {
        fetchTrackMeta(track.id);
      }
    });
  }, [playlist, fetchTrackMeta, metaCache]);

  useEffect(() => {
    let mounted = true;
    const initialIndex = getRandomIndex(playlist.length);
    setCurrentTrackIndex(initialIndex);

    loadYouTubeAPI().then(() => {
      if (!mounted || !containerRef.current) return;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (e) {}
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '240',
        width: '240',
        videoId: playlist[initialIndex]?.id || playlist[0]?.id || '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          enablejsapi: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            if (mounted) {
              setIsReady(true);
              setIsBuffering(false);
              updateMetaFromPlayer();

              try {
                const iframe = event.target?.getIframe?.() || containerRef.current?.querySelector?.('iframe');
                if (iframe) {
                  iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; accelerometer; gyroscope');
                  iframe.setAttribute('playsinline', '1');
                }
              } catch (err) {}

              if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                try {
                  event.target.unMute();
                  event.target.playVideo();
                } catch (e) {}
              }
            }
          },
          onStateChange: (e) => {
            if (!mounted) return;
            updateMetaFromPlayer();
            switch (e.data) {
              case -1: // UNSTARTED
              case window.YT.PlayerState.PAUSED:
                setIsPlaying(false);
                setIsBuffering(false);
                stopSilentAudio();
                if ('mediaSession' in navigator) {
                  navigator.mediaSession.playbackState = 'paused';
                }
                break;
              case window.YT.PlayerState.PLAYING:
                setIsPlaying(true);
                setIsBuffering(false);
                startPolling();
                startSilentAudio();
                if ('mediaSession' in navigator) {
                  navigator.mediaSession.playbackState = 'playing';
                }
                break;
              case window.YT.PlayerState.BUFFERING:
                setIsBuffering(true);
                break;
              case window.YT.PlayerState.ENDED:
                setIsPlaying(false);
                setIsBuffering(false);
                stopPolling();
                const nextIdx = getNextTrackIndex();
                loadTrack(nextIdx);
                break;
            }
          },
          onError: () => {
            setIsBuffering(false);
            const nextIdx = getNextTrackIndex();
            loadTrack(nextIdx);
          },
        },
      });
    });
    return () => {
      mounted = false;
      stopPolling();
      stopSilentAudio();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (e) {}
      }
      playerRef.current = null;
    };
  }, []);

  const loadNewPlaylist = useCallback(
    (newPl) => {
      playlistRef.current = newPl;
      const initialIdx = getRandomIndex(newPl.length);
      setCurrentTrackIndex(initialIdx);
      setCurrentTime(0);
      setDuration(0);
      setIsBuffering(false);
      if (newPl[initialIdx]?.id) {
        fetchTrackMeta(newPl[initialIdx].id);
      }
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function' && newPl[initialIdx]) {
        try {
          playerRef.current.loadVideoById(newPl[initialIdx].id);
          if (typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          }
        } catch (e) {
          console.warn('loadNewPlaylist loadVideoById error:', e);
        }
      }
    },
    [fetchTrackMeta]
  );

  // Exact song loading for shared songs in chat (bypasses random index selection)
  const loadSpecificTrack = useCallback(
    (newPl, targetIndex, youtubeId) => {
      playlistRef.current = newPl;
      let finalIdx = targetIndex;
      if (typeof finalIdx !== 'number' || finalIdx < 0 || finalIdx >= newPl.length) {
        if (youtubeId) {
          finalIdx = newPl.findIndex((t) => t.id === youtubeId);
        }
        if (finalIdx === -1) finalIdx = 0;
      }
      setCurrentTrackIndex(finalIdx);
      setCurrentTime(0);
      setDuration(0);
      setIsBuffering(false);
      const videoId = youtubeId || newPl[finalIdx]?.id;
      if (videoId) {
        fetchTrackMeta(videoId);
      }
      startSilentAudio();
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function' && videoId) {
        try {
          playerRef.current.loadVideoById(videoId);
          if (typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          }
        } catch (e) {
          console.warn('loadSpecificTrack error:', e);
        }
      }
    },
    [fetchTrackMeta, startSilentAudio]
  );

  const play = useCallback(() => {
    startSilentAudio();
    if (!isReady || !playerRef.current) {
      pendingPlayRef.current = true;
      setIsBuffering(true);
      return;
    }
    try {
      if (typeof playerRef.current.unMute === 'function' && !isMuted) {
        playerRef.current.unMute();
      }
      if (typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }
    } catch (e) {
      console.warn('play error:', e);
    }
  }, [startSilentAudio, isMuted, isReady]);

  const pause = useCallback(() => {
    stopSilentAudio();
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try { playerRef.current.pauseVideo(); } catch (e) {}
    }
  }, [stopSilentAudio]);

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.isMuted === 'function') {
      try {
        if (playerRef.current.isMuted()) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } catch (e) {}
    }
  }, []);

  const setVolume = useCallback((val) => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(val);
        setVolumeState(val);
        if (val === 0 && typeof playerRef.current.mute === 'function') {
          playerRef.current.mute();
          setIsMuted(true);
        } else if (typeof playerRef.current.unMute === 'function' && typeof playerRef.current.isMuted === 'function' && playerRef.current.isMuted()) {
          playerRef.current.unMute();
          setIsMuted(false);
        }
      } catch (e) {}
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    const nextIdx = getNextTrackIndex();
    loadTrack(nextIdx);
  }, [getNextTrackIndex, loadTrack]);

  const prevTrack = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      try {
        if (playerRef.current.getCurrentTime() > 3 && typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(0);
          setCurrentTime(0);
          return;
        }
      } catch (e) {}
    }
    const len = playlistRef.current.length;
    const prevIdx = trackIndexRef.current === 0 ? len - 1 : trackIndexRef.current - 1;
    loadTrack(prevIdx);
  }, [loadTrack]);

  const seekTo = useCallback((s) => {
    if (typeof s !== 'number' || isNaN(s) || s < 0) return;
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try { playerRef.current.seekTo(s, true); } catch (e) {}
    }
    setCurrentTime(s);
  }, []);

  const rawTrack = playlist[currentTrackIndex] || playlist[0] || null;
  const fetched = rawTrack ? metaCache[rawTrack.id] : null;

  const currentTrack = rawTrack
    ? {
        ...rawTrack,
        title: fetched?.title || rawTrack.title || 'Rajasthani Song',
        artist: fetched?.artist || rawTrack.artist || 'Apna Culturez',
      }
    : null;

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  // Sync with OS Lock Screen & Notification Center via MediaSession API
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.title || 'Apno Dhun',
        artist: currentTrack.artist || 'Apna Culturez',
        album: 'Apno Dhun • Rajasthan Ri Dhun',
        artwork: [
          {
            src: `https://img.youtube.com/vi/${currentTrack.id}/hqdefault.jpg`,
            sizes: '480x360',
            type: 'image/jpeg',
          },
          {
            src: `https://img.youtube.com/vi/${currentTrack.id}/mqdefault.jpg`,
            sizes: '320x180',
            type: 'image/jpeg',
          },
          {
            src: '/favicon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      });
    } catch (e) {
      console.warn('Failed to set mediaSession metadata:', e);
    }
  }, [currentTrack]);

  // Hook Lock Screen Control Buttons (Play, Pause, Next, Prev, Seek)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const actionHandlers = [
      ['play', play],
      ['pause', pause],
      ['previoustrack', prevTrack],
      ['nexttrack', nextTrack],
      ['seekto', (details) => {
        if (details.seekTime !== undefined) {
          seekTo(details.seekTime);
        }
      }],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (e) {}
    }

    return () => {
      for (const [action] of actionHandlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch (e) {}
      }
    };
  }, [play, pause, nextTrack, prevTrack, seekTo]);

  // Resolved playlist with 100% real fetched titles for every song
  const resolvedPlaylist = playlist.map((track) => ({
    ...track,
    title: metaCache[track.id]?.title || track.title,
    artist: metaCache[track.id]?.artist || track.artist,
  }));

  return {
    containerRef,
    isReady,
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
    pause,
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
  };
}
