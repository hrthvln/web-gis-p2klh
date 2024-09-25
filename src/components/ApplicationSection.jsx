import React from 'react';
import { FaWater, FaWind } from 'react-icons/fa';
import { GiWaves } from 'react-icons/gi'; // Import ikon gelombang
import BackgroundImage from '../assets/dlhk-diy.jpg'; // Import gambar latar belakang

const ApplicationSection = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-start justify-between py-16"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0)), 
          linear-gradient(to top right, rgba(50, 89, 57, 0.1), rgba(50, 89, 57, 0)), 
          url(${BackgroundImage})`,
        backgroundBlendMode: 'overlay, overlay, normal',
      }}
    >
      {/* Teks Aplikasi WebGIS di sebelah kiri */}
      <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-15 text-left mt-16 w-1/2 ml-8">
        <h2
          className="text-4xl font-bold text-[#325939] mb-4"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
        >
          Aplikasi WebGIS
        </h2>
        <p className="text-lg text-gray-700">
          Menyediakan berbagai data kualitas air, udara, dan kondisi laut yang dapat diakses secara interaktif.
        </p>
      </div>


      {/* Container untuk Kartu Aplikasi */}
      <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
        {/* Kartu Aplikasi 1 */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
          <div className="bg-white border-2 border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-60">
            <FaWater className="text-3xl text-blue-500 mb-4" /> {/* Ikon Air */}
            <h3 className="text-sm font-semibold mb-2 text-center">Peta Pemantauan Kualitas Air Sungai</h3>
            <button className="bg-[#325939] text-white px-3 py-1 text-sm rounded hover:bg-opacity-80 transition duration-300">
              Buka
            </button>
          </div>
        </div>

        {/* Kartu Aplikasi 2 */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
          <div className="bg-white border-2 border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-60">
            <FaWind className="text-3xl text-green-500 mb-4" /> {/* Ikon Udara */}
            <h3 className="text-sm font-semibold mb-2 text-center">Peta Pemantauan Kualitas Udara</h3>
            <button className="bg-[#325939] text-white px-3 py-1 text-sm rounded hover:bg-opacity-80 transition duration-300">
              Buka
            </button>
          </div>
        </div>

        {/* Kartu Aplikasi 3 */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
          <div className="bg-white border-2 border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-60">
            <GiWaves className="text-3xl text-blue-700 mb-4" /> {/* Ikon Gelombang */}
            <h3 className="text-sm font-semibold mb-2 text-center">Peta Pemantauan Kualitas Air Laut</h3>
            <button className="bg-[#325939] text-white px-3 py-1 text-sm rounded hover:bg-opacity-80 transition duration-300">
              Buka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSection;
