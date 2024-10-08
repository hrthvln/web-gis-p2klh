import React, { useState, useEffect } from 'react';
import { FaLayerGroup, FaInfoCircle, FaFilter } from 'react-icons/fa';

const RiverWaterQualityMap = () => {
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

export default RiverWaterQualityMap;












































// src/components/RiverWaterQualityMap.jsx
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import logo from '../assets/logo.png'; // Sesuaikan jalur logo

const RiverWaterQualityMap = () => {
  const [map, setMap] = useState(null);
  const [geojsonLayerFeb, setGeojsonLayerFeb] = useState(null);
  const [geojsonLayerJun, setGeojsonLayerJun] = useState(null);
  const [geojsonLayerOkt, setGeojsonLayerOkt] = useState(null);
  const [boundaryLayer, setBoundaryLayer] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showLegendPopup, setShowLegendPopup] = useState(false);
  const [showLayerPopup, setShowLayerPopup] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });

  // Fungsi untuk memuat data GeoJSON
  const loadGeoJsonData = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      return null;
    }
  };

  useEffect(() => {
    // Inisialisasi peta
    const initialMap = L.map('map').setView([-7.797068, 110.370529], 10); // Koordinat DIY

    // Tambahkan tile layer alternatif (Google Maps tile sebagai opsi)
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: 'Map data © Google',
    }).addTo(initialMap);

    // Tambahkan Locate Control untuk menentukan lokasi pengguna
    L.control.locate({
      position: 'topleft',
      flyTo: true,
      strings: {
        title: "Temukan Lokasi Saya"
      }
    }).addTo(initialMap);

    // Hapus kontrol zoom default dan tambahkan satu kontrol zoom
    if (initialMap.zoomControl) {
      initialMap.removeControl(initialMap.zoomControl); // Hapus kontrol zoom yang kedua
    }
    L.control.zoom({ position: 'topleft' }).addTo(initialMap);

    // Event listener untuk menampilkan koordinat kursor secara realtime
    initialMap.on('mousemove', function (e) {
      setCoords({ lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
    });

    // Menampilkan koordinat saat peta diklik
    initialMap.on('click', function (e) {
      setCoords({ lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
    });

    setMap(initialMap);

    return () => {
      initialMap.remove();
    };
  }, []);

  // Fungsi untuk mengelola penambahan lapisan GeoJSON
  const toggleLayer = async (layerState, setLayerState, geojsonUrl) => {
    if (layerState) {
      map.removeLayer(layerState);
      setLayerState(null);
    } else {
      const geojsonData = await loadGeoJsonData(geojsonUrl);
      const newLayer = L.geoJSON(geojsonData, {
        style: (feature) => ({
          color: feature.properties.color || 'blue',
        }),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`<h3>${feature.properties.nama}</h3><p>Tahun: ${feature.properties.tahun}</p>`);
        },
      }).addTo(map);
      setLayerState(newLayer);
    }
  };

  const toggleBoundaryLayer = async () => {
    if (boundaryLayer) {
      map.removeLayer(boundaryLayer);
      setBoundaryLayer(null);
    } else {
      const boundariesData = await loadGeoJsonData('/map/batasKab_cleaned.geojson');
      const newBoundaryLayer = L.geoJSON(boundariesData, {
        style: (feature) => ({
          color: feature.properties.color || '#FF5733', // Warna highlight untuk batas kabupaten
          weight: 3, // Menentukan ketebalan garis
          opacity: 0.7, // Transparansi garis
        }),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`<h3>${feature.properties.nama}</h3>`);
        },
      }).addTo(map);
      setBoundaryLayer(newBoundaryLayer);
    }
  };
  

  return (
    <div>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#6A9C89', padding: '10px', display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <h2 style={{ color: 'white', margin: 0 }}>Peta Pemantauan Kualitas Air Sungai di DIY</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
          {/* Filter Tahun */}
          <div>
            <i className="fas fa-filter" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setShowFilterPopup(!showFilterPopup)}></i>
            {showFilterPopup && (
              <div className="popup">
                <div className="popup-content">
                  <span className="close-btn" onClick={() => setShowFilterPopup(false)}>x</span>
                  <h3>Filter Tahun</h3>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Layer List */}
          <div>
            <i className="fas fa-layer-group" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setShowLayerPopup(!showLayerPopup)}></i>
            {showLayerPopup && (
              <div className="popup">
                <div className="popup-content">
                  <span className="close-btn" onClick={() => setShowLayerPopup(false)}>x</span>
                  <h3>Layer List</h3>
                  <label>
                    <input type="checkbox" onChange={() => toggleLayer(geojsonLayerFeb, setGeojsonLayerFeb, '/map/sungaiFeb.geojson')} /> Periode Februari
                  </label><br />
                  <label>
                    <input type="checkbox" onChange={() => toggleLayer(geojsonLayerJun, setGeojsonLayerJun, '/map/sungaiJun.geojson')} /> Periode Juni
                  </label><br />
                  <label>
                    <input type="checkbox" onChange={() => toggleLayer(geojsonLayerOkt, setGeojsonLayerOkt, '/map/sungaiOkt.geojson')} /> Periode Oktober
                  </label><br />
                  <label>
                    <input type="checkbox" onChange={toggleBoundaryLayer} /> Batas Kabupaten
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Legenda */}
          <div>
            <i className="fas fa-info-circle" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setShowLegendPopup(!showLegendPopup)}></i>
            {showLegendPopup && (
              <div className="popup">
                <div className="popup-content">
                  <span className="close-btn" onClick={() => setShowLegendPopup(false)}>x</span>
                  <h3>Legenda</h3>
                  <p><b>Titik Pemantauan Kualitas Air Sungai</b> <i className="fas fa-circle" style={{ color: 'blue' }}></i></p>
                  <p><b>Batas Kecamatan</b> <i className="fas fa-circle" style={{ color: 'red' }}></i></p>
                  <div>
                    <p><b>Sleman</b> <i className="fas fa-square" style={{ color: '#1f77b4' }}></i></p>
                    <p><b>Bantul</b> <i className="fas fa-square" style={{ color: '#ff7f0e' }}></i></p>
                    <p><b>Kulon Progo</b> <i className="fas fa-square" style={{ color: '#2ca02c' }}></i></p>
                    <p><b>Gunung Kidul</b> <i className="fas fa-square" style={{ color: '#d62728' }}></i></p>
                    <p><b>Kota Yogyakarta</b> <i className="fas fa-square" style={{ color: '#9467bd' }}></i></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Peta */}
      <div id="map" style={{ height: '600px' }}></div>

      {/* Koordinat */}
      {coords.lat && coords.lng && (
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'white', padding: '5px', borderRadius: '15px', zIndex: '1000' }}>
          Koordinat: {coords.lat}, {coords.lng}
        </div>
      )}
    </div>
  );
};

export default RiverWaterQualityMap;
