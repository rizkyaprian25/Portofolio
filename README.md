# Muhamad Rizky Aprian — Portofolio Digital

> Aplikasi web portofolio personal dan sistem manajemen konten (CMS) modern yang dirancang dengan presisi tinggi mengadopsi estetika **Apple Minimalist Design System**, **Next.js 14 (App Router)**, **TypeScript**, dan **Tailwind CSS**.

---

## 🌟 Sorotan Utama & Nilai Unggul

Aplikasi ini dibangun bukan sekadar sebagai etalase karya statis, melainkan sebagai produk web berperforma tinggi (*high-craft digital product*) yang memadukan kecepatan akses, keandalan sistem (*defensive resilience*), dan pengalaman interaksi pengguna yang menyenangkan (*delightful micro-interactions*).

- 🎨 **Estetika Apple Human Interface Guidelines (HIG):** Tipografi proporsional, kontras warna yang nyaman di mata, efek *Liquid Glass* (transparansi fungsional dengan *backdrop blur* halus), serta transisi terakselerasi GPU.
- 🌓 **Harmoni Mode Terang & Gelap:** Transisi tema mulus tanpa kedipan (*flicker-free*) dengan persistensi lokal otomatis.
- 🎬 **Showcase Proyek Dual-Media:** Mendukung tampilan visual fleksibel berupa galeri foto beresolusi tinggi maupun video demo interaktif YouTube yang tersemat rapi di dalam modal pratinjau.
- ⌨️ **Command Palette Interaktif (`⌘K` / `Ctrl+K`):** Akses instan untuk mencari proyek, navigasi halaman cepat, membuka dokumen CV, menyalin kontak email, serta beralih tema tampilan melalui pintasan keyboard.
- 🔊 **Audio Haptic Web Audio API:** Efek suara klik dan *pop* sintetis murni menggunakan Web Audio API (0 transfer file eksternal, latensi nol) yang dilengkapi kontrol pembisuan (*mute toggle*).
- 📄 **Curriculum Vitae QuickLook:** Pratinjau dokumen CV PDF langsung di browser tanpa memaksa pengunduhan langsung, dengan opsi unduh satu klik.
- 🛡️ **Panel Admin CMS Terproteksi:** Dashboard pengelolaan portofolio, profil, dan CV dengan pengamanan berlapis:
  - Gerbang URL rahasia (*Secret Path Portal*).
  - Autentikasi 2 langkah: Passcode 6-digit dan kredensial kata sandi ter-hash *bcrypt*.
  - Proteksi *Brute-Force* berbasis *sliding-window rate limiter*.
  - Sesi aman berbasis JSON Web Token (JWT) di dalam cookie `HttpOnly` dan `SameSite`.
  - Penulisan basis data atomik (*atomic file I/O*) pada `database.json` untuk mencegah korupsi file.

---

## 🛠️ Tumpukan Teknologi (*Tech Stack*)

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Bahasa:** [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) dengan palet token Apple semantik
- **Ikonografi:** [Lucide React](https://lucide.dev/) (Bobot stroke seragam & terpadu)
- **Keamanan:** `bcryptjs` (Password Hashing), `jsonwebtoken` (JWT Session Management)
- **Font:** Google Font *Outfit* & *Inter*
- **Basis Data:** Local JSON Data Store dengan Atomic Temporary File Rename

---

## 📁 Struktur Direktori

```text
├── app/                      # Rute Next.js App Router
│   ├── admin/                # Panel CMS Admin dan portal login terlindungi
│   ├── api/                  # REST API Route Handlers (auth, portfolio, profile, cv, upload)
│   ├── projects/             # Halaman arsip lengkap eksplorasi proyek
│   ├── error.tsx             # Global Error Boundary terstruktur
│   ├── not-found.tsx         # Halaman 404 bergaya Apple
│   ├── manifest.ts           # Web App Manifest (PWA Readiness)
│   ├── layout.tsx            # Root Layout, font, dan metadata SEO Schema.org
│   └── page.tsx              # Landing page utama (Hero, Featured, Skills, Timeline)
├── components/               # Komponen Modular
│   ├── admin/                # Komponen CMS (PortfolioManager, ProfileEditor, AdminSidebar)
│   ├── public/               # Komponen Publik (Hero, PortfolioGrid, CommandPalette, Navbar)
│   └── ui/                   # Komponen Primitif Defensif (SafeImage)
├── data/                     # Penyimpanan Data Lokal
│   └── database.json         # Single Source of Truth data portofolio & profil
├── lib/                      # Utilitas Bisnis & Logika Inti
│   ├── audio.ts              # Generator mikro-suara Web Audio API
│   ├── auth.ts               # Pengelolaan sesi JWT & verifikasi kredensial
│   ├── db.ts                 # Operasi baca-tulis file atomik & fallback seed
│   └── rateLimit.ts          # In-memory sliding-window rate limiter
└── public/                   # Aset Statis Lokal (foto studio, gambar proyek, dokumen CV)
```

---

## 🚀 Panduan Memulai (*Getting Started*)

### Prasyarat
- **Node.js** versi 18.17 atau lebih baru
- **npm** versi 9 atau lebih baru

### 1. Kloning Repositori
```bash
git clone https://github.com/rizkyaprian25/Portofolio.git
cd Portofolio
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan nilai konfigurasi kunci rahasia:
```env
JWT_SECRET=rahasia-kunci-enkripsi-jwt-anda-di-sini
NEXT_PUBLIC_SITE_URL=https://muhamadrizkyaprian.dev
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada alamat `http://localhost:3000` untuk melihat aplikasi berjalan.

### 5. Kompilasi Produksi
Untuk memastikan seluruh rute statis dan optimasi bundel lulus tanpa kendala:
```bash
npm run build
npm run start
```

---

## 🔒 Kebijakan Keamanan & Ketahanan Sistem

1. **Defensive UI (`SafeImage`):** Semua gambar dilindungi komponen fallback otomatis untuk mencegah antarmuka rusak (*layout shift*) jika terjadi kegagalan jaringan atau URL eksternal bermasalah.
2. **Atomic Write Data:** Modifikasi basis data pada `database.json` ditulis melalui berkas sementara `.tmp` sebelum di-rename secara instan, menjamin keutuhan data terhadap pemutusan daya/server restart mendadak.
3. **Zero Hardcoded Secrets:** Tidak ada kredensial mentah yang ditanam pada komponen klien. Kunci otentikasi dikendalikan melalui variabel lingkungan terenkripsi.

---

## 👤 Pengembang (*Author*)

**Muhamad Rizky Aprian**
- Website: [muhamadrizkyaprian.dev](https://muhamadrizkyaprian.dev)
- GitHub: [@rizkyaprian25](https://github.com/rizkyaprian25)
- LinkedIn: [Muhamad Rizky Aprian](https://linkedin.com/in/rizkyaprian)
- Email: [rizkyaprian25@gmail.com](mailto:rizkyaprian25@gmail.com)

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT License](LICENSE).
