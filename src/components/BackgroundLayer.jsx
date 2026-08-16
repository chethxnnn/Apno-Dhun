import { useState, useEffect, useRef } from 'react';
import './BackgroundLayer.css';

export default function BackgroundLayer({ src, srcMobile, bgPosition = 'center', currentMode = 'wedding' }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const activeSrc = isMobile && srcMobile ? srcMobile : src;
  const [layers, setLayers] = useState({
    front: { src: activeSrc, pos: bgPosition, key: 0 },
    back: null,
  });
  const count = useRef(0);

  useEffect(() => {
    count.current += 1;
    setLayers((prev) => ({
      front: { src: activeSrc, pos: bgPosition, key: count.current },
      back: prev.front,
    }));
  }, [activeSrc, bgPosition]);

  return (
    <div
      className={`bg-wrap bg-mode-${currentMode}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {layers.back && (
        <div
          key={`b-${layers.back.key}`}
          className="bg-layer bg-out"
          style={{
            backgroundImage: `url(${layers.back.src})`,
            backgroundPosition: layers.back.pos || 'center',
          }}
        />
      )}
      <div
        key={`f-${layers.front.key}`}
        className="bg-layer bg-in"
        style={{
          backgroundImage: `url(${layers.front.src})`,
          backgroundPosition: layers.front.pos || 'center',
        }}
      />
      {/* Decorative gradient overlay */}
      <div className="bg-overlay" />
      {/* Invisible protective glass shield to block inspect / right-click extraction */}
      <div className="bg-shield" onContextMenu={(e) => e.preventDefault()} />
    </div>
  );
}
