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
- **Favicon & Brand Identity**:
  - Web favicon configured with `public/favicon.png` (`apno favcon.png`).
  - Add to Home Screen PWA Banner displays the favicon logo on the left-most side of the container (`[ Logo ] [ 2 Text Lines ] [ Cross ✕ ]`).
- **Favicon & Brand Identity**:
  - Web favicon configured with `public/favicon.png` (`apno favcon.png`).
  - Add to Home Screen PWA Banner displays the favicon logo on the left-most side of the container (`[ Logo ] [ 2 Text Lines ] [ Cross ✕ ]`).
- **Header Layout**:
  - **Top-Left Corner**: Exact **Apno Dhun Logo** (`public/apno-dhun-logo.png` / `apno dhun logo.png`) rendered in top-left across Mobile, iPad, and Desktop views!
  - **Desktop Mehmaan Counter**: Positioned in top-left directly **under the Apno Dhun logo** (`top: 84px; left: 28px;`).
  - **Top-Right Corner**: Clock & Date block (`clock-block-responsive` / `simple-mobile-time`) moved to the top-right corner across Mobile, iPad, and Desktop views!
  - **Removed Social Links**: Completely removed Spotify ↗ and YouTube Music ↗ links.
  - **Mobile & iPad Navigation**: Responsive bottom footer navigation bar.
- **Custom Calligraphy Titles**: High-res Devanagari PNG title images (`/titles/lok.png`, `byaav.png`, `trend.png`, `bhakti.png`) featuring continuous 6-second levitation & breathing shadow animations (`titleAmbientFloat`).
- **Background Illustrations**: High-resolution hand-drawn art (`folk.png`, `wedding.png`, `trending.png`, `devotional.png`) with mobile-tuned framing (`42% center` for Goddess & temple arch in Bhakti).

---

## 🏰 2. Capsule Glass Music Player & Interactive Features (busdriver.wtf Evolution)

- **Capsule Dock Container**: Capsule glass container (`border-radius: 9999px`) with dark frosted glass (`backdrop-filter: blur(48px)`), gold border accents, and ambient glow.
- **Spinning Vinyl Disc Art**: Circular vinyl disc (`art-disc spin`) with center hole on the far left.
- **Controls & Pill-Shaped Dhun Button**:
  - **Pill-Shaped Dhun Button (`[ Icon /dhun-button.png ] Dhun`)**: Replaced the old Patrika icon button with a sleek glass pill button featuring your custom **`dhun button.png`** icon (`public/dhun-button.png`) and **"Dhun"** text! Styled in the exact dark shade (`rgba(20, 18, 24, 0.85)`) matching the player dock. Clicking opens the Patrika card as usual.
  - **Mobile & iPad Shake Phone Gesture (`src/hooks/useShake.js`)**: Automatically detects phone/iPad shake movements (`devicemotion` accelerometer API threshold) and instantly opens the Dhun card modal with haptic vibration feedback (`navigator.vibrate`)!
  - **Removed Shuffle Button**: Removed the shuffle toggle button from the player controls dock.
  - `Previous (⏮)`
  - **Big Solid White Play Circle Button** (`▶ / ⏸`)
  - `Next (⏭)`
  - **Smooth Expandable Hover Volume Bar (`🔊`)**: Hovering over the volume icon smoothly expands a horizontal volume slider (`width: 65px`). Mouse leave collapses it back.
  - `Geet Maala Queue (≡)`
- **Mobile Controls Order**:
  - Mobile Controls Order: `[ Pill Dhun Button ]  [ Prev ]  [ Play ]  [ Next ]  [ Volume ]  [ Queue ]`
  - Desktop Controls Order: `[ Pill Dhun Button ]  [ Prev ]  [ Play ]  [ Next ]  [ Volume ]  [ Queue ]`
  - **Larger Mobile Play & Prev/Next Buttons**: Solid white play button increased to `50px`, Prev/Next buttons increased to `38px` for tap comfort.
- **Exact busdriver.wtf Queue Card Layout, Real Titles & Interactive Share Button**:
  - Exact typography, font sizes, active track pill highlights (`background: rgba(255,255,255,0.12)`), 3 orange/gold vertical dots (`⋮⋮⋮`).
  - Automatically fetches 100% real YouTube video titles and channel names for every song in the queue.
  - **Interactive Website Share Button**: Bottom card `[ ⬆ ] Share Apno Dhun` triggers native Web Share API on supported devices or copies `apno-dhun.vercel.app` URL to clipboard with visual green checkmark feedback!
- **Smooth Opening & Closing Animations Both Ways**:
  - Queue list modal plays smooth 0.3s slide-up entrance (`queueSlideUp`) and slide-down exit (`queueSlideDown`) with matching backdrop fade transitions both ways.
- **Pixel-Perfect html2canvas Patrika Export (`PatrikaModal.jsx`)**:
  - Uses **`html2canvas`** at **4x Ultra HD Scale Factor** (~2074x3032 resolution), ensuring the saved PNG image has **NO COMPROMISE on quality — razor sharp 4K resolution** with zero blurriness or downsampling loss!
  - **Background-Image Cover Container**: Uses a `background-image` container with `background-size: cover; background-position: center;` so `html2canvas` renders the thumbnail **100% full without black bars** and without scaling/zooming distortion!
  - **Centered Red Thin Serif Title**: Slightly reduced title font size (`0.91rem`) with reduced vertical gap (`margin-top: -3px`) between title and artist name in muted red thin font below the thumbnail.
