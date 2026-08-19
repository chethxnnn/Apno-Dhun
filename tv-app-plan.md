# 📺 Apno Dhun for Android TV & Google TV: Master Implementation Blueprint

## 🎯 Executive Vision
Transform **Apno Dhun** into a luxury, big-screen 4K living room music sanctuary for **Android TV, Google TV, Mi TV, OnePlus TV, Sony Bravia, Samsung, and Fire TV**.

The TV app maintains **100% aesthetic and functional parity with the Desktop experience** (desktop glassmorphic player capsule, live Rajasthani clock, Mehmaan counter, Geet Maala queue, Panchayat chat, and 4K wallpapers), powered by a dedicated **TV Remote D-Pad State Machine**.

---

## 🎮 1. TV Remote Navigation & Focus State Machine

Because TV users interact exclusively via D-Pad (Up, Down, Left, Right, OK, Back), the app operates on a **Hierarchical Modal Priority Stack**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MODAL FOCUS PRIORITY STACK                      │
├────────────────────────────────────────────────────────────────────────┤
│ Level 4 (Highest): Announcement Modal (New Vibe Popup)                 │
│ Level 3:           Panchayat Live Chat Drawer                          │
│ Level 2:           Geet Maala (Queue Viewer)                           │
│ Level 1 (Default): Main Player Resting State                           │
└────────────────────────────────────────────────────────────────────────┘
```

> **Key Rule**: The `BACK` button always dismisses the topmost active modal level and returns focus cleanly to the Level below it.

---

## 🕹️ 2. Detailed Remote Control Command Matrix

### A. Main Player Resting State (Default View)
*The desktop layout fills the 55"–75" 4K TV screen with subtle animated ambient glow.*

| Remote Button | Action | Visual / Audio Feedback |
| :--- | :--- | :--- |
| **`CENTER / OK`** | **Play / Pause** | Vinyl disc starts/stops spinning + play button animation |
| **`RIGHT ▶`** | **Next Track** | Smooth slide transition to next song in playlist |
| **`LEFT ◀`** | **Previous Track** | Restarts current song (if >3s in) or jumps to previous track |
| **`UP ▲`** | **Next Vibe** | Switches category (*Lok → Byaav → DHH → Trend → Bhakti*) |
| **`DOWN ▼`** | **Open Geet Maala (Queue)** | Opens floating glass queue viewer above player dock |
| **`BACK 🔙`** | **Exit Confirmation Dialog** | Shows *"क्या आप Apno Dhun बंद करना चाहते हैं? [हाँ] [नहीं]"* |
| **`YELLOW BUTTON` (or 'P')** | **Open Panchayat Chat** | Slides in right-side live community chat drawer |
| **`BLUE BUTTON` (or 'G')** | **Ghungroo (घुंघरू)** | Plays crisp metallic chime percussion |
| **`LONG PRESS OK` (or 'C')**| **Toggle Cinema Mode** | Hides UI for 4K ambient living room art mode |

---

### B. When Geet Maala (Queue Viewer) is OPEN
*Floating glass panel sits centered above the player dock, identical to desktop/iPad.*

| Remote Button | Action |
| :--- | :--- |
| **`UP ▲ / DOWN ▼`** | Smoothly scroll through songs with glowing gold focus border (`#FFDF73`). |
| **`CENTER / OK`** | **Plays the selected track immediately** and closes queue (or keeps open). |
| **`LEFT ◀ / RIGHT ▶`** | Switch Vibe Tabs (*LOK • BYAAV • DHH • TREND • BHAKTI*) inside the queue. |
| **`BACK 🔙`** | **Immediately closes Geet Maala** and returns focus to player capsule. |

---

### C. When New Vibe Announcement Banner Appears
*6-second automatic popup modal (e.g. New DHH / Folk release).*

| Remote Button | Action |
| :--- | :--- |
| **`CENTER / OK`** | Selects **"सुनो (Check Out)"** → Switches to new vibe & dismisses popup. |
| **`BACK 🔙`** | **Immediately closes the popup** and returns to music playback. |
| **`LEFT / RIGHT`** | Toggles focus between *[ Close ✕ ]* and *[ Check Out ]* buttons. |

