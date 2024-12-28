// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import RiverWater2023 from './components/RiverWater2023';
import SeaWater2023 from './components/SeaWater2023';
import Air2023 from './components/Air2023';
import RiverWater2024 from './components/RiverWater2024';
import SeaWater2024 from './components/SeaWater2024';
import Air2024 from './components/Air2024';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Main Page Route */}
          <Route 
            path="/" 
            element={<MainPage />} 
          />
          {/* River Water Quality Map 2023 Route */}
          <Route 
            path="/maps/kualitas-air-sungai-2023" 
            element={<RiverWater2023 />} 
          />
          {/* Air Quality Map 2023 Route */}
          <Route 
            path="/maps/kualitas-udara-2023" 
            element={<Air2023 />} 
          />
          {/* Sea Water Quality Map 2023 Route */}
          <Route 
            path="/maps/kualitas-air-laut-2023" 
            element={<SeaWater2023 />} 
          />
          {/* River Water Quality Map 2024 Route */}
          <Route 
            path="/maps/kualitas-air-sungai-2024" 
            element={<RiverWater2024 />} 
          />
          {/* Air Quality Map 2024 Route */}
          <Route 
            path="/maps/kualitas-udara-2024" 
            element={<Air2024 />} 
          />
          {/* Sea Water Quality Map 2024 Route */}
          <Route 
            path="/maps/kualitas-air-laut-2024" 
            element={<SeaWater2024 />} 
          />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
