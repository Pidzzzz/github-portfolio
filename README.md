<div align="center">

# 🗂️ Rak Proyek — GitHub Portfolio

**Website portofolio/showcase repositori GitHub yang modern, luwes, dan interaktif.**

Dirancang dengan prinsip **human-centric & fluid design**: tata letak asimetris yang
bernapas, tipografi emosional, gerakan natural, warna hangat, dan mikro-copy yang ramah —
bukan templat korporat.

[![Build](https://img.shields.io/badge/build-passing-4d7c6f?style=flat-square&logo=vite)](#-fitur)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ee4c9c?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-MIT-6d4bc9?style=flat-square)](LICENSE)

[✨ Fitur](#-fitur) · [🚀 Menjalankan](#-menjalankan) · [📁 Struktur](#-struktur) · [📝 Catatan Teknis](#-catatan-teknis)

</div>

---

Website portofolio/showcase repositori GitHub yang modern, luwes, dan
interaktif. Dirancang dengan prinsip **human-centric & fluid design**:
tata letak asimetris yang bernapas, tipografi emosional, gerakan natural,
warna hangat, dan mikro-copy yang ramah.

## ✨ Fitur

### 1. Integrasi GitHub API
- Menarik daftar repo publik secara dinamis dari GitHub REST API.
- Menampilkan **nama, deskripsi, bintang, fork, bahasa, topik, dan waktu update**.
- Memakai token `VITE_GITHUB_TOKEN` bila tersedia (5.000 req/jam), tanpa token
  tetap jalan (60 req/jam).
- **Selalu punya jaring pengaman**: bila API gagal / kena rate limit, data
  lokal di `src/data/fallback.js` ditampilkan otomatis — halaman tidak pernah
  kosong.

### 2. Live Preview System ⭐
- **Modal pratinjau langsung** berbingkai jendela browser (bilah alamat,
  titik lampu, tombol muat ulang).
- URL preview diambil dari `homepage` repo, lalu **GitHub Pages** bila
  `has_pages` aktif → otomatis terbuka di iframe.
- Tab **"Tentang"**: README hasil render GitHub + meta repo.
- **Fallback preview** ketika tidak ada tautan live: **visualizer kode animasi**
  yang barisnya dibangun deterministik dari nama repo & bahasanya, plus kartu
  informasi repo.
- Pesan yang manusiawi ketika situs memblokir embed ("buka langsung" → tab baru).

### 3. Filter & Pencarian Responsif
- Pencarian **real-time** berdasarkan nama, deskripsi, bahasa, atau topik.
- Chip filter: **Semua · Unggulan · Web Apps · Tools/Scripts · Bot & Otomasi ·
  Lainnya** — lengkap dengan jumlah tiap kategori.
- Kategori ditentukan otomatis dari topik + kata kunci deskripsi.
- Empty state dengan bahasa ramah + tombol reset.

### 4. Gaya Human-Centric & Fluid
| Prinsip | Penerapan |
| --- | --- |
| Warna hangat | Off-white `#f6f4f0` (terang) / slate `#15171c` (gelap) — tanpa `#000`/`#fff` mentah |
| Subtle gradients & soft shadows | Blob gradien blur, `shadow-soft` / `shadow-lift` berlapis |
| Radius organik | `radius-organic` (`28px 28px 28px 8px`), sudut campuran tajam–lengkung |
| Layout bernapas | Grid asimetris: kartu pertama melebar 2 kolom, sisanya bergeser selang-seling |
| Tipografi emosional | **Fraunces** (display/serif) + **Plus Jakarta Sans** (teks) |
| Motion natural | Easing `cubic-bezier(0.22, 1, 0.36, 1)`, spring Framer Motion, hover `scale-[1.01]` + `y: -6` |
| Mikro-copy ramah | Loading, empty, dan error memakai bahasa manusiawi |
| Aksesibilitas | `prefers-reduced-motion`, fokus terlihat, label ARIA, Escape menutup modal |

## 🛠️ Stack

- **React 19** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Framer Motion 12** — layout animation, spring, entrance/exit
- Tanpa dependensi ikon/markdown eksternal (SVG inline sendiri)

## 🚀 Menjalankan

```bash
# 1. pasang dependensi
npm install

# 2. (opsional) salin konfigurasi lalu isi token
cp .env.example .env.local

# 3. jalankan
npm run dev          # → http://localhost:5199

npm run build        # build produksi ke dist/
npm run preview      # pratinjau build di http://localhost:4180
```

> 💡 Port dev disengaja **5199** (bukan 5173) karena port 5173 di mesin ini
> sudah dipakai proyek lain. Ubah di `vite.config.js` bila perlu.

### Environment Variables

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `VITE_GITHUB_TOKEN` | *(kosong)* | PAT GitHub untuk menaikkan rate limit |
| `VITE_GITHUB_USERNAME` | `Pidzzzz` | Username sumber data |

> ⚠️ Nilai `VITE_*` ikut ter-bundle ke JavaScript klien saat build. Jangan
> pakai token berskopes repository **private** untuk deployment publik.
> `.env.local` sudah masuk `.gitignore`.

## 📁 Struktur

```text
github-portfolio/
├── index.html                  # shell + anti-flash tema + Google Fonts
├── vite.config.js
├── .env.example
├── scripts/
│   └── gen-fallback.mjs        # regenerate src/data/fallback.js dari data/_repos_raw.json
├── data/
│   └── _repos_raw.json         # snapshot data repo (input generator fallback)
└── src/
    ├── main.jsx
    ├── App.jsx                 # komposisi + state pencarian/filter
    ├── index.css               # token warna, tema gelap, utilitas, README styling
    ├── data/
    │   ├── categories.js       # aturan kategori, filter, hitungan
    │   └── fallback.js         # data cadangan (auto-generate)
    ├── hooks/
    │   ├── useGithub.js        # fetch profil + repo + status
    │   └── useTheme.js         # tema gelap/terang + persistensi
    ├── utils/
    │   ├── github.js           # klien API, sanitasi HTML, preview URL, warna bahasa
    │   └── format.js           # angka, waktu relatif, ukuran
    └── components/
        ├── Header.jsx          # nav melayang + toggle tema
        ├── Hero.jsx            # hero asimetris + kartu profil miring
        ├── Toolbar.jsx         # pencarian + chip kategori
        ├── RepoGrid.jsx        # grid asimetris + empty state + skeleton
        ├── RepoCard.jsx        # kartu repo (mode normal & lebar)
        ├── PreviewModal.jsx    # ⭐ live preview iframe + tab "Tentang"
        ├── CodeVisualizer.jsx  # fallback visualisasi kode animasi
        ├── NoticeBanner.jsx    # pita pemberitahuan ramah
        ├── Footer.jsx
        └── Icon.jsx            # ikon SVG inline
```

## 🔄 Menyegarkan Data Cadangan

```bash
# 1. simpan daftar repo terbaru ke data/_repos_raw.json
#    (mis. via: gh api "users/Pidzzzz/repos?per_page=100&sort=updated" > data/_repos_raw.json)
# 2. lalu:
node scripts/gen-fallback.mjs
```

## 📝 Catatan Teknis

- **Keamanan HTML**: README yang dirender GitHub melewati penyaring lapis-kedua
  (`sanitizeHtml`) sebelum `dangerouslySetInnerHTML` — `<script>`/`<iframe>`
  dan atribut `on*` dibuang.
- **Sandbox iframe**: `allow-scripts allow-same-origin allow-forms
  allow-modals allow-popups` — cukup untuk demo, tidak membuka navigasi top.
- **Anti-kedip tema**: kelas `.dark` diterapkan oleh skrip inline di
  `index.html` *sebelum* paint pertama.
- **Aksesibilitas**: seluruh animasi dimatikan pada
  `prefers-reduced-motion: reduce`.