---

### D. When Panchayat Live Chat Drawer is OPEN
*Right-side floating glass chat card.*

| Remote Button | Action |
| :--- | :--- |
| **`UP ▲ / DOWN ▼`** | Scroll through live message history. |
| **`CENTER / OK` (on Song Share)** | **Plays the shared song directly!** |
| **`LEFT ◀ / RIGHT ▶`** | Move focus to **Quick TV Emoji Bar** (🙏, 👑, 👳, 🚩, 🔥, 🎵, 🌸). |
| **`CENTER / OK` (on Emoji)** | Instantly sends the reaction to live chat (zero typing needed). |
| **`BACK 🔙`** | **Immediately closes Panchayat** and returns focus to player capsule. |

---

### E. 4K Ambient Living Room / Cinema Mode
*Designed for living rooms during dinner parties, family gatherings, or late-night relaxation.*

* **Visuals**: Palace & desert artworks slowly pan and zoom (Ken Burns 4K motion) with floating golden dust particles and live time in the corner.
* **Waking Up**: Pressing **ANY button on the TV remote** immediately brings back the full player controls.

---

## 🏗️ 3. Technical Architecture & File Structure

```
src/
├── hooks/
│   ├── useTVRemote.js          # Global D-Pad keydown & focus state listener
│   └── useTVFocus.js           # Spatial focus navigation manager
├── components/
│   ├── TVFocusOutline.css      # Luxury gold focus rings for remote navigation
│   └── TVExitModal.jsx         # Android TV back button exit confirmation
android/
├── app/
│   └── src/main/
│       ├── AndroidManifest.xml # Android TV Leanback & Touchscreen false flags
│       └── res/
│           ├── drawable/
│           │   └── banner.png  # 320x180 Android TV Leanback Launcher Banner
│           └── mipmap/
│               └── ic_launcher.png
capacitor.config.json           # Native Android TV build configuration
```

---

## 📜 4. Android TV Configuration Specifications

### A. `AndroidManifest.xml` Flags:
```xml
<!-- Declare Android TV Leanback Support -->
<uses-feature android:name="android.software.leanback" android:required="false" />
<uses-feature android:name="android.hardware.touchscreen" android:required="false" />
<uses-feature android:name="android.hardware.microphone" android:required="false" />

<application
    android:banner="@drawable/banner"
    android:icon="@mipmap/ic_launcher"
    android:label="Apno Dhun"
    android:theme="@style/AppTheme.NoActionBar">
    
    <activity
        android:name=".MainActivity"
        android:exported="true"
        android:screenOrientation="landscape"
        android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode">
        
        <!-- Standard Android Launcher -->
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
        
        <!-- Android TV Leanback Launcher -->
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
        </intent-filter>
    </activity>
</application>
```

---

## 🚀 5. Implementation Roadmap (When Starting)

| Step | Task | Duration |
| :--- | :--- | :--- |
| **Step 1** | Build `useTVRemote.js` focus hook and gold focus styling in React. | 1 Day |
| **Step 2** | Add Capacitor Android TV platform (`@capacitor/android`). | Half Day |
| **Step 3** | Create 320×180px Leanback banner & 4K splash screen. | Half Day |
| **Step 4** | Sideload `.apk` onto an Android TV / Google TV device & test all remote buttons. | 1 Day |
| **Step 5** | Create Google Play Store listing and publish under Android TV Track. | 2–4 Days (Review) |

---

## 💰 6. Budget & Resource Estimates
* **Development & Tools**: **₹0 (100% Free)** (React, Capacitor, Android Studio).
* **App Size on TV Storage**: **~8 MB to 10 MB** (Ultra-lightweight cloud streaming).
* **Google Play Developer Account**: **$25 (approx. ₹2,100 INR)** one-time lifetime fee.
* **Server Hosting**: **₹0 (Free tier covers all streaming)**.

---

*This blueprint is permanently saved in `tv-app-plan.md`. When you are ready to launch Apno Dhun on Android TV, we can execute this roadmap immediately!* 📺👑
