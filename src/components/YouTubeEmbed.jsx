import React from 'react';

export default function YouTubeEmbed({ containerRef, ghungrooRef }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '240px',
        height: '240px',
        opacity: 0.001,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: -1,
      }}
      aria-hidden="true"
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {ghungrooRef && <div ref={ghungrooRef} style={{ width: '100%', height: '100%' }} />}
    </div>
  );
}
