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
  - **Desktop Top-Left Block**: Sleek condensed digital clock font (**`Bebas Neue`**, `62px` with `transform: scaleY(1.18)`).
  - **Stacked Seconds & AM/PM**: Live gold seconds (`28`) on top, with `PM` stacked directly beneath it next to the clock digits!
  - **Aligned Date Row**: Aligned directly below the clock in top-left in exact format **`13th August, 2026`** spanning the clock display width!
  - **Desktop Top-Right**: Spotify ↗ and YT Music ↗ social links.
  - **Centered Navigation**: `[Lok]  [Byaav]  (🔴 APNA LOGO)  [Trend]  [Bhakti]`
  - **Logo Zoom**: Smooth 1.22x hover zoom animation linking to Instagram (`https://instagram.com/apna.culturez`)
  - **Mobile Layout**: Responsive bottom footer navigation bar.
- **Custom Calligraphy Titles**: High-res Devanagari PNG title images (`/titles/lok.png`, `byaav.png`, `trend.png`, `bhakti.png`) featuring continuous 6-second levitation & breathing shadow animations (`titleAmbientFloat`).
- **Background Illustrations**: High-resolution hand-drawn art (`folk.png`, `wedding.png`, `trending.png`, `devotional.png`) with mobile-tuned framing (`42% center` for Goddess & temple arch in Bhakti).

---

## 🏰 2. Capsule Glass Music Player & Interactive Features (busdriver.wtf Evolution)

- **Capsule Dock Container**: Capsule glass container (`border-radius: 9999px`) with dark frosted glass (`backdrop-filter: blur(48px)`), gold border accents, and ambient glow.
- **Spinning Vinyl Disc Art**: Circular vinyl disc (`art-disc spin`) with center hole on the far left.
- **Controls & Expandable Volume Slider**:
  - `Previous (⏮)`
  - **Big Solid White Play Circle Button** (`▶ / ⏸`)
  - `Next (⏭)`
  - **Smooth Expandable Hover Volume Bar (`🔊`)**: Hovering over the volume icon smoothly expands a horizontal volume slider (`width: 65px`). Mouse leave collapses it back.
  - `Shuffle Toggle (🔀)`
  - `Royal Patrika Card (📜)`
  - `Geet Maala Queue (≡)`
- **Mobile Controls Order & Larger Button Sizes**:
  - Mobile Controls Order: `[ Patrika ]  [ Shuffle ]  [ Prev ]  [ Play ]  [ Next ]  [ Volume ]  [ Queue ]`
  - Desktop Controls Order: `[ Patrika ]  [ Shuffle ]  [ Prev ]  [ Play ]  [ Next ]  [ Volume ]  [ Queue ]`
  - **Larger Mobile Play & Prev/Next Buttons**: Solid white play button increased to `50px`, Prev/Next buttons increased to `38px` for tap comfort.
- **Exact busdriver.wtf Queue Card Layout, Real Titles & Interactive Share Button**:
  - Exact typography, font sizes, active track pill highlights (`background: rgba(255,255,255,0.12)`), 3 orange/gold vertical dots (`⋮⋮⋮`).
  - Automatically fetches 100% real YouTube video titles and channel names for every song in the queue.
  - **Interactive Website Share Button**: Bottom card `[ ⬆ ] Share Apno Dhun` triggers native Web Share API on supported devices or copies `apno-dhun.vercel.app` URL to clipboard with visual green checkmark feedback!
- **Smooth Opening & Closing Animations Both Ways**:
  - Queue list modal plays smooth 0.3s slide-up entrance (`queueSlideUp`) and slide-down exit (`queueSlideDown`) with matching backdrop fade transitions both ways.
- **Native Royal Patrika Image File Sharing**:
  - Clicking `Share your Patrika` renders a high-res Royal Invitation Card (`1080x1920`) canvas PNG file and opens the device native Web Share API with image attachment (WhatsApp, Instagram Stories, Twitter, Messages) or fallback image download.
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
