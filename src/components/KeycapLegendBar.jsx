import './KeycapLegendBar.css';

export default function KeycapLegendBar({ currentMode = 'wedding', onPlayGhungroo }) {
  return (
    <div className={`keycap-legend-bar legend-mode-${currentMode}`}>
      <div className="keycap-item">
        <span className="keycap">Space</span>
        <span className="keycap-label">PLAY / PAUSE</span>
      </div>
      <div className="keycap-item">
        <span className="keycap">←</span>
        <span className="keycap">→</span>
        <span className="keycap-label">SEEK</span>
      </div>
      <div className="keycap-item">
        <span className="keycap">F</span>
        <span className="keycap-label">CINEMA MODE</span>
      </div>
      <div className="keycap-item">
        <span className="keycap">Q</span>
        <span className="keycap-label">GEET MAALA</span>
      </div>
      <div className="keycap-item">
        <span className="keycap">P</span>
        <span className="keycap-label">DHUN CARD</span>
      </div>
      <div
        className="keycap-item keycap-interactive"
        onClick={onPlayGhungroo}
        role="button"
        tabIndex={0}
        title="Play Ghungroo (G)"
        style={{ cursor: 'pointer' }}
      >
        <span className="keycap">G</span>
        <span className="keycap-label">GHUNGROO</span>
      </div>
    </div>
  );
}
