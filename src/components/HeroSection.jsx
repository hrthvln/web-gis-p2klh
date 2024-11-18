import React from 'react';
import mapDecoration from '../assets/map.png'; // Dekorasi peta untuk Hero Section
import map2Decoration from '../assets/map2.png'; // Dekorasi peta untuk About Section

const HeroSection = () => {
  return (
    <div className="relative w-full bg-white">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen bg-white flex items-center overflow-hidden">
        {/* Teks Hero Section */}
        <div className="text-left px-10 sm:px-16 lg:px-16 max-w-lg lg:max-w-3xl">
          <h1 className="font-cardo text-[#16423C] text-3xl sm:text-5xl font-bold mb-4">
            SISTEM INFORMASI
          </h1>
          <h2 className="text-[#16423C] text-1xl sm:text-3xl font-bold mb-7">
            PEMANTAUAN MUTU AIR DAN UDARA
          </h2>
          <p className="font-cardo text-black text-lg sm:text-lg max-w-xl mb-2 text-justify">
            Dinas Lingkungan Hidup dan Kehutanan DIY menyediakan akses publik terhadap titik pemantauan kualitas air sungai, udara, dan air laut di Daerah Istimewa Yogyakarta.
          </p>
        </div>

        {/* Dekorasi Gambar 1 */}
        <img
          src={mapDecoration}
          alt="Map Decoration"
          className="absolute bottom-0 right-0 opacity-60 h-90"
        />
      </div>

      {/* About Section */}
      <div className="relative w-full min-h-screen bg-white py-12 sm:py-16 flex items-center">
        {/* Dekorasi Gambar 2 */}
        <img
          src={map2Decoration}
          alt="Map Decoration"
          className="absolute bottom-0 left-0 opacity-60 h-90"
        />

        {/* Teks About Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-end w-full">
          <div className="lg:w-1/2 text-left lg:pl-16 lg:pr-8">
            <h2 className="font-cardo text-[#16423C] text-1xl sm:text-3xl font-bold mb-7">
              Visualisasi geospasial interaktif—
            </h2>
            <p className="font-cardo text-black text-lg sm:text-lg max-w-xl mb-3 text-justify">
              menggambarkan pemantauan mutu air dan lingkungan secara akurat dalam mendukung perlindungan dan pengelolaan lingkungan hidup.
            </p>
            <p className="font-cardo text-black text-lg sm:text-lg max-w-xl text-justify">
              Aplikasi ini dirancang untuk memudahkan akses data dalam menginformasikan mutu air dan udara di Daerah Istimewa Yogyakarta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
