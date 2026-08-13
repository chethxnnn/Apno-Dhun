export const modes = ['folk', 'wedding', 'trending', 'devotional'];

export const playlistIds = {
  folk: 'PLYAOxVEAP3bs',
  wedding: 'PLEsCBM7K03Bk',
  trending: 'PLeiQ7CPbnew8',
  devotional: 'PLDM_wzSW7hoc',
};

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
    bgPosition: '58% center', // frames the temple arch, Goddess & cow in center
  },
  trending: {
    label: 'Trend',
    titleImg: '/titles/trend.png',
    titlePosition: 'center-up',
    bg: '/backgrounds/trending.png',
    bgPosition: '75% center',
  },
};

// Playlists fallback containing existing static YouTube IDs
export const playlists = {
  folk: [
    { id: 'YQGDuo6Uufg', title: 'Kesariya Balam', artist: 'Rajasthani Folk' },
    { id: 'vHKsj1Wjhp0', title: 'Padharo Mhare Des', artist: 'Rajasthani Folk' },
  ],
  wedding: [
    { id: '7WCpoMLMdS0', title: 'Byaav Ro Geet', artist: 'Rajasthani Wedding' },
    { id: 'sCx7kNgOPgg', title: 'Banna Re Baga Me', artist: 'Wedding Folk' },
  ],
  devotional: [
    { id: 'u3RdMh6PE94', title: 'Bhagwan Ri Bhakti', artist: 'Devotional Bhajan' },
    { id: 'NQGW2L2raWQ', title: 'Ramdev Ji Bhajan', artist: 'Devotional' },
  ],
  trending: [
    { id: 'hxVeQam-U3M', title: 'Navo Trend Hit', artist: 'Rajasthani New' },
    { id: 'fDvCKZV5ZEo', title: 'Navo Trend', artist: 'Rajasthani Trending' },
  ],
};
