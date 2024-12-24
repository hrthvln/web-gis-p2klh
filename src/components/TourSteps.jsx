const tourSteps = [
    {
        target: '.header',
        content: 'Selamat datang di WebGIS Pemantauan Kualitas Air Laut DIY',
        placement: 'center', // Menyesuaikan letak panduan
      },
      {
        target: '.information-river-water',
        content: 'WebGIS ini memberikan informasi terkait kualitas air sungai di Daerah Istimewa Yogyakarta sebanyak 50 titik pemantauan pada setiap periode. Titik pemantauan tersebut meliputi Sungai Code (6 titik), Sungai Gajahwong (8 titik), Sungai Winongo (8 titik), Sungai Bedog (5 titik), Sungai Konteng (4 titik), Sungai Kuning (4 titik), Sungai Tambakbayan (4 titik), Sungai Oyo (4 titik), Sungai Belik (3 titik), Sungai Bulus (2 titik), dan Sungai Opak (2 titik). Selain itu, terdapat informasi Sub DAS dan Nilai Indeks Kualitas Air (IKA).',
        placement: 'center', // Menyesuaikan letak panduan
      },
      {
        target: '.information-air',
        content: 'WebGIS ini memberikan informasi terkait kualitas udara di Daerah Istimewa Yogyakarta sebanyak 20 titik pemantauan yang diambil pada setiap kabupaten di DIY. Selain itu, terdapat informasi Nilai Indeks Kualitas Udara (IKU).',
        placement: 'center', // Menyesuaikan letak panduan
      },
      {
        target: '.information-sea-water',
        content: 'WebGIS ini memberikan informasi terkait kualitas air laut di Daerah Istimewa Yogyakarta pada tahun 2023, sebanyak 10 titik pemantauan pada setiap periode. Titik pemantauan tersebut meliputi Pantai Jogan, Pantai Krakal, Pantai Baron, Pantai Ngedan, Pantai Parangtritis, Pantai Glagah, Pantai Bugel, Pantai Kuwaru, Pantai Cangkring, Pantai Depok.',
        placement: 'center', // Menyesuaikan letak panduan
      },
      {
        target: '.dropdown-container',
        content: 'Dapatkan data terkait kualitas air sungai dengan mengunduh setelah memilih file.',
        placement: 'top',
        spotlightClicks: true, // Fitur klik akan difokuskan pada elemen ini
      },
      {
        target: '.layer-icon',
        content: 'Daftar layer untuk menampilkan layer yang tersedia.',
        placement: 'top',
      },
      {
        target: '.year-icon',
        content: 'Filter tahun untuk memilih data berdasarkan periode.',
        placement: 'top',
      },
      {
        target: '.legend-icon',
        content: 'Legenda untuk menjelaskan simbol pada peta.',
        placement: 'top',
      },
      {
        target: '.leaflet-interactive',
        content: 'Klik pada titik di peta untuk melihat informasi lokasi.',
        placement: 'center',
      },
      {
        target: '.leaflet-control-zoom',
        content: 'Gunakan tombol ini untuk zoom-in atau zoom-out peta.',
        placement: 'bottom',
      },
      {
        target: '.leaflet-control-locate',
        content: 'Fitur ini untuk menampilkan lokasi Anda pada peta.',
        placement: 'top',
      },
      {
        target: '.leaflet-control-latlng',
        content: 'Bagian ini menunjukkan nilai latitude dan longitude lokasi Anda di peta.',
        placement: 'top',
      },
    ];
  
  export default tourSteps;
  