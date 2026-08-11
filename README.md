# Apno Dhun (अपणो धुन) — Apna Culturez 🎵

> The music of Rajasthan, in our own style. Folk, Wedding, Devotional & Trending tunes — all in one place.

Inspired by [saloon.wtf](https://saloon.wtf), **Apno Dhun** is a high-performance, glassmorphic music web application built with **React** and **Vite**, presenting curated Rajasthani music with custom artwork and Apple Music-inspired player UI.

---

## ✨ Features

- 🎨 **4 Cultural Vibes**:
  - **Lok** (*Lok Ri Dhun*) — Traditional Folk
  - **Byaav** (*Byaav Ro Geet*) — Wedding Classics
  - **Trend** (*Navo Trend*) — Modern Rajasthani Hits
  - **Bhakti** (*Bhagwan Ri Bhakti*) — Devotional & Bhajans
- 🎧 **Apple Music-Style Glassmorphic Player**:
  - Spinning vinyl record with YouTube thumbnail artwork
  - Audio visualizer sound bars
  - Dynamic red glow aura
  - Track seek bar & progress polling
- 🎹 **Pro Desktop Interactivity & Shortcuts**:
  - `[Space]` — Play / Pause toggle
  - `[M]` — Mute / Unmute audio
  - `[F]` — **Cinema Mode** (hides UI overlay for pure ambient visual experience)
  - `[→] / [←]` — Next / Previous track
- 🟢 **Live Listener Counter**: Discrete online presence indicator below the top header.
- 📱 **Mobile & Tablet Optimized**: Responsive layout with mobile footer navigation bar.

---

## 🚀 Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Audio Engine**: Hidden 1×1 YouTube IFrame API + oEmbed metadata fetching
- **Styling**: Vanilla CSS3 with Custom Design Tokens & Backdrop Blur
- **Typography**: `Inter`, `Playfair Display`, `Rozha One`, `Tiro Devanagari Hindi`

---

## 💻 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/chethxnnn/Apno-Dhun.git

# 2. Navigate to project directory
cd Apno-Dhun

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 🛠 Project Structure

```text
suno/
├── public/
│   ├── backgrounds/     # Vibe background illustrations
│   ├── titles/          # Custom Devanagari calligraphy title images
│   └── logo.png         # Apna Culturez logo
├── src/
│   ├── components/      # Glassmorphic React UI components
│   │   ├── BackgroundLayer.jsx
│   │   ├── Header.jsx
│   │   ├── LiveListeners.jsx
│   │   ├── Player.jsx
│   │   ├── TitleDisplay.jsx
│   │   └── YouTubeEmbed.jsx
│   ├── data/            # Playlists & vibe configurations
│   │   └── playlists.js
│   ├── hooks/           # Custom React hooks (YouTube API, Presence)
│   │   ├── useYouTubePlayer.js
│   │   └── useLiveListeners.js
│   ├── App.jsx          # Main application & keyboard event listener
│   ├── App.css
│   ├── index.css        # Global CSS design system
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 License

Created for **Apna Culturez** (`@apna.culturez`).
