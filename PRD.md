# PRD — Website Portofolio Pribadi

## 1. Ringkasan
Website portofolio pribadi yang menampilkan profil, karya/proyek, dan CV, dilengkapi panel admin sederhana untuk mengelola konten (tambah/update portofolio dan CV) tanpa perlu ubah kode.

## 2. Tujuan
- Menyediakan halaman personal branding yang profesional untuk ditunjukkan ke calon klien/perekrut.
- Memudahkan pemilik website memperbarui konten portofolio dan CV secara mandiri.

## 3. Target Pengguna
- **Pengunjung publik**: calon klien, HR/recruiter, kolega — melihat profil, karya, dan CV.
- **Admin (pemilik website)**: mengelola konten portofolio dan CV via panel admin.

## 4. Lingkup (Scope)

### 4.1 Front-End (Publik)
| Halaman | Isi |
|---|---|
| **Home / Beranda** | Foto profil, nama, tagline singkat, ringkasan bio, navigasi ke section lain |
| **Tentang Saya (Biodata)** | Foto, biodata lengkap (nama, deskripsi diri, skill, kontak, sosial media) |
| **Portofolio** | Daftar/grid proyek (thumbnail, judul, deskripsi singkat), halaman detail per proyek (deskripsi lengkap, gambar/link demo, teknologi yang dipakai) |
| **CV** | Tampilkan CV (preview) + tombol unduh (download PDF) |
| **Kontak** *(opsional)* | Form kontak / link email, sosial media |

### 4.2 Admin Panel (Kelola Konten)
| Fitur | Deskripsi |
|---|---|
| Login admin | Autentikasi sederhana (username/password) |
| Kelola Biodata | Edit foto, nama, deskripsi, kontak, sosial media |
| Kelola Portofolio | Tambah, edit, hapus proyek (judul, deskripsi, gambar, link, teknologi, tanggal) |
| Kelola CV | Upload/replace file CV (PDF), update tanggal terakhir diperbarui |
| Preview | Lihat perubahan sebelum dipublikasikan *(opsional untuk v1)* |

## 5. Fitur Utama (User Stories)
1. Sebagai **pengunjung**, saya ingin melihat foto dan biodata pemilik agar mengenal profilnya dengan cepat.
2. Sebagai **pengunjung**, saya ingin melihat daftar proyek portofolio agar bisa menilai kemampuan pemilik.
3. Sebagai **pengunjung**, saya ingin melihat detail tiap proyek (deskripsi, gambar, teknologi, link demo).
4. Sebagai **pengunjung**, saya ingin melihat/mengunduh CV pemilik dalam format PDF.
5. Sebagai **admin**, saya ingin login ke panel admin agar hanya saya yang bisa ubah konten.
6. Sebagai **admin**, saya ingin menambah/mengedit/menghapus proyek portofolio tanpa coding.
7. Sebagai **admin**, saya ingin mengganti file CV kapan saja saat ada update.
8. Sebagai **admin**, saya ingin mengedit biodata dan foto profil dari panel admin.

## 6. Struktur Data (Data Model — garis besar)

**Profile**
- nama, tagline, deskripsi/bio, foto_url, email, sosial_media[], skill[]

**Portfolio Item**
- id, judul, deskripsi_singkat, deskripsi_lengkap, gambar[], teknologi[], link_demo, link_repo, tanggal, urutan/featured

**CV**
- file_url (PDF), tanggal_update

**Admin User**
- username, password (hashed)

## 7. Alur Pengguna (User Flow)
**Pengunjung:** Buka website → Home → klik menu Portofolio/CV/Tentang → lihat detail proyek atau unduh CV.

**Admin:** Buka `/admin` → login → pilih menu (Biodata / Portofolio / CV) → tambah/edit/hapus data → simpan → perubahan langsung tampil di front-end.

## 8. Non-Functional Requirements
- **Responsif**: tampil baik di desktop, tablet, mobile.
- **Performa**: loading cepat, gambar teroptimasi (compressed/lazy-load).
- **Keamanan**: admin panel terproteksi login, password ter-hash, upload file dibatasi (tipe & ukuran).
- **SEO dasar**: meta title/description, struktur heading yang benar.
- **Maintainability**: konten dikelola dari database/CMS, bukan hardcode di kode front-end.

## 9. Saran Teknologi *(opsional, bisa disesuaikan)*
- **Front-End**: Next.js / React (atau HTML-CSS-JS statis jika sederhana)
- **Backend & DB**: Node.js + Express, atau pakai CMS headless (Sanity/Strapi) untuk mempercepat fitur kelola konten
- **Storage**: untuk gambar & file CV (misal: Cloudinary, S3, atau folder server)
- **Hosting**: Vercel/Netlify (front-end), Railway/Render (backend jika terpisah)

## 10. Out of Scope (v1)
- Multi-bahasa (bisa jadi fitur tahap 2)
- Komentar/blog
- Multi-user admin (role & permission)

## 11. Kriteria Sukses
- Semua konten (biodata, portofolio, CV) bisa diupdate admin tanpa bantuan developer.
- Website tampil rapi & responsif di berbagai perangkat.
- Waktu update konten (misal tambah 1 proyek baru) < 5 menit lewat admin panel.
