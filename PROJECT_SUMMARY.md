# Apno Dhun (अपणो धुन) — Comprehensive Project Documentation

> **Apno Dhun** is a high-performance, glassmorphic music web application celebrating the rich musical heritage of Rajasthan. Created for **Apna Culturez** (`@apna.culturez`) and inspired by *saloon.wtf*.

---

## 🎨 1. Brand & Visual Design Identity

- **Direct Vibe Landing**: Opens directly into the active vibe experience (defaulting to *Byaav*) with single-view layout.
- **4 Cultural Vibes**:
  1. 🪕 **Lok** (*Lok Ri Dhun*) — Traditional Rajasthani Folk
  2. 💒 **Byaav** (*Byaav Ro Geet*) — Wedding Classics & Ritual Songs
  3. 🔥 **Trend** (*Navo Trend*) — Modern Hits & Trending Beats
  4. 🙏 **Bhakti** (*Bhagwan Ri Bhakti*) — Devotional Bhajans & Aarti
- **Header Layout**:
  - Live local time display top-left (`7:21 pm`)
  - Centered navigation: `[Lok]  [Byaav]  (🔴 APNA LOGO)  [Trend]  [Bhakti]`
  - Social links top-right: Spotify ↗ and YT Music ↗
  - **Logo Zoom**: Smooth 1.22x hover zoom animation linking to Instagram (`https://instagram.com/apna.culturez`)
  - **Mobile Layout**: Responsive bottom footer navigation bar.
- **Custom Calligraphy Titles**: High-res Devanagari PNG title images (`/titles/lok.png`, `byaav.png`, `trend.png`, `bhakti.png`) featuring continuous 6-second levitation & breathing shadow animations (`titleAmbientFloat`).
- **Background Illustrations**: High-resolution hand-drawn art (`folk.png`, `wedding.png`, `trending.png`, `devotional.png`) with mobile-tuned framing (`42% center` for Goddess & temple arch in Bhakti).

---

## 🏰 2. Glassmorphic Square Dock Music Player

- **Outer Box**: A premium rounded corner box (`border-radius: 20px`) with frosted glass (`backdrop-filter: blur(48px)`), thin border highlights, and ambient glow.
- **Square Album Art**: Sized to fit and align perfectly with the vertical column (`116px` square on desktop / `92px` on mobile) with custom drop shadow.
- **Inner Layout Stack**:
  - Left: Square Album Art
  - Right: Vertical column containing:
    1. **Track Title** (with auto-truncation)
    2. **Artist Name**
    3. **Golden Gota-Patti Seek Line** (glowing golden silk thread progress line)
    4. **Time Indicators** (current time / total duration)
    5. **5-Button Controls Row**: Mute, Previous, Play/Pause, Next, and Shuffle centered at the bottom of the column.
- **Custom Vibe Seek Pointers**:
  - 💒 **Byaav**: Royal Groom with Varmala (`groom.png`) moving towards the stationary Bride (`bride.png`) sitting at 100% end.
  - 🪕 **Lok**: Traditional hand-painted **Rajasthani Dhol** (`dhol.png`).
  - 🔥 **Trend**: Custom Fire Flame (`fire.png`).
  - 🙏 **Bhakti**: Glowing traditional **Diya 🪔** with flickering flame.
  - **Size Integrity**: Pointer sizes remain constant and never shrink when approaching the end of the song.
- **Desktop & Mobile Interactive Drag**:
  - Tap-to-seek support on the progress track.
  - **Smooth Sliding Drag**: Full drag-and-seek support for both mouse events and mobile touch interfaces (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none` to prevent screen scroll while seeking.

---

## 🎹 3. Pro Interactivity & Desktop Shortcuts

| Key | Action | Visual Feedback |
|---|---|---|
| `[ Space ]` / `[ K ]` | Toggle Play / Pause | Floating Glassmorphic Toast |
| `[ M ]` | Toggle Mute / Unmute | Toast Notification |
| `[ S ]` | Toggle **Shuffle Mode** | Golden Glow Button + Toast |
| `[ → ]` | Next Track | Toast Notification |
| `[ ← ]` | Previous Track / Restart | Toast Notification |
| `[ F ]` / `[ Esc ]` | **Cinema Mode** (fades UI out) | Toast Notification |

---

## 🟢 4. Real-Time Live Listener Counter

- **Positioning**: Discrete small pill (`11px` font) positioned directly below the top header with a soft, dim pulsing green dot (`🟢 online`).
- **Ably Realtime Presence Integration**:
  - Automatically loads Ably browser SDK from CDN when `VITE_ABLY_API_KEY` (`appId.keyId:secret`) is configured in Vercel.
  - Subscribes to presence events (`enter`, `leave`, `present`) for 100% real-time active visitor counting.
  - Features an **automatic graceful fallback** to an organic time-of-day pulse generator if the key is missing or invalid.

---

## 🎧 5. YouTube Player Engine & Metadata Fetching

- **Hidden Player**: Operates inside a 1×1 hidden `div` via YouTube IFrame API.
- **Dynamic Metadata Fetching**: Automatically fetches live video title and channel name via public `noembed` oEmbed API + `getVideoData()`, caching metadata in React state.
- **Random Initial Track Order**: Automatically picks a random song upon opening the site or switching vibes.

---

## 📁 6. Project Directory Map

```text
suno/
├── public/
│   ├── backgrounds/          # High-res vibe backgrounds (folk, wedding, trending, devotional)
│   ├── player-icons/         # Custom hand-painted seek pointers (groom, bride, dhol, fire)
│   ├── titles/               # Devanagari calligraphy title images
│   └── logo.png              # Apna Culturez logo
├── src/
│   ├── components/           # React UI components
│   │   ├── BackgroundLayer.jsx & .css
│   │   ├── Header.jsx & .css
│   │   ├── LiveListeners.jsx & .css
│   │   ├── Player.jsx & .css
│   │   ├── TitleDisplay.jsx & .css
│   │   └── YouTubeEmbed.jsx
│   ├── data/
│   │   └── playlists.js      # Vibe configurations & user YouTube song IDs
│   ├── hooks/
│   │   ├── useYouTubePlayer.js (YouTube engine, metadata & shuffle logic)
│   │   └── useLiveListeners.js (Realtime Ably presence & fallback)
│   ├── App.jsx               # App entry & keyboard shortcuts listener
│   ├── App.css
│   ├── index.css             # Design tokens & global resets
│   └── main.jsx
├── index.html                # Google Fonts (Great Vibes, Sacramento, Caveat, Inter)
├── package.json
├── README.md
└── PROJECT_SUMMARY.md        # Comprehensive documentation
```

---

## ⚙️ 7. Environment Setup for Vercel

- **Vercel Environment Variable**:
  - **Name**: `VITE_ABLY_API_KEY`
  - **Value Format**: `appId.keyId:keySecret` *(copied from Ably Dashboard ➔ API Keys ➔ Root Key)*
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
