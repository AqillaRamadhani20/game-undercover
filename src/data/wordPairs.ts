import type { WordPair } from '../types/game';

export const DEFAULT_WORD_PAIRS: WordPair[] = [
  // Makanan & Minuman (10)
  { id: 'wp-1', category: 'Makanan & Minuman', wordA: 'Kopi', wordB: 'Teh', hint: 'Minuman populer berkafein atau santai' },
  { id: 'wp-2', category: 'Makanan & Minuman', wordA: 'Nasi Goreng', wordB: 'Mie Goreng', hint: 'Menu sarapan/malam khas Indonesia' },
  { id: 'wp-3', category: 'Makanan & Minuman', wordA: 'Es Krim', wordB: 'Puding', hint: 'Dessert manis penyejuk lidah' },
  { id: 'wp-4', category: 'Makanan & Minuman', wordA: 'Martabak Manis', wordB: 'Kue Terang Bulan', hint: 'Camilan malam legit penuh topping' },
  { id: 'wp-5', category: 'Makanan & Minuman', wordA: 'Sate Ayam', wordB: 'Bakso', hint: 'Kuliner gerobak favorit sejuta umat' },
  { id: 'wp-6', category: 'Makanan & Minuman', wordA: 'Cokelat', wordB: 'Keju', hint: 'Bahan makanan manis/asin favorit' },
  { id: 'wp-7', category: 'Makanan & Minuman', wordA: 'Pizza', wordB: 'Burger', hint: 'Makanan cepat saji ala barat' },
  { id: 'wp-8', category: 'Makanan & Minuman', wordA: 'Bubur Ayam', wordB: 'Lontong Sayur', hint: 'Pilihan sarapan berkuah pagi hari' },
  { id: 'wp-9', category: 'Makanan & Minuman', wordA: 'Sambal Terasi', wordB: 'Sambal Matah', hint: 'Pelengkap pedas khas Nusantara' },
  { id: 'wp-10', category: 'Makanan & Minuman', wordA: 'Soto Ayam', wordB: 'Rawon', hint: 'Kuliner sup daging berempah gurih' },

  // Benda Sehari-hari (10)
  { id: 'wp-11', category: 'Benda Sehari-hari', wordA: 'Sepatu', wordB: 'Sandal', hint: 'Alas kaki untuk beraktivitas' },
  { id: 'wp-12', category: 'Benda Sehari-hari', wordA: 'Payung', wordB: 'Jas Hujan', hint: 'Pelindung tubuh saat musim hujan' },
  { id: 'wp-13', category: 'Benda Sehari-hari', wordA: 'Kasur', wordB: 'Sofa', hint: 'Tempat empuk untuk rebahan atau duduk' },
  { id: 'wp-14', category: 'Benda Sehari-hari', wordA: 'Kipas Angin', wordB: 'AC', hint: 'Alat penyejuk ruangan di kala gerah' },
  { id: 'wp-15', category: 'Benda Sehari-hari', wordA: 'Bantal', wordB: 'Guling', hint: 'Teman tidur setia di kasur' },
  { id: 'wp-16', category: 'Benda Sehari-hari', wordA: 'Kacamata', wordB: 'Lensa Kontak', hint: 'Alat bantu pandangan atau fashion' },
  { id: 'wp-17', category: 'Benda Sehari-hari', wordA: 'Jam Tangan', wordB: 'Gelang', hint: 'Aksesoris yang melingkar di pergelangan tangan' },
  { id: 'wp-18', category: 'Benda Sehari-hari', wordA: 'Dompet', wordB: 'Tas Selempang', hint: 'Tempat menyimpan uang dan kartu' },
  { id: 'wp-19', category: 'Benda Sehari-hari', wordA: 'Pensil', wordB: 'Pulpen', hint: 'Alat tulis manual di atas kertas' },
  { id: 'wp-20', category: 'Benda Sehari-hari', wordA: 'Sikat Gigi', wordB: 'Benang Gigi', hint: 'Pembersih gigi di kamar mandi' },

  // Hewan & Alam (9)
  { id: 'wp-21', category: 'Hewan & Alam', wordA: 'Kucing', wordB: 'Anjing', hint: 'Hewan peliharaan berkaki empat' },
  { id: 'wp-22', category: 'Hewan & Alam', wordA: 'Singa', wordB: 'Harimau', hint: 'Kucing besar predator ganas alam liar' },
  { id: 'wp-23', category: 'Hewan & Alam', wordA: 'Pantai', wordB: 'Gunung', hint: 'Destinasi liburan healing alam terbuka' },
  { id: 'wp-24', category: 'Hewan & Alam', wordA: 'Danau', wordB: 'Sungai', hint: 'Perairan darat air tawar' },
  { id: 'wp-25', category: 'Hewan & Alam', wordA: 'Hujan', wordB: 'Badai', hint: 'Fenomena cuaca berair dari langit' },
  { id: 'wp-26', category: 'Hewan & Alam', wordA: 'Durian', wordB: 'Nangka', hint: 'Buah beraroma kuat dan kulit tebal' },
  { id: 'wp-27', category: 'Hewan & Alam', wordA: 'Jeruk', wordB: 'Lemon', hint: 'Buah sitrus kaya vitamin C' },
  { id: 'wp-28', category: 'Hewan & Alam', wordA: 'Lumba-lumba', wordB: 'Paus', hint: 'Mamalia cerdas penghuni lautan' },
  { id: 'wp-29', category: 'Hewan & Alam', wordA: 'Matahari', wordB: 'Bulan', hint: 'Benda langit penerang bumi' },

  // Teknologi & Hiburan (7)
  { id: 'wp-30', category: 'Teknologi & Pop', wordA: 'Instagram', wordB: 'TikTok', hint: 'Media sosial berbasis visual dan video' },
  { id: 'wp-31', category: 'Teknologi & Pop', wordA: 'Netflix', wordB: 'YouTube', hint: 'Platform streaming tontonan video' },
  { id: 'wp-32', category: 'Teknologi & Pop', wordA: 'WhatsApp', wordB: 'Telegram', hint: 'Aplikasi kirim pesan chat instan' },
  { id: 'wp-33', category: 'Teknologi & Pop', wordA: 'Gitar', wordB: 'Biola', hint: 'Alat musik berdawai dan berbunyi merdu' },
  { id: 'wp-34', category: 'Teknologi & Pop', wordA: 'Bioskop', wordB: 'Teater', hint: 'Tempat nonton pertunjukan layar lebar atau panggung' },
  { id: 'wp-35', category: 'Teknologi & Pop', wordA: 'Laptop', wordB: 'Tablet', hint: 'Gadget portabel untuk produktivitas' },
  { id: 'wp-36', category: 'Teknologi & Pop', wordA: 'Headphone', wordB: 'Earphone', hint: 'Alat dengar audio personal di telinga' },

  // Profesi & Transportasi (6)
  { id: 'wp-37', category: 'Profesi & Transportasi', wordA: 'Dokter', wordB: 'Perawat', hint: 'Tenaga medis penyelamat di rumah sakit' },
  { id: 'wp-38', category: 'Profesi & Transportasi', wordA: 'Polisi', wordB: 'Satpam', hint: 'Petugas penjaga keamanan dan ketertiban' },
  { id: 'wp-39', category: 'Profesi & Transportasi', wordA: 'Kereta Api', wordB: 'Busway', hint: 'Moda transportasi umum massal darat' },
  { id: 'wp-40', category: 'Profesi & Transportasi', wordA: 'Ojek Online', wordB: 'Taksi Online', hint: 'Transportasi online panggilan aplikasi' },
  { id: 'wp-41', category: 'Profesi & Transportasi', wordA: 'Sepeda', wordB: 'Sepeda Motor', hint: 'Kendaraan roda dua' },
  { id: 'wp-42', category: 'Profesi & Transportasi', wordA: 'Pesawat', wordB: 'Helikopter', hint: 'Armada angkasa raya bersayap/baling-baling' }
];

