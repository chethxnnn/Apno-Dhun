import { useState, useEffect, useRef } from 'react';
import './BackgroundLayer.css';

export default function BackgroundLayer({ src, bgPosition = 'center' }) {
  const [layers, setLayers] = useState({ front: { src, pos: bgPosition, key: 0 }, back: null });
  const count = useRef(0);

  useEffect(() => {
    count.current += 1;
    setLayers(prev => ({ front: { src, pos: bgPosition, key: count.current }, back: prev.front }));
  }, [src, bgPosition]);

  return (
    <div className="bg-wrap">
      {layers.back && (
        <div
          key={`b-${layers.back.key}`}
          className="bg-layer bg-out"
          style={{
            backgroundImage: `url(${layers.back.src})`,
            backgroundPosition: layers.back.pos || 'center'
          }}
        />
      )}
      <div
        key={`f-${layers.front.key}`}
        className="bg-layer bg-in"
        style={{
          backgroundImage: `url(${layers.front.src})`,
          backgroundPosition: layers.front.pos || 'center'
        }}
      />
      <div className="bg-overlay" />
    </div>
  );
}
