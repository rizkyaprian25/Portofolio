# DESIGN.md — Website Portofolio Pribadi

Dokumen ini adalah turunan teknis dari `PRD.md`, mencakup desain sistem, arsitektur, struktur folder, API, database, dan tampilan (front-end & admin).

---

## 1. Arsitektur Sistem

```
┌─────────────────┐        ┌──────────────────┐        ┌───────────────┐
│   Front-End      │  API   │   Backend/API     │  Query │   Database    │
│  (Publik)        │◄──────►│   (REST/CMS)      │◄──────►│   (DB/CMS)    │
│  Next.js / React │        │   Node/Express     │        │  PostgreSQL/  │
└─────────────────┘        │   atau Strapi/Sanity│        │  Mongo/Sanity │
                            └──────────────────┘        └───────────────┘
                                     ▲
                                     │ Auth
                            ┌──────────────────┐
                            │   Admin Panel     │
                            │  (halaman /admin) │
                            └──────────────────┘
```

- **Front-End (publik)**: render halaman Home, Tentang, Portofolio, CV — mengambil data dari API.
- **Admin Panel**: bagian terpisah (route `/admin`) dengan auth, form CRUD untuk kelola konten.
- **Backend**: menyediakan REST API untuk keduanya, menangani auth & upload file.
- **Database**: menyimpan profile, portfolio items, cv, admin user.

**Pilihan implementasi** (pilih salah satu sesuai kebutuhan):
- **A. Full custom**: Next.js (front + admin) + Express/Node API + PostgreSQL/MongoDB.
- **B. Headless CMS** (lebih cepat dibangun): Next.js front-end + Strapi/Sanity sebagai backend & admin panel siap pakai (mengurangi effort bikin admin dari nol).

Dokumen ini menggunakan pendekatan **A (full custom)** sebagai baseline karena kontrol penuh, tapi struktur data tetap kompatibel bila nanti pindah ke CMS.

---

## 2. Struktur Folder (Next.js, contoh)

```
portfolio-app/
├── app/ (atau pages/)
│   ├── page.tsx                 # Home
│   ├── about/page.tsx           # Tentang Saya
│   ├── portfolio/
│   │   ├── page.tsx             # List portofolio
│   │   └── [slug]/page.tsx      # Detail proyek
│   ├── cv/page.tsx              # Halaman CV
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── layout.tsx           # Layout admin + sidebar
│   │   ├── page.tsx             # Dashboard
│   │   ├── profile/page.tsx     # Edit biodata
│   │   ├── portfolio/
│   │   │   ├── page.tsx         # List + tombol tambah
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── cv/page.tsx          # Upload/replace CV
│   └── api/                     # API routes (jika Next full-stack)
│       ├── auth/...
│       ├── profile/route.ts
│       ├── portfolio/route.ts
│       └── cv/route.ts
├── components/
│   ├── public/                  # Navbar, Footer, ProjectCard, Hero, dll
│   └── admin/                   # Sidebar, FormField, Table, dll
├── lib/                         # db client, auth helper, upload helper
└── public/uploads/              # (jika simpan lokal; idealnya pakai cloud storage)
```

---

## 3. Skema Database

### Table: `profiles`
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/PK | |
| nama | string | |
| tagline | string | |
| bio | text | |
| foto_url | string | |
| email | string | |
| sosial_media | JSON | `[{platform, url}]` |
| skills | JSON | `["React","Node.js",...]` |
| updated_at | timestamp | |

### Table: `portfolio_items`
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/PK | |
| judul | string | |
| slug | string | untuk URL detail |
| deskripsi_singkat | string | ditampilkan di card |
| deskripsi_lengkap | text | ditampilkan di detail |
| gambar | JSON | array URL gambar |
| teknologi | JSON | array string |
| link_demo | string | nullable |
| link_repo | string | nullable |
| featured | boolean | tampil di home atau tidak |
| urutan | int | untuk sorting manual |
| created_at / updated_at | timestamp | |

### Table: `cv`
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/PK | biasanya cukup 1 row |
| file_url | string | link file PDF |
| updated_at | timestamp | |

### Table: `admin_users`
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/PK | |
| username | string | |
| password_hash | string | |
| created_at | timestamp | |

---

## 4. Desain API (REST)

### Publik (read-only)
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/profile` | ambil data biodata |
| GET | `/api/portfolio` | list semua proyek |
| GET | `/api/portfolio/:slug` | detail 1 proyek |
| GET | `/api/cv` | ambil link file CV terbaru |

### Admin (butuh auth token/session)
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/login` | login admin |
| POST | `/api/auth/logout` | logout |
| PUT | `/api/profile` | update biodata |
| POST | `/api/portfolio` | tambah proyek baru |
| PUT | `/api/portfolio/:id` | edit proyek |
| DELETE | `/api/portfolio/:id` | hapus proyek |
| POST | `/api/cv` | upload/replace file CV |
| POST | `/api/upload` | upload gambar (dipakai form portofolio & profile) |

**Auth**: session cookie (httpOnly) atau JWT. Semua endpoint admin di-wrap middleware `requireAuth`.

---

## 5. Desain Tampilan — Front-End (Publik)

### 5.1 Layout Umum
- **Navbar** (sticky): Logo/Nama — Menu: Home, Tentang, Portofolio, CV, Kontak
- **Footer**: sosial media, copyright

### 5.2 Home
```
[ Navbar ]
┌───────────────────────────────┐
│  Foto Profil (bulat/rounded)   │
│  Nama Besar                     │
│  Tagline                        │
│  [Tombol: Lihat Portofolio] [Unduh CV] │
└───────────────────────────────┘
[ Section: Ringkasan bio singkat ]
[ Section: Featured Portfolio (3-4 kartu proyek) ]
[ Footer ]
```

### 5.3 Tentang Saya
```
[ Navbar ]
┌─────────────┬─────────────────────┐
│  Foto        │  Nama                │
│              │  Deskripsi lengkap   │
│              │  Skill (badge/tag)   │
│              │  Kontak & sosmed     │
└─────────────┴─────────────────────┘
[ Footer ]
```

### 5.4 Portofolio (List)
```
[ Navbar ]
Grid card (3 kolom desktop / 1 kolom mobile):
┌───────────┐ ┌───────────┐ ┌───────────┐
│ thumbnail  │ │ thumbnail  │ │ thumbnail  │
│ judul      │ │ judul      │ │ judul      │
│ deskripsi..│ │ deskripsi..│ │ deskripsi..│
│ [Lihat →]  │ │ [Lihat →]  │ │ [Lihat →]  │
└───────────┘ └───────────┘ └───────────┘
[ Footer ]
```

### 5.5 Detail Proyek
```
[ Navbar ]
Judul Proyek
Galeri gambar (carousel/grid)
Deskripsi lengkap
Teknologi: [tag] [tag] [tag]
[Tombol: Lihat Demo] [Lihat Repo]
[ Footer ]
```

### 5.6 CV
```
[ Navbar ]
Judul: "Curriculum Vitae"
Preview PDF (embed) atau ringkasan CV
[Tombol: Unduh CV (PDF)]
Terakhir diperbarui: dd/mm/yyyy
[ Footer ]
```

---

## 6. Desain Tampilan — Admin Panel

### 6.1 Login
```
┌───────────────────────┐
│      Login Admin       │
│  Username [________]   │
│  Password [________]   │
│      [ Login ]         │
└───────────────────────┘
```

### 6.2 Layout Admin (setelah login)
```
┌──────────┬───────────────────────────────┐
│ Sidebar  │  Konten (sesuai menu aktif)     │
│ - Dashboard │                              │
│ - Biodata │                                │
│ - Portofolio │                             │
│ - CV      │                                │
│ - Logout  │                                │
└──────────┴───────────────────────────────┘
```

### 6.3 Dashboard
- Ringkasan: jumlah proyek, tanggal CV terakhir update, tombol pintasan "+ Tambah Proyek".

### 6.4 Kelola Biodata
```
Form:
- Upload Foto (preview)
- Nama
- Tagline
- Bio (textarea)
- Email
- Sosial Media (list dinamis: tambah/hapus baris platform+url)
- Skills (input tag)
[ Simpan Perubahan ]
```

### 6.5 Kelola Portofolio
**List:**
```
Tabel: Judul | Featured | Urutan | Aksi (Edit/Hapus)
[ + Tambah Proyek Baru ]
```
**Form Tambah/Edit:**
```
- Judul
- Slug (auto dari judul, bisa diedit)
- Deskripsi Singkat
- Deskripsi Lengkap (rich text/textarea)
- Upload Gambar (multi)
- Teknologi (input tag)
- Link Demo
- Link Repo
- Featured? (toggle)
- Urutan (angka)
[ Simpan ] [ Batal ]
```

### 6.6 Kelola CV
```
- File CV saat ini: [nama_file.pdf] [Lihat]
- Upload file baru (PDF only, max 5MB)
[ Simpan / Replace ]
- Terakhir diperbarui: dd/mm/yyyy
```

---

## 7. Validasi & Batasan
- Upload gambar: format jpg/png/webp, maks 2MB per file.
- Upload CV: format PDF, maks 5MB.
- Field wajib: nama, tagline, minimal 1 foto profil; judul & deskripsi singkat untuk tiap proyek.
- Slug proyek harus unik (auto-generate + cek duplikat).

---

## 8. Komponen UI Reusable
- `Navbar`, `Footer`
- `ProjectCard`, `ProjectGallery`
- `TagBadge` (untuk skill/teknologi)
- `Button` (primary/secondary)
- `AdminSidebar`, `AdminTable`, `FormField`, `ImageUploader`, `ConfirmDialog` (untuk hapus data)

---

## 9. Rencana Pengembangan (Milestone)
1. **Setup project** — Next.js + struktur folder + koneksi DB.
2. **Front-end statis** — Home, Tentang, Portofolio (dummy data), CV.
3. **Backend API** — endpoint publik (GET) dahulu, hubungkan ke front-end.
4. **Admin auth** — login & proteksi route `/admin`.
5. **Admin CRUD** — Biodata, Portofolio, CV.
6. **Upload file** — gambar & PDF (local/cloud storage).
7. **Polish & responsif** — styling, testing di mobile.
8. **Deploy** — front-end ke Vercel, backend/DB ke Railway/Render (atau all-in-one jika pakai Next full-stack).
