# atur-duit

Berikut adalah draf file `README.md` yang detail, bersih, dan profesional untuk aplikasi hitung uang bulanan Anda. File ini sudah disesuaikan dengan teknologi **Vue 3**, **Vite**, dan **Vue Router** (tanpa hash) yang sedang Anda gunakan.

Anda tinggal menyalin kode di bawah ini dan memasukkannya ke dalam file `README.md` di root folder proyek Anda.

---

```markdown
# 💰 Monthly Finance Tracker (Aplikasi Hitung Uang Bulanan)

Aplikasi berbasis web untuk mencatat, mengelola, dan mengalokasikan keuangan bulanan secara personal. Aplikasi ini dirancang menggunakan **Vue 3** dan **Vite** untuk performa yang cepat, ringan, serta antarmuka yang responsif.

## 🚀 Fitur Utama

*   **Dashboard Ringkasan:** Menampilkan total pemasukan, pengeluaran, dan sisa saldo berjalan secara *real-time*.
*   **Pencatatan Transaksi:** Manajemen data pemasukan dan pengeluaran harian/bulanan.
*   **Alokasi Anggaran (Budgeting):** Mengatur batas maksimal pengeluaran berdasarkan kategori (misal: Makanan, Transportasi, Hiburan).
*   **Rekap Keuangan:** Visualisasi data ringkas untuk melihat performa finansial Anda setiap bulan.
*   **Clean URL:** Navigasi modern tanpa tanda `/#/` menggunakan HTML5 History Mode.

---

## 🛠️ Teknologi yang Digunakan

*   **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Routing:** [Vue Router v4](https://router.vuejs.org/) (Web History Mode)
*   **Styling:** *[Sebutkan framework CSS Anda di sini, misal: Tailwind CSS / Bootstrap / Vanilla CSS]*

---

## 💻 Memulai (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat

Pastikan Anda sudah menginstal:
*   [Node.js](https://nodejs.org/) (Versi 18 atau terbaru direkomendasikan)
*   NPM (Bawaan setelah menginstal Node.js) atau Yarn

### Langkah Instalasi

1. **Clone Repositori**
```bash
   git clone [https://github.com/hardypx/aturDuit.git]

```

2. **Instal Dependensi**

```bash
   npm install

```

3. **Jalankan Server Lokal (Development)**

```bash
   npm run dev

```

Buka [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) di browser Anda.

4. **Build untuk Produksi**

```bash
   npm run build

```

Perintah ini akan menghasilkan folder `dist` yang siap di-deploy ke hosting.

---

## 📂 Struktur Folder Proyek

```text
├── src/
│   ├── assets/          # File statis (Gambar, Icon, Global CSS)
│   ├── components/      # Komponen Vue yang reusable
│   ├── router/          # Konfigurasi Vue Router (index.js)
│   ├── views/           # Halaman utama (Dashboard, Transaksi, Rekap, Anggaran)
│   ├── App.vue          # Root component
│   └── main.js          # Entry point aplikasi
├── package.json         # Dependensi dan script project
├── vite.config.js       # Konfigurasi Vite
└── README.md            # Dokumentasi proyek

```

---

## 🌐 Catatan Deployment (PENTING)

Karena aplikasi ini menggunakan **Vue Router dengan Web History Mode** (tanpa tanda `/#/`), Anda wajib menambahkan konfigurasi server agar halaman tidak mengalami **Error 404** saat di-refresh oleh pengguna.

### Jika menggunakan Vercel

Tambahkan file `vercel.json` di root folder Anda:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}

```

### Jika menggunakan Apache (`.htaccess`)

Tambahkan kode berikut pada file `.htaccess` di dalam folder publik:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

---

### 💡 Tips Tambahan untuk GitHub Anda:
1. Ganti `username-anda` dan `nama-repo-anda` pada bagian **Clone Repositori** sesuai dengan akun GitHub Anda.
2. Di bagian **Teknologi yang Digunakan**, isi framework CSS yang Anda pakai (misalnya jika pakai Tailwind CSS, tulis saja Tailwind CSS agar profil repositori Anda terlihat makin rapi).

```
