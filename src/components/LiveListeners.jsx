import { useState, useEffect, useRef } from 'react';
import './LiveListeners.css';

export default function LiveListeners({ count }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (prevCountRef.current !== count && count) {
      prevCountRef.current = count;
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (!count) return null;

  return (
    <div className="live-listeners-bare">
      <img src="/safa-icon.webp" alt="Safa" className="safa-icon-big" />
      <span className={`listeners-text-clean ${isBlinking ? 'count-blink' : ''}`}>
        <strong className="listeners-num-bold">{count}</strong> Mehmaan
      </span>
    </div>
  );
}
