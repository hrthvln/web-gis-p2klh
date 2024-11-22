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
              className="bg-[#16423C] text-white px-4 py-2 rounded hover:bg-opacity-80 transition duration-300"
            >
              Aplikasi WebGIS
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section Carousel */}
      <div className="relative w-full h-screen">
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
            <div className="absolute top-1/4 left-10 sm:left-16 text-left max-w-lg lg:max-w-2xl">
              <h1 className="font-cardo text-[#16423C] text-3xl sm:text-4xl font-bold mb-4">
                SISTEM INFORMASI
              </h1>
              <h1 className="font-cardo text-[#16423C] text-3xl sm:text-4xl font-bold mb-7">
                PEMANTAUAN MUTU AIR & UDARA
              </h1>
              <p className="font-cardo text-black text-sm sm:text-lg">
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
      <div className="relative w-full min-h-screen bg-white py-12 sm:py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-start">
    {/* Gambar Peta */}
    <div className="relative lg:w-1/2 flex justify-center lg:justify-start">
      <img
        src={MapDIY}
        alt="Map Decoration"
        className="h-64 sm:h-72 lg:h-96 w-auto max-w-xs sm:max-w-sm lg:max-w-md"
      />
    </div>

    {/* Teks About */}
    <div className="lg:w-1/2 text-left mt-8 lg:mt-0 lg:pl-8 lg:pt-24">
      <h2 className="font-cardo text-[#16423C] text-2xl sm:text-3xl font-bold mb-4">
        Visualisasi geospasial interaktif—
      </h2>
      <p className="font-cardo text-black text-base sm:text-lg mb-4">
        menggambarkan pemantauan mutu air dan lingkungan secara akurat dalam mendukung perlindungan
        dan pengelolaan lingkungan hidup.
      </p>
      <p className="font-cardo text-black text-base sm:text-lg">
        Aplikasi ini dirancang untuk memudahkan akses data dalam menginformasikan mutu air dan udara
        di Daerah Istimewa Yogyakarta.
      </p>
    </div>
  </div>
</div>
      
      {/* Application Section */}
      <div
        id="application-section"
        className="relative w-full bg-white flex flex-col items-center py-16 px-4 sm:px-8"
      >
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#16423C] mb-4">
            Aplikasi WebGIS
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            Menyediakan berbagai data titik pemantauan kualitas air sungai, udara, dan air laut yang dapat diakses secara interaktif.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {[
            {
              id: "air-sungai",
              bgImage: webgisAirSungai, // URL gambar untuk tampilan WebGIS
              icon: AirSungaiIcon,
              title: "Peta Pemantauan Kualitas Air Sungai",
              link: "/maps/kualitas-air-sungai",
            },
            {
              id: "udara",
              bgImage: webgisUdara,
              icon: UdaraIcon,
              title: "Peta Pemantauan Kualitas Udara",
              link: "/maps/kualitas-udara",
            },
            {
              id: "air-laut",
              bgImage: webgisAirLaut,
              icon: AirLautIcon,
              title: "Peta Pemantauan Kualitas Air Laut",
              link: "/maps/kualitas-air-laut",
            },
          ].map((app, index) => (
            <Link
              key={index}
              to={app.link}
              className="group flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative"
            >
              {/* Background Gambar */}
              <div
                className="h-40 sm:h-48 md:h-56 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${app.bgImage})` }}
              />

              {/* Ikon Lingkaran */}
              <div className="absolute top-4 left-4 w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <img src={app.icon} alt={app.title} className="w-6 h-6" />
              </div>

              {/* Bagian Title */}
              <div className="p-4 bg-[#f9f9f9]">
                <h3 className="text-center text-sm sm:text-md font-semibold text-[#16423C]">
                  {app.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#d1e0dd]/55 p-6 mt-8 font-cardo text-black text-sm">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="DLHK DIY Logo" className="h-12 sm:h-16 mx-auto" />
          </div>
          <p className="text-sm sm:text-base">Jl. Argulobang No. 19, Baciro, Gondokusuman, Yogyakarta 55225</p>
          <div className="flex justify-center items-center mt-2 text-sm sm:text-base">
            <FaPhoneAlt className="mr-2" />
            <span>(0274) 588 518</span>
            <span className="mx-2 hidden sm:inline">|</span>
            <FaEnvelope className="mr-2" />
            <span>dlhk.jogjaprov.go.id</span>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            {[
              { icon: FaInstagram, link: "https://www.instagram.com/dlhkdiy/" },
              { icon: FaFacebook, link: "https://www.facebook.com/dlhkdiy/" },
              { icon: FaYoutube, link: "https://www.youtube.com/@dlhkdiy/videos" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg sm:text-xl text-[#16423C] hover:text-[#0d6a4e] transition duration-300"
              >
                {React.createElement(social.icon)}
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs sm:text-sm">&copy; 2024 DLHK DIY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default InformationPage;
