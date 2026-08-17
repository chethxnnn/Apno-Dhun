import { useState, useRef, useCallback, useEffect } from 'react';
import './CircularVibeNav.css';
import { modes, modeConfig } from '../data/playlists';
import { getActiveNewVibeKey } from '../data/newVibeConfig';

export default function CircularVibeNav({ currentMode, onModeChange, isMobile = false }) {
  const [animState, setAnimState] = useState({
    shiftX: 0,
    targetOffset: 0,
    isAnimating: false,
  });

  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const isAnimatingRef = useRef(false);
  const wheelLockTime = useRef(0);

  const activeIdx = modes.indexOf(currentMode);
  const total = modes.length;

  const navigateToOffset = useCallback(
    (offset) => {
      if (offset === 0 || isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const nextIdx = (activeIdx + offset + total * 100) % total;
      const targetMode = modes[nextIdx];

      // Measure exact pixel distance between current center item (index 3) and target item (index 3 + offset)
      let shift = 0;
      if (trackRef.current && trackRef.current.children) {
        const centerEl = trackRef.current.children[3]; // Center slot is at index 3 in 7-slot setup
        const targetEl = trackRef.current.children[3 + offset];
        if (centerEl && targetEl) {
          shift = targetEl.offsetLeft - centerEl.offsetLeft;
        }
      }

      // Fallback if measurement unavailable
      if (!shift) {
        shift = offset * (isMobile ? 56 : 74);
      }

      setAnimState({
        shiftX: shift,
        targetOffset: offset,
        isAnimating: true,
      });

      // 340ms fluid Apple spring-like easing transition
      setTimeout(() => {
        onModeChange(targetMode);
        setAnimState({
          shiftX: 0,
          targetOffset: 0,
          isAnimating: false,
        });
        isAnimatingRef.current = false;
      }, 340);
    },
    [activeIdx, total, onModeChange, isMobile]
  );

  // ── Touch Swipe Gestures (Mobile / iPad) ──
  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (dragStartX.current === null) return;
    const diffX = dragStartX.current - e.changedTouches[0].clientX;
    dragStartX.current = null;

    if (Math.abs(diffX) > 24) {
      if (diffX > 0) {
        navigateToOffset(1);
      } else {
        navigateToOffset(-1);
      }
    }
  };

  // ── Mouse Drag / Swipe Gestures (Desktop) ──
  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || isAnimatingRef.current) return;
    const diffX = dragStartX.current - e.clientX;
    if (Math.abs(diffX) > 30) {
      isDragging.current = false;
      if (diffX > 0) {
        navigateToOffset(1);
      } else {
        navigateToOffset(-1);
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // ── Wheel / Trackpad Horizontal & Vertical Scrolling (Desktop) ──
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - wheelLockTime.current < 360 || isAnimatingRef.current) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 16) {
      wheelLockTime.current = now;
      if (delta > 0) {
        navigateToOffset(1);
      } else {
        navigateToOffset(-1);
      }
    }
  };

  useEffect(() => {
    const onGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, []);

  // 7 circular slots for silky-smooth edge transitions: [-3, -2, -1, 0, 1, 2, 3]
  const slots = [-3, -2, -1, 0, 1, 2, 3];

  const trackStyle = animState.isAnimating
    ? {
        transform: `translate3d(${-animState.shiftX}px, 0, 0)`,
        transition: 'transform 0.34s cubic-bezier(0.25, 1, 0.5, 1)',
      }
    : {
        transform: 'translate3d(0, 0, 0)',
        transition: 'none',
      };

  return (
    <div
      className={`circular-ring-container ${isMobile ? 'mobile-ring' : 'desktop-ring'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      title="Click or swipe to switch vibes"
    >
      <div
        className={`circular-ring-track ${animState.isAnimating ? 'is-animating' : ''}`}
        ref={trackRef}
        style={trackStyle}
      >
        {slots.map((offset) => {
          const modeIndex = (activeIdx + offset + total * 100) % total;
          const modeKey = modes[modeIndex];
          const config = modeConfig[modeKey];

          // Compute active styling dynamically during animation
          const effectiveOffset = animState.isAnimating
            ? offset - animState.targetOffset
            : offset;

          const isCenter = effectiveOffset === 0;
          const isNear = Math.abs(effectiveOffset) === 1;
          const isFar = Math.abs(effectiveOffset) === 2;

          let slotClass = 'slot-edge-buffer';
          if (isCenter) slotClass = 'slot-center';
          else if (isNear) slotClass = 'slot-near';
          else if (isFar) slotClass = 'slot-far';

              const activeNewVibeKey = getActiveNewVibeKey();

              return (
                <button
                  key={`${modeKey}-${offset}`}
                  className={`ring-nav-item ${slotClass} ${isCenter ? 'active' : ''}`}
                  onClick={(e) => {
                    if (Math.abs(dragStartX.current - e.clientX) > 10) return;
                    navigateToOffset(offset);
                  }}
                  aria-label={`Switch to ${config?.label || modeKey} vibe`}
                >
                  <span className="ring-nav-label">
                    {config?.label || modeKey}
                    {activeNewVibeKey && modeKey === activeNewVibeKey && (
                      <span className="vibe-new-badge">NEW</span>
                    )}
                  </span>
                </button>
              );
        })}
      </div>
    </div>
  );
}
