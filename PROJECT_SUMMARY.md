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
- **Interactive Expandable Vinyl Disc / Large Thumbnail (`Player.jsx` & `Player.css`)**:
  - **Mobile & iPad Exclusive (<= 900px)**: Tapping on the spinning vinyl CD disc in Mobile & iPad views smoothly expands the entire player upward, morphing the compact spinning CD into a **large, high-resolution 16:9 album cover card** (`art-wrap-expanded`). On Desktop (> 900px), it remains a sleek fixed compact dock.
  - **Apple UI Fluid Animation (`cubic-bezier(0.32, 0.72, 0, 1)`)**: Transitions with native Apple iOS spring-like physics, smooth border-radius morphing, and fluid layout resizing.
  - **Standalone Clean Close Icon (`✕`)**: Features a clean floating `✕` close icon in the top-right corner of the expanded artwork with zero circle background for an uncluttered look.
  - **Bidirectional Queue List Mutual Exclusivity**:
    - If the artwork is expanded and the user opens the Geet Maala Queue list (`≡`), the artwork automatically collapses first, smoothly sliding open the queue list.
    - If the Geet Maala Queue list is open and the user taps the CD disc, the queue list automatically closes first, smoothly expanding the artwork card!
  - Tapping anywhere on the expanded thumbnail smoothly collapses the player back down into the compact capsule dock with the spinning CD!
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
- **Smooth Apple UI Opening & Closing Modal Sheet Animations**:
  - Queue list modal uses Apple iOS sheet physics (`cubic-bezier(0.32, 0.72, 0, 1)`) with scale spring (`scale(0.93) ➔ scale(1)`), subtle blur fade, and backdrop blur transitions both ways.
- **Offscreen 1037 × 1516 Native DOM Export Node (`PatrikaModal.jsx`)**:
  - Rendered a dedicated hidden 1037 × 1516 full-res React DOM node (`exportCardRef`) offscreen so the browser's native DOM engine handles text layout, Devanagari Hindi Unicode characters ("सतरंगी लहरियो"), and font rendering with 100% perfection!
  - **Exact 1:1 Title Font Size Parity**: Set `font-size: 43px;` on `.clean-song-title-compact-export` (exact mathematical 1:1 ratio matching `0.91rem` on `348px` screen preview card), ensuring title size, margins, and line wrapping match the screen preview 100%!
  - Captured via `html2canvas` at `scale: 2` (2074 × 3032 Ultra HD resolution).
  - **Clean Action Buttons**: Streamlined UI with just two full-width pill buttons: **"Share your Patrika"** and **"Not now"**.
  - **Custom Multiline Hinglish WhatsApp Share Message**: Shares with your exact custom multiline text structure (`Ram Ram Sa! I am listening to "[Song Title]" on Apno Dhun.\n\nApne favourite Rajasthani geet yahan suno!\nhttps://apnodhun.in`).
  - **Centered Red Thin Serif Title**: Slightly reduced title font size (`0.91rem`) with reduced vertical gap (`margin-top: -3px`) between title and artist name in muted red thin font below the thumbnail.
- **Mobile & iPad Top-Left Bebas Neue Clock & Responsive Date**:
  - **iPad Mode**: Increased Bebas Neue clock size to **`42px`** with full date format (`13th August, 2026`).
  - **Mobile Mode**: Compact `26px` clock with abbreviated short month format (**`13th Aug, 2026`**) spanning the exact width of the time block above it.
- **Clean Queue List View**:
  - Removed language pills from queue list header.
  - Hidden scrollbar on mobile view for a clean, borderless list experience.
- **Responsive Dock & Navigation Width & Vertical Positioning**:
  - **iPad View**: Player dock and Queue card set to `580px` max-width. Player dock elevated to `bottom: 94px` with Queue card elevated to `bottom: 244px`.
  - **Mobile View**: Player dock centered with `left: 50% !important; transform: translateX(-50%) !important` with zero rightward shift. Player dock elevated to **`bottom: 88px`** (and `84px` expanded) with Queue card elevated to **`bottom: 256px`** for spacious breathing room above bottom navigation.
- **PWA Add to Home Screen Pill Banner**:
  - Compact width reduced to **`max-width: 320px`** for mobile and iPad views.
  - Displays 2 lines: **Line 1**: `Keep Apno Dhun on your home screen` | **Line 2**: `Tap [ share icon ] then add to home screen`.
  - Subtle unhighlighted close cross icon (`✕`) right next to the text.
  - Floating cleanly at `bottom: 246px` on mobile/iPad view, fading down to `opacity: 0.3` when Queue list is active.
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
| `[ G ]` | Play **Authentic Ghungroo Sound** (YouTube: `CvCD8ZEoIes` from 1.0s to 5.0s) | Interactive Keycap Click |
| `[ → ]` / `[ N ]` | Next Track | Toast Notification |
| `[ ← ]` | Previous Track / Restart | Toast Notification |
| `[ F ]` / `[ Esc ]` | **Cinema Mode** / Close Modals | Toast Notification |

