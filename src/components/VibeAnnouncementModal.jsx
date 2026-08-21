import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VibeAnnouncementModal.css';

export default function VibeAnnouncementModal({
  isOpen,
  onClose,
  onCheckOut,
  posterImg = '/dhh-poster-popup.webp',
  vibeTitle = 'DHH',
}) {
  const [render, setRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef(null);
  const autoHideTimerRef = useRef(null);

  const handleClose = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    onClose && onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
      setRender(true);
      setIsClosing(false);

      // Auto-disappear after 15 seconds
      autoHideTimerRef.current = setTimeout(() => {
        handleClose();
      }, 15000);
    } else if (render && !isClosing) {
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
      setIsClosing(true);
      timerRef.current = setTimeout(() => {
        setRender(false);
        setIsClosing(false);
      }, 280);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, [isOpen, render, isClosing, handleClose]);

  const handleCheckOut = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onCheckOut && onCheckOut();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!render) return null;

  return (
    <div
      className={`announcement-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`announcement-modal-card ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Poster Image */}
        <img
          src={posterImg}
          alt={`${vibeTitle} Announcement`}
          className="announcement-poster-img"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Top-Right Close Button (Cross Icon) */}
        <button
          type="button"
          className="announcement-close-btn"
          onClick={handleClose}
          aria-label="Close Announcement"
          title="Close (Esc)"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: 'none' }}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Bottom-Centered "CHECK NOW" Button (Clean Text Without Arrow) */}
        <button
          type="button"
          className="announcement-checkout-btn"
          onClick={handleCheckOut}
        >
          <span>CHECK NOW</span>
        </button>
      </div>
    </div>
  );
}
