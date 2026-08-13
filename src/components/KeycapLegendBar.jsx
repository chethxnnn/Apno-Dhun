import './KeycapLegendBar.css';

export default function KeycapLegendBar() {
  return (
    <div className="keycap-legend-bar">
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
        <span className="keycap">N</span>
        <span className="keycap">P</span>
        <span className="keycap-label">TRACK</span>
      </div>
      <div className="keycap-item">
        <span className="keycap">Q</span>
        <span className="keycap-label">GEET MAALA</span>
      </div>
      <div className="keycap-item">
        <span className="keycap">P</span>
        <span className="keycap-label">PATRIKA</span>
      </div>
      <div className="keycap-item">
        <span className="keycap">G</span>
        <span className="keycap-label">GHUNGROO</span>
      </div>
    </div>
  );
}
