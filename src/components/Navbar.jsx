import React from 'react';
import logo from '../assets/logo.png'; // Ganti dengan logo Anda

const Navbar = () => {
  // Fungsi untuk scroll ke section
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll agar elemen berada di atas
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo dan teks di sebelah kiri */}
          <div className="flex items-center">
            <img src={logo} alt="DLHK Logo" className="h-12 w-12" />
            <div className="ml-3">
              <span className="font-cardo text-black text-sm font-bold leading-tight">
                DINAS LINGKUNGAN HIDUP DAN KEHUTANAN
              </span>
              <br />
              <span className="font-cardo text-black text-sm">
                DAERAH ISTIMEWA YOGYAKARTA
              </span>
            </div>
          </div>

          {/* Tombol untuk mengarah ke ApplicationSection */}
          <button
            onClick={() => handleScrollToSection('application-section')}
            className="bg-[#6A9C89] text-white px-4 py-2 rounded hover:bg-opacity-80 transition duration-300"
          >
            Aplikasi WebGIS
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
