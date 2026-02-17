const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// KONEKSI MYSQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Kosongkan jika tidak ada password
  database: 'db_mahasiswa'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke MySQL:', err);
    throw err;
  }
  console.log('✅ Backend terkoneksi ke MySQL Laragon!');
});

// ==================== CRUD ENDPOINTS ====================

// 1️⃣ READ - Ambil semua data mahasiswa
app.get('/api/mahasiswa', (req, res) => {
  db.query('SELECT * FROM mahasiswa ORDER BY id DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 2️⃣ CREATE - Tambah mahasiswa baru (DENGAN VALIDASI NIM)
app.post('/api/mahasiswa', (req, res) => {
  const { nim, nama, jurusan, jenis_kelamin } = req.body;

  // Validasi input
  if (!nim || !nama || !jurusan || !jenis_kelamin) {
    return res.status(400).json({
      error: 'Semua field harus diisi!'
    });
  }

  // Cek apakah NIM sudah ada
  db.query('SELECT * FROM mahasiswa WHERE nim = ?', [nim], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // NIM sudah terdaftar
      return res.status(409).json({
        error: `NIM ${nim} sudah terdaftar! Gunakan NIM lain.`
      });
    }

    // Insert data baru
    const query = 'INSERT INTO mahasiswa (nim, nama, jurusan, jenis_kelamin) VALUES (?, ?, ?, ?)';
    db.query(query, [nim, nama, jurusan, jenis_kelamin], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: 'Data berhasil ditambahkan!',
        id: result.insertId
      });
    });
  });
});

// 3️⃣ UPDATE - Edit data mahasiswa (DENGAN VALIDASI NIM)
app.put('/api/mahasiswa/:id', (req, res) => {
  const id = req.params.id;
  const { nim, nama, jurusan, jenis_kelamin } = req.body;

  // Validasi input
  if (!nim || !nama || !jurusan || !jenis_kelamin) {
    return res.status(400).json({
      error: 'Semua field harus diisi!'
    });
  }

  // Cek apakah NIM sudah digunakan mahasiswa lain
  db.query('SELECT * FROM mahasiswa WHERE nim = ? AND id != ?', [nim, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res.status(409).json({
        error: `NIM ${nim} sudah digunakan mahasiswa lain!`
      });
    }

    // Update data
    const query = 'UPDATE mahasiswa SET nim=?, nama=?, jurusan=?, jenis_kelamin=? WHERE id=?';
    db.query(query, [nim, nama, jurusan, jenis_kelamin, id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Data berhasil di-update!' });
    });
  });
});

// 4️⃣ DELETE - Hapus data mahasiswa
app.delete('/api/mahasiswa/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM mahasiswa WHERE id=?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Data berhasil dihapus!' });
  });
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server CRUD aktif di http://localhost:${PORT}`);
});