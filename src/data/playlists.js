export const modes = ['folk', 'wedding', 'trending', 'devotional'];

export const modeConfig = {
  folk: {
    label: 'Lok',
    titleImg: '/titles/lok.png',
    titlePosition: 'center-right-up',
    bg: '/backgrounds/folk.png',
    bgPosition: 'center center',
  },
  wedding: {
    label: 'Byaav',
    titleImg: '/titles/byaav.png',
    titlePosition: 'left',
    bg: '/backgrounds/wedding.png',
    bgPosition: 'center center',
  },
  devotional: {
    label: 'Bhakti',
    titleImg: '/titles/bhakti.png',
    titlePosition: 'left-up',
    bg: '/backgrounds/devotional.png',
    bgPosition: '22% center',
  },
  trending: {
    label: 'Trend',
    titleImg: '/titles/trend.png',
    titlePosition: 'center-up',
    bg: '/backgrounds/trending.png',
    bgPosition: '75% center',
  },
};

// Playlists containing strictly the 5 YouTube IDs supplied by the user
export const playlists = {
  folk: [
    { id: 'YQGDuo6Uufg', title: 'Lok Ri Dhun', artist: 'Rajasthani Folk' },
  ],
  wedding: [
    { id: '7WCpoMLMdS0', title: 'Byaav Ro Geet', artist: 'Rajasthani Wedding' },
  ],
  devotional: [
    { id: 'u3RdMh6PE94', title: 'Bhagwan Ri Bhakti', artist: 'Devotional Bhajan' },
  ],
  trending: [
    { id: 'hxVeQam-U3M', title: 'Navo Trend Hit', artist: 'Rajasthani New' },
    { id: 'fDvCKZV5ZEo', title: 'Navo Trend', artist: 'Rajasthani Trending' },
  ],
};
