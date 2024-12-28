const tourSteps = [
  {
      target: '.header-river-water',
      content: 'Selamat datang di WebGIS Pemantauan Kualitas Air Sungai DIY. Mari mulai tour kita. :)',
      placement: 'center', // Menyesuaikan letak panduan
    },
    {
      target: '.header-air',
      content: 'Selamat datang di WebGIS Pemantauan Kualitas Udara DIY. Mari mulai tour kita. :)',
      placement: 'center', // Menyesuaikan letak panduan
    },
    {
      target: '.header-sea-water',
      content: 'Selamat datang di WebGIS Pemantauan Kualitas Air Laut DIY. Mari mulai tour kita. :)',
      placement: 'center', // Menyesuaikan letak panduan
    },
    {
      target: '.information-river-water',
      content: 'WebGIS ini memberikan informasi terkait kualitas air sungai di DIY sebanyak 50 titik pemantauan pada setiap periode. Titik pemantauan tersebut meliputi Sungai Code (6 titik), Sungai Gajahwong (8 titik), Sungai Winongo (8 titik), Sungai Bedog (5 titik), Sungai Konteng (4 titik), Sungai Kuning (4 titik), Sungai Tambakbayan (4 titik), Sungai Oyo (4 titik), Sungai Belik (3 titik), Sungai Bulus (2 titik), dan Sungai Opak (2 titik). Selain itu, terdapat informasi Sub DAS dan Nilai Indeks Kualitas Air (IKA).',
      placement: 'center', // Menyesuaikan letak panduan
    },
    {
      target: '.information-air',
      content: 'WebGIS ini memberikan informasi terkait kualitas udara di DIY sebanyak 20 titik pemantauan yang diambil pada setiap kabupaten di DIY. Selain itu, terdapat informasi Nilai Indeks Kualitas Udara (IKU).',
      placement: 'center', // Menyesuaikan letak panduan
    },
    {
      target: '.information-sea-water',
      content: 'WebGIS ini memberikan informasi terkait kualitas air laut di DIY pada tahun 2023, sebanyak 10 titik pemantauan pada setiap periode. Titik pemantauan tersebut meliputi Pantai Jogan, Pantai Krakal, Pantai Baron, Pantai Ngedan, Pantai Parangtritis, Pantai Glagah, Pantai Bugel, Pantai Kuwaru, Pantai Cangkring, Pantai Depok.',
      placement: 'center', // Menyesuaikan letak panduan
    },
    {
      target: '.dropdown-container',
      content: 'Download untuk mengunduh data terkait dengan memilih file terlebih dahulu.',
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
      content: 'Filter tahun untuk memilih data berdasarkan periode tahun.',
      placement: 'top',
    },
    {
      target: '.legend-icon',
      content: 'Legenda untuk menjelaskan simbol pada peta.',
      placement: 'top',
    },
    {
      target: '.leaflet-interactive',
      content: 'Klik pada titik/lokasi di peta untuk melihat informasi.',
      placement: 'center',
    },
    {
      target: '.leaflet-control-zoom',
      content: 'Gunakan tombol ini untuk zoom-in atau zoom-out peta.',
      placement: 'top',
    },
    {
      target: '.leaflet-control-locate',
      content: 'Fitur ini untuk menampilkan lokasi kamu di peta.',
      placement: 'top',
    },
    {
      target: '.leaflet-control-latlng',
      content: 'Bagian ini menunjukkan nilai latitude dan longitude cursor kamu di peta.',
      placement: 'top',
    },
  ];

export default tourSteps;
