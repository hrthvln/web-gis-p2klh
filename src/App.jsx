// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RiverWater from './components/RiverWater';
import SeaWater from './components/SeaWater';
import Air from './components/Air';
import MainPage from './components/MainPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Home Route with Hero, About, and Application sections */}
          <Route 
            path="/" 
            element={<MainPage />} 
          />
          {/* River Water Quality Map Route */}
          <Route 
            path="/maps/kualitas-air-sungai" 
            element={<RiverWater />} 
          />
          {/* Air Quality Map Route */}
          <Route 
            path="/maps/kualitas-udara" 
            element={<Air />} 
          />
          {/* Sea Water Quality Map Route */}
          <Route 
            path="/maps/kualitas-air-laut" 
            element={<SeaWater />} 
          />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
