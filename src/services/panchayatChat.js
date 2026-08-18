/**
 * Panchayat Chat Service
 * 
 * Real-time ephemeral chat using Supabase Realtime Broadcast.
 * Zero database, zero storage — messages relay through WebSocket and
 * exist only in client browser memory.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

const CHANNEL_NAME = 'apno-panchayat';
const BROADCAST_EVENT = 'panchayat-msg';
const PRESENCE_EVENT = 'panchayat-presence';

let channel = null;
let messageListeners = [];
let presenceListeners = [];

/**
 * Join the Panchayat broadcast channel.
 * @param {object} identity - { id, name, number, avatar, color }
 * @returns {boolean} - true if joined successfully
 */
export function joinPanchayat(identity) {
  if (!isSupabaseConfigured() || !supabase) {
    // Local in-memory testing mode: send welcome Rajasthani sample messages
    setTimeout(() => {
      messageListeners.forEach((cb) => {
        cb({
          type: 'text',
          id: 'welcome_1',
          sender: {
            id: 'mock_1',
            name: 'Rangilo Banna',
            number: '482',
            avatar: '👳',
            color: '#D8893E',
          },
          text: 'Ram Ram Sa! 🙏 Apno Dhun ri Panchayat mein swagat hai!',
          timestamp: Date.now() - 120000,
        });
        cb({
          type: 'song_share',
          id: 'welcome_2',
          sender: {
            id: 'mock_2',
            name: 'Royal Baisa',
            number: '117',
            avatar: '👑',
            color: '#B95D43',
          },
          song: {
            title: 'Kesariya Balam',
            artist: 'Rajasthani Folk',
            vibeKey: 'folk',
            trackIndex: 0,
            youtubeId: 'vHKsj1Wjhp0',
          },
          timestamp: Date.now() - 60000,
        });
      });
    }, 200);
    return true;
  }

  if (channel) return true; // Already joined

  channel = supabase.channel(CHANNEL_NAME, {
    config: {
      broadcast: { self: true }, // Receive own messages for confirmation
      presence: { key: identity.id },
    },
  });

  // Listen for broadcast messages
  channel.on('broadcast', { event: BROADCAST_EVENT }, (payload) => {
    const message = payload.payload;
    if (message) {
      messageListeners.forEach((cb) => cb(message));
    }
  });

  // Listen for presence changes (online count)
  channel.on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    const count = Object.keys(state).length;
    presenceListeners.forEach((cb) => cb(count));
  });

  // Subscribe and track presence
  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: identity.id,
        name: identity.name,
        number: identity.number,
        avatar: identity.avatar,
        online_at: new Date().toISOString(),
      });
    }
  });

  return true;
}

/**
 * Send a text message to the Panchayat.
 * @param {object} identity - sender identity
 * @param {string} text - message text
 * @returns {Promise<boolean>}
 */
export async function sendTextMessage(identity, text) {
  const message = {
    type: 'text',
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sender: {
      id: identity.id,
      name: identity.name,
      number: identity.number,
      avatar: identity.avatar,
      color: identity.color,
    },
    text: text.trim(),
    timestamp: Date.now(),
  };

  if (!channel || !isSupabaseConfigured()) {
    // Local in-memory broadcast
    messageListeners.forEach((cb) => cb(message));
    return true;
  }

  try {
    await channel.send({
      type: 'broadcast',
      event: BROADCAST_EVENT,
      payload: message,
    });
    return true;
  } catch (err) {
    console.error('Failed to broadcast text message:', err);
    return false;
  }
}

/**
 * Send a "currently listening to" song share message.
 * @param {object} identity - sender identity
 * @param {object} song - { title, artist, vibeKey, trackIndex, youtubeId }
 * @returns {Promise<boolean>}
 */
export async function sendSongShare(identity, song) {
  const message = {
    type: 'song_share',
    id: `song_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sender: {
      id: identity.id,
      name: identity.name,
      number: identity.number,
      avatar: identity.avatar,
      color: identity.color,
    },
    song: {
      title: song.title,
      artist: song.artist,
      vibeKey: song.vibeKey,
      trackIndex: song.trackIndex,
      youtubeId: song.youtubeId,
    },
    timestamp: Date.now(),
  };

  if (!channel || !isSupabaseConfigured()) {
    // Local in-memory broadcast
    messageListeners.forEach((cb) => cb(message));
    return true;
  }

  try {
    await channel.send({
      type: 'broadcast',
      event: BROADCAST_EVENT,
      payload: message,
    });
    return true;
  } catch (err) {
    console.error('Failed to broadcast song share:', err);
    return false;
  }
}

/**
 * Register a callback for incoming messages.
 * @param {function} callback - receives message object
 * @returns {function} unsubscribe function
 */
export function onMessage(callback) {
  messageListeners.push(callback);
  return () => {
    messageListeners = messageListeners.filter((cb) => cb !== callback);
  };
}

/**
 * Register a callback for online presence count updates.
 * @param {function} callback - receives count (number)
 * @returns {function} unsubscribe function
 */
export function onPresenceChange(callback) {
  presenceListeners.push(callback);
  return () => {
    presenceListeners = presenceListeners.filter((cb) => cb !== callback);
  };
}

/**
 * Leave the Panchayat and clean up.
 */
export function leavePanchayat() {
  if (channel) {
    channel.unsubscribe();
    channel = null;
  }
  messageListeners = [];
  presenceListeners = [];
}
