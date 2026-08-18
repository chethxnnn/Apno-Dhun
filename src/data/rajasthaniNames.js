/**
 * Rajasthani Identity Generator for Panchayat
 * 
 * Generates random, fun Rajasthani monikers for anonymous chat users.
 * Identity persists in sessionStorage (same tab session), but is fully
 * ephemeral — closing the tab or refreshing gives a new identity.
 */

const names = [
  'Jamkudi',
  'Laddu',
  'Banna',
  'Banni',
  'Dhapudi',
  'Dopa',
  'Dobi',
  'Pappiya',
  'Rameshiya',
  'Suriya',
  'Mangu',
  'Mangudi',
  'Gappu',
  'Gappudi',
  'Laddudi',
  'Chhamkudi',
  'Jhampudi',
  'Jhamku',
  'Tappu',
  'Tappudi',
  'Dholiya',
  'Dholu',
  'Kanhaiya',
  'Kaniya',
  'Bheru',
  'Bheriya',
  'Kaliya',
  'Kalludi',
  'Chhotu',
  'Chhoti',
  'Pappu',
  'Pappudi',
  'Ghumela',
  'Ghumariya',
  'Fuddu',
  'Fuddi',
  'Lappu',
  'Lappudi',
  'Tuntuniya',
  'Chikudi',
  'Chikna',
  'Chikni',
  'Bhamariya',
  'Bhamri',
  'Kachoriya',
  'Fafdiya',
  'Dhondu',
  'Dhamku',
  'Lattu',
  'Lattudi',
];

const avatars = ['👳', '👑', '🪕', '🐪', '🚩', '🦅', '🦚', '⚔️', '🐎', '🪘', '🦁', '🏰', '🎭', '🪔'];

const colors = [
  '#FFDF73', '#FFC2B2', '#B2CCF5', '#FFD2A0',
  '#FFC096', '#FFE0A6', '#81C784', '#CE93D8',
  '#F48FB1', '#80DEEA', '#FFAB91', '#A5D6A7',
];

const SESSION_KEY = 'apno_panchayat_identity';

/**
 * Generates or retrieves the user's Panchayat identity.
 * @returns {{ name: string, number: number, avatar: string, color: string, id: string }}
 */
export function getIdentity() {
  try {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    /* ignore */
  }

  const identity = {
    name: names[Math.floor(Math.random() * names.length)],
    number: Math.floor(Math.random() * 900) + 100, // 100–999
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(identity));
  } catch (e) {
    /* ignore */
  }

  return identity;
}

/**
 * Returns the display name string (e.g. "👳 Rangilo Banna #482")
 */
export function getDisplayName(identity) {
  return `${identity.avatar} ${identity.name} #${identity.number}`;
}
