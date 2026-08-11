import './LiveListeners.css';

export default function LiveListeners({ count }) {
  return (
    <div className="live-listeners-bar">
      <span className="dim-pulse-dot" aria-hidden="true" />
      <span className="listeners-text">{count} online</span>
    </div>
  );
}
