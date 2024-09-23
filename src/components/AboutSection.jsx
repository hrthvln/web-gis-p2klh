import React from 'react';
import map2Decoration from '../assets/map2.png';      // Dekorasi peta kiri bawah

const AboutSection = () => {
  return (
    <div className="relative w-full h-3/4 bg-white overflow-hidden py-16">
      {/* Dekorasi Map di kiri bawah */}
      <img 
        src={map2Decoration} 
        alt="Map Decoration" 
        className="absolute bottom-0 left-0 opacity-60 h-60" /> {/* 60% opacity */}

      {/* Container untuk teks deskripsi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Teks Deskripsi, posisi teks agak kanan */}
        <div className="text-right lg:text-left lg:w-2/3 ml-auto mr-16">
          <h2 className="text-lg font-normal font-[Cardo] leading-relaxed text-justify mb-4">
            Visualisasi geospasial interaktif memungkinkan pemantauan kondisi lingkungan secara akurat, mendukung kebijakan lingkungan yang lebih baik.
          </h2>
          <p className="text-lg font-normal font-[Cardo] leading-relaxed text-justify">
            Aplikasi ini dirancang untuk meningkatkan transparansi, memudahkan akses data, serta mendukung upaya perlindungan lingkungan di Daerah Istimewa Yogyakarta (DIY).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
