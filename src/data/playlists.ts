export interface AudioTrack {
  id: string;
  title: string;
  src: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  tracks: AudioTrack[];
}

// Sample audio URLs (using royalty-free Islamic audio samples)
// In production, replace these with actual audio files
const SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const playlists: Playlist[] = [
  {
    id: "manasik-haji",
    title: "Doa Manasik Haji",
    description: "Kumpulan doa untuk ibadah Haji",
    tracks: [
      { id: "h1", title: "Niat Ihram Haji", src: SAMPLE_AUDIO },
      { id: "h2", title: "Doa Talbiyah", src: SAMPLE_AUDIO },
      { id: "h3", title: "Doa Thawaf", src: SAMPLE_AUDIO },
      { id: "h4", title: "Doa Sa'i", src: SAMPLE_AUDIO },
      { id: "h5", title: "Doa Wukuf di Arafah", src: SAMPLE_AUDIO },
      { id: "h6", title: "Doa di Muzdalifah", src: SAMPLE_AUDIO },
      { id: "h7", title: "Doa Lempar Jumrah", src: SAMPLE_AUDIO },
    ],
  },
  {
    id: "manasik-umrah",
    title: "Doa Manasik Umrah",
    description: "Kumpulan doa untuk ibadah Umrah",
    tracks: [
      { id: "u1", title: "Niat Ihram Umrah", src: SAMPLE_AUDIO },
      { id: "u2", title: "Doa Talbiyah Umrah", src: SAMPLE_AUDIO },
      { id: "u3", title: "Doa Thawaf Umrah", src: SAMPLE_AUDIO },
      { id: "u4", title: "Doa Sa'i Umrah", src: SAMPLE_AUDIO },
      { id: "u5", title: "Doa Tahallul", src: SAMPLE_AUDIO },
    ],
  },
  {
    id: "doa-harian",
    title: "Doa Sehari-hari",
    description: "Doa-doa untuk aktivitas sehari-hari",
    tracks: [
      { id: "d1", title: "Doa Bangun Tidur", src: SAMPLE_AUDIO },
      { id: "d2", title: "Doa Sebelum Makan", src: SAMPLE_AUDIO },
      { id: "d3", title: "Doa Sesudah Makan", src: SAMPLE_AUDIO },
      { id: "d4", title: "Doa Masuk Masjid", src: SAMPLE_AUDIO },
      { id: "d5", title: "Doa Keluar Masjid", src: SAMPLE_AUDIO },
      { id: "d6", title: "Doa Sebelum Tidur", src: SAMPLE_AUDIO },
    ],
  },
  {
    id: "doa-perjalanan",
    title: "Doa Perjalanan",
    description: "Doa saat bepergian",
    tracks: [
      { id: "p1", title: "Doa Naik Kendaraan", src: SAMPLE_AUDIO },
      { id: "p2", title: "Doa Keselamatan Perjalanan", src: SAMPLE_AUDIO },
      { id: "p3", title: "Doa Tiba di Tempat Tujuan", src: SAMPLE_AUDIO },
      { id: "p4", title: "Doa Masuk Hotel", src: SAMPLE_AUDIO },
    ],
  },
  {
    id: "doa-tanah-suci",
    title: "Doa di Tanah Suci",
    description: "Doa khusus di tempat-tempat suci",
    tracks: [
      { id: "t1", title: "Doa Melihat Ka'bah", src: SAMPLE_AUDIO },
      { id: "t2", title: "Doa di Multazam", src: SAMPLE_AUDIO },
      { id: "t3", title: "Doa di Maqam Ibrahim", src: SAMPLE_AUDIO },
      { id: "t4", title: "Doa Minum Air Zamzam", src: SAMPLE_AUDIO },
      { id: "t5", title: "Doa di Raudhah", src: SAMPLE_AUDIO },
      { id: "t6", title: "Doa Ziarah Makam Rasulullah", src: SAMPLE_AUDIO },
    ],
  },
];

export function getPlaylist(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id);
}
