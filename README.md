# Undercover: Word Party Game 🦎

Game pesta tebak kata sosial berbasis web yang responsif, mobile-first, dan langsung dapat dimainkan secara **Pass-and-Play (Offline 1 HP)**. Terinspirasi dari game legendaris **Undercover®** karya Yanstar Studio.

Dibangun dengan arsitektur **Finite State Machine (FSM)** modular yang memisahkan logika engine murni dari antarmuka React, memudahkan ekspansi ke mode Online Room (WebSocket / WebRTC / Firebase) di masa mendatang.

---

## 🚀 Fitur Unggulan

### 1. Pass-and-Play (Offline 1 HP) dengan Privacy Guard 2-Tahap
- **Tahap 1 (Layar Tertutup):** Menampilkan nama pemain berikutnya ("Oper HP ke [Nama Pemain]") dan tombol *"Buka Kata Rahasia"*. Kata rahasia dan peran sama sekali **tidak di-render ke dalam DOM** saat layar tertutup demi keamanan anti-intip.
- **Tahap 2 (Layar Terbuka):** Menampilkan kata rahasia (atau kartu khusus Mr. White tanpa kata) beserta peran spesial & pasangan rahasia (The Lovers).
- Tombol *"Sembunyikan & Oper Berikutnya"* langsung membersihkan kata dari DOM sebelum beralih ke pemain berikutnya.

### 2. Tiga Peran Utama & Rasio Seimbang
- **🛡️ Civilian (Warga Sipil):** Mayoritas pemain, menerima kata yang sama persis. Misi: menemukan semua penyusup.
- **🕵️ Undercover (Penyusup):** Menerima kata yang sangat mirip dengan kata Civilian. Misi: membaur dan mengeliminasi warga.
- **🎭 Mr. White:** Tidak menerima kata sama sekali! Misi: mengarang petunjuk berdasarkan pemain lain. Jika tereliminasi, mendapat **1x kesempatan menebak kata Civilian** untuk langsung menang seketika (+6 poin)!
- **Auto Role Ratio:** Algoritma otomatis menghitung komposisi ideal peran untuk 3–20 pemain dengan jaminan warga sipil selalu mayoritas, plus kontrol manual yang fleksibel bagi host.

### 3. Word-Pair Engine & Kata Kustom (Personal Words)
- **42 Pasang Kata Bahasa Indonesia:** Dikurasi dalam 5 kategori seru (*Makanan & Minuman*, *Benda Sehari-hari*, *Hewan & Alam*, *Teknologi & Pop*, *Profesi & Transportasi*).
- **Anti-Repeat & Random Swap:** Mengingat `usedWordPairIds` agar kata tidak berulang sampai pool habis, serta mengacak 50/50 mana yang menjadi `civilianWord` vs `undercoverWord`.
- **Fitur Personal Words:** Input pasangan kata sendiri, simpan ke `localStorage`, dan mainkan bersama kategori bawaan.

### 4. Special Roles (Modular Lifecycle Hooks)
- **⚖️ Goddess of Justice:** Memutuskan hasil voting jika terjadi seri (tetap berfungsi meski dirinya sudah gugur).
- **💖 The Lovers (min. 5 pemain):** Dua pemain terikat cinta rahasia; jika salah satu gugur, pasangannya otomatis ikut tereliminasi karena patah hati.
- **🤫 Mr. Meme:** Setiap ronde 1 pemain acak dikutuk untuk mendeskripsikan kata **hanya dengan gestur/pantomim bisu**.
- **⚔️ The Revenger (min. 5 pemain):** Saat tereliminasi, berhak menyeret 1 pemain lain yang masih hidup ikut keluar.
- **🤡 The Joy Fool:** Jika menjadi pemain pertama yang tereliminasi di ronde 1, langsung mendapatkan bonus **+4 poin**.

### 5. Aturan Evaluasi Kemenangan & Poin Ketat
1. **Mr. White Berhasil Tebak Kata:** `MR_WHITE_WIN` (+6 poin untuk Mr. White).
2. **Semua Penyusup Gugur:** `CIVILIANS_WIN` (+2 poin untuk tiap Civilian).
3. **Warga Sipil Sisa &le; 1:** `INFILTRATORS_WIN` (+10 poin untuk Undercover, +6 poin untuk Mr. White jika bertahan).

