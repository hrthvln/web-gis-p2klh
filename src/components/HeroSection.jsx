import React from 'react';
import mapDecoration from '../assets/map.png'; // Map decoration image

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Hero section content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-black">
        <h1 className="font-cardo text-[#325939] text-5xl font-bold mb-4"> {/* Font size 50, color #325939 */}
          SISTEM INFORMASI
        </h1>
        <h2 className="font-cardo text-[#325939] text-4xl mb-4"> {/* Font size 40 */}
          PEMANTAUAN LINGKUNGAN HIDUP
        </h2>
        <p className="font-cardo text-black text-lg max-w-3xl mx-auto"> {/* Font size 22 */}
          Dinas Lingkungan Hidup dan Kehutanan DIY menyediakan akses publik terhadap titik pemantauan kualitas air sungai, udara,
          dan air laut di Daerah Istimewa Yogyakarta melalui sistem WebGIS.
        </p>
      </div>

      {/* Map and Batik decorations */}
      <img src={mapDecoration} alt="Map Decoration" className="absolute bottom-0 right-0 opacity-60 h-40" /> {/* 60% opacity */}
    </div>
  );
};

export default HeroSection;
