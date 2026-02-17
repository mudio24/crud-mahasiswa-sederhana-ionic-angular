import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  listMahasiswa: any[] = [];
  listMahasiswaFiltered: any[] = []; // 🆕 Untuk hasil filter
  searchTerm: string = ''; // 🆕 Keyword pencarian
  
  // Variabel untuk form
  inputNim = '';
  inputNama = '';
  inputProdi = '';
  inputGender = '';
  idEdit: number | null = null;

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // Ambil data dari backend
  loadData() {
    this.api.getMahasiswa().subscribe(res => {
      this.listMahasiswa = res;
      this.listMahasiswaFiltered = res; // 🆕 Copy ke filtered list
      console.log('Data mahasiswa:', res);
    });
  }

  // Simpan data (tambah atau update)
  simpanData() {
    // Validasi: pastikan semua field terisi
    if (!this.inputNim || !this.inputNama || !this.inputProdi || !this.inputGender) {
      this.tampilkanToast('Mohon isi semua field!', 'warning');
      return;
    }

    const data = { 
      nim: this.inputNim,
      nama: this.inputNama, 
      jurusan: this.inputProdi,
      jenis_kelamin: this.inputGender
    };

    if (this.idEdit) {
      // Mode EDIT (Update data yang sudah ada)
      this.api.updateMahasiswa(this.idEdit, data).subscribe({
        next: () => {
          this.tampilkanToast('Data berhasil di-update!', 'success');
          this.resetForm();
          this.loadData();
        },
        error: (err) => {
          this.tampilkanToast(err.error.error || 'Gagal update data', 'danger');
        }
      });
    } else {
      // Mode TAMBAH (Insert data baru)
      this.api.tambahMahasiswa(data).subscribe({
        next: () => {
          this.tampilkanToast('Data berhasil ditambahkan!', 'primary');
          this.resetForm();
          this.loadData();
        },
        error: (err) => {
          this.tampilkanToast(err.error.error || 'Gagal tambah data', 'danger');
        }
      });
    }
  }

  // Isi form dengan data yang mau diedit
  editData(mhs: any) {
    this.idEdit = mhs.id;
    this.inputNim = mhs.nim;
    this.inputNama = mhs.nama;
    this.inputProdi = mhs.jurusan;
    this.inputGender = mhs.jenis_kelamin;
    
    // Scroll ke atas agar form terlihat
    window.scrollTo(0, 0);
  }

  // Kosongkan form
  resetForm() {
    this.idEdit = null;
    this.inputNim = '';
    this.inputNama = '';
    this.inputProdi = '';
    this.inputGender = '';
  }

  // Konfirmasi sebelum hapus
  async konfirmasiHapus(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Yakin ingin menghapus data ini?',
      buttons: [
        { 
          text: 'Batal', 
          role: 'cancel' 
        },
        {
          text: 'Hapus',
          role: 'confirm',
          handler: () => {
            this.api.deleteMahasiswa(id).subscribe(() => {
              this.tampilkanToast('Data berhasil dihapus', 'danger');
              this.loadData();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Tampilkan pesan toast
  async tampilkanToast(pesan: string, warna: string) {
    const toast = await this.toastCtrl.create({
      message: pesan,
      duration: 2000,
      color: warna,
      position: 'bottom'
    });
    await toast.present();
  }

  // 🆕 METHOD UNTUK LIVE SEARCH
  filterMahasiswa(event: any) {
    const keyword = event.target.value.toLowerCase();
    this.searchTerm = keyword;

    if (!keyword) {
      // Jika search kosong, tampilkan semua data
      this.listMahasiswaFiltered = this.listMahasiswa;
    } else {
      // Filter berdasarkan nama atau NIM
      this.listMahasiswaFiltered = this.listMahasiswa.filter(mhs => {
        return (
          mhs.nama.toLowerCase().includes(keyword) ||
          mhs.nim.toLowerCase().includes(keyword) ||
          mhs.jurusan.toLowerCase().includes(keyword)
        );
      });
    }
  }

  // 🆕 METHOD UNTUK PULL TO REFRESH
  handleRefresh(event: any) {
    console.log('Refreshing data...');
    
    this.api.getMahasiswa().subscribe({
      next: (res) => {
        this.listMahasiswa = res;
        this.listMahasiswaFiltered = res;
        
        // Reset search
        this.searchTerm = '';
        
        // Tampilkan toast
        this.tampilkanToast('Data berhasil di-refresh!', 'success');
        
        // Selesaikan animasi refresh
        event.target.complete();
      },
      error: (err) => {
        console.error('Error refresh:', err);
        this.tampilkanToast('Gagal refresh data', 'danger');
        event.target.complete();
      }
    });
  }
}