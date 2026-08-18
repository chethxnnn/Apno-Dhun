import React from 'react';

export default function YouTubeEmbed({ containerRef, ghungrooRef }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '2px',
        height: '2px',
        opacity: 0.01,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <div ref={containerRef} style={{ width: '200px', height: '200px' }} />
      {ghungrooRef && <div ref={ghungrooRef} style={{ width: '200px', height: '200px' }} />}
    </div>
  );
}
