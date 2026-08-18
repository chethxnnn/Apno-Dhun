import './PanchayatButton.css';

export default function PanchayatButton({ onClick, isActive = false, unreadCount = 0 }) {
  return (
    <button
      className={`panchayat-float-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-label="Open Panchayat Chat"
      title="Panchayat Chat (C)"
    >
      <svg
        className="panchayat-btn-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span className="panchayat-btn-text">पंचायत</span>
      {unreadCount > 0 && !isActive && (
        <span className="panchayat-unread-dot" />
      )}
    </button>
  );
}