---

- **Header & Navigation Layout**:
  - **Desktop Top-Left Collab Branding**: Displays **`[Apno Dhun Logo] ✕ [Apna Culturez Logo]`** in their natural uncropped shapes as a sleek brand collaboration badge.
  - **Infinite 5-Vibe Circular Ring Carousel Navigation (`CircularVibeNav`)**:
    - **Continuous Infinite Loop**: Seamlessly loops through all 5 vibes (`... - Bhakti - Lok - Byaav - DHH - Trend - Bhakti - ...`).
    - **Always Centered & Enlarged Active Vibe**: Active vibe is centered and enlarged (`scale(1.22)`, glowing white text shadow), with adjacent vibes medium (`scale(0.98)`), and outer vibes subtle (`scale(0.82)`).
    - **Physical Ring Sliding Animation**: Clicking any adjacent or edge vibe smoothly slides the ring left/right with spring easing (`cubic-bezier(0.32, 0.72, 0, 1)`) and recenters the newly selected vibe.
    - **Desktop & Mobile Interactive Navigation**: Supports touch swipe gestures on mobile, and mouse drag (`cursor: grab`) + wheel/trackpad scrolling on desktop with **zero scrollbars**.
    - **Crisp 5-Vibe Visibility**: Outer leftmost and rightmost vibes (`slot-far`) are clearly visible with enhanced legibility and balanced spacing.
  - **Refined Desktop Title Scaling**: Hero calligraphy title sizes scaled to a clean, well-proportioned desktop max dimension (`max-width: ~44vw`, `max-height: 35vh`).
  - **Desktop Top-Right Block**: Stretched condensed digital clock font (**`Bebas Neue`**, `62px` with `transform: scaleY(1.18)`) with live seconds and aligned date row.
  - **Mobile & iPad Header Layout**:
    - **Top-Left**: Apno Dhun logo.
    - **Top-Center**: Compact, elegant time on top (`11.5px`) with **prominent, larger Live Mehmaan counter (`13.5px`) & 22px pulsing Safa icon** directly below it with comfortable top vertical padding!
    - **Top-Right**: Apna Culturez logo in its natural uncropped shape.
    - **Bottom Footer**: Clean Infinite Circular Ring navigation bar (`max-width: 440px` mobile / `max-width: 580px` iPad).
- **5 Curated Soundscapes & Responsive Multi-Device Backgrounds**:
  - **DHH (Rajasthani Hip-Hop & Rap)**:
    - **Desktop / iPad Background**: Uses `public/backgrounds/rap-desktop.png` with zoomed-out framing and subtle micro-drift on iPad Air & iPad Pro.
    - **Mobile Background**: Uses `public/backgrounds/rap-mobile.png` with standard immersive full-cover viewport background rendering.
    - **Title Artwork**: Uses authentic Rajasthani rap calligraphy title image (`public/titles/dhh.png` / `rap title.png`), scaled up specifically for iPad Air & iPad Pro (`max-width: 62vw`).
    - **Live Playlist**: `PLIR61cB-oARA` (Initial track: `ewxyXyq4R9A`).
  - Connected directly to YouTube Data API v3 endpoints via `src/services/youtubeApi.js`:
    - **Folk (`folk`)**: `PLYAOxVEAP3bs`
    - **Wedding (`wedding`)**: `PLEsCBM7K03Bk`
    - **Rajasthani DHH (`dhh`)**: `PLIR61cB-oARA` (Initial track: `ewxyXyq4R9A`, with DHH tab in Geet Maala Queue).
    - **Trending (`trending`)**: `PLeiQ7CPbnew8`
    - **Devotional (`devotional`)**: `PLDM_wzSW7hoc`
  - **5 Harmonious Vibe Player Color Palettes**:
    - **Devotional**: `#405A87` (Muted royal/navy blue)
    - **Lok**: `#D8893E` (Warm light orange)
    - **Trending (Nayo Trend)**: `#E66E28` (Warm vibrant orangish with coral highlights)
    - **DHH**: `#C99A4B` (Warm ochre/golden with modern minimalist glowing circle seek pointer)
    - **Wedding**: `#B95D43` (Soft terracotta red)
    - Seamlessly harmonizes the entire player dock: Play/Pause button, Previous/Next/Mute/Queue buttons, Dhun pill button, aura glow, seekbar progress fill, volume slider, **desktop keyboard shortcut keycaps (cleanly hidden on iPad Pro, iPad Air, tablets & mobile)**, and the **Geet Maala Queue List Drawer** (with anti-collision tab layout, zero mobile scrollbars, **matching exact player width (`660px` on desktop, `650px` on iPad, `440px` on mobile) and elevated vertical positioning**, **sleek pill capsule shape (`border-radius: 9999px`) on Desktop & iPad with sleek reduced height, 58px vinyl CD, track title & artist placed directly on top of justified control buttons, and duration seekbar extending full-width below from CD to right edge**, and **justified fluidly animated controls on expanded artwork across Mobile, iPad Air & iPad Pro**) for every vibe!
  - **Authentic Hero Title Sizing**: Preserved original large calligraphy hero title dimensions for Lok, Byaav, Trend, and Bhakti, with a dedicated refined proportion applied strictly to DHH.
  - **Fluid Continuous Circular Vibe Nav Scroller**:
    - **Apple-Physics Continuous Gliding**: Engineered a 7-slot continuous track (`[-3, -2, -1, 0, 1, 2, 3]`) that measures exact pixel offsets between items (`offsetLeft`) and performs smooth inertial horizontal translations (`cubic-bezier(0.25, 1, 0.5, 1)`).
    - **Active Vibe Frosted Glass Capsule Highlight**: Prominently highlights the currently selected vibe inside a frosted glass capsule pill (`background: rgba(255, 255, 255, 0.16); backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 9999px;`) with zero blurry halo box lines.
    - **Universal Live Mehmaan Presence**: Integrated live presence counter with glowing Safa icon across **Desktop & iPad** (positioned right under the top-left collab logo at `top: 72px–96px; left: 20px–34px`) and **Mobile** (centered in top header block).
    - **Refined Desktop & iPad Proportions**: Scaled desktop header elements (`56px` Apno Dhun logo, `50px` Apna Culturez logo, `68px` clock display, and **`17px` center vibe pill with `15px` and `13.5px` adjacent vibes**) and iPad header logos (**`50px` Apno Dhun logo, `46px` Apna Culturez logo**).
  - **Live Auto-Update**: Whenever you add, delete, or reorder tracks in your YouTube playlists, the site updates automatically on refresh/visit with **zero code changes**!
  - **Smart LocalStorage Caching**: 15-minute TTL cache protects your free 10,000 daily API quota while serving instant zero-latency song lists to visitors.
  - **Artwork & Image Copy Protection Layer**:
    - **Invisible Security Shield**: Added an unclickable transparent glass shield directly over background visual layers (`.bg-shield`).
    - **Right-Click Interception**: Global and element-level `onContextMenu={(e) => e.preventDefault()}` blocks context-menu popup ("Save Image As", "Copy Image Address") across all backgrounds, titles, logos, and artwork cards.
    - **Anti-Drag & Anti-Select**: Applied `-webkit-user-drag: none; user-drag: none;` and `user-select: none;` globally on all `<img>` tags and visual containers to stop click-and-drag downloads.
    - **iOS & Android Long-Press Protection**: Applied `-webkit-touch-callout: none;` across all views to suppress native mobile "Save to Photos" and "Share Image" callout sheets.
