/**
 * Real-Time Phonetic Transliteration Engine for Apno Dhun
 * 
 * Automatically converts Roman (English) text to Devanagari script in real-time.
 * No manual aliases needed — works for ANY Hindi/Rajasthani word, forever.
 * 
 * How it works:
 *   User types "banna re" → engine generates "बन्नरे" → searches BOTH scripts
 *   User types "kesariya" → engine generates "केसरिय" → matches "केसरिया बालम"
 */

// ─── Consonant Mappings (Longest match first) ───
const consonantMap = {
  // Aspirated & compound consonants (3-char)
  'chh': 'छ', 'shh': 'ष',
  // Aspirated consonants (2-char)
  'kh': 'ख', 'gh': 'घ', 'ch': 'च', 'jh': 'झ',
  'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ',
  'sh': 'श', 'ng': 'ं', 'ny': 'ञ',
  // Simple consonants (1-char)
  'k': 'क', 'g': 'ग', 'c': 'क', 'j': 'ज',
  't': 'त', 'd': 'द', 'n': 'न',
  'p': 'प', 'b': 'ब', 'm': 'म',
  'y': 'य', 'r': 'र', 'l': 'ल',
  'v': 'व', 'w': 'व',
  's': 'स', 'h': 'ह',
  'f': 'फ़', 'z': 'ज़', 'q': 'क़', 'x': 'क्स',
};

// ─── Vowel Mappings (Longest match first) ───
// Each vowel has an independent form (start of word / after vowel)
// and a matra/dependent form (after a consonant)
const vowelMap = {
  // Long / compound vowels (2-3 char — must come before short)
  'aa': { ind: 'आ', dep: 'ा' },
  'ee': { ind: 'ई', dep: 'ी' },
  'oo': { ind: 'ऊ', dep: 'ू' },
  'ai': { ind: 'ऐ', dep: 'ै' },
  'au': { ind: 'औ', dep: 'ौ' },
  'ou': { ind: 'औ', dep: 'ौ' },
  // Short vowels (1 char)
  'a': { ind: 'अ', dep: '' },   // Inherent vowel — no matra needed
  'i': { ind: 'इ', dep: 'ि' },
  'u': { ind: 'उ', dep: 'ु' },
  'e': { ind: 'ए', dep: 'े' },
  'o': { ind: 'ओ', dep: 'ो' },
};

// Halant (virama) — suppresses inherent vowel to form consonant clusters
const HALANT = '्';

// Sorted keys for greedy longest-match (3-char, 2-char, 1-char)
const consonantKeys = Object.keys(consonantMap).sort((a, b) => b.length - a.length);
const vowelKeys = Object.keys(vowelMap).sort((a, b) => b.length - a.length);

/**
 * Transliterates a Roman/English string to Devanagari script.
 * Uses a greedy longest-match state machine.
 *
 * @param {string} input - Roman text (e.g., "banna re baga")
 * @returns {string} - Devanagari text (e.g., "बन्नरेबग")
 */
export function romanToDevanagari(input) {
  if (!input) return '';
  const str = input.toLowerCase();
  let result = '';
  let i = 0;
  let lastWasConsonant = false;

  while (i < str.length) {
    let matched = false;

    // 1. Try matching a consonant (longest first)
    for (const key of consonantKeys) {
      if (str.startsWith(key, i)) {
        if (lastWasConsonant) {
          result += HALANT; // Join with previous consonant
        }
        result += consonantMap[key];
        lastWasConsonant = true;
        i += key.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // 2. Try matching a vowel (longest first)
    for (const key of vowelKeys) {
      if (str.startsWith(key, i)) {
        if (lastWasConsonant) {
          result += vowelMap[key].dep; // Dependent matra form
        } else {
          result += vowelMap[key].ind; // Independent form
        }
        lastWasConsonant = false;
        i += key.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // 3. Unrecognized character — pass through (space, number, punctuation)
    lastWasConsonant = false;
    result += str[i];
    i++;
  }

  return result;
}

/**
 * Detects if a string contains Devanagari characters.
 */
function hasDevanagari(str) {
  return /[\u0900-\u097F]/.test(str);
}

/**
 * Checks if a track matches a search query using real-time transliteration.
 * Searches both the original Roman query AND its Devanagari transliteration.
 *
 * @param {object} track - { id, title, artist }
 * @param {string} query - User's search input
 * @returns {boolean}
 */
export function trackMatchesQuery(track, query) {
  if (!query || !query.trim()) return true;

  const q = query.toLowerCase().trim();
  const searchTarget = `${track.title || ''} ${track.artist || ''}`.toLowerCase();

  // Direct match (Roman ↔ Roman, or Devanagari ↔ Devanagari)
  if (searchTarget.includes(q)) return true;

  // Transliterated match (Roman query → Devanagari, then search)
  if (!hasDevanagari(q)) {
    const devanagariQuery = romanToDevanagari(q);
    if (devanagariQuery && searchTarget.includes(devanagariQuery)) return true;

    // Also try without spaces (song titles often merge words)
    const devanagariNoSpace = romanToDevanagari(q.replace(/\s+/g, ''));
    if (devanagariNoSpace && searchTarget.includes(devanagariNoSpace)) return true;
  }

  // Split multi-word query — match if ALL words match somewhere
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allWordsMatch = words.every((word) => {
      if (searchTarget.includes(word)) return true;
      const devaWord = romanToDevanagari(word);
      return devaWord && searchTarget.includes(devaWord);
    });
    if (allWordsMatch) return true;
  }

  return false;
}

/**
 * Vibe label map for displaying badge pills on cross-vibe results.
 */
export const vibeLabelMap = {
  folk: 'LOK',
  wedding: 'BYAAV',
  dhh: 'DHH',
  trending: 'TREND',
  devotional: 'BHAKTI',
};