export const CATEGORIES = [
  'Makanan & Minuman',
  'Benda Sehari-hari',
  'Hewan & Alam',
  'Teknologi & Pop',
  'Profesi & Transportasi',
] as const;

const PERSONAL_WORDS_KEY = 'undercover_personal_words';

export function getStoredPersonalWords(): WordPair[] {
  try {
    const raw = localStorage.getItem(PERSONAL_WORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePersonalWords(words: WordPair[]): void {
  try {
    localStorage.setItem(PERSONAL_WORDS_KEY, JSON.stringify(words));
  } catch (err) {
    console.error('Failed to save personal words to localStorage', err);
  }
}

export function getAllWordPairs(): WordPair[] {
  const personal = getStoredPersonalWords();
  return [...DEFAULT_WORD_PAIRS, ...personal];
}

export function selectRandomWordPair(
  categories: string[],
  usedIds: string[]
): { pair: WordPair; civilianWord: string; undercoverWord: string } {
  const all = getAllWordPairs();
  
  // Filter by categories if specified
  const filtered = categories.length > 0
    ? all.filter(p => categories.includes(p.category) || p.isCustom)
    : all;

  // Filter out used IDs
  let pool = filtered.filter(p => !usedIds.includes(p.id));
  
  // If pool exhausted, reset and reuse filtered
  if (pool.length === 0) {
    pool = filtered.length > 0 ? filtered : all;
  }

  // Pick random pair
  const randomIndex = Math.floor(Math.random() * pool.length);
  const pair = pool[randomIndex];

  // Random swap 50/50 so wordA isn't always Civilian
  const isSwap = Math.random() > 0.5;
  const civilianWord = isSwap ? pair.wordB : pair.wordA;
  const undercoverWord = isSwap ? pair.wordA : pair.wordB;

  return { pair, civilianWord, undercoverWord };
}
