import { playlists as fallbackPlaylists, playlistIds } from '../data/playlists';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL

export async function fetchLivePlaylist(vibeKey) {
  const playlistId = playlistIds[vibeKey];
  const fallback = fallbackPlaylists[vibeKey] || [];

  if (!playlistId) return fallback;

  // 1. Check LocalStorage Cache
  const cacheKey = `apno_dhun_yt_cache_${vibeKey}`;
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cachedData = JSON.parse(cachedStr);
      if (
        Date.now() - cachedData.timestamp < CACHE_TTL_MS &&
        Array.isArray(cachedData.items) &&
        cachedData.items.length > 0
      ) {
        return cachedData.items;
      }
    }
  } catch (e) {
    console.warn('LocalStorage cache read error:', e);
  }

  // If no API key configured, return fallback
  if (!API_KEY) {
    return fallback;
  }

  // 2. Fetch Live from YouTube Data API v3 with automatic pagination (supports 50, 100, 200+ songs)
  try {
    let allItems = [];
    let nextPageToken = '';
    let pageCount = 0;
    const maxPages = 10; // Supports up to 500 songs per playlist (10 pages * 50)

    do {
      const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}${pageParam}&key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`YouTube Data API HTTP error ${res.status} for ${vibeKey}.`);
        break;
      }

      const data = await res.json();
      if (!data.items || !Array.isArray(data.items)) {
        break;
      }

      const pageItems = data.items
        .filter((item) => item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId)
        .map((item) => {
          const snippet = item.snippet;
          const videoId = snippet.resourceId.videoId;
          let title = snippet.title || 'Rajasthani Song';
          if (title === 'Private video' || title === 'Deleted video') {
            return null;
          }
          let artist = snippet.videoOwnerChannelTitle || snippet.channelTitle || 'Apna Culturez';
          artist = artist.replace(/ - Topic$/i, '').replace(/Official$/i, '').trim();

          return {
            id: videoId,
            title,
            artist,
            thumbnail:
              snippet.thumbnails?.high?.url ||
              snippet.thumbnails?.medium?.url ||
              `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          };
        })
        .filter(Boolean);

      allItems = allItems.concat(pageItems);
      nextPageToken = data.nextPageToken || '';
      pageCount++;
    } while (nextPageToken && pageCount < maxPages);

    if (allItems.length > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), items: allItems }));
      } catch (e) {
        /* ignore write errors */
      }
      return allItems;
    }
  } catch (err) {
    console.warn(`Failed to fetch live YouTube playlist for ${vibeKey}:`, err);
  }

  return fallback;
}

export async function fetchAllLivePlaylists() {
  const vibes = Object.keys(playlistIds);
  const results = {};

  await Promise.all(
    vibes.map(async (vibeKey) => {
      const items = await fetchLivePlaylist(vibeKey);
      results[vibeKey] = items;
    })
  );

  return results;
}