- **Mobile & iPad Top-Left Bebas Neue Clock & Responsive Date**:
  - **iPad Mode**: Increased Bebas Neue clock size to **`42px`** with full date format (`13th August, 2026`).
  - **Mobile Mode**: Compact `26px` clock with abbreviated short month format (**`13th Aug, 2026`**) spanning the exact width of the time block above it.
- **Clean Queue List View**:
  - Removed language pills from queue list header.
  - Hidden scrollbar on mobile view for a clean, borderless list experience.
- **Responsive Dock & Navigation Width Alignment**:
  - **iPad View**: Footer navigation bar restored to standard layout; player dock and Queue card set to `580px`.
  - **Mobile View**: Player dock centered with `left: 50% !important; transform: translateX(-50%) !important` with zero rightward shift.
- **PWA Add to Home Screen Pill Banner**:
  - Compact width reduced to **`max-width: 320px`** for mobile and iPad views.
  - Displays 2 lines: **Line 1**: `Keep Apno Dhun on your home screen` | **Line 2**: `Tap [ share icon ] then add to home screen`.
  - Subtle unhighlighted close cross icon (`✕`) right next to the text.
  - Floating cleanly at `bottom: 232px` on mobile/iPad view, fading down to `opacity: 0.3` when Queue list is active.
- **Larger Rajasthani Safa Icon**:
  - Safa icon increased to `34px` on desktop and `26px` on mobile with red pulsing glow (`safaPulseBig`).
- **Desktop Keycaps Shortcuts Position**:
  - Positioned closer below the desktop player dock at `bottom: 44px`.

---

## 🎹 3. Pro Interactivity & Desktop Shortcuts

| Key | Action | Visual Feedback |
|---|---|---|
| `[ Space ]` / `[ K ]` | Toggle Play / Pause | Floating Glassmorphic Toast |
| `[ M ]` | Toggle Mute / Unmute | Toast Notification |
| `[ S ]` | Toggle **Shuffle Mode** | Golden Glow Button + Toast |
| `[ Q ]` | Open **Geet Maala Queue** | Frosted Glass Modal |
| `[ P ]` | Open **Royal Patrika Card** | Vertical Card Modal |
| `[ G ]` | Play **Ghungroo Chime** | Web Audio Bell + Toast |
| `[ → ]` / `[ N ]` | Next Track | Toast Notification |
| `[ ← ]` | Previous Track / Restart | Toast Notification |
| `[ F ]` / `[ Esc ]` | **Cinema Mode** / Close Modals | Toast Notification |

---

- **Header & Navigation Layout**:
  - **Desktop Top-Left Block**: Sleek condensed digital clock font (**`Bebas Neue`**, `62px` with `transform: scaleY(1.18)`).
  - **Stacked Seconds & AM/PM**: Live gold seconds (`28`) on top, with `PM` stacked directly beneath it next to the clock digits!
  - **Aligned Date Row**: Aligned directly below the clock in top-left in exact format **`13th August, 2026`** (desktop/iPad) and **`13th Aug, 2026`** (mobile) spanning the clock display width!
  - **Desktop Top-Right**: Spotify ↗ and YT Music ↗ social links.
  - **Centered Navigation**: `[Lok]  [Byaav]  (🔴 APNA LOGO)  [Trend]  [Bhakti]` on Desktop.
  - **Mobile & iPad Layout**: Fixed bottom footer navigation bar (`max-width: 440px` mobile / `max-width: 580px` iPad).
- **Real-Time Live Listener Counter (Safa Icon & Mehmaan Branding)**:
  - **Positioning**: Fixed at `top: 16px; left: 50%; transform: translateX(-50%)` in top header bar across all Mobile and iPad views!
- **Visuals & Animations**:
  - Replaced standard dot with a custom **Rajasthani Safa Icon** (`safa-icon.png`, `34px` desktop / `20px` compact mobile/iPad).
  - **Typography**: **Bold count number** (`42`) + Normal weight label (**Mehmaan**) scaled to compact `11px` in mobile/iPad header line.
- **Ably Realtime Presence Integration**:
  - Subscribes to realtime presence events for 100% accurate active visitor counting with automatic fallback.

---

## 🎧 5. YouTube Player Engine & Realtime Data API v3 Sync

- **Realtime Playlist Auto-Sync (YouTube Data API v3)**:
  - Connected directly to YouTube Data API v3 endpoints via `src/services/youtubeApi.js`.
  - Mapped 4 Live Playlist IDs:
    - **Folk (`folk`)**: `PLYAOxVEAP3bs`
    - **Wedding (`wedding`)**: `PLEsCBM7K03Bk`
    - **Trending (`trending`)**: `PLeiQ7CPbnew8`
    - **Devotional (`devotional`)**: `PLDM_wzSW7hoc`
  - **Live Auto-Update**: Whenever you add, delete, or reorder tracks in your YouTube playlists, the site updates automatically on refresh/visit with **zero code changes**!
  - **Smart LocalStorage Caching**: 15-minute TTL cache protects your free 10,000 daily API quota while serving instant zero-latency song lists to visitors.
  - **Offline Fallback**: Automatically falls back to static playlists if no API key is set or if YouTube API fails.
- **Hidden Player Engine**: Operates inside a 1×1 hidden `div` via YouTube IFrame API.
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
