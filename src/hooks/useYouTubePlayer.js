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
    first.parentNode.insertBefore(tag, first);
    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      resolve();
    };
  });
  return apiLoadPromise;
}

export function useYouTubePlayer(playlist) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Pick initial random track index for the vibe
  const getRandomIndex = (len) => (len > 0 ? Math.floor(Math.random() * len) : 0);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => getRandomIndex(playlist.length));
  const [metaCache, setMetaCache] = useState({});

  const playlistRef = useRef(playlist);
  const trackIndexRef = useRef(currentTrackIndex);
  const shuffleRef = useRef(isShuffle);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    trackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    shuffleRef.current = isShuffle;
  }, [isShuffle]);

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
          setCurrentTime(playerRef.current.getCurrentTime() || 0);
          setDuration(playerRef.current.getDuration() || 0);
          if (typeof playerRef.current.isMuted === 'function') {
            setIsMuted(playerRef.current.isMuted());
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
      if (!playerRef.current || !playlistRef.current[i]) return;
      setCurrentTrackIndex(i);
      setCurrentTime(0);
      setDuration(0);
      const track = playlistRef.current[i];
      if (track?.id) {
        fetchTrackMeta(track.id);
      }
      playerRef.current.loadVideoById(playlistRef.current[i].id);
    },
    [fetchTrackMeta]
  );

  const getNextTrackIndex = useCallback(() => {
    const len = playlistRef.current.length;
    if (len <= 1) return 0;

    if (shuffleRef.current) {
      let rand = getRandomIndex(len);
      // Avoid repeating same track if playlist length > 1
      while (rand === trackIndexRef.current) {
        rand = getRandomIndex(len);
      }
      return rand;
    }
    return (trackIndexRef.current + 1) % len;
  }, []);

  // Pre-fetch oEmbed metadata for current playlist items
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
      if (playerRef.current) playerRef.current.destroy();

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: playlist[initialIndex]?.id || playlist[0]?.id || '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (mounted) {
              setIsReady(true);
              updateMetaFromPlayer();
            }
          },
          onStateChange: (e) => {
            if (!mounted) return;
            updateMetaFromPlayer();
            switch (e.data) {
              case window.YT.PlayerState.PLAYING:
                setIsPlaying(true);
                setIsBuffering(false);
                startPolling();
                break;
              case window.YT.PlayerState.PAUSED:
                setIsPlaying(false);
                setIsBuffering(false);
                break;
              case window.YT.PlayerState.BUFFERING:
                setIsBuffering(true);
                break;
              case window.YT.PlayerState.ENDED: {
                setIsPlaying(false);
                stopPolling();
                const nextIdx = getNextTrackIndex();
                loadTrack(nextIdx);
                break;
              }
            }
          },
          onError: () => {
            const nextIdx = getNextTrackIndex();
            loadTrack(nextIdx);
          },
        },
      });
    });
    return () => {
      mounted = false;
      stopPolling();
      try {
        playerRef.current?.destroy();
      } catch (e) {}
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
      if (newPl[initialIdx]?.id) {
        fetchTrackMeta(newPl[initialIdx].id);
      }
      if (playerRef.current && newPl[initialIdx]) {
        playerRef.current.loadVideoById(newPl[initialIdx].id);
      }
    },
    [fetchTrackMeta]
  );

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (playerRef.current.isMuted()) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
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
    try {
      if (playerRef.current?.getCurrentTime() > 3) {
        playerRef.current.seekTo(0);
        setCurrentTime(0);
        return;
      }
    } catch (e) {}
    const len = playlistRef.current.length;
    const prevIdx = trackIndexRef.current === 0 ? len - 1 : trackIndexRef.current - 1;
    loadTrack(prevIdx);
  }, [loadTrack]);

  const seekTo = useCallback((s) => {
    playerRef.current?.seekTo(s, true);
    setCurrentTime(s);
  }, []);

  const rawTrack = playlist[currentTrackIndex] || playlist[0] || null;
  const fetched = rawTrack ? metaCache[rawTrack.id] : null;

  const currentTrack = rawTrack
    ? {
        ...rawTrack,
        title: fetched?.title || rawTrack.title || 'YouTube Song',
        artist: fetched?.artist || rawTrack.artist || 'Apna Culturez',
      }
    : null;

  return {
    containerRef,
    isReady,
    isPlaying,
    isBuffering,
    isMuted,
    isShuffle,
    currentTime,
    duration,
    currentTrack,
    currentTrackIndex,
    play,
    pause,
    togglePlay,
    toggleMute,
    toggleShuffle,
    nextTrack,
    prevTrack,
    seekTo,
    loadTrack,
    loadNewPlaylist,
  };
}
