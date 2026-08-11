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

export const playlists = {
  folk: [
    { id: 'YQGDuo6Uufg', title: 'Lok Ri Dhun', artist: 'Rajasthani Folk' },
    { id: '1noR8m_jMco', title: 'Chaudhary', artist: 'Amit Trivedi ft. Mame Khan' },
    { id: '1T4xVn3yC48', title: 'Kesariya Balam', artist: 'Mame Khan' },
  ],
  wedding: [
    { id: '7WCpoMLMdS0', title: 'Byaav Ro Geet', artist: 'Rajasthani Wedding' },
    { id: 'vHKsj1Wjhp0', title: 'Banna Re', artist: 'Wedding Folk' },
    { id: 'sCx7kNgOPgg', title: 'Banni Tharo Banno', artist: 'Wedding Bangers' },
  ],
  devotional: [
    { id: 'u3RdMh6PE94', title: 'Bhagwan Ri Bhakti', artist: 'Devotional Bhajan' },
    { id: 'gGORMNGv6aY', title: 'Khatu Shyam Bhajan', artist: 'Devotional' },
    { id: 'NQGW2L2raWQ', title: 'Ramdev Ji Bhajan', artist: 'Devotional' },
  ],
  trending: [
    { id: 'fDvCKZV5ZEo', title: 'Navo Trend', artist: 'Rajasthani Trending' },
    { id: 'g9US1yLN5pA', title: 'Loor', artist: 'Trending Hits' },
    { id: 'YU7WRFBakag', title: 'Mharo Rajasthan', artist: 'Trending' },
  ],
};