- **5 Vibe-Specific Royal Dhun Card Templates (`PatrikaModal`)**:
  - Automatically loads the custom card template matching the active vibe:
    - **लोक (Folk)**: `/cards/folk.png`
    - **ब्याव (Wedding)**: `/cards/wedding.png`
    - **DHH (Rap)**: `/cards/dhh.png`
    - **ट्रेंड (Trending)**: `/cards/trending.png`
    - **भक्ति (Devotional)**: `/cards/devotional.png`
  - **100% Unchanged Text & Thumbnail Placement**: The song title, artist typography, larger thumbnail window, and high-definition 4K export engine (`2074x3032`) maintain exact pixel-perfect positioning across all 5 card templates.
- **Hidden Player Engine**: Operates inside a 1×1 hidden `div` via YouTube IFrame API.
- **Lock Screen & Control Center Integration (MediaSession API)**:
  - Synchronizes live song metadata (Title, Artist, and High-Resolution YouTube Artwork) directly with **iOS Control Center / Lock Screen** and **Android Media Notification Tray**.
  - Provides full native lock screen hardware controls: `Play`, `Pause`, `Next Track`, `Previous Track`, and dynamic seekbar position updates (`seekto`).
  - **Background Playback Keep-Alive**: Uses a lightweight silent audio loop to register the browser tab as an active system audio player, maintaining audio daemon persistence when switching tabs, apps, or locking the phone.
- **Dynamic Metadata Fetching**: Automatically fetches live video title and channel name via public `noembed` oEmbed API + `getVideoData()`, caching metadata in React state.
- **Random Initial Track Order**: Automatically picks a random song upon opening the site or switching vibes.
- **Vercel Web Analytics (`@vercel/analytics`)**:
  - Full privacy-compliant visitor analytics tracking hourly traffic spikes, daily visits, unique vs. returning users, referrers (Instagram, WhatsApp, Twitter), countries/cities, and device breakdown with zero cookie banners.

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
├── TODO.md                   # Future roadmap & channel monitoring setup
└── PROJECT_SUMMARY.md        # Comprehensive documentation
```

---

## ⚙️ 7. Environment Setup for Vercel

- **Vercel Environment Variable**:
  - **Name**: `VITE_ABLY_API_KEY`
  - **Value Format**: `appId.keyId:keySecret` *(copied from Ably Dashboard ➔ API Keys ➔ Root Key)*
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
