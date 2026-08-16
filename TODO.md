# 📋 Apno Dhun — Future Roadmap & TODOs

---

## 🌟 1. Automated "New Releases" (नवा गीत) Channel Monitor

### 🎯 Feature Overview:
Automatically track designated Rajasthani YouTube channels and dynamically ingest their newly uploaded songs into a brand-new **6th Vibe category** called **"नवा गीत" (New Releases)** without any manual file editing or git commits.

### 🛠️ Architecture & Setup Details:
1. **Public YouTube Channel RSS Feeds (`/api/new-releases`)**:
   - Query public XML feeds: `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`.
   - **Cost**: $0.00 (Zero API quota used).
   - In-memory cache for 30–60 minutes to serve instant zero-latency song lists.
2. **Smart Music Filters**:
   - Exclude YouTube Shorts (<60s) and non-music announcements.
   - Automatically sort by latest upload date first.
3. **UI Integration**:
   - **Top Header Vibe Selector**: Add 6th vibe pill (`🌟 नवा` / `New Releases`).
   - **Geet Maala Queue**: Add `NEW` tab showing live auto-updating releases.
   - **Theme & Artwork**: Custom golden-amber theme accents and matching Dhun Card template.

### 📝 Channels to Track (Placeholder):
```javascript
export const trackedChannels = [
  // Add YouTube Channel IDs / links here when ready
  // Example: { name: 'Channel Name', channelId: 'UCxxxxxxxxxxxxxx' }
];
```
