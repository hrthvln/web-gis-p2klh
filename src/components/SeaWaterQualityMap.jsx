import React, { useState, useEffect } from 'react';
import { FaLayerGroup, FaInfoCircle, FaFilter } from 'react-icons/fa';

const SeaWaterQualityMap = () => {
  const [isLayerListOpen, setIsLayerListOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2023'); // Default tahun 2023
  const [showBoundary, setShowBoundary] = useState(true);
  const [showFebLayer, setShowFebLayer] = useState(true);
  const [showJunLayer, setShowJunLayer] = useState(true);
  const [showOktLayer, setShowOktLayer] = useState(true);
  const [showIkaLayer, setShowIkaLayer] = useState(true);

  const toggleLayerList = () => {
    setIsLayerListOpen(!isLayerListOpen);
    if (isLegendOpen) setIsLegendOpen(false);  // Tutup legenda jika layer list dibuka
    if (isYearFilterOpen) setIsYearFilterOpen(false);  // Tutup filter tahun jika layer list dibuka
  };

  const toggleLegend = () => {
    setIsLegendOpen(!isLegendOpen);
    if (isLayerListOpen) setIsLayerListOpen(false);  // Tutup layer list jika legenda dibuka
    if (isYearFilterOpen) setIsYearFilterOpen(false);  // Tutup filter tahun jika legenda dibuka
  };

  const toggleYearFilter = () => {
    setIsYearFilterOpen(!isYearFilterOpen);
    if (isLegendOpen) setIsLegendOpen(false);  // Tutup legenda jika filter tahun dibuka
    if (isLayerListOpen) setIsLayerListOpen(false);  // Tutup layer list jika filter tahun dibuka
  };

  const handleLayerToggle = (checked, layer) => {
    switch (layer) {
      case 'boundary':
        setShowBoundary(checked);
        break;
      case 'february':
        setShowFebLayer(checked);
        break;
      case 'june':
        setShowJunLayer(checked);
        break;
      case 'october':
        setShowOktLayer(checked);
        break;
      case 'ika':
        setShowIkaLayer(checked);
        break;
      default:
        break;
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#1E90FF' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="logo.png" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          <h1 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>DLHK DIY WebGIS</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaLayerGroup
            style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={toggleLayerList}
          />
          <FaInfoCircle
            style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={toggleLegend}
          />
          <FaFilter
            style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer' }}
            onClick={toggleYearFilter}
          />
        </div>

        {/* Layer List Pop-up */}
        {isLayerListOpen && (
          <div style={{ position: 'absolute', top: '60px', right: '200px', backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.2)', zIndex: 999 }}>
            <h3 style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: '5px' }}>Daftar Layer</h3>
            <label>
              <input type="checkbox" checked={showBoundary} onChange={(e) => handleLayerToggle(e.target.checked, 'boundary')} />
              Batas Kabupaten
            </label>
            <br />
            <label>
              <input type="checkbox" checked={showFebLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'february')} />
              Periode Februari
            </label>
            <br />
            <label>
              <input type="checkbox" checked={showJunLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'june')} />
              Periode Juni
            </label>
            <br />
            <label>
              <input type="checkbox" checked={showOktLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'october')} />
              Periode Oktober
            </label>
            <br />
            <label>
              <input type="checkbox" checked={showIkaLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'ika')} />
              Nilai IKA DIY
            </label>
          </div>
        )}

        {/* Legend Pop-up */}
        {isLegendOpen && (
          <div style={{ position: 'absolute', top: '60px', right: '100px', backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.2)', zIndex: 999 }}>
            <h3 style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: '5px' }}>Legenda</h3>
            <div>
              <b>Titik Pemantauan Kualitas Air Sungai</b>
              <div><span style={{ backgroundColor: '#FF0000', borderRadius: '50%', display: 'inline-block', width: '10px', height: '10px' }}></span> Februari</div>
              <div><span style={{ backgroundColor: '#00FF00', borderRadius: '50%', display: 'inline-block', width: '10px', height: '10px' }}></span> Juni</div>
              <div><span style={{ backgroundColor: '#0000FF', borderRadius: '50%', display: 'inline-block', width: '10px', height: '10px' }}></span> Oktober</div>
              <div><span style={{ backgroundColor: '#FFFF00', borderRadius: '50%', display: 'inline-block', width: '10px', height: '10px' }}></span> Nilai IKA</div>
            </div>
          </div>
        )}

        {/* Year Filter Pop-up */}
        {isYearFilterOpen && (
          <div style={{ position: 'absolute', top: '60px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.2)', zIndex: 999 }}>
            <h3 style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: '5px' }}>Filter Tahun</h3>
            <div>
              <label>
                <input type="radio" value="2023" checked={selectedYear === '2023'} onChange={() => handleYearChange('2023')} />
                2023
              </label>
              <br />
              <label>
                <input type="radio" value="2022" checked={selectedYear === '2022'} onChange={() => handleYearChange('2022')} />
                2022
              </label>
              <br />
              <label>
                <input type="radio" value="2021" checked={selectedYear === '2021'} onChange={() => handleYearChange('2021')} />
                2021
              </label>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SeaWaterQualityMap;