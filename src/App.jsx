// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ApplicationSection from './components/ApplicationSection';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ApplicationSection />
      <Footer />
    </div>
  );
}

export default App;