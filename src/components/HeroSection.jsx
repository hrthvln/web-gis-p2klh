import React from 'react';
import mapDecoration from '../assets/map.png'; // Dekorasi peta untuk Hero Section
import map2Decoration from '../assets/map2.png'; // Dekorasi peta untuk About Section

const HeroSection = () => {
  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-screen bg-white overflow-hidden">
        {/* Konten Hero Section */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-black px-4 sm:px-0">
          <h1 className="font-cardo text-[#325939] text-4xl sm:text-5xl font-bold mb-4"> {/* Ukuran font responsif */}
            SISTEM INFORMASI
          </h1>
          <h2 className="font-cardo text-[#325939] text-3xl sm:text-4xl mb-4">
            PEMANTAUAN LINGKUNGAN HIDUP
          </h2>
          <p className="font-cardo text-black text-base sm:text-lg max-w-3xl mx-auto">
            Dinas Lingkungan Hidup dan Kehutanan DIY menyediakan akses publik terhadap titik pemantauan kualitas air sungai, udara, dan air laut di Daerah Istimewa Yogyakarta melalui sistem WebGIS.
          </p>
        </div>

        {/* Dekorasi Peta di Hero Section */}
        <img
          src={mapDecoration}
          alt="Map Decoration"
          className="absolute bottom-0 right-0 opacity-60 h-24 sm:h-40" /> {/* Tinggi responsif */}
      </div>

      {/* About Section */}
      <div className="relative w-full bg-white overflow-hidden py-12 sm:py-16">
        {/* Dekorasi Map di kiri bawah */}
        <img
          src={map2Decoration}
          alt="Map Decoration"
          className="absolute bottom-0 left-0 opacity-60 h-40 sm:h-60" /> {/* Tinggi responsif */}

        {/* Container untuk teks deskripsi */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Teks Deskripsi */}
          <div className="lg:w-2/3 ml-auto text-justify px-4 sm:px-0">
            <h2 className="text-base sm:text-lg font-normal font-[Cardo] leading-relaxed mb-4">
              Visualisasi geospasial interaktif memungkinkan pemantauan kondisi lingkungan secara akurat, mendukung kebijakan lingkungan yang lebih baik.
            </h2>
            <p className="text-base sm:text-lg font-normal font-[Cardo] leading-relaxed">
              Aplikasi ini dirancang untuk meningkatkan transparansi, memudahkan akses data, serta mendukung upaya perlindungan lingkungan di Daerah Istimewa Yogyakarta (DIY).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
