import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Slide1 from "../assets/Slide1.png";
import Slide2 from "../assets/Slide2.png";
import Slide3 from "../assets/Slide3.png";
import Slide4 from "../assets/Slide4.png";
import mapDecoration from "../assets/map.png";
import BackgroundImage from '../assets/dlhk_diy.png';
import AirSungaiIcon from '../assets/air_sungai.png';
import UdaraIcon from '../assets/udara.png';
import AirLautIcon from '../assets/air_laut.png';
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import '../styles/main.css';

const Navbar = () => {
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="DLHK Logo" className="h-10 w-10 sm:h-12 sm:w-12" />
            <div className="ml-3">
              <span className="font-cardo text-black text-xs sm:text-xs lg:text-sm font-bold leading-tight">
                DINAS LINGKUNGAN HIDUP DAN KEHUTANAN
              </span>
              <br />
              <span className="font-cardo text-black text-xs sm:text-xs lg:text-sm">
                DAERAH ISTIMEWA YOGYAKARTA
              </span>
            </div>
          </div>
          {/* Button */}
          <button
            onClick={() => handleScrollToSection("application-section")}
            className="hidden md:block bg-[#16423C]/80 text-white px-4 py-2 text-sm sm:text-base lg:text-lg rounded hover:bg-opacity-80 transition duration-300"
          >
            WebGIS
          </button>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <div className="relative w-full bg-white pt-0 sm:pt-0 lg:pt-32 flex items-center">
      <div className="relative w-full min-h-[70vh] bg-white flex flex-col-reverse lg:flex-row items-center">
        <div className="text-left px-6 sm:px-2 lg:px-16 max-w-lg sm:max-w-2xl lg:max-w-4xl">
          <h1 className="font-cardo text-[#16423C] text-2xl sm:text-4xl md:text-5xl font-bold mb-3">
            SISTEM INFORMASI
          </h1>
          <h2 className="text-[#16423C] text-xl sm:text-4xl md:text-4xl font-bold mb-7">
            PEMANTAUAN MUTU AIR & UDARA
          </h2>
          <p className="font-cardo text-black text-sm sm:text-base lg:text-lg max-w-xl mb-2 text-justify">
            Dinas Lingkungan Hidup dan Kehutanan DIY menyediakan akses publik
            terhadap titik pemantauan kualitas air sungai, udara, dan air laut
            di Daerah Istimewa Yogyakarta.
          </p>
        </div>
        <img
          src={mapDecoration}
          alt="Map Decoration"
          className="w-80 sm:w-72 md:w-96 lg:w-1/2 absolute bottom-0 right-0 opacity-60 h-90"
        />
      </div>
    </div>
  );
};

const AboutSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [Slide1, Slide2, Slide3, Slide4];

  useEffect(() => {
    const interval = setInterval(() => {
 setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[70vh] bg-white py-12 sm:py-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 flex justify-center mb-8 lg:mb-0">
          <div className="relative w-full h-[300px] sm:h-[300px] overflow-hidden">
            <img
              src={slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full object-cover h-full transition-transform duration-500"
            />
          </div>
        </div>
        <div className="lg:w-1/2 text-left lg:pl-8">
          <h2 className="font-cardo text-[#16423C] text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-7">
            Visualisasi geospasial interaktif—
          </h2>
          <p className="font-cardo text-black text-sm sm:text-base lg:text-lg max-w-xl mb-3 text-justify">
            menggambarkan pemantauan mutu air dan lingkungan secara akurat dalam
            mendukung perlindungan dan pengelolaan lingkungan hidup.
          </p>
          <p className="font-cardo text-black text-sm sm:text-base lg:text-lg max-w-xl mb-3 text-justify">
            Aplikasi ini dirancang untuk memudahkan akses data dalam
            menginformasikan mutu air dan udara di Daerah Istimewa Yogyakarta.
          </p>
        </div>
      </div>
    </div>
  );
};

const ApplicationSection = () => {
  return (
    <div className="relative w-full bg-white py-12 sm:py-16 flex items-center justify-center">
      <div
        id="application-section"
        className="relative w-[95%] max-w-7xl h-[600px] bg-center bg-no-repeat flex flex-col md:flex-row md:items-start md:justify-between py-32 px-8 sm:px-6 md:px-12 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0)),
            linear-gradient(to top right, rgba(50, 89, 57, 0.1), rgba(50, 89, 57, 0)),
            url(${BackgroundImage})`,
          backgroundSize: "auto",
          backgroundPosition: "center",
          borderRadius: "70px",
          backgroundBlendMode: "overlay, overlay, normal",
        }}
      >
        {/* Deskripsi di sebelah kiri */}
        <div className="relative z-10 max-w-7xl px-4 text-left w-full md:w-3/4 lg:w-1/2 mb-4 md:mb-4 mt-0">
          <p className="text-sm sm:text-base md:text-lg font-bold text-[#16423C]">
            Menyediakan berbagai data hasil pemantauan kualitas air sungai, udara, dan air laut.
          </p>
        </div>

        {/* Grid aplikasi */}
<div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2 md:gap-6 lg:gap-8 px-4 sm:px-4 lg:px-4">
  {/* Card 1 */}
  <div
    id="air-sungai"
    className="card p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
  >
    <Link to="/maps/kualitas-air-sungai">
      <div className="custom-height bg-white border-2 border-gray-150 p-4 rounded-lg flex flex-col items-center justify-center">
        <img
          src={AirSungaiIcon}
          alt="Air Sungai"
          className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain mb-2"
        />
        <h3 className="text-center text-xs sm:text-sm lg:text-base font-semibold leading-tight">
          Pemantauan Kualitas Air Sungai
        </h3>
      </div>
    </Link>
  </div>

  {/* Card 2 */}
  <div
    id="udara"
    className="card bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
  >
    <Link to="/maps/kualitas-udara">
      <div className="custom-height bg-white border-2 border-gray-150 p-4 rounded-lg flex flex-col items-center justify-center">
        <img
          src={UdaraIcon}
          alt="Udara"
          className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain mb-2"
        />
        <h3 className="text-center text-xs sm:text-sm lg:text-base font-semibold leading-tight">
          Pemantauan Kualitas Udara
        </h3>
      </div>
    </Link>
  </div>

  {/* Card 3 */}
  <div
    id="air-laut"
    className="card bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
  >
    <Link to="/maps/kualitas-air-laut">
      <div className="custom-height bg-white border-2 border-gray-150 p-4 rounded-lg flex flex-col items-center justify-center">
        <img
          src={AirLautIcon}
          alt="Air Laut"
          className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain mb-2"
        />
        <h3 className="text-center text-xs sm:text-sm lg:text-base font-semibold leading-tight">
          Pemantauan Kualitas Air Laut
        </h3>
      </div>
    </Link>
  </div>
</div>

      </div>
    </div>
  );
};


const Footer = () => {
  return (
    <footer className="bg-[#d1e0dd]/55 p-6 mt-0 font-cardo text-black text-sm">
      <div className="container mx-auto text-center">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="DLHK DIY Logo" className="h-20 mx-auto" />
        </div>
        <p className="text-sm mb-2">Dinas Lingkungan Hidup dan Kehutanan DIY</p>
        <div className="text-center">
          <p className="text-sm">
            Jl. Argulobang No. 19, Baciro, Gondokusuman, Yogyakarta 55225
          </p>
          <div className="flex justify-center items-center mt-2">
            <FaPhoneAlt className="mr-2" />
            <span>(0274) 588 518</span>
            <span className="mx-2">|</span>
            <FaEnvelope className="mr-2" />
            <span>dlhk.jogjaprov.go.id</span>
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <a href="https://www.instagram.com/dlhkdiy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="text-xl text-black hover:text-gray-600" />
          </a>
          <a href="https://www.facebook.com/dlhkdiy/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="text-xl text-black hover:text-gray-600" />
          </a>
          <a href="https://www.youtube.com/@dlhkdiy/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube className="text-xl text-black hover:text-gray-600" />
          </a>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm mt-2">
              © 2024 | DLHK DIY
          </p>
        </div>
      </div>
    </footer>
  );
};

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ApplicationSection />
      <Footer />
    </div>
  );
};

export default MainPage;