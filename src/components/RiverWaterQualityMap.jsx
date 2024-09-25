// src/components/RiverWaterQualityMap.jsx
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import logo from '../assets/logo.png'; // Logo bisa disesuaikan dengan jalur Anda

const RiverWaterQualityMap = () => {
  const [map, setMap] = useState(null);
  const [geojsonLayer, setGeojsonLayer] = useState(null);
  const [boundaryLayer, setBoundaryLayer] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showLegendPopup, setShowLegendPopup] = useState(false);
  const [showLayerPopup, setShowLayerPopup] = useState(false);

  // Fungsi untuk memuat data GeoJSON
  const loadGeoJsonData = async (url, filterYear = null) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Jika ada filter tahun, lakukan filter data
      if (filterYear) {
        const filteredData = {
          ...data,
          features: data.features.filter(
            (feature) => feature.properties.tahun === filterYear
          ),
        };
        return filteredData;
      }
      return data;
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      return null;
    }
  };

  useEffect(() => {
    // Inisialisasi peta
    const initialMap = L.map('map').setView([-7.872532, 109.7648094], 10); // Koordinat DIY

    // Tambahkan tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(initialMap);

    // Tambahkan kontrol zoom dan locate control
    L.control.zoom({ position: 'topleft' }).addTo(initialMap);
    L.control
      .locate({
        position: 'topleft',
        drawCircle: true,
        keepCurrentZoomLevel: true,
        showPopup: false,
      })
      .addTo(initialMap);

    setMap(initialMap);

    return () => {
      initialMap.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      // Hapus layer GeoJSON sebelumnya (jika ada)
      if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
      }
      if (boundaryLayer) {
        map.removeLayer(boundaryLayer);
      }

      // Memuat dan menampilkan titik GeoJSON
      loadGeoJsonData('/map/diyJson.geojson', selectedYear).then((pointsData) => {
        if (pointsData) {
          const newGeojsonLayer = L.geoJSON(pointsData, {
            onEachFeature: (feature, layer) => {
              layer.bindPopup(`
                <h3>${feature.properties.nama}</h3>
                <p>Keterangan: ${feature.properties.keterangan}</p>
                <p>Tahun: ${feature.properties.tahun}</p>
              `);
            },
          }).addTo(map);
          setGeojsonLayer(newGeojsonLayer);
        }
      });

      // Memuat dan menampilkan batas kecamatan
      loadGeoJsonData('/map/boundaries.geojson').then((boundariesData) => {
        if (boundariesData) {
          const newBoundaryLayer = L.geoJSON(boundariesData, {
            style: {
              color: '#FF5733',
              weight: 2,
              dashArray: '4',
            },
          }).addTo(map);
          setBoundaryLayer(newBoundaryLayer);
        }
      });
    }
  }, [map, selectedYear]);

  return (
    <div>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#228B22', padding: '10px', display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <h2 style={{ color: 'white', margin: 0 }}>Peta Pemantauan Kualitas Air Sungai di DIY</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
          {/* Filter Tahun Icon */}
          <i className="fas fa-filter" onClick={() => setShowFilterPopup(true)} style={{ color: 'white', cursor: 'pointer' }}></i>
          {/* List Jumlah Titik Icon */}
          <i className="fas fa-list" onClick={() => setShowInfoPopup(true)} style={{ color: 'white', cursor: 'pointer' }}></i>
          {/* Legenda Icon */}
          <i className="fas fa-info-circle" onClick={() => setShowLegendPopup(true)} style={{ color: 'white', cursor: 'pointer' }}></i>
          {/* Layer List Icon */}
          <i className="fas fa-layer-group" onClick={() => setShowLayerPopup(true)} style={{ color: 'white', cursor: 'pointer' }}></i>
        </div>
      </nav>

      {/* Filter Tahun Pop-up */}
      {showFilterPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={() => setShowFilterPopup(false)}>x</span>
            <h3>Filter Tahun</h3>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
        </div>
      )}

      {/* List Jumlah Titik Pop-up */}
      {showInfoPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={() => setShowInfoPopup(false)}>x</span>
            <h3>Jumlah Titik Pemantauan</h3>
            <ul>
              <li>Titik 1 - Info</li>
              <li>Titik 2 - Info</li>
            </ul>
          </div>
        </div>
      )}

      {/* Legenda Pop-up */}
      {showLegendPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={() => setShowLegendPopup(false)}>x</span>
            <h3>Legenda</h3>
            <p>Titik: Ditandai dengan warna biru</p>
            <p>Batas Kecamatan: Garis oranye putus-putus</p>
          </div>
        </div>
      )}

      {/* Layer List Pop-up */}
      {showLayerPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={() => setShowLayerPopup(false)}>x</span>
            <h3>Layer List</h3>
            <label>
              <input type="checkbox" checked={!!geojsonLayer} onChange={() => {
                if (geojsonLayer) {
                  map.removeLayer(geojsonLayer);
                  setGeojsonLayer(null);
                } else {
                  loadGeoJsonData('/map/diyJson.geojson', selectedYear).then((data) => {
                    const newLayer = L.geoJSON(data).addTo(map);
                    setGeojsonLayer(newLayer);
                  });
                }
              }} />
              Titik Pemantauan
            </label>
            <label>
              <input type="checkbox" checked={!!boundaryLayer} onChange={() => {
                if (boundaryLayer) {
                  map.removeLayer(boundaryLayer);
                  setBoundaryLayer(null);
                } else {
                  loadGeoJsonData('/map/boundaries.geojson').then((data) => {
                    const newLayer = L.geoJSON(data).addTo(map);
                    setBoundaryLayer(newLayer);
                  });
                }
              }} />
              Batas Kecamatan
            </label>
          </div>
        </div>
      )}

      {/* Peta */}
      <div id="map" style={{ height: '100vh', width: '100vw' }}></div>
    </div>
  );
};

export default RiverWaterQualityMap;
