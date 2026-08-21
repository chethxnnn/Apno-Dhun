export const modes = ['folk', 'wedding', 'dhh', 'trending', 'devotional'];

export const playlistIds = {
  folk: 'PLYAOxVEAP3bs',
  wedding: 'PLEsCBM7K03Bk',
  dhh: 'PLIR61cB-oARA',
  trending: 'PLeiQ7CPbnew8',
  devotional: 'PLDM_wzSW7hoc',
};

export const modeConfig = {
  folk: {
    label: 'Lok',
    titleImg: '/titles/lok.webp',
    titlePosition: 'center-right-up',
    bg: '/backgrounds/folk.webp',
    bgPosition: 'center center',
  },
  wedding: {
    label: 'Byaav',
    titleImg: '/titles/byaav.webp',
    titlePosition: 'left',
    bg: '/backgrounds/wedding.webp',
    bgPosition: 'center center',
  },
  dhh: {
    label: 'DHH',
    titleImg: '/titles/dhh.webp',
    titlePosition: 'dhh-pos',
    bg: '/backgrounds/rap-desktop.webp',
    bgMobile: '/backgrounds/rap-mobile.webp',
    bgPosition: 'center center',
  },
  trending: {
    label: 'Trend',
    titleImg: '/titles/trend.webp',
    titlePosition: 'center-up',
    bg: '/backgrounds/trending.webp',
    bgPosition: '75% center',
  },
  devotional: {
    label: 'Bhakti',
    titleImg: '/titles/bhakti.webp',
    titlePosition: 'left-up',
    bg: '/backgrounds/devotional.webp',
    bgPosition: '58% center', // frames the temple arch, Goddess & cow in center
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
  dhh: [
    { id: 'ewxyXyq4R9A', title: 'Rajasthani DHH', artist: 'Desert Hip Hop' },
  ],
  trending: [
    { id: 'hxVeQam-U3M', title: 'Navo Trend Hit', artist: 'Rajasthani New' },
    { id: 'fDvCKZV5ZEo', title: 'Navo Trend', artist: 'Rajasthani Trending' },
  ],
  devotional: [
    { id: 'u3RdMh6PE94', title: 'Bhagwan Ri Bhakti', artist: 'Devotional Bhajan' },
    { id: 'NQGW2L2raWQ', title: 'Ramdev Ji Bhajan', artist: 'Devotional' },
  ],
};
