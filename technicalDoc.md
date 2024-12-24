# 📍 WebGIS untuk Monitoring Kualitas Lingkungan DIY

Aplikasi ini adalah peta interaktif berbasis **React.js** dan **Leaflet.js** untuk memantau kualitas lingkungan di Yogyakarta, seperti udara, air sungai, dan air laut.

---

## 🗺️ 1. Pendahuluan

**Tujuan:**
- Menyediakan visualisasi data lingkungan secara interaktif.
- Mendukung pengambilan keputusan berbasis data oleh DLHK DIY.

**Fitur Utama:**
- Visualisasi peta interaktif menggunakan **Leaflet.js**.
- Filter data berdasarkan tahun, kategori, dan wilayah.
- Dukungan upload file **GeoJSON** (opsional).

---

## 🗂️ 2. Struktur Proyek

```plaintext
/webgis-project
├── /src
│   ├── /components  -> Komponen Reusable (Header, Footer, MapContainer)
│   ├── /pages       -> Halaman utama (LandingPage, WebGISAirSungai, dll.)
│   ├── /assets      -> File statis (gambar, ikon)
│   ├── /utils       -> Fungsi utilitas (parseGeoJSON.js, helpers.js)
│   └── index.js     -> Entry point aplikasi
├── /public
│   ├── /data        -> File GeoJSON statis
│   └── index.html   -> Template HTML utama
└── package.json     -> Konfigurasi dependensi

---


## 🖥️ 3. **Cara Menjalankan Aplikasi**
Clone repository:

bash
Salin kode
git clone <repository_url>
cd webgis-project
Install dependencies:

bash
Salin kode
npm install
Jalankan aplikasi:

bash
Salin kode
npm start
Akses di browser:

arduino
Salin kode
http://localhost:3000
🛠️ 4. Panduan Pengembang
a. Menambahkan Layer GeoJSON Baru
Tambahkan file GeoJSON ke folder /public/data/geojson/.

Contoh kode untuk menampilkan layer GeoJSON:

javascript
Salin kode
import { GeoJSON } from 'react-leaflet';

const MapContainer = () => {
  const geojsonData = { /* Data GeoJSON */ };

  return (
    <GeoJSON data={geojsonData} style={{ color: 'blue' }} />
  );
};
b. Menambahkan Filter
Tambahkan filter di src/components/FilterBar.js. Pastikan filter tersebut memengaruhi data GeoJSON di peta.

👩‍💻 5. Panduan Pengguna
a. Cara Menggunakan Peta
Navigasi Peta:

Drag untuk memindahkan.
Scroll untuk zoom in/zoom out.
Memilih Layer:

Gunakan panel di sisi kiri untuk memilih data yang ingin ditampilkan.
b. Mengunggah File GeoJSON (Jika Didukung)
Klik tombol Upload Data.
Pilih file GeoJSON.
Klik Submit.
c. Masalah Umum
Peta tidak muncul: Refresh browser atau pastikan koneksi internet stabil.
🌐 6. Hosting dan Deployment
a. Build Aplikasi
Untuk menghasilkan file build siap hosting:

bash
Salin kode
npm run build
b. Hosting di Netlify
Login ke Netlify.
Upload folder /build melalui dashboard.
c. Update Data GeoJSON
Ganti file di folder /public/data/geojson/.
Deploy ulang aplikasi.
🛠️ 7. Troubleshooting
a. Layer Tidak Muncul
Masalah: GeoJSON tidak valid.
Solusi: Periksa file GeoJSON di https://geojsonlint.com/.

b. Performa Lambat
Masalah: Terlalu banyak data dalam GeoJSON.
Solusi: Simplifikasi GeoJSON menggunakan Mapshaper.

❓ 8. FAQ
Q: Apa itu GeoJSON?
A: Format file geografis untuk menyimpan data spasial (misalnya titik, garis, atau area).

Q: Apa browser yang didukung?
A: Chrome, Firefox, Edge, dan Safari.

📜 9. Lisensi
Proyek ini dilisensikan di bawah MIT License. Silakan gunakan, ubah, atau distribusikan aplikasi ini sesuai ketentuan.

yaml
Salin kode

---

Dokumentasi ini dirancang agar mudah digunakan oleh pengembang maupun staf non-teknis. Jika Anda me