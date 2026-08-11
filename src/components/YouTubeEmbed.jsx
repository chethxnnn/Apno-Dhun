import React from 'react';

export default function YouTubeEmbed({ containerRef }) {
  return (
    <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden', top: 0, left: 0, zIndex: -100 }}>
      <div ref={containerRef} />
    </div>
  );
}
