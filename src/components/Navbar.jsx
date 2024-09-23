import React, { useState } from 'react';
import logo from '../assets/logo.png'; // Replace with your logo
import { FaBars } from 'react-icons/fa'; // Import icon for the hamburger menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to handle dropdown visibility

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and text on the left */}
          <div className="flex items-center">
            <img src={logo} alt="DLHK Logo" className="h-12 w-12" /> {/* Adjust logo size if needed */}
            <div className="ml-3">
              <span className="font-cardo text-black text-lg font-bold leading-tight">
                DINAS LINGKUNGAN HIDUP DAN KEHUTANAN
              </span>
              <br />
              <span className="font-cardo text-black text-lg">
                DAERAH ISTIMEWA YOGYAKARTA
              </span>
            </div>
          </div>

          {/* Hamburger Menu for dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="focus:outline-none text-black"
            >
              <FaBars className="h-8 w-8" /> {/* Hamburger icon */}
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Peta Pemantauan Kualitas Air Sungai
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Peta Pemantauan Kualitas Udara
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Peta Pemantauan Kualitas Air Laut
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
