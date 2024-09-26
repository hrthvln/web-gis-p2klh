import React from "react";
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa"; // Import ikon
import Logo from "../assets/logo.png"; // Pastikan logo ini ada di folder assets

const Footer = () => {
  return (
    <footer className="bg-[#6A9C89] p-6 mt-8 font-cardo text-black text-sm"> {/* Background 95% transparan */}
      <div className="container mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={Logo} alt="DLHK DIY Logo" className="h-16 mx-auto" />
        </div>

        {/* Informasi Kontak */}
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

        {/* Ikon Sosial Media */}
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

        {/* Copyright */}
        <div className="text-center mt-6">
          <p className="text-sm mt-2">
              © 2024 | DLHK DIY
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
