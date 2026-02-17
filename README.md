# 🎓 Sistem CRUD Mahasiswa

Aplikasi **CRUD (Create, Read, Update, Delete)** data mahasiswa berbasis web menggunakan **Ionic Angular** sebagai frontend dan **Express.js + MySQL** sebagai backend REST API.

> 📚 Tugas Mata Kuliah: **Pemrograman Bergerak** — Pertemuan 10 & 11

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Arsitektur](#-arsitektur)
- [Prasyarat](#-prasyarat)
- [Instalasi & Menjalankan](#-instalasi--menjalankan)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)

---

## ✨ Fitur

| Fitur | Keterangan |
|---|---|
| ➕ **Create** | Tambah data mahasiswa baru dengan validasi NIM unik |
| 📖 **Read** | Menampilkan daftar seluruh mahasiswa |
| ✏️ **Update** | Edit data mahasiswa yang sudah ada |
| 🗑️ **Delete** | Hapus data mahasiswa dengan konfirmasi |
| 🔍 **Live Search** | Pencarian real-time berdasarkan nama, NIM, atau prodi |
| 🔄 **Pull to Refresh** | Tarik ke bawah untuk memuat ulang data |
| 📊 **Statistik** | Menampilkan jumlah total, laki-laki, dan perempuan |
| 🎨 **UI Modern** | Tampilan premium dengan gradient, animasi, dan card-based layout |

---

## 🛠️ Teknologi

### Frontend (`client-crud`)

| Teknologi | Versi | Fungsi |
|---|---|---|
| Ionic Framework | 8.x | UI Components & Mobile Framework |
| Angular | 20.x | Frontend Framework |
| TypeScript | 5.9 | Bahasa Pemrograman |
| Capacitor | 8.x | Native Bridge (opsional) |
| SCSS | - | Styling |

### Backend (`server-crud`)

| Teknologi | Versi | Fungsi |
|---|---|---|
| Node.js | 22.x | Runtime JavaScript |
| Express.js | 5.x | Web Framework / REST API |
| MySQL2 | 3.x | Database Driver |
| CORS | 2.x | Cross-Origin Resource Sharing |
| Body-Parser | 2.x | Parsing Request Body |

---

## 🏗️ Arsitektur

```
┌─────────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Ionic Angular      │  HTTP   │   Express.js     │  MySQL   │  Database   │
│   (localhost:8100)   │ ──────► │  (localhost:3000) │ ───────► │  db_mahasiswa│
│                      │ ◄────── │                  │ ◄─────── │             │
│  • Form Input        │  JSON   │  GET    /api/mhs │  Query   │  mahasiswa  │
│  • Daftar Mahasiswa  │         │  POST   /api/mhs │          │  ─ id       │
│  • Search & Filter   │         │  PUT    /api/mhs │          │  ─ nim      │
│  • Pull to Refresh   │         │  DELETE /api/mhs │          │  ─ nama     │
│  • Statistik         │         │                  │          │  ─ jurusan  │
└─────────────────────┘         └──────────────────┘         └─────────────┘
```

---

## 📌 Prasyarat

Pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [MySQL](https://www.mysql.com/) — bisa menggunakan **Laragon**, **XAMPP**, atau MySQL langsung
- [Ionic CLI](https://ionicframework.com/docs/cli) — install via:
  ```bash
  npm install -g @ionic/cli
  ```

---

## 🚀 Instalasi & Menjalankan

### 1️⃣ Siapkan Database

Buka MySQL (phpMyAdmin / terminal / Laragon), lalu jalankan query berikut:

```sql
CREATE DATABASE db_mahasiswa;

USE db_mahasiswa;

CREATE TABLE mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  jurusan VARCHAR(100) NOT NULL,
  jenis_kelamin CHAR(1) NOT NULL
);
```

> ⚠️ Konfigurasi koneksi database ada di `server-crud/server.js`. Sesuaikan `host`, `user`, `password`, dan `database` jika diperlukan.

### 2️⃣ Jalankan Backend (Terminal 1)

```bash
# Masuk ke folder server
cd server-crud

# Install dependencies
npm install

# Jalankan server
node server.js
```

Jika berhasil:
```
🚀 Server CRUD aktif di http://localhost:3000
✅ Backend terkoneksi ke MySQL Laragon!
```

### 3️⃣ Jalankan Frontend (Terminal 2)

```bash
# Masuk ke folder client
cd client-crud

# Install dependencies
npm install

# Jalankan Ionic dev server
ionic serve
```

Browser akan otomatis terbuka di **http://localhost:8100**

> 💡 **Penting:** Kedua terminal harus tetap berjalan bersamaan!

---

## 📁 Struktur Proyek

```
ionic-crud/
├── client-crud/                    # Frontend (Ionic Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── home/
│   │   │   │   ├── home.page.ts        # Logika halaman utama (CRUD)
│   │   │   │   ├── home.page.html      # Template UI
│   │   │   │   └── home.page.scss      # Styling halaman
│   │   │   ├── services/
│   │   │   │   └── api.service.ts      # Service HTTP untuk komunikasi API
│   │   │   ├── app.component.ts        # Root component
│   │   │   └── app.routes.ts           # Konfigurasi routing
│   │   ├── theme/
│   │   │   └── variables.scss          # Variabel tema warna
│   │   ├── global.scss                 # Style global
│   │   ├── main.ts                     # Bootstrap aplikasi
│   │   └── index.html                  # Entry point HTML
│   ├── package.json
│   └── angular.json
│
├── server-crud/                    # Backend (Express.js)
│   ├── server.js                       # Server utama + CRUD endpoints
│   └── package.json
│
└── README.md                       # Dokumentasi ini
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Deskripsi | Body (JSON) |
|---|---|---|---|
| `GET` | `/api/mahasiswa` | Ambil semua data mahasiswa | - |
| `POST` | `/api/mahasiswa` | Tambah mahasiswa baru | `{ nim, nama, jurusan, jenis_kelamin }` |
| `PUT` | `/api/mahasiswa/:id` | Update data mahasiswa | `{ nim, nama, jurusan, jenis_kelamin }` |
| `DELETE` | `/api/mahasiswa/:id` | Hapus data mahasiswa | - |

### Contoh Request

**Tambah Mahasiswa (POST)**
```json
{
  "nim": "2201001",
  "nama": "Ahmad Fauzi",
  "jurusan": "Teknik Informatika",
  "jenis_kelamin": "L"
}
```

**Response Sukses:**
```json
{
  "message": "Data berhasil ditambahkan!",
  "id": 1
}
```

**Response Error (NIM duplikat):**
```json
{
  "error": "NIM 2201001 sudah terdaftar! Gunakan NIM lain."
}
```

---

## 📸 Screenshot

### Tampilan Utama
Aplikasi menampilkan form input data mahasiswa di bagian atas, statistik (total, laki-laki, perempuan), dan daftar mahasiswa dengan fitur search dan swipe actions.

### Fitur Utama
- **Header gradient** purple dengan judul dan subtitle
- **Stat cards** menampilkan jumlah mahasiswa secara real-time
- **Form card** dengan input NIM, nama, program studi (dropdown), dan gender selector
- **Student list** dengan avatar inisial, chip badges berwarna, dan swipe-to-action
- **Live search** untuk pencarian cepat

---

## ❓ Troubleshooting

| Masalah | Solusi |
|---|---|
| `Gagal koneksi ke MySQL` | Pastikan MySQL aktif (Laragon/XAMPP), cek `host`, `user`, `password` di `server.js` |
| Data tidak muncul di browser | Pastikan `node server.js` sedang berjalan di terminal |
| `EADDRINUSE: port 3000` | Port sudah dipakai, matikan proses lain atau ubah `PORT` di `server.js` |
| `npm install` error | Hapus folder `node_modules` dan `package-lock.json`, lalu jalankan ulang `npm install` |
| Tampilan tidak berubah | Hard refresh browser dengan `Ctrl + Shift + R` |

---

## 👨‍💻 Dibuat Untuk

Tugas Mata Kuliah **Pemrograman Bergerak** — Semester 7  
Pertemuan 10 & 11: Implementasi CRUD dengan Ionic Angular dan Express.js
