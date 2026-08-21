/**
 * Configuration for newly released vibes on Apno Dhun
 * Whenever you launch a new vibe, simply update this object:
 * - vibeKey: the vibe identifier (e.g. 'dhh', 'folk', etc.)
 * - posterImg: poster image located in public/ directory
 * - releaseDate: ISO date string when the vibe was launched
 * - durationDays: how many days the popup and 'NEW' badges should remain active (default: 7)
 * 
 * Everything (popup + header & queue 'NEW' tags) automatically expires after durationDays!
 */
export const latestVibeAnnouncement = {
  vibeKey: 'dhh',
  posterImg: '/dhh-poster-popup.webp',
  releaseDate: '2026-08-17T00:00:00Z',
  durationDays: 7, // 1 week active window
};

/**
 * Returns true if the new vibe promotion is currently within its active 7-day window.
 */
export function isNewVibeActive() {
  if (!latestVibeAnnouncement || !latestVibeAnnouncement.releaseDate || !latestVibeAnnouncement.vibeKey) {
    return false;
  }
  const releaseTime = new Date(latestVibeAnnouncement.releaseDate).getTime();
  const expiryTime = releaseTime + latestVibeAnnouncement.durationDays * 24 * 60 * 60 * 1000;
  return Date.now() < expiryTime;
}

/**
 * Returns the active new vibe key (e.g. 'dhh') if currently active, or null if expired.
 */
export function getActiveNewVibeKey() {
  return isNewVibeActive() ? latestVibeAnnouncement.vibeKey : null;
}
