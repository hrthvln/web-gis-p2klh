import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import logo from "../assets/logo.png";
import MapDIY from "../assets/MapDIY.png";
import Slide1 from "../assets/Slide1.png";
import Slide2 from "../assets/Slide2.png";
import Slide3 from "../assets/Slide3.png";
import AirSungaiIcon from "../assets/AirSungaiIcon.png";
import UdaraIcon from "../assets/UdaraIcon.png";
import AirLautIcon from "../assets/AirLautIcon.png";
import webgisAirSungai from "../assets/webgis-air-sungai.png";
import webgisUdara from "../assets/webgis-udara.png";
import webgisAirLaut from "../assets/webgis-air-laut.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import CSS untuk carousel

const InformationPage = () => {
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-50 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
            <button
              onClick={() => handleScrollToSection("application-section")}
              className="bg-[#16423C]/80 text-white px-4 py-2 rounded hover:bg-opacity-80 transition duration-300"
            >
              Aplikasi WebGIS
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section Carousel */}
      <div className="relative absolute top-0 w-full h-screen">
        <Carousel
          showArrows={true}
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          className="h-full"
        >
          {/* Slide 1 */}
          <div className="relative w-full h-full">
            <img src={Slide1} alt="Slide 1" className="w-full h-full object-cover" />
            <div className="absolute top-1/4 left-10 sm:left-16 max-w-lg lg:max-w-3xl text-justify">
              <h1 className="font-cardo text-[#16423C] text-4xl sm:text-4xl font-bold mb-4 text-justify">SISTEM INFORMASI</h1>
              <h1 className="font-cardo text-[#16423C] text-4xl sm:text-4xl font-bold mb-7 text-justify">PEMANTAUAN MUTU AIR & UDARA</h1>
              <p className="font-cardo text-black text-lg sm:text-lg max-w-xl mb-2 text-justify">
                Dinas Lingkungan Hidup dan Kehutanan DIY menyediakan akses publik terhadap titik
                pemantauan kualitas air sungai, udara, dan air laut di Daerah Istimewa Yogyakarta.
              </p>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="w-full h-full">
            <img src={Slide2} alt="Slide 2" className="w-full h-full object-cover" />
          </div>

          {/* Slide 3 */}
          <div className="w-full h-full">
            <img src={Slide3} alt="Slide 3" className="w-full h-full object-cover" />
          </div>
        </Carousel>
      </div>

      {/* About Section */}
      <div className="relative w-full min-h-screen bg-white py-12 sm:py-16 flex items-center">
        <img src={MapDIY} alt="Map Decoration" className="absolute left-28 h-96" />
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

      {/* Application Section */}
      <div
        id="application-section"
        className="relative w-full bg-white flex flex-col md:flex-row md:items-start md:justify-between py-16"
      >
        <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 text-left mt-8 md:mt-16 w-full md:w-1/2 ml-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#16423C] mb-4">
            Aplikasi WebGIS
          </h2>
          <p className="text-base md:text-lg text-gray-700">
            Menyediakan berbagai data titik pemantauan kualitas air sungai, udara, dan air laut yang dapat diakses secara interaktif.
          </p>
        </div>

        {/* Card Grid */}
        <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
          {[
            { 
              id: "air-sungai", 
              bgImage: webgisAirSungai, // Ganti dengan URL gambar untuk tampilan WebGIS
              icon: AirSungaiIcon, 
              title: "Peta Pemantauan Kualitas Air Sungai", 
              link: "/maps/kualitas-air-sungai" 
            },
            { 
              id: "udara", 
              bgImage: webgisUdara, 
              icon: UdaraIcon, 
              title: "Peta Pemantauan Kualitas Udara", 
              link: "/maps/kualitas-udara" 
            },
            { 
              id: "air-laut", 
              bgImage: webgisAirLaut, 
              icon: AirLautIcon, 
              title: "Peta Pemantauan Kualitas Air Laut", 
              link: "/maps/kualitas-air-laut" 
            }
          ].map((app, index) => (
            <Link
              key={index}
              to={app.link}
              className="group flex flex-col w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
            >
              {/* Gambar Background */}
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${app.bgImage})` }}
              />

              {/* Ikon dalam lingkaran */}
              <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <img src={app.icon} alt={app.title} className="w-8 h-8" />
              </div>

              {/* Bagian Bawah: Title dan Button */}
              <div className="p-6 bg-[#f9f9f9] flex flex-col items-center">
                <h3 className="text-md font-semibold text-center text-[#16423C] mb-4">
                  {app.title}
                </h3>
                <button className="border border-[#16423C] text-[#16423C] px-4 py-2 text-sm rounded-full hover:bg-[#16423C] hover:text-white transition duration-300">
                  Buka
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-[#d1e0dd]/55 p-6 mt-8 font-cardo text-black text-sm">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="DLHK DIY Logo" className="h-16 mx-auto" />
          </div>
          <p className="text-sm">Jl. Argulobang No. 19, Baciro, Gondokusuman, Yogyakarta 55225</p>
          <div className="flex justify-center items-center mt-2">
            <FaPhoneAlt className="mr-2" />
            <span>(0274) 588 518</span>
            <span className="mx-2">|</span>
            <FaEnvelope className="mr-2" />
            <span>dlhk.jogjaprov.go.id</span>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            {[{ icon: FaInstagram, link: "https://www.instagram.com/dlhkdiy/" }, { icon: FaFacebook, link: "https://www.facebook.com/dlhkdiy/" }, { icon: FaYoutube, link: "https://www.youtube.com/@dlhkdiy/videos" }].map((social, index) => (
              <a key={index} href={social.link} target="_blank" rel="noopener noreferrer" className="text-xl text-[#16423C] hover:text-[#0d6a4e] transition duration-300">
                {React.createElement(social.icon)}
              </a>
            ))}
          </div>
          <p className="mt-4">&copy; 2024 DLHK DIY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default InformationPage;
