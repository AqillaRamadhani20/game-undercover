import type { WordPair } from '../types/game';

export const DEFAULT_WORD_PAIRS: WordPair[] = [
  // ==========================================
  // 1. Makanan & Minuman (30 Pasang - 1 Kata)
  // ==========================================
  { id: 'wp-1', category: 'Makanan & Minuman', wordA: 'Kopi', wordB: 'Teh', hint: 'Minuman santai populer' },
  { id: 'wp-2', category: 'Makanan & Minuman', wordA: 'Bakso', wordB: 'Soto', hint: 'Kuliner kuah gurih' },
  { id: 'wp-3', category: 'Makanan & Minuman', wordA: 'Boba', wordB: 'Cendol', hint: 'Minuman manis berbutir' },
  { id: 'wp-4', category: 'Makanan & Minuman', wordA: 'Cokelat', wordB: 'Keju', hint: 'Topping manis atau asin' },
  { id: 'wp-5', category: 'Makanan & Minuman', wordA: 'Pizza', wordB: 'Burger', hint: 'Cepat saji ala barat' },
  { id: 'wp-6', category: 'Makanan & Minuman', wordA: 'Rawon', wordB: 'Gulai', hint: 'Masakan kuah bumbu pekat' },
  { id: 'wp-7', category: 'Makanan & Minuman', wordA: 'Siomay', wordB: 'Batagor', hint: 'Jajanan bumbu kacang' },
  { id: 'wp-8', category: 'Makanan & Minuman', wordA: 'Tempe', wordB: 'Tahu', hint: 'Olahan kedelai bergizi' },
  { id: 'wp-9', category: 'Makanan & Minuman', wordA: 'Rendang', wordB: 'Semur', hint: 'Olahan daging kecap/rempah' },
  { id: 'wp-10', category: 'Makanan & Minuman', wordA: 'Mie', wordB: 'Bihun', hint: 'Olahan mi atau sohun gurih' },
  { id: 'wp-11', category: 'Makanan & Minuman', wordA: 'Cilok', wordB: 'Cireng', hint: 'Camilan aci kenyal' },
  { id: 'wp-12', category: 'Makanan & Minuman', wordA: 'Bakwan', wordB: 'Risol', hint: 'Gorengan renyah' },
  { id: 'wp-13', category: 'Makanan & Minuman', wordA: 'Ketoprak', wordB: 'Pecel', hint: 'Sayuran siram bumbu kacang' },
  { id: 'wp-14', category: 'Makanan & Minuman', wordA: 'Donat', wordB: 'Roti', hint: 'Kudapan berbahan tepung gandum' },
  { id: 'wp-15', category: 'Makanan & Minuman', wordA: 'Semangka', wordB: 'Melon', hint: 'Buah segar berair' },
  { id: 'wp-16', category: 'Makanan & Minuman', wordA: 'Jeruk', wordB: 'Lemon', hint: 'Buah sitrus masam manis' },
  { id: 'wp-17', category: 'Makanan & Minuman', wordA: 'Durian', wordB: 'Nangka', hint: 'Buah beraroma wangi kuat' },
  { id: 'wp-18', category: 'Makanan & Minuman', wordA: 'Apel', wordB: 'Pir', hint: 'Buah renyah berair' },
  { id: 'wp-19', category: 'Makanan & Minuman', wordA: 'Nanas', wordB: 'Mangga', hint: 'Buah tropis kuning segar' },
  { id: 'wp-20', category: 'Makanan & Minuman', wordA: 'Rempeyek', wordB: 'Kerupuk', hint: 'Teman makan pelengkap renyah' },
  { id: 'wp-21', category: 'Makanan & Minuman', wordA: 'Emping', wordB: 'Keripik', hint: 'Camilan garing asin' },
  { id: 'wp-22', category: 'Makanan & Minuman', wordA: 'Susu', wordB: 'Sirup', hint: 'Minuman manis penambah energi' },
  { id: 'wp-23', category: 'Makanan & Minuman', wordA: 'Yoghurt', wordB: 'Yakult', hint: 'Minuman fermentasi asam segar' },
  { id: 'wp-24', category: 'Makanan & Minuman', wordA: 'Sambal', wordB: 'Saus', hint: 'Pelengkap rasa pedas' },
  { id: 'wp-25', category: 'Makanan & Minuman', wordA: 'Madu', wordB: 'Gula', hint: 'Pemanis alami atau kristal' },
  { id: 'wp-26', category: 'Makanan & Minuman', wordA: 'Garam', wordB: 'Micin', hint: 'Bumbu penyedap masakan' },
  { id: 'wp-27', category: 'Makanan & Minuman', wordA: 'Mentega', wordB: 'Minyak', hint: 'Bahan lemak untuk menumis' },
  { id: 'wp-28', category: 'Makanan & Minuman', wordA: 'Sate', wordB: 'Kebab', hint: 'Daging tusuk atau gulung panggangan' },
  { id: 'wp-29', category: 'Makanan & Minuman', wordA: 'Bubur', wordB: 'Lontong', hint: 'Olahan beras lembut berkuah' },
  { id: 'wp-30', category: 'Makanan & Minuman', wordA: 'Cincau', wordB: 'Agar', hint: 'Bahan puding atau penyejuk dahaga' },

  // ==========================================
  // 2. Benda Sehari-hari (28 Pasang - 1 Kata)
  // ==========================================
  { id: 'wp-31', category: 'Benda Sehari-hari', wordA: 'Sepatu', wordB: 'Sandal', hint: 'Alas kaki' },
  { id: 'wp-32', category: 'Benda Sehari-hari', wordA: 'Payung', wordB: 'Jas', hint: 'Pelindung tubuh saat keluar' },
  { id: 'wp-33', category: 'Benda Sehari-hari', wordA: 'Kasur', wordB: 'Sofa', hint: 'Tempat duduk atau rebahan empuk' },
  { id: 'wp-34', category: 'Benda Sehari-hari', wordA: 'Bantal', wordB: 'Guling', hint: 'Teman tidur di ranjang' },
  { id: 'wp-35', category: 'Benda Sehari-hari', wordA: 'Kacamata', wordB: 'Lensa', hint: 'Alat bantu pandangan mata' },
  { id: 'wp-36', category: 'Benda Sehari-hari', wordA: 'Kalung', wordB: 'Gelang', hint: 'Perhiasan aksesoris tubuh' },
  { id: 'wp-37', category: 'Benda Sehari-hari', wordA: 'Dompet', wordB: 'Tas', hint: 'Wadah penyimpan uang dan barang' },
  { id: 'wp-38', category: 'Benda Sehari-hari', wordA: 'Pensil', wordB: 'Pulpen', hint: 'Alat tulis tangan' },
  { id: 'wp-39', category: 'Benda Sehari-hari', wordA: 'Piring', wordB: 'Mangkuk', hint: 'Wadah sajian makanan' },
  { id: 'wp-40', category: 'Benda Sehari-hari', wordA: 'Sendok', wordB: 'Garpu', hint: 'Alat makan di tangan' },
  { id: 'wp-41', category: 'Benda Sehari-hari', wordA: 'Gelas', wordB: 'Cangkir', hint: 'Wadah minuman' },
  { id: 'wp-42', category: 'Benda Sehari-hari', wordA: 'Ember', wordB: 'Gayung', hint: 'Wadah air di kamar mandi' },
  { id: 'wp-43', category: 'Benda Sehari-hari', wordA: 'Handuk', wordB: 'Selimut', hint: 'Kain pengering atau penghangat tubuh' },
  { id: 'wp-44', category: 'Benda Sehari-hari', wordA: 'Sisir', wordB: 'Jepit', hint: 'Perapi mahkota rambut' },
  { id: 'wp-45', category: 'Benda Sehari-hari', wordA: 'Botol', wordB: 'Termos', hint: 'Wadah cairan portabel' },
  { id: 'wp-46', category: 'Benda Sehari-hari', wordA: 'Sabun', wordB: 'Sampo', hint: 'Pembersih badan dan kepala' },
  { id: 'wp-47', category: 'Benda Sehari-hari', wordA: 'Sapu', wordB: 'Pel', hint: 'Alat bersih lantai' },
  { id: 'wp-48', category: 'Benda Sehari-hari', wordA: 'Gunting', wordB: 'Pisau', hint: 'Benda tajam pemotong' },
  { id: 'wp-49', category: 'Benda Sehari-hari', wordA: 'Cermin', wordB: 'Kaca', hint: 'Benda pemantul bayangan' },
  { id: 'wp-50', category: 'Benda Sehari-hari', wordA: 'Lilin', wordB: 'Senter', hint: 'Penerang dalam gelap' },
  { id: 'wp-51', category: 'Benda Sehari-hari', wordA: 'Koper', wordB: 'Ransel', hint: 'Tas untuk bepergian jauh' },
  { id: 'wp-52', category: 'Benda Sehari-hari', wordA: 'Kunci', wordB: 'Gembok', hint: 'Pengaman pintu dan lemari' },
  { id: 'wp-53', category: 'Benda Sehari-hari', wordA: 'Sabuk', wordB: 'Tali', hint: 'Pengikat celana atau benda' },
  { id: 'wp-54', category: 'Benda Sehari-hari', wordA: 'Topi', wordB: 'Helm', hint: 'Pelindung bagian kepala' },
  { id: 'wp-55', category: 'Benda Sehari-hari', wordA: 'Kemeja', wordB: 'Kaos', hint: 'Pakaian atasan badan' },
  { id: 'wp-56', category: 'Benda Sehari-hari', wordA: 'Celana', wordB: 'Rok', hint: 'Pakaian bawahan' },
  { id: 'wp-57', category: 'Benda Sehari-hari', wordA: 'Penggaris', wordB: 'Meteran', hint: 'Alat ukur panjang' },
  { id: 'wp-58', category: 'Benda Sehari-hari', wordA: 'Penghapus', wordB: 'Tipex', hint: 'Penghilang coretan tulisan' },

  // ==========================================
  // 3. Hewan & Alam (26 Pasang - 1 Kata)
  // ==========================================
  { id: 'wp-59', category: 'Hewan & Alam', wordA: 'Kucing', wordB: 'Anjing', hint: 'Hewan peliharaan favorit' },
  { id: 'wp-60', category: 'Hewan & Alam', wordA: 'Singa', wordB: 'Harimau', hint: 'Predator buas berkaki empat' },
  { id: 'wp-61', category: 'Hewan & Alam', wordA: 'Pantai', wordB: 'Gunung', hint: 'Wisata alam terbuka' },
  { id: 'wp-62', category: 'Hewan & Alam', wordA: 'Danau', wordB: 'Sungai', hint: 'Genangan atau aliran air' },
  { id: 'wp-63', category: 'Hewan & Alam', wordA: 'Hujan', wordB: 'Badai', hint: 'Cuaca berangin dan berair' },
  { id: 'wp-64', category: 'Hewan & Alam', wordA: 'Matahari', wordB: 'Bulan', hint: 'Benda langit penerang' },
  { id: 'wp-65', category: 'Hewan & Alam', wordA: 'Bebek', wordB: 'Angsa', hint: 'Unggas air paruh pipih' },
  { id: 'wp-66', category: 'Hewan & Alam', wordA: 'Kuda', wordB: 'Zebra', hint: 'Hewan berkuku pelari cepat' },
  { id: 'wp-67', category: 'Hewan & Alam', wordA: 'Katak', wordB: 'Kodok', hint: 'Amfibi pelompat' },
  { id: 'wp-68', category: 'Hewan & Alam', wordA: 'Semut', wordB: 'Nyamuk', hint: 'Serangga kecil di sekitar kita' },
  { id: 'wp-69', category: 'Hewan & Alam', wordA: 'Gajah', wordB: 'Jerapah', hint: 'Hewan darat berukuran besar' },
  { id: 'wp-70', category: 'Hewan & Alam', wordA: 'Kelinci', wordB: 'Kucing', hint: 'Hewan peliharaan lucu berbulu' },
  { id: 'wp-71', category: 'Hewan & Alam', wordA: 'Mawar', wordB: 'Melati', hint: 'Bunga harum menawan' },
  { id: 'wp-72', category: 'Hewan & Alam', wordA: 'Hutan', wordB: 'Kebun', hint: 'Hamparan pepohonan rimbun' },
  { id: 'wp-73', category: 'Hewan & Alam', wordA: 'Gurun', wordB: 'Bukit', hint: 'Bentang alam gersang/bergelombang' },
  { id: 'wp-74', category: 'Hewan & Alam', wordA: 'Pelangi', wordB: 'Awan', hint: 'Pemandangan di langit' },
  { id: 'wp-75', category: 'Hewan & Alam', wordA: 'Belalang', wordB: 'Jangkrik', hint: 'Serangga pelompat berbunyi' },
  { id: 'wp-76', category: 'Hewan & Alam', wordA: 'Hiu', wordB: 'Paus', hint: 'Raksasa penghuni lautan' },
  { id: 'wp-77', category: 'Hewan & Alam', wordA: 'Monyet', wordB: 'Kera', hint: 'Primata cerdas lincah' },
  { id: 'wp-78', category: 'Hewan & Alam', wordA: 'Elang', wordB: 'Gagak', hint: 'Burung berparuh tajam' },
  { id: 'wp-79', category: 'Hewan & Alam', wordA: 'Lebah', wordB: 'Tawon', hint: 'Serangga bersengat madu' },
  { id: 'wp-80', category: 'Hewan & Alam', wordA: 'Buaya', wordB: 'Komodo', hint: 'Reptil predator besar Indonesia' },
  { id: 'wp-81', category: 'Hewan & Alam', wordA: 'Kambing', wordB: 'Domba', hint: 'Ternak herbivora berbulu' },
  { id: 'wp-82', category: 'Hewan & Alam', wordA: 'Sapi', wordB: 'Kerbau', hint: 'Ternak besar penghasil susu/tenaga' },
  { id: 'wp-83', category: 'Hewan & Alam', wordA: 'Kelapa', wordB: 'Sawit', hint: 'Pohon palem kaya minyak' },
  { id: 'wp-84', category: 'Hewan & Alam', wordA: 'Laut', wordB: 'Samudra', hint: 'Perairan asin luas bumi' },

  // ==========================================
  // 4. Teknologi & Pop (22 Pasang - 1 Kata)
  // ==========================================
  { id: 'wp-85', category: 'Teknologi & Pop', wordA: 'Instagram', wordB: 'TikTok', hint: 'Media sosial tren anak muda' },
  { id: 'wp-86', category: 'Teknologi & Pop', wordA: 'Netflix', wordB: 'YouTube', hint: 'Platform nonton video' },
  { id: 'wp-87', category: 'Teknologi & Pop', wordA: 'WhatsApp', wordB: 'Telegram', hint: 'Aplikasi chat perpesanan' },
  { id: 'wp-88', category: 'Teknologi & Pop', wordA: 'Gitar', wordB: 'Biola', hint: 'Alat musik berdawai' },
  { id: 'wp-89', category: 'Teknologi & Pop', wordA: 'Bioskop', wordB: 'Teater', hint: 'Tempat tontonan seni' },
  { id: 'wp-90', category: 'Teknologi & Pop', wordA: 'Laptop', wordB: 'Tablet', hint: 'Komputer ringkas portabel' },
  { id: 'wp-91', category: 'Teknologi & Pop', wordA: 'Headphone', wordB: 'Earphone', hint: 'Perangkat audio telinga' },
  { id: 'wp-92', category: 'Teknologi & Pop', wordA: 'Spotify', wordB: 'Joox', hint: 'Aplikasi dengar musik' },
  { id: 'wp-93', category: 'Teknologi & Pop', wordA: 'Shopee', wordB: 'Tokopedia', hint: 'Tempat belanja daring' },
  { id: 'wp-94', category: 'Teknologi & Pop', wordA: 'PlayStation', wordB: 'Xbox', hint: 'Konsol game rumahan' },
  { id: 'wp-95', category: 'Teknologi & Pop', wordA: 'Mouse', wordB: 'Touchpad', hint: 'Pengendali kursor layar' },
  { id: 'wp-96', category: 'Teknologi & Pop', wordA: 'Powerbank', wordB: 'Charger', hint: 'Pengisi baterai gawai' },
  { id: 'wp-97', category: 'Teknologi & Pop', wordA: 'Bluetooth', wordB: 'Wifi', hint: 'Koneksi nirkabel digital' },
  { id: 'wp-98', category: 'Teknologi & Pop', wordA: 'Smartwatch', wordB: 'Arloji', hint: 'Penunjuk jam pergelangan tangan' },
  { id: 'wp-99', category: 'Teknologi & Pop', wordA: 'Podcast', wordB: 'Radio', hint: 'Siaran suara obrolan' },
  { id: 'wp-100', category: 'Teknologi & Pop', wordA: 'Anime', wordB: 'Kartun', hint: 'Film animasi bergambar' },
  { id: 'wp-101', category: 'Teknologi & Pop', wordA: 'Twitter', wordB: 'Threads', hint: 'Media sosial cuitan teks' },
  { id: 'wp-102', category: 'Teknologi & Pop', wordA: 'Kamera', wordB: 'Webcam', hint: 'Perekam gambar dan video' },
  { id: 'wp-103', category: 'Teknologi & Pop', wordA: 'Televisi', wordB: 'Bioskop', hint: 'Layar tontonan hiburan video' },
  { id: 'wp-104', category: 'Teknologi & Pop', wordA: 'Komputer', wordB: 'Laptop', hint: 'Perangkat kerja dan komputasi' },
  { id: 'wp-105', category: 'Teknologi & Pop', wordA: 'Flashdisk', wordB: 'Memori', hint: 'Penyimpan file data portabel' },
  { id: 'wp-106', category: 'Teknologi & Pop', wordA: 'Speaker', wordB: 'Headset', hint: 'Alat pengeras atau pemutar suara' },

  // ==========================================
  // 5. Profesi & Transportasi (20 Pasang - 1 Kata)
  // ==========================================
  { id: 'wp-107', category: 'Profesi & Transportasi', wordA: 'Dokter', wordB: 'Perawat', hint: 'Tenaga medis penyembuh' },
  { id: 'wp-108', category: 'Profesi & Transportasi', wordA: 'Polisi', wordB: 'Satpam', hint: 'Penjaga tertib dan aman' },
  { id: 'wp-109', category: 'Profesi & Transportasi', wordA: 'Kereta', wordB: 'Bus', hint: 'Transportasi darat berpenumpang banyak' },
  { id: 'wp-110', category: 'Profesi & Transportasi', wordA: 'Ojek', wordB: 'Taksi', hint: 'Angkutan penumpang antar alamat' },
  { id: 'wp-111', category: 'Profesi & Transportasi', wordA: 'Sepeda', wordB: 'Motor', hint: 'Kendaraan dua roda' },
  { id: 'wp-112', category: 'Profesi & Transportasi', wordA: 'Pesawat', wordB: 'Helikopter', hint: 'Angkutan udara bermesin' },
  { id: 'wp-113', category: 'Profesi & Transportasi', wordA: 'Guru', wordB: 'Dosen', hint: 'Pengajar di sekolah atau kampus' },
  { id: 'wp-114', category: 'Profesi & Transportasi', wordA: 'Koki', wordB: 'Barista', hint: 'Peracik santapan lezat' },
  { id: 'wp-115', category: 'Profesi & Transportasi', wordA: 'Fotografer', wordB: 'Videografer', hint: 'Perekam visual karya seni' },
  { id: 'wp-116', category: 'Profesi & Transportasi', wordA: 'Pilot', wordB: 'Masinis', hint: 'Pengemudi moda transportasi jarak jauh' },
  { id: 'wp-117', category: 'Profesi & Transportasi', wordA: 'Pramugari', wordB: 'Pelayan', hint: 'Pemberi layanan ramah konsumen' },
  { id: 'wp-118', category: 'Profesi & Transportasi', wordA: 'Kapal', wordB: 'Perahu', hint: 'Kendaraan penjelajah perairan' },
  { id: 'wp-119', category: 'Profesi & Transportasi', wordA: 'Becak', wordB: 'Delman', hint: 'Transportasi tradisional non-mesin' },
  { id: 'wp-120', category: 'Profesi & Transportasi', wordA: 'Angkot', wordB: 'Busway', hint: 'Transportasi umum jalan raya' },
  { id: 'wp-121', category: 'Profesi & Transportasi', wordA: 'Ambulans', wordB: 'Damkar', hint: 'Kendaraan tanggap darurat' },
  { id: 'wp-122', category: 'Profesi & Transportasi', wordA: 'Hakim', wordB: 'Jaksa', hint: 'Aparat hukum persidangan' },
  { id: 'wp-123', category: 'Profesi & Transportasi', wordA: 'Kasir', wordB: 'Teller', hint: 'Petugas loket urusan uang' },
  { id: 'wp-124', category: 'Profesi & Transportasi', wordA: 'Petani', wordB: 'Nelayan', hint: 'Penyedia pangan beras dan ikan' },
  { id: 'wp-125', category: 'Profesi & Transportasi', wordA: 'Arsitek', wordB: 'Desainer', hint: 'Perancang rupa dan tata ruang' },
  { id: 'wp-126', category: 'Profesi & Transportasi', wordA: 'Aktor', wordB: 'Selebgram', hint: 'Tokoh terkenal layar hiburan' },

  // ==========================================
  // 6. Artis & Superhero (30 Pasang - 1 Kata Familiar)
  // ==========================================
  { id: 'wp-127', category: 'Artis & Superhero', wordA: 'Batman', wordB: 'Superman', hint: 'Pahlawan legendaris DC Comics' },
  { id: 'wp-128', category: 'Artis & Superhero', wordA: 'Spiderman', wordB: 'Deadpool', hint: 'Pahlawan lincah berkostum merah' },
  { id: 'wp-129', category: 'Artis & Superhero', wordA: 'Thor', wordB: 'Loki', hint: 'Karakter bersaudara dari Asgard' },
  { id: 'wp-130', category: 'Artis & Superhero', wordA: 'Ironman', wordB: 'Batman', hint: 'Miliarder jenius berzirah canggih' },
  { id: 'wp-131', category: 'Artis & Superhero', wordA: 'Hulk', wordB: 'Thanos', hint: 'Raksasa berdaya fisik dahsyat' },
  { id: 'wp-132', category: 'Artis & Superhero', wordA: 'Wolverine', wordB: 'Deadpool', hint: 'Mutan bermata pisau atau regenerasi cepat' },
  { id: 'wp-133', category: 'Artis & Superhero', wordA: 'Flash', wordB: 'Sonic', hint: 'Karakter pahlawan berkecepatan kilat' },
  { id: 'wp-134', category: 'Artis & Superhero', wordA: 'Joker', wordB: 'Thanos', hint: 'Karakter penjahat paling ikonik' },
  { id: 'wp-135', category: 'Artis & Superhero', wordA: 'Venom', wordB: 'Spiderman', hint: 'Karakter jagoan laba-laba atau simbiot' },
  { id: 'wp-136', category: 'Artis & Superhero', wordA: 'Gundala', wordB: 'Gatotkaca', hint: 'Superhero jagoan hebat Indonesia' },
  { id: 'wp-137', category: 'Artis & Superhero', wordA: 'Aquaman', wordB: 'Poseidon', hint: 'Penguasa lautan samudra berkuasa' },
  { id: 'wp-138', category: 'Artis & Superhero', wordA: 'Batman', wordB: 'Robin', hint: 'Duo pahlawan pelindung Kota Gotham' },
  { id: 'wp-139', category: 'Artis & Superhero', wordA: 'Naruto', wordB: 'Sasuke', hint: 'Ninja legendaris Konoha' },
  { id: 'wp-140', category: 'Artis & Superhero', wordA: 'Luffy', wordB: 'Zoro', hint: 'Pendekar bajak laut Topi Jerami' },
  { id: 'wp-141', category: 'Artis & Superhero', wordA: 'Goku', wordB: 'Vegeta', hint: 'Prajurit bangsa Saiya terkuat' },
  { id: 'wp-142', category: 'Artis & Superhero', wordA: 'Raffi', wordB: 'Baim', hint: 'Artis & presenter ternama Indonesia' },
  { id: 'wp-143', category: 'Artis & Superhero', wordA: 'Desta', wordB: 'Vincent', hint: 'Duo presenter sahabat karib' },
  { id: 'wp-144', category: 'Artis & Superhero', wordA: 'Sule', wordB: 'Andre', hint: 'Komedian televisi legendaris' },
  { id: 'wp-145', category: 'Artis & Superhero', wordA: 'Komeng', wordB: 'Lontong', hint: 'Pelawak spontan legendaris Indonesia' },
  { id: 'wp-146', category: 'Artis & Superhero', wordA: 'Reza', wordB: 'Iqbaal', hint: 'Aktor tampan perfilman Indonesia' },
  { id: 'wp-147', category: 'Artis & Superhero', wordA: 'Raditya', wordB: 'Dodit', hint: 'Komika dan penulis terkenal' },
  { id: 'wp-148', category: 'Artis & Superhero', wordA: 'Tulus', wordB: 'Judika', hint: 'Penyanyi pria bersuara emas' },
  { id: 'wp-149', category: 'Artis & Superhero', wordA: 'Raisa', wordB: 'Isyana', hint: 'Diva pop wanita bersuara merdu' },
  { id: 'wp-150', category: 'Artis & Superhero', wordA: 'Agnez', wordB: 'Anggun', hint: 'Penyanyi wanita Indonesia go international' },
  { id: 'wp-151', category: 'Artis & Superhero', wordA: 'Atta', wordB: 'Thariq', hint: 'YouTuber kakak beradik populer Indonesia' },
  { id: 'wp-152', category: 'Artis & Superhero', wordA: 'Taylor', wordB: 'Selena', hint: 'Penyanyi pop wanita sahabat selebriti' },
  { id: 'wp-153', category: 'Artis & Superhero', wordA: 'Ronaldo', wordB: 'Messi', hint: 'Megabintang sepakbola dunia' },
  { id: 'wp-154', category: 'Artis & Superhero', wordA: 'Barbie', wordB: 'Ken', hint: 'Karakter boneka ikonik dunia' },
  { id: 'wp-155', category: 'Artis & Superhero', wordA: 'Beyonce', wordB: 'Rihanna', hint: 'Bintang diva musik pop global' },
  { id: 'wp-156', category: 'Artis & Superhero', wordA: 'Nobita', wordB: 'Doraemon', hint: 'Karakter kartun sahabat sejati' },
];

export const CATEGORIES = [
  'Makanan & Minuman',
  'Benda Sehari-hari',
  'Hewan & Alam',
  'Teknologi & Pop',
  'Profesi & Transportasi',
  'Artis & Superhero',
] as const;

export const FAMOUS_PRESET_NAMES = [
  'Batman', 'Superman', 'Spiderman', 'Ironman', 'Deadpool',
  'Thor', 'Hulk', 'Loki', 'Joker', 'Thanos',
  'Gundala', 'Gatotkaca', 'Naruto', 'Sasuke', 'Luffy',
  'Raffi', 'Desta', 'Vincent', 'Sule', 'Andre',
  'Komeng', 'Iqbaal', 'Reza', 'Raditya', 'Tulus',
  'Raisa', 'Agnez', 'Taylor', 'Messi', 'Ronaldo'
];

export function secureRandomFloat(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] / (0xffffffff + 1);
  }
  return Math.random();
}

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

  // Pick random pair with cryptographic randomness
  const randomIndex = Math.floor(secureRandomFloat() * pool.length);
  const pair = pool[randomIndex];

  // Random swap 50/50 so wordA isn't always Civilian
  const isSwap = secureRandomFloat() > 0.5;
  const civilianWord = isSwap ? pair.wordB : pair.wordA;
  const undercoverWord = isSwap ? pair.wordA : pair.wordB;

  return { pair, civilianWord, undercoverWord };
}
