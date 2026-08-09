// ══════════════════════════════════════════════════════
//  Music Player — Curated Song Library
// ══════════════════════════════════════════════════════

export type Language = 'hindi' | 'kannada' | 'english';

export interface Track {
  id: string;           // YouTube video ID
  title: string;
  artist: string;
  language: Language;
}

export const TRACKS: Track[] = [
  // ── Hindi ──────────────────────────────────────────
  { id: 'OulN7vTDq1I',  title: 'DJ Waley Babu',                 artist: 'Badshah ft. Aastha Gill',           language: 'hindi' },
  { id: 'W_aLmjb4E0Q',  title: 'Jungle Raja',                  artist: 'Nucleya ft. DIVINE',                language: 'hindi' },
  { id: '69CEiHfS_mc',  title: 'Lungi Dance',                   artist: 'Honey Singh',                       language: 'hindi' },
  { id: 'II2EO3Nw4m0',  title: 'Badtameez Dil',                 artist: 'Benny Dayal',                       language: 'hindi' },
  { id: 'v7K4vGYL9zI',  title: 'Khalibali',                     artist: 'Shivam Pathak / Vishal Dadlani',    language: 'hindi' },
  { id: '-sWXx1mbgtU',  title: 'Kar Gayi Chull',                artist: 'Badshah & Neha Kakkar',             language: 'hindi' },
  { id: 'jCEdTq3j-0U',  title: 'Gallan Goodiyan',               artist: 'Shankar Mahadevan & others',        language: 'hindi' },
  { id: 'bdesdebUFLE',  title: 'Paagal',                        artist: 'Badshah',                           language: 'hindi' },
  { id: '3nA1hmKCRpE',  title: 'Daaru Desi',                    artist: 'Benny Dayal',                       language: 'hindi' },
  { id: 'pElk1ShPrcE',  title: 'Ainvayi Ainvayi',               artist: 'Salim Merchant',                    language: 'hindi' },

  // ── Kannada ────────────────────────────────────────
  { id: 'ebz20FHrT44',  title: 'Belageddu',                     artist: 'Vijay Prakash',                     language: 'kannada' },
  { id: 'Ysf4QRrcLGM',  title: 'Karabuu',                       artist: 'Chandan Shetty',                    language: 'kannada' },
  { id: 'zJSP3I1lCco',  title: 'Party Freak',                   artist: 'Chandan Shetty',                    language: 'kannada' },
  { id: 'TnyWMhSqyjY',  title: 'Salaam Rocky Bhai',             artist: 'Yash (KGF)',                        language: 'kannada' },
  { id: 'V3-Fd8wPuRA',  title: 'Tagaru Banthu Tagaru',        artist: 'Anthony Daasan / Vijay Prakash',   language: 'kannada' },
  { id: 'iWeoIZK-Nvw',  title: 'Mr & Mrs Ramachari',            artist: 'Yash',                              language: 'kannada' },
  { id: 'sWk9lpkGAfs',  title: 'Yeno Yeno Aagide',             artist: 'Yash (Googly)',                     language: 'kannada' },
  { id: 'iQJoTo5gkXU',  title: 'Koodi Itta',                    artist: 'Yash (Santhu)',                     language: 'kannada' },
  { id: 'pvhr-liomWM',  title: 'Toofan',                        artist: 'KGF Chapter 2',                     language: 'kannada' },

  // ── English ────────────────────────────────────────
  { id: '4NRXx6U8ABQ',  title: 'Blinding Lights',               artist: 'The Weeknd',                        language: 'english' },
  { id: 'OPf0YbXqDm0',  title: 'Uptown Funk',                    artist: 'Mark Ronson ft. Bruno Mars',        language: 'english' },
  { id: '09R8_2nJtjg',  title: 'Sugar',                          artist: 'Maroon 5',                          language: 'english' },
  { id: 'hT_nvWreIhg',  title: 'Counting Stars',                artist: 'OneRepublic',                       language: 'english' },
  { id: '2Vv-BfVoq4g',  title: 'Perfect',                        artist: 'Ed Sheeran',                        language: 'english' },
  { id: 'nYh-n7EOtMA',  title: 'Cheap Thrills',                  artist: 'Sia',                               language: 'english' },
  { id: 'q0hyYWKXF0Q',  title: 'Dance Monkey',                   artist: 'Tones and I',                       language: 'english' },
  { id: 'PT2_F-1esPk',  title: 'Closer',                         artist: 'The Chainsmokers ft. Halsey',       language: 'english' },
  { id: 'nfs8NYg7yQM',  title: 'Attention',                      artist: 'Charlie Puth',                      language: 'english' },
  { id: '2zNSgSzhBfM',  title: 'Can\'t Hold Us',                 artist: 'Macklemore & Ryan Lewis',           language: 'english' },
];

export const LANGUAGE_LABELS: Record<Language, string> = {
  hindi: 'Hindi',
  kannada: 'Kannada',
  english: 'English',
};
