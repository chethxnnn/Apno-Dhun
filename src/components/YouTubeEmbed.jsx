import React from 'react';

export default function YouTubeEmbed({ containerRef, ghungrooRef }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '320px',
        height: '240px',
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
