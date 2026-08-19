import React from 'react';
import './ErrorBoundary.css';

const INSTAGRAM_URL = 'https://instagram.com/apna.culturez';
const YOUTUBE_URL = 'https://www.youtube.com/@ApnaCulturez';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Apno Dhun Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-wrap">
          <div className="error-boundary-card">
            {/* Top Dual Logos: Apna Culturez ✕ Apno Dhun */}
            <div className="error-boundary-logos">
              <img
                src="/logo.png"
                alt="Apna Culturez"
                className="error-logo-img"
              />
              <span className="error-logo-divider">✕</span>
              <img
                src="/apno-dhun-logo.png"
                alt="Apno Dhun"
                className="error-logo-img"
              />
            </div>

            {/* Center Content */}
            <div className="error-boundary-body">
              <h2 className="error-hindi-heading">राम राम सा!</h2>
              <p className="error-hindi-sub">
                कुछ तकनीकी समस्या आई है। चिंता मत करो सा, एक बार पेज पुनः लोड करो।
              </p>
              <button
                className="error-reload-btn"
                onClick={this.handleReload}
              >
                <span>🔄</span>
                <span>पुनः लोड करें (Reload)</span>
              </button>
            </div>

            {/* Bottom Social Channels: Instagram & YouTube */}
            <div className="error-boundary-socials">
              <span className="error-socials-label">Connect with Apna Culturez</span>
              <div className="error-social-links-row">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="error-social-pill"
                >
                  <span className="error-social-icon">📸</span>
                  <span>Instagram</span>
                </a>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="error-social-pill"
                >
                  <span className="error-social-icon">🎥</span>
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
