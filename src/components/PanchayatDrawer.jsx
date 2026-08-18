import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './PanchayatDrawer.css';
import { getIdentity } from '../data/rajasthaniNames';
import { joinPanchayat, sendTextMessage, sendSongShare, onMessage, onPresenceChange, leavePanchayat } from '../services/panchayatChat';
import { isSupabaseConfigured } from '../services/supabaseClient';

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PanchayatDrawer({
  isOpen,
  onClose,
  currentTrack,
  currentMode,
  listenerCount = 1,
  onModeChange,
  onSelectTrack,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(listenerCount);
  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastSendTimeRef = useRef(0);
  const lastMessageRef = useRef('');

  // Mount/Unmount with Apple iOS physics transition
  useEffect(() => {
    if (isOpen && !isMounted) {
      setIsMounted(true);
      setIsClosing(false);
    } else if (!isOpen && isMounted) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted]);

  // Connect to Realtime Broadcast (or Local In-Memory Relay) on mount
  useEffect(() => {
    if (isMounted) {
      const id = getIdentity();
      setIdentity(id);
      joinPanchayat(id);

      const unsubMsg = onMessage((msg) => {
        setMessages((prev) => {
          const next = [...prev, msg];
          if (next.length > 100) return next.slice(next.length - 100);
          return next;
        });
      });

      const unsubPresence = onPresenceChange((count) => {
        setOnlineCount(count);
      });

      return () => {
        if (unsubMsg) unsubMsg();
        if (unsubPresence) unsubPresence();
        leavePanchayat();
      };
    }
  }, [isMounted]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Smooth mobile/iPad keyboard auto-adjustment (Top stays fixed, bottom moves up)
  useEffect(() => {
    if (!isInputFocused || !window.visualViewport) {
      setKeyboardOffset(0);
      return;
    }

    const viewport = window.visualViewport;
    const fullHeight = window.innerHeight;

    const handleResize = () => {
      const keyboardHeight = fullHeight - viewport.height;
      if (keyboardHeight > 100) {
        setKeyboardOffset(keyboardHeight);
      } else {
        setKeyboardOffset(0);
      }
    };

    viewport.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, [isInputFocused]);

  const handleSendText = () => {
    const text = inputText.trim();
    if (!text) return;

    const now = Date.now();
    if (now - lastSendTimeRef.current < 1500) {
      return; // 1.5s Rate limit
    }

    if (text === lastMessageRef.current) {
      return; // Duplicate block
    }

    sendTextMessage(identity, text);
    lastSendTimeRef.current = now;
    lastMessageRef.current = text;
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleShareSong = () => {
    if (!currentTrack) return;

    const now = Date.now();
    if (now - lastSendTimeRef.current < 1500) return;

    sendSongShare(identity, {
      title: currentTrack.title,
      artist: currentTrack.artist || 'Apna Culturez',
      vibeKey: currentMode,
      trackIndex: currentTrack.trackIndex || 0,
      youtubeId: currentTrack.id,
    });

    lastSendTimeRef.current = now;
  };

  const handleListenNow = (song) => {
    if (song.vibeKey !== currentMode) {
      onModeChange && onModeChange(song.vibeKey);
      setTimeout(() => {
        onSelectTrack && onSelectTrack(song.trackIndex);
      }, 150);
    } else {
      onSelectTrack && onSelectTrack(song.trackIndex);
    }
  };

  const handleQuickEmoji = (emoji) => {
    const now = Date.now();
    if (now - lastSendTimeRef.current < 1500) return;
    sendTextMessage(identity, emoji);
    lastSendTimeRef.current = now;
  };

  const handleBackdropClick = (e) => {
    onClose();
  };

  if (!isMounted) return null;

  const displayCount = listenerCount || onlineCount || 1;

  return (
    <div
      className={`panchayat-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`panchayat-card panchayat-mode-${currentMode} ${isClosing ? 'closing' : ''} ${keyboardOffset > 0 ? 'keyboard-open' : ''}`}
        style={keyboardOffset > 0 ? { bottom: `${keyboardOffset + 12}px` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Bigger Apno Dhun Logo (Left) + Live Counter & Close Button (Right) */}
        <div className="panchayat-header">
          <img
            src="/apno-dhun-logo.png"
            alt="Apno Dhun"
            className="panchayat-brand-logo"
          />
          <div className="panchayat-header-right">
            <div className="panchayat-header-online">
              <span className="online-dot" />
              <span className="online-text">{displayCount} Mehmaan</span>
            </div>
            <button
              className="panchayat-close-btn"
              onClick={onClose}
              aria-label="Close Panchayat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Identity Subheader (You) */}
        {identity && (
          <div className="panchayat-identity-bar">
            <div className="identity-pill" style={{ borderColor: identity.color + '55' }}>
              <span className="identity-avatar">{identity.avatar}</span>
              <span className="identity-name" style={{ color: identity.color }}>
                {identity.name} #{identity.number}
              </span>
              <span className="identity-you">(You)</span>
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="panchayat-messages" ref={messagesContainerRef}>
              {messages.length === 0 && (
                <div className="panchayat-empty">
                  <span className="empty-icon">💬</span>
                  <p className="empty-text">Panchayat is open!</p>
                  <p className="empty-hint">Say Ram Ram Sa or share a song...</p>
                </div>
              )}

              {messages.map((msg) => {
                const isMe = msg.sender?.id === identity?.id;

                if (msg.type === 'song_share') {
                  return (
                    <div
                      key={msg.id}
                      className={`panchayat-msg ${isMe ? 'msg-mine' : 'msg-other'}`}
                    >
                      {!isMe && (
                        <span className="msg-sender" style={{ color: msg.sender?.color }}>
                          {msg.sender?.avatar} {msg.sender?.name} #{msg.sender?.number}
                        </span>
                      )}
                      <div className="msg-song-card">
                        <div className="song-card-header">
                          <span className="song-card-icon">🎧</span>
                          <span className="song-card-label">
                            {isMe ? 'You shared' : `${msg.sender?.name} is vibing to`}
                          </span>
                        </div>
                        <div className="song-card-body">
                          <div className="song-card-info">
                            <span className="song-card-title">{msg.song?.title}</span>
                            <span className="song-card-artist">{msg.song?.artist}</span>
                          </div>
                          <button
                            className="song-card-listen"
                            onClick={() => handleListenNow(msg.song)}
                          >
                            ▶ Listen
                          </button>
                        </div>
                      </div>
                      <span className="msg-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  );
                }

                // Text message
                const isSingleEmoji = /^\p{Emoji}$/u.test(msg.text?.trim() || '');
                return (
                  <div
                    key={msg.id}
                    className={`panchayat-msg ${isMe ? 'msg-mine' : 'msg-other'}`}
                  >
                    {!isMe && (
                      <span className="msg-sender" style={{ color: msg.sender?.color }}>
                        {msg.sender?.avatar} {msg.sender?.name} #{msg.sender?.number}
                      </span>
                    )}
                    <div
                      className={`msg-bubble ${isMe ? 'bubble-mine' : 'bubble-other'} ${isSingleEmoji ? 'bubble-emoji' : ''}`}
                    >
                      <span className={isSingleEmoji ? 'msg-emoji-big' : 'msg-text'}>
                        {msg.text}
                      </span>
                    </div>
                    <span className="msg-time">{formatTime(msg.timestamp)}</span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Emoji Bar + Share Song */}
            <div className="panchayat-emoji-bar">
              <div className="emoji-pills">
                {['🔥', '🚩', '🪕', '👑', '❤️', '👏'].map((emoji) => (
                  <button
                    key={emoji}
                    className="emoji-quick-btn"
                    onClick={() => handleQuickEmoji(emoji)}
                    aria-label={`Send ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                className="share-song-btn"
                onClick={handleShareSong}
                disabled={!currentTrack}
                title="Share what you're listening to"
              >
                🎵 Share
              </button>
            </div>

            {/* Apple iMessage-Style Input Bar */}
            <div className="panchayat-input-bar">
              <input
                ref={inputRef}
                className="panchayat-input"
                type="text"
                placeholder="Message Panchayat..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 200))}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                maxLength={200}
              />
              <button
                className={`panchayat-send-btn ${inputText.trim().length > 0 ? 'send-active' : ''}`}
                onClick={handleSendText}
                disabled={inputText.trim().length === 0}
                aria-label="Send"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }
