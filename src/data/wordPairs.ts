import type { WordPair } from '../types/game';

export const DEFAULT_WORD_PAIRS: WordPair[] = [
  // ==========================================
  // 1. Makanan & Minuman (30 Pasang)
  // ==========================================
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
  { id: 'wp-11', category: 'Makanan & Minuman', wordA: 'Boba', wordB: 'Cendol', hint: 'Minuman manis kenyal berbutir' },
  { id: 'wp-12', category: 'Makanan & Minuman', wordA: 'Siomay', wordB: 'Batagor', hint: 'Jajanan khas Bandung bumbu kacang gurih' },
  { id: 'wp-13', category: 'Makanan & Minuman', wordA: 'Tempe', wordB: 'Tahu', hint: 'Olahan kedelai murah meriah kaya protein' },
  { id: 'wp-14', category: 'Makanan & Minuman', wordA: 'Rendang', wordB: 'Dendeng Balado', hint: 'Olahan daging sapi lezat khas Minang' },
  { id: 'wp-15', category: 'Makanan & Minuman', wordA: 'Nasi Uduk', wordB: 'Nasi Kuning', hint: 'Nasi gurih harum berempah' },
  { id: 'wp-16', category: 'Makanan & Minuman', wordA: 'Pempek', wordB: 'Tekwan', hint: 'Olahan ikan khas Palembang berkuah asam/gurih' },
  { id: 'wp-17', category: 'Makanan & Minuman', wordA: 'Martabak Telur', wordB: 'Telur Dadar', hint: 'Gorengan telur renyah gurih' },
  { id: 'wp-18', category: 'Makanan & Minuman', wordA: 'Cilok', wordB: 'Cireng', hint: 'Jajanan aci kenyal kenyal' },
  { id: 'wp-19', category: 'Makanan & Minuman', wordA: 'Bakwan', wordB: 'Tahu Isi', hint: 'Gorengan renyah berisikan sayur' },
  { id: 'wp-20', category: 'Makanan & Minuman', wordA: 'Ketoprak', wordB: 'Gado-Gado', hint: 'Menu sehat siram saus kacang melimpah' },
  { id: 'wp-21', category: 'Makanan & Minuman', wordA: 'Donat', wordB: 'Roti Manis', hint: 'Kudapan berbahan dasar tepung beragi' },
  { id: 'wp-22', category: 'Makanan & Minuman', wordA: 'Semangka', wordB: 'Melon', hint: 'Buah bulat segar banyak air' },
  { id: 'wp-23', category: 'Makanan & Minuman', wordA: 'Roti Bakar', wordB: 'Pisang Bakar', hint: 'Camilan nongkrong malam di warkop' },
  { id: 'wp-24', category: 'Makanan & Minuman', wordA: 'Es Kelapa Muda', wordB: 'Es Cincau', hint: 'Pelepas dahaga di siang hari terik' },
  { id: 'wp-25', category: 'Makanan & Minuman', wordA: 'Jus Alpukat', wordB: 'Jus Mangga', hint: 'Minuman buah kental manis menyegarkan' },
  { id: 'wp-26', category: 'Makanan & Minuman', wordA: 'Kerupuk Putih', wordB: 'Rempeyek', hint: 'Teman makan renyah wajib ada' },
  { id: 'wp-27', category: 'Makanan & Minuman', wordA: 'Keripik Singkong', wordB: 'Keripik Kentang', hint: 'Camilan garing asin gurih' },
  { id: 'wp-28', category: 'Makanan & Minuman', wordA: 'Mie Instan Kuah', wordB: 'Mie Instan Goreng', hint: 'Penyelamat anak kos tanggal tua' },
  { id: 'wp-29', category: 'Makanan & Minuman', wordA: 'Kue Cubit', wordB: 'Pukis', hint: 'Kue jajanan pasar bertekstur empuk lembut' },
  { id: 'wp-30', category: 'Makanan & Minuman', wordA: 'Susu Sapi', wordB: 'Susu Kedelai', hint: 'Minuman bergizi sumber kalsium' },

  // ==========================================
  // 2. Benda Sehari-hari (28 Pasang)
  // ==========================================
  { id: 'wp-31', category: 'Benda Sehari-hari', wordA: 'Sepatu', wordB: 'Sandal', hint: 'Alas kaki untuk beraktivitas' },
  { id: 'wp-32', category: 'Benda Sehari-hari', wordA: 'Payung', wordB: 'Jas Hujan', hint: 'Pelindung tubuh saat musim hujan' },
  { id: 'wp-33', category: 'Benda Sehari-hari', wordA: 'Kasur', wordB: 'Sofa', hint: 'Tempat empuk untuk rebahan atau duduk' },
  { id: 'wp-34', category: 'Benda Sehari-hari', wordA: 'Kipas Angin', wordB: 'AC', hint: 'Alat penyejuk ruangan di kala gerah' },
  { id: 'wp-35', category: 'Benda Sehari-hari', wordA: 'Bantal', wordB: 'Guling', hint: 'Teman tidur setia di kasur' },
  { id: 'wp-36', category: 'Benda Sehari-hari', wordA: 'Kacamata', wordB: 'Lensa Kontak', hint: 'Alat bantu pandangan atau fashion' },
  { id: 'wp-37', category: 'Benda Sehari-hari', wordA: 'Jam Tangan', wordB: 'Gelang', hint: 'Aksesoris yang melingkar di pergelangan tangan' },
  { id: 'wp-38', category: 'Benda Sehari-hari', wordA: 'Dompet', wordB: 'Tas Selempang', hint: 'Tempat menyimpan uang dan kartu' },
  { id: 'wp-39', category: 'Benda Sehari-hari', wordA: 'Pensil', wordB: 'Pulpen', hint: 'Alat tulis manual di atas kertas' },
  { id: 'wp-40', category: 'Benda Sehari-hari', wordA: 'Sikat Gigi', wordB: 'Benang Gigi', hint: 'Pembersih gigi di kamar mandi' },
  { id: 'wp-41', category: 'Benda Sehari-hari', wordA: 'Piring', wordB: 'Mangkuk', hint: 'Wadah makan di atas meja' },
  { id: 'wp-42', category: 'Benda Sehari-hari', wordA: 'Sendok', wordB: 'Garpu', hint: 'Peralatan makan berpasangan' },
  { id: 'wp-43', category: 'Benda Sehari-hari', wordA: 'Gelas', wordB: 'Cangkir', hint: 'Wadah untuk meminum cairan' },
  { id: 'wp-44', category: 'Benda Sehari-hari', wordA: 'Ember', wordB: 'Gayung', hint: 'Perlengkapan menampung dan mengambil air' },
  { id: 'wp-45', category: 'Benda Sehari-hari', wordA: 'Handuk', wordB: 'Selimut', hint: 'Kain penyerap air atau penghangat tubuh' },
  { id: 'wp-46', category: 'Benda Sehari-hari', wordA: 'Sisir', wordB: 'Jepit Rambut', hint: 'Aksesoris merapikan mahkota kepala' },
  { id: 'wp-47', category: 'Benda Sehari-hari', wordA: 'Botol Minum', wordB: 'Termos', hint: 'Wadah pembawa minuman portabel' },
  { id: 'wp-48', category: 'Benda Sehari-hari', wordA: 'Sabun Mandi', wordB: 'Sampo', hint: 'Pembersih tubuh saat mandi' },
  { id: 'wp-49', category: 'Benda Sehari-hari', wordA: 'Sapu', wordB: 'Alat Pel', hint: 'Peralatan bersih-bersih lantai rumah' },
  { id: 'wp-50', category: 'Benda Sehari-hari', wordA: 'Gunting', wordB: 'Pisau Dapur', hint: 'Benda tajam untuk memotong' },
  { id: 'wp-51', category: 'Benda Sehari-hari', wordA: 'Cermin', wordB: 'Kaca Jendela', hint: 'Kaca tembus pandang atau pemantul bayangan' },
  { id: 'wp-52', category: 'Benda Sehari-hari', wordA: 'Lilin', wordB: 'Lampu Senter', hint: 'Penerang darurat di kala mati lampu' },
  { id: 'wp-53', category: 'Benda Sehari-hari', wordA: 'Koper', wordB: 'Ransel', hint: 'Tas untuk bepergian atau liburan' },
  { id: 'wp-54', category: 'Benda Sehari-hari', wordA: 'Kunci Rumah', wordB: 'Gembok', hint: 'Alat pengaman pintu dari pencuri' },
  { id: 'wp-55', category: 'Benda Sehari-hari', wordA: 'Sabuk Pinggang', wordB: 'Tali Celana', hint: 'Penahan celana agar tidak melorot' },
  { id: 'wp-56', category: 'Benda Sehari-hari', wordA: 'Gantungan Baju', wordB: 'Jepitan Jemuran', hint: 'Perlengkapan menjemur pakaian basah' },
  { id: 'wp-57', category: 'Benda Sehari-hari', wordA: 'Catokan Rambut', wordB: 'Hairdryer', hint: 'Alat elektronik penata rambut' },
  { id: 'wp-58', category: 'Benda Sehari-hari', wordA: 'Gunting Kuku', wordB: 'Kikir Kuku', hint: 'Alat perawatan kebersihan jari tangan' },

  // ==========================================
  // 3. Hewan & Alam (26 Pasang)
  // ==========================================
  { id: 'wp-59', category: 'Hewan & Alam', wordA: 'Kucing', wordB: 'Anjing', hint: 'Hewan peliharaan berkaki empat' },
  { id: 'wp-60', category: 'Hewan & Alam', wordA: 'Singa', wordB: 'Harimau', hint: 'Kucing besar predator ganas alam liar' },
  { id: 'wp-61', category: 'Hewan & Alam', wordA: 'Pantai', wordB: 'Gunung', hint: 'Destinasi liburan healing alam terbuka' },
  { id: 'wp-62', category: 'Hewan & Alam', wordA: 'Danau', wordB: 'Sungai', hint: 'Perairan darat air tawar' },
  { id: 'wp-63', category: 'Hewan & Alam', wordA: 'Hujan', wordB: 'Badai', hint: 'Fenomena cuaca berair dari langit' },
  { id: 'wp-64', category: 'Hewan & Alam', wordA: 'Durian', wordB: 'Nangka', hint: 'Buah beraroma kuat dan kulit tebal' },
  { id: 'wp-65', category: 'Hewan & Alam', wordA: 'Jeruk', wordB: 'Lemon', hint: 'Buah sitrus kaya vitamin C' },
  { id: 'wp-66', category: 'Hewan & Alam', wordA: 'Lumba-lumba', wordB: 'Paus', hint: 'Mamalia cerdas penghuni lautan' },
  { id: 'wp-67', category: 'Hewan & Alam', wordA: 'Matahari', wordB: 'Bulan', hint: 'Benda langit penerang bumi' },
  { id: 'wp-68', category: 'Hewan & Alam', wordA: 'Bebek', wordB: 'Angsa', hint: 'Unggas air berleher lentur' },
  { id: 'wp-69', category: 'Hewan & Alam', wordA: 'Kuda', wordB: 'Zebra', hint: 'Hewan berkuku satu bertubuh tegap' },
  { id: 'wp-70', category: 'Hewan & Alam', wordA: 'Kupu-kupu', wordB: 'Capung', hint: 'Serangga terbang cantik bersayap indah' },
  { id: 'wp-71', category: 'Hewan & Alam', wordA: 'Katak', wordB: 'Kodok', hint: 'Amfibi pelompat bersuara nyaring' },
  { id: 'wp-72', category: 'Hewan & Alam', wordA: 'Semut', wordB: 'Rayap', hint: 'Serangga kecil hidup berkoloni' },
  { id: 'wp-73', category: 'Hewan & Alam', wordA: 'Kelinci', wordB: 'Marmut', hint: 'Hewan lucu berbulu pemakan wortel/rumput' },
  { id: 'wp-74', category: 'Hewan & Alam', wordA: 'Gurita', wordB: 'Cumi-cumi', hint: 'Hewan laut bertentakel banyak' },
  { id: 'wp-75', category: 'Hewan & Alam', wordA: 'Nyamuk', wordB: 'Lalat', hint: 'Serangga kecil pengganggu di rumah' },
  { id: 'wp-76', category: 'Hewan & Alam', wordA: 'Bunga Mawar', wordB: 'Bunga Melati', hint: 'Bunga harum simbol asmara atau kesucian' },
  { id: 'wp-77', category: 'Hewan & Alam', wordA: 'Pohon Kelapa', wordB: 'Pohon Sawit', hint: 'Tumbuhan palem tropis penghasil buah serbaguna' },
  { id: 'wp-78', category: 'Hewan & Alam', wordA: 'Hutan Belantara', wordB: 'Kebun Raya', hint: 'Kawasan rimbun penuh pepohonan' },
  { id: 'wp-79', category: 'Hewan & Alam', wordA: 'Gurun Pasir', wordB: 'Bukit Kapur', hint: 'Lanskap gersang berangin kering' },
  { id: 'wp-80', category: 'Hewan & Alam', wordA: 'Pelangi', wordB: 'Awan Putih', hint: 'Pemandangan indah di angkasa setelah hujan' },
  { id: 'wp-81', category: 'Hewan & Alam', wordA: 'Belalang', wordB: 'Jangkrik', hint: 'Serangga pelompat berbunyi khas malam hari' },
  { id: 'wp-82', category: 'Hewan & Alam', wordA: 'Hiu', wordB: 'Buaya', hint: 'Predator bertaring tajam yang ditakuti' },
  { id: 'wp-83', category: 'Hewan & Alam', wordA: 'Monyet', wordB: 'Simpanse', hint: 'Primata lincah pemanjat pohon' },
  { id: 'wp-84', category: 'Hewan & Alam', wordA: 'Bintang Laut', wordB: 'Ubur-ubur', hint: 'Makhluk unik pesisir pantai laut' },

  // ==========================================
  // 4. Teknologi & Pop (22 Pasang)
  // ==========================================
  { id: 'wp-85', category: 'Teknologi & Pop', wordA: 'Instagram', wordB: 'TikTok', hint: 'Media sosial berbasis visual dan video' },
  { id: 'wp-86', category: 'Teknologi & Pop', wordA: 'Netflix', wordB: 'YouTube', hint: 'Platform streaming tontonan video' },
  { id: 'wp-87', category: 'Teknologi & Pop', wordA: 'WhatsApp', wordB: 'Telegram', hint: 'Aplikasi kirim pesan chat instan' },
  { id: 'wp-88', category: 'Teknologi & Pop', wordA: 'Gitar', wordB: 'Biola', hint: 'Alat musik berdawai dan berbunyi merdu' },
  { id: 'wp-89', category: 'Teknologi & Pop', wordA: 'Bioskop', wordB: 'Teater', hint: 'Tempat nonton pertunjukan layar lebar atau panggung' },
  { id: 'wp-90', category: 'Teknologi & Pop', wordA: 'Laptop', wordB: 'Tablet', hint: 'Gadget portabel untuk produktivitas' },
  { id: 'wp-91', category: 'Teknologi & Pop', wordA: 'Headphone', wordB: 'Earphone', hint: 'Alat dengar audio personal di telinga' },
  { id: 'wp-92', category: 'Teknologi & Pop', wordA: 'Spotify', wordB: 'Apple Music', hint: 'Layanan streaming musik berlangganan' },
  { id: 'wp-93', category: 'Teknologi & Pop', wordA: 'Shopee', wordB: 'Tokopedia', hint: 'Aplikasi belanja online e-commerce favorit' },
  { id: 'wp-94', category: 'Teknologi & Pop', wordA: 'PlayStation', wordB: 'Nintendo Switch', hint: 'Konsol video game populer' },
  { id: 'wp-95', category: 'Teknologi & Pop', wordA: 'Mouse Komputer', wordB: 'Touchpad', hint: 'Alat penggerak kursor di komputer' },
  { id: 'wp-96', category: 'Teknologi & Pop', wordA: 'Powerbank', wordB: 'Charger Dinding', hint: 'Pengisi daya baterai smartphone' },
  { id: 'wp-97', category: 'Teknologi & Pop', wordA: 'Bluetooth', wordB: 'Wi-Fi', hint: 'Koneksi nirkabel transfer data' },
  { id: 'wp-98', category: 'Teknologi & Pop', wordA: 'Smartwatch', wordB: 'Jam Digital', hint: 'Penunjuk waktu canggih di pergelangan tangan' },
  { id: 'wp-99', category: 'Teknologi & Pop', wordA: 'Podcast', wordB: 'Radio', hint: 'Program obrolan audio informatif' },
  { id: 'wp-100', category: 'Teknologi & Pop', wordA: 'Anime', wordB: 'Kartun', hint: 'Tontonan animasi karakter bergambar' },
  { id: 'wp-101', category: 'Teknologi & Pop', wordA: 'Voice Note', wordB: 'Panggilan Telepon', hint: 'Komunikasi suara via ponsel' },
  { id: 'wp-102', category: 'Teknologi & Pop', wordA: 'Twitter (X)', wordB: 'Threads', hint: 'Media sosial berbasis cuitan teks pendek' },
  { id: 'wp-103', category: 'Teknologi & Pop', wordA: 'Kamera DSLR', wordB: 'Kamera HP', hint: 'Alat fotografi pengabadi momen' },
  { id: 'wp-104', category: 'Teknologi & Pop', wordA: 'Keyboard Mekanikal', wordB: 'Keyboard Membran', hint: 'Papan ketik tombol komputer' },
  { id: 'wp-105', category: 'Teknologi & Pop', wordA: 'Mobile Legends', wordB: 'Free Fire', hint: 'Game mobile kompetitif online sejuta umat' },
  { id: 'wp-106', category: 'Teknologi & Pop', wordA: 'Google Drive', wordB: 'Flashdisk', hint: 'Media penyimpan file dokumen digital' },

  // ==========================================
  // 5. Profesi & Transportasi (20 Pasang)
  // ==========================================
  { id: 'wp-107', category: 'Profesi & Transportasi', wordA: 'Dokter', wordB: 'Perawat', hint: 'Tenaga medis penyelamat di rumah sakit' },
  { id: 'wp-108', category: 'Profesi & Transportasi', wordA: 'Polisi', wordB: 'Satpam', hint: 'Petugas penjaga keamanan dan ketertiban' },
  { id: 'wp-109', category: 'Profesi & Transportasi', wordA: 'Kereta Api', wordB: 'Busway', hint: 'Moda transportasi umum massal darat' },
  { id: 'wp-110', category: 'Profesi & Transportasi', wordA: 'Ojek Online', wordB: 'Taksi Online', hint: 'Transportasi online panggilan aplikasi' },
  { id: 'wp-111', category: 'Profesi & Transportasi', wordA: 'Sepeda', wordB: 'Sepeda Motor', hint: 'Kendaraan roda dua' },
  { id: 'wp-112', category: 'Profesi & Transportasi', wordA: 'Pesawat', wordB: 'Helikopter', hint: 'Armada angkasa raya bersayap/baling-baling' },
  { id: 'wp-113', category: 'Profesi & Transportasi', wordA: 'Guru', wordB: 'Dosen', hint: 'Pendidik mulia pencerdas generasi bangsa' },
  { id: 'wp-114', category: 'Profesi & Transportasi', wordA: 'Koki (Chef)', wordB: 'Barista', hint: 'Ahli peracik makanan atau kopi lezat' },
  { id: 'wp-115', category: 'Profesi & Transportasi', wordA: 'Fotografer', wordB: 'Videografer', hint: 'Profesi visual pengabadi momen' },
  { id: 'wp-116', category: 'Profesi & Transportasi', wordA: 'Pilot', wordB: 'Masinis', hint: 'Pengemudi armada transportasi publik jarak jauh' },
  { id: 'wp-117', category: 'Profesi & Transportasi', wordA: 'Pramugari', wordB: 'Pelayan Restoran', hint: 'Profesi ramah melayani kenyamanan pelanggan' },
  { id: 'wp-118', category: 'Profesi & Transportasi', wordA: 'Kapal Feri', wordB: 'Kapal Pesiar', hint: 'Transportasi laut berukuran besar' },
  { id: 'wp-119', category: 'Profesi & Transportasi', wordA: 'Becak', wordB: 'Delman', hint: 'Kendaraan tradisional tanpa bahan bakar bensin' },
  { id: 'wp-120', category: 'Profesi & Transportasi', wordA: 'Angkot', wordB: 'Metromini', hint: 'Transportasi jalan raya legendaris kota' },
  { id: 'wp-121', category: 'Profesi & Transportasi', wordA: 'Ambulans', wordB: 'Mobil Pemadam', hint: 'Kendaraan darurat bersirine kencang di jalan' },
  { id: 'wp-122', category: 'Profesi & Transportasi', wordA: 'Hakim', wordB: 'Pengacara', hint: 'Aparat penegak hukum di ruang sidang' },
  { id: 'wp-123', category: 'Profesi & Transportasi', wordA: 'Kasir', wordB: 'Teller Bank', hint: 'Petugas transaksi keuangan dan uang tunai' },
  { id: 'wp-124', category: 'Profesi & Transportasi', wordA: 'Petani', wordB: 'Nelayan', hint: 'Pahlawan pangan penyedia beras dan ikan' },
  { id: 'wp-125', category: 'Profesi & Transportasi', wordA: 'Arsitek', wordB: 'Desainer Interior', hint: 'Perancang tata ruang dan keindahan bangunan' },
  { id: 'wp-126', category: 'Profesi & Transportasi', wordA: 'Artis Sinetron', wordB: 'Selebgram', hint: 'Sosok figur publik terkenal di layar kaca/HP' },
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