### 6. UI/UX Modern & Audio Sintetis Offline
- **Mobile-First & One-Handed Friendly:** Dirancang nyaman dimainkan sambil memegang HP dengan satu tangan dan dioper ke teman.
- **Palet Bunglon:** Dark Mode `#0F172A` / Light Mode `#FFFFFF`, aksen Emerald Green (`#16A34A`), Sky Blue (`#0284C7`), Amber (`#F59E0B`), dan Rose (`#E11D48`).
- **Zero-Dependency Audio Synthesizer:** Efek suara flip kartu, klik, detak timer, eliminasi gong, dan victory fanfare disintesis langsung menggunakan Web Audio API tanpa butuh file MP3 eksternal.
- **Haptic Vibration:** Umpan balik getar pada tombol penting via `navigator.vibrate`.
- **Confetti Victory:** Perayaan kemenangan dengan animasi kembang api kertas warna-warni.

---

## 🛠️ Arsitektur Kode

```
src/
├── types/
│   └── game.ts                # TypeScript interfaces (Player, Role, GameState, Config, dll)
├── data/
│   └── wordPairs.ts           # 42 pasang kata bawaan + Personal Words storage manager
├── engine/
│   ├── roleDistributor.ts     # Auto role ratio calculator, validator, Fisher-Yates shuffle
│   ├── winEvaluator.ts        # Logika evaluasi kemenangan & skor berurutan
│   ├── specialRoleHooks.ts    # Lifecycle hooks untuk 5 Special Roles
│   ├── gameReducer.ts         # Finite State Machine (FSM) terpusat
│   └── engine.verify.ts       # Automated verification test suite
├── utils/
│   ├── audio.ts               # Web Audio API synthesizer + haptics
│   └── storage.ts             # LocalStorage persistence (profiles, scoreboard, settings)
└── components/
    ├── layout/
    │   └── Header.tsx         # Navbar dengan logo, indikator ronde, toggle tema & suara
    ├── common/
    │   ├── Modal.tsx          # Reusable modal
    │   ├── RulebookModal.tsx  # Panduan lengkap aturan permainan dalam Bahasa Indonesia
    │   └── ScoreboardModal.tsx# Papan skor kumulatif & rekap kemenangan
    ├── lobby/
    │   ├── LobbyScreen.tsx    # Manajemen pemain, rasio peran, toggle special roles, kategori
    │   └── PersonalWordsModal.tsx # Form tambah & hapus kata kustom
    ├── reveal/
    │   └── WordRevealScreen.tsx # Privacy guard 2-tahap kartu rahasia
    ├── description/
    │   └── DescriptionScreen.tsx# Urutan giliran bicara + banner kutukan Mr. Meme
    ├── discussion/
    │   └── DiscussionScreen.tsx # Timer diskusi interaktif (pause, +30s, skip)
    ├── voting/
    │   ├── VotingScreen.tsx   # Voting konsensus cepat / hitung suara
    │   ├── TieBreakerModal.tsx# Pemecah seri (Goddess, Suit, Revote)
    │   ├── MrWhiteGuessModal.tsx # Modal tebakan terakhir Mr. White
    │   └── RevengerChoiceModal.tsx # Modal balas dendam The Revenger
    └── result/
        ├── RoundResultScreen.tsx # Pengungkapan peran tereliminasi & tragedi Lovers
        └── GameOverScreen.tsx # Banner kemenangan, ungkap semua peran & kata, scoreboard
```

---

## 💻 Cara Menjalankan

### Persyaratan
- Node.js (v18+)
- npm / pnpm / yarn

### Langkah Instalasi
```bash
# 1. Masuk ke direktori
cd "website game undercover"

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev

# 4. Atau build & preview produksi
npm run build
npm run preview
```

Buka peramban di `http://localhost:5173/` (dev) atau `http://localhost:4173/` (preview).

---

## 🧪 Menjalankan Pengujian Engine

Untuk memverifikasi rasio peran, anti-repeat kata, urutan aturan kemenangan, dan special roles:

```bash
npx tsx src/engine/engine.verify.ts
```
