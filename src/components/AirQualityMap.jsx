import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import { FaLayerGroup, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa'; // Import icon dari react-icons
import logo from '../assets/logo.png'; // Sesuaikan jalur logo

const AirQualityMap = () => {
  const [map, setMap] = useState(null);
  const [boundaryLayer, setBoundaryLayer] = useState(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [showBoundary, setShowBoundary] = useState(true);

  // State untuk toggle Layer List, Legend, dan Year Filter
  const [isLayerListOpen, setIsLayerListOpen] = useState(false); 
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false); 

  // State untuk tahun terpilih
  const [selectedYear, setSelectedYear] = useState(2023); 

  // State untuk popup aktif
  const [activePopup, setActivePopup] = useState(null); 

  // State untuk layer pemantauan udara
  const [udaraLayer, setUdaraLayer] = useState(null); 
  const [showUdaraLayer, setShowUdaraLayer] = useState(true); // Visibility dari layer udara

  // Warna yang ditetapkan untuk setiap kabupaten
  const kabupatenColors = {
    'Sleman': '#2c7fb8',
    'Bantul': '#FFE400',
    'Gunungkidul': '#d95f0e',
    'Kulon Progo': '#379237',
    'Kota Yogyakarta': '#dd1c77'
  };

// Warna untuk setiap periode
  const pointColors = {
    udara: "#ff7800"
  };


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

  // Tambahkan tile layer
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

  // Membuat kontrol khusus untuk menampilkan koordinat di pojok kiri bawah
  const coordsControl = L.control({ position: 'bottomleft' });
  coordsControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'leaflet-control-latlng');
    div.style.background = 'rgba(255, 255, 255, 0.7)';
    div.style.padding = '5px';
    div.style.borderRadius = '3px';
    div.style.fontSize = '12px';
    div.innerHTML = 'Longitude: 0.000000 | Latitude: 0.000000';
    return div;
  };
  coordsControl.addTo(initialMap);

  // Event listener untuk memperbarui koordinat kursor
  initialMap.on('mousemove', function (e) {
    const { lat, lng } = e.latlng;
    document.querySelector('.leaflet-control-latlng').innerHTML = `Longitude: ${lng.toFixed(6)} | Latitude: ${lat.toFixed(6)}`;
  });

  // Event listener untuk memperbarui koordinat saat peta diklik
  initialMap.on('click', function (e) {
    const { lat, lng } = e.latlng;
    document.querySelector('.leaflet-control-latlng').innerHTML = `Longitude: ${lng.toFixed(6)} | Latitude: ${lat.toFixed(6)}`;
  });

  setMap(initialMap);

  return () => {
    initialMap.remove();
  };
}, []);

  // Fungsi untuk toggle pop-up, memastikan hanya satu pop-up terbuka pada satu waktu
  const handlePopupToggle = (popupName) => {
    if (popupName === 'isLayerListOpen') {
      setIsLayerListOpen(!isLayerListOpen);
      setIsLegendOpen(false); // Tutup yang lain
      setIsYearFilterOpen(false); // Tutup yang lain
    } else if (popupName === 'isLegendOpen') {
      setIsLegendOpen(!isLegendOpen);
      setIsLayerListOpen(false); // Tutup yang lain
      setIsYearFilterOpen(false); // Tutup yang lain
    } else if (popupName === 'isYearFilterOpen') {
      setIsYearFilterOpen(!isYearFilterOpen);
      setIsLayerListOpen(false); // Tutup yang lain
      setIsLegendOpen(false); // Tutup yang lain
    }

  // Perbarui state activePopup dengan nama popup yang aktif
  setActivePopup((prevPopup) => (prevPopup === popupName ? null : popupName));
  };


  // Fungsi untuk memuat dan mengaktifkan boundary layer (batas kabupaten)
  const toggleBoundaryLayer = async () => {
    if (boundaryLayer) {
      map.removeLayer(boundaryLayer);
      setBoundaryLayer(null);
    } else {
      const boundariesData = await loadGeoJsonData('/map/batasKab_cleaned.geojson');
      const newBoundaryLayer = L.geoJSON(boundariesData, {
        style: (feature) => {
          const kabupaten = feature.properties.NAMOBJ;
          console.log("Kabupaten ditemukan:", kabupaten); // Debugging untuk memastikan nama kabupaten
          
          // Tetapkan warna dari daftar kabupatenColors atau gunakan warna default jika kabupaten tidak ada dalam daftar
          const color = kabupatenColors[kabupaten] || '#000000'; 
          return {
            color: color, // Warna ditetapkan dari kabupatenColors
            weight: 3,
            opacity: 0.7,
            fillOpacity: 0.2, // Pastikan ada fillOpacity agar warna muncul
            fillColor: color // Tambahkan fillColor agar batasnya berwarna
          };
        },
        onEachFeature: (feature, layer) => {
          // Tampilkan popup dengan nama kabupaten
          layer.bindPopup(`<h3>${feature.properties.NAMOBJ}</h3>`);
        },
      }).addTo(map);
      setBoundaryLayer(newBoundaryLayer);
    }
  };

  // Memanggil fungsi untuk menampilkan batas kabupaten saat komponen pertama kali dimuat
  useEffect(() => {
    if (map) {
      toggleBoundaryLayer();
    }
  }, [map]);

  // Fungsi untuk memuat layer titik pemantauan udara
    const loadAirPointLayer = async (layer, setLayer, url, color) => {
      if (layer) {
          map.removeLayer(layer);
          setLayer(null);
      }

      const pointData = await loadGeoJsonData(url);
      const newLayer = L.geoJSON(pointData, {
          pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, {
                  radius: 6,
                  fillColor: color,
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
              });
          },
          onEachFeature: (feature, layer) => {
              const { Kode, Kabupaten, Nama_Lokasi, Kategori, Alamat, Foto } = feature.properties;
              const { x, y } = feature.properties;

              // Mengakses properti dengan tanda kurung menggunakan bracket notation
              const Tahap_1_NO2 = feature.properties["Tahap_1_Kadar_NO2_(µg/m3)"];
              const Tahap_2_NO2 = feature.properties["Tahap_2_Kadar_NO2_(µg/m3)"];
              const Tahap_1_SO2 = feature.properties["Tahap_1_Kadar_SO2_(µg/m3)"];
              const Tahap_2_SO2 = feature.properties["Tahap_2_Kadar_SO2_(µg/m3)"];

              layer.bindPopup(`
                  <div style="max-height: 400px; overflow-y: auto; font-size: 10px; width: 250px; padding: 10px;">
                      <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 10px;">${Nama_Lokasi}</h3>
                      <div style="width: 100%; height: 150px; overflow: hidden; display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
                          <img src="${Foto}" alt="Foto Lokasi" style="width: 100%; height: auto; object-fit: cover; max-height: 100%;"/>
                      </div>
                      <table style="font-size: 10px; width: 100%; border-collapse: collapse;">
                          <tr>
                              <td style="padding: 2px;"><b>Kode</b></td>
                              <td style="padding: 2px;">${Kode}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Kabupaten</b></td>
                              <td style="padding: 2px;">${Kabupaten}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Koordinat</b></td>
                              <td style="padding: 2px;">x: ${x.toFixed(6)}, y: ${y.toFixed(6)}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Kategori</b></td>
                              <td style="padding: 2px;">${Kategori}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Nama Lokasi</b></td>
                              <td style="padding: 2px;">${Nama_Lokasi}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Alamat Lokasi</b></td>
                              <td style="padding: 2px;">${Alamat}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Kadar NO2 Tahap 1 (µg/m³)</b></td>
                              <td style="padding: 2px;">${Tahap_1_NO2}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Kadar NO2 Tahap 2 (µg/m³)</b></td>
                              <td style="padding: 2px;">${Tahap_2_NO2}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Kadar SO2 Tahap 1 (µg/m³)</b></td>
                              <td style="padding: 2px;">${Tahap_1_SO2}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px;"><b>Kadar SO2 Tahap 2 (µg/m³)</b></td>
                              <td style="padding: 2px;">${Tahap_2_SO2}</td>
                          </tr>
                      </table>
                  </div>
              `);
          }
      }).addTo(map);

      newLayer.bringToFront();
      setLayer(newLayer);
  };


  // Toggle layer visibility based on checkbox status
  const handleLayerToggle = (checked, layerName) => {
    switch (layerName) {
      case 'boundary':
        setShowBoundary(checked);
        if (checked) {
          toggleBoundaryLayer();
        } else {
          if (boundaryLayer) map.removeLayer(boundaryLayer);
        }
        break;
      case 'udara':
        setShowUdaraLayer(checked);
        if (checked) {
          loadAirPointLayer(udaraLayer, setUdaraLayer, '/map/titikUdara.geojson', pointColors.udara);
        } else {
          if (udaraLayer) map.removeLayer(udaraLayer);
        }
      break;
      default:
        break;
    }
  };

  // Fungsi untuk menangani perubahan tahun
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setIsYearFilterOpen(false);
    
    if (year === 2023) {
      // Tampilkan layer list atau data untuk tahun 2023
      showLayerList();
    } else {
      // Sembunyikan layer list jika tahun bukan 2023
      hideLayerList();
    }
  };

  return (
    <div>
  {/* Navbar */}
  <nav style={{ backgroundColor: '#79AC78', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          <h1 style={{ margin: 0, color: 'white', fontSize: '1.3 rem' }}>Peta Titik Pemantauan Kualitas Air Sungai DIY</h1>
        </div>

        {/* Icon Group */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Icon Layer List */}
          <FaLayerGroup
            style={{ fontSize: '1.3rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={() => handlePopupToggle('isLayerListOpen')}
          />

          {/* Icon Year Filter */}
          <FaCalendarAlt
            style={{ fontSize: '1.3rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={() => handlePopupToggle('isYearFilterOpen')}
          />

          {/* Icon Legend */}
          <FaInfoCircle
            style={{ fontSize: '1.3rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={() => handlePopupToggle('isLegendOpen')}
          />
        </div>

        {/* Layer List Pop-up */}
        {activePopup === 'isLayerListOpen' && (
          <div style={popupStyle}>
            <h3 style={popupHeaderStyle}>Layer List</h3>

            {/* Checkbox untuk Batas Kabupaten */}
            <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
              <input 
                type="checkbox" 
                checked={showBoundary} 
                onChange={(e) => handleLayerToggle(e.target.checked, 'boundary')} 
                style={inputStyle} 
              />
              Batas Kabupaten
            </label>
            <br />
            {/* Checkbox untuk Layer Pemantauan Udara */}
            <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
              <input 
                type="checkbox" 
                checked={showUdaraLayer} 
                onChange={(e) => handleLayerToggle(e.target.checked, 'udara')} 
                style={inputStyle} 
              />
              Titik Pemantauan Udara
            </label>
          </div>
        )}


      {/* Year Filter Pop-up */}
      {activePopup === 'isYearFilterOpen' && (
        <div style={popupStyle}>
          <h3 style={popupHeaderStyle}>Filter Tahun</h3>
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input
              type="radio"
              name="year"
              value="2023"
              checked={selectedYear === 2023}
              onChange={() => handleYearChange(2023)} style={inputStyle}
            />
            2023
          </label>
          <br />
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input
              type="radio"
              name="year"
              value="2022"
              checked={selectedYear === 2022}
              onChange={() => handleYearChange(2022)} style={inputStyle}
            />
            2022
          </label>
          <br />
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input
              type="radio"
              name="year"
              value="2021"
              checked={selectedYear === 2021}
              onChange={() => handleYearChange(2021)} style={inputStyle}
            />
            2021
          </label>
        </div>
      )}

      {/* Legend Pop-up */}
      {activePopup === 'isLegendOpen' && (
        <div style={popupStyle}>
          <h3 style={popupHeaderStyle}>Legenda</h3>
          
          {/* Legenda Titik Pemantauan Udara */}
            <div style={popupContentStyle}>
              <b>Titik Pemantauan Kualitas Udara</b>
              <div style={legendItemStyle}>
                <span style={{ ...legendCircleStyle, backgroundColor: pointColors.udara }}></span> Udara Pemantauan
              </div>
            </div>

          {/* Legenda Batas Kabupaten */}
            <div style={popupContentStyle}>
              <b>Batas Kabupaten</b>
              {Object.keys(kabupatenColors).map(kabupaten => (
                <div key={kabupaten} style={legendItemStyle}>
                  <span style={{ ...legendSquareStyle, backgroundColor: kabupatenColors[kabupaten] }}></span> {kabupaten}
                </div>
              ))}
            </div>
          </div>
        )}
        </nav>

      {/* Peta */}
      <div id="map" style={{ height: '580px' }}></div>

      {/* Koordinat */}
      {coords.lat && coords.lng && (
        <div style={{ position: 'absolute', bottom: '5px', left: '5px', backgroundColor: 'white', padding: '2px', borderRadius: '2px', zIndex: '1000' }}>
          Koordinat: {coords.lat}, {coords.lng}
        </div>
      )}
    </div>
  );
};

// Gaya CSS untuk pop-up
const popupStyle = {
  position: 'absolute',
  top: '55px',
  right: '7px',
  backgroundColor: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 0 15px rgba(0,0,0,0.3)',
  zIndex: 1000,
  minWidth: '230px',
  width: 'auto'
};

const popupHeaderStyle = {
  margin: '0 0 10px 0',
  fontSize: '0.7rem', // Ukuran font yang diinginkan
  fontWeight: 'bold', // Menjadikan teks bold
  borderBottom: '1px solid #ccc',
  paddingBottom: '10px',
  marginBottom: '10px'
};

const popupContentStyle = {
  marginBottom: '10px',
  fontSize: '0.7rem', // Ukuran font yang sama dengan header
  fontWeight: 'normal', // Teks tidak bold
  fontFamily: 'Arial, sans-serif', // Ganti dengan tipe font yang diinginkan
};

const checkboxLabelStyle = {
  alignItems: 'center', // Untuk memastikan checkbox dan teks sejajar
  fontSize: '0.7rem',
  marginBottom: '10px',
  display: 'inline-block', // Supaya labelnya tidak terlalu panjang
  verticalAlign: 'middle' // Supaya sejajar secara vertikal
};

const inputStyle = {
  verticalAlign: 'middle', // Untuk menyejajarkan input dengan teks
  marginRight: '5px' // Jarak antara checkbox/radio button dengan teks
};

const legendItemStyle = {
  alignItems: 'center',
  marginTop: '5px'
};

// Gaya untuk lingkaran (Titik Pemantauan)
const legendCircleStyle = {
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: '50%', // Tetap menggunakan lingkaran
  marginRight: '10px'
};

// Gaya untuk persegi (Batas Kabupaten dan Sub DAS)
const legendSquareStyle = {
  display: 'inline-block',
  width: '10px',
  height: '10px',
  marginRight: '10px' // Tanpa borderRadius agar tetap berbentuk persegi
};

const coordStyle = {
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '5px 10px',
  borderRadius: '4px',
  fontSize: '1rem',
  zIndex: 1000
};

export default AirQualityMap;
