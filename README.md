# Analisis Kompleksitas Algoritma: Iteratif vs Rekursif

## 👤 Developer
**Anugrah Panji Pradipa (103012580014)** 
## Anggota Kelompok
* **Muhammad Bintang R.F (103012580052)** 
* **Giyats Almanfalutti (103012580054)** 

Aplikasi berbasis web ini dikembangkan untuk memvisualisasikan dan membandingkan performa (Time Complexity) antara pendekatan **Iteratif** dan **Rekursif** dalam kasus pencarian nilai (Min/Max) dan pengurutan data (Sorting).

Dibuat menggunakan **React** dan **Tailwind CSS**.

---

## 📋 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Instalasi dan Menjalankan Aplikasi](#-instalasi-dan-menjalankan-aplikasi)
3. [Petunjuk Penggunaan](#-petunjuk-penggunaan)
4. [Penjelasan Algoritma](#-penjelasan-algoritma)
   - [Pencarian Min/Max](#1-pencarian-minmax)
   - [Pengurutan (Sorting)](#2-pengurutan-sorting)

---

## 🚀 Fitur Utama
* **Generate Data:** Pembuatan data acak hingga 10.000+ elemen secara instan.
* **Benchmarking Real-time:** Mengukur waktu eksekusi algoritma dalam milidetik (`performance.now()`).
* **Visualisasi Grafik:** Bar chart untuk membandingkan kecepatan algoritma secara visual.
* **History & Rata-rata:** Menyimpan riwayat pengujian dan menghitung rata-rata performa untuk akurasi data yang lebih baik.

---

## 💻 Instalasi dan Menjalankan Aplikasi

Pastikan Anda telah menginstal **Node.js** di komputer Anda.

1.  **Clone atau Download** repository ini.
2.  Buka terminal di folder project.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Jalankan aplikasi:
    ```bash
    npm run dev
    ```
5.  Buka browser dan akses `http://localhost:5173` (atau port yang tertera di terminal).

---

## 📖 Petunjuk Penggunaan

1.  **Input Data:**
    * Gunakan tombol **Generate Random Data** (100, 5000, dst) untuk membuat data uji secara otomatis.
    * Atau, ketik angka manual di kolom input (pisahkan dengan koma).
2.  **Mulai Pengujian:**
    * Klik tombol **"MULAI UJI PERFORMA"**.
    * Tunggu hingga proses perhitungan selesai (tombol akan kembali aktif).
3.  **Analisis Hasil:**
    * Lihat panel ringkasan untuk mengetahui nilai Min/Max dan sampel data terurut.
    * Perhatikan **Chart Card** untuk membandingkan durasi waktu eksekusi.
4.  **Riwayat & Rata-rata:**
    * Setiap kali tombol ditekan, hasil akan masuk ke **Tabel Riwayat**.
    * Klik tombol **"PILIH N"** pada tabel untuk melihat grafik rata-rata dari seluruh percobaan pada jumlah data tersebut.

---

## 🧠 Penjelasan Algoritma

Aplikasi ini membandingkan dua kategori algoritma:

### 1. Pencarian Min/Max

Tujuannya adalah mencari nilai terbesar dan terkecil dalam sebuah array.

#### a. Iteratif (Linear Scan)
* **Cara Kerja:** Menggunakan perulangan (`for loop`). Algoritma menganggap elemen pertama adalah min/max, lalu membandingkannya satu per satu dengan elemen berikutnya hingga akhir array.
* **Kompleksitas Waktu:** O(N) - Linear. Waktu proses berbanding lurus dengan jumlah data.
* **Kelebihan:** Hemat memori (Space Complexity O(1)).

#### b. Rekursif (Divide and Conquer)
* **Cara Kerja:** Array dibagi menjadi dua bagian secara terus menerus hingga tersisa 1 atau 2 elemen. Kemudian, nilai min/max dari bagian kiri dan kanan dibandingkan (conquer) saat "naik" kembali dari rekursi.
* **Kompleksitas Waktu:** O(N). Meskipun divide & conquer, setiap elemen tetap harus dikunjungi.
* **Kekurangan:** Memakan memori Stack (O(\log N)) karena tumpukan pemanggilan fungsi. Biasanya lebih lambat dari iteratif pada JavaScript karena *overhead* fungsi.

---

### 2. Pengurutan (Sorting)

Tujuannya adalah mengurutkan array dari nilai terkecil ke terbesar.

#### a. Bubble Sort (Iteratif)
* **Cara Kerja:** Membandingkan elemen yang bersebelahan. Jika elemen kiri lebih besar dari kanan, posisinya ditukar. Proses ini diulang berkali-kali hingga tidak ada lagi penukaran.
* **Kompleksitas Waktu:** O(N^2) - Kuadratik.
* **Analisis:** Sangat lambat untuk data besar. Jika data bertambah 10x lipat, waktu proses bisa bertambah 100x lipat.

#### b. Merge Sort (Rekursif)
* **Cara Kerja:** Menggunakan prinsip *Divide and Conquer*.
    1.  **Divide:** Array dipecah menjadi dua bagian terus menerus hingga tersisa 1 elemen per bagian.
    2.  **Conquer/Merge:** Bagian-bagian kecil tersebut digabungkan kembali. Saat menggabungkan, algoritma membandingkan elemen dan menyusunnya dalam urutan yang benar.
* **Kompleksitas Waktu:** O(N \log N) - Log-linear.
* **Analisis:** Jauh lebih cepat dan stabil dibanding Bubble Sort untuk data besar.

---

## 📊 Ringkasan Perbandingan

| Algoritma | Tipe | Time Complexity (Avg) | Keterangan |
| :--- | :--- | :--- | :--- |
| **MaxMin Iteratif** | Loop | O(N) | Cepat & Hemat Memori |
| **MaxMin Rekursif** | Rekursi | O(N) | Overhead pada Call Stack |
| **Bubble Sort** | Iteratif | O(N^2) | Sangat Lambat untuk N besar |
| **Merge Sort** | Rekursi | O(N \log N) | Sangat Cepat & Efisien |