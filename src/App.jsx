// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ApplicationSection from './components/ApplicationSection';
import Footer from './components/Footer';
import RiverWaterQualityMap from './components/RiverWaterQualityMap';
import AirQualityMap from './components/AirQualityMap';
import SeaWaterQualityMap from './components/SeaWaterQualityMap';
import InformationPage from './components/InformationPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Home Route with Hero, About, and Application sections */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <HeroSection />
                <ApplicationSection />
                <Footer />
              </>
            } 
          />
          {/* River Water Quality Map Route */}
          <Route 
            path="/maps/kualitas-air-sungai" 
            element={<RiverWaterQualityMap />} 
          />
          {/* Air Quality Map Route */}
          <Route 
            path="/maps/kualitas-udara" 
            element={<AirQualityMap />} 
          />
          {/* Sea Water Quality Map Route */}
          <Route 
            path="/maps/kualitas-air-laut" 
            element={<SeaWaterQualityMap />} 
          />
          {/* Information Page */}
          <Route 
              path="/InformationPage" 
              element={<InformationPage />} 
            />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
