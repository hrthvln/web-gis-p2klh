import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import Joyride from 'react-joyride';
import { FaLayerGroup, FaInfoCircle, FaCalendarAlt, FaDownload } from 'react-icons/fa'; // Import icon dari react-icons
import logo from '../assets/logo.png'; // Sesuaikan jalur logo
import '../styles/webgis.css';
import TourSteps from '../components/TourSteps';

const SeaWaterQualityMap = () => {
  const [map, setMap] = useState(null);
  const [boundaryLayer, setBoundaryLayer] = useState(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [showBoundary, setShowBoundary] = useState(true);

  const [isLayerListOpen, setIsLayerListOpen] = useState(false); // State untuk toggle Layer List
  const [isLegendOpen, setIsLegendOpen] = useState(false); // State untuk toggle Legend
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false); // State untuk toggle Year Filter
  const [selectedYear, setSelectedYear] = useState(2023); // State untuk tahun terpilih
  const [activePopup, setActivePopup] = useState(null);

  // State untuk layer pemantauan air laut
  const [oneSeaLayer, setOneSeaLayer] = useState(null); 
  const [showOneSeaLayer, setShowOneSeaLayer] = useState(true); // Visibility dari layer laut periode 1
  const [twoSeaLayer, setTwoSeaLayer] = useState(null); 
  const [showTwoSeaLayer, setShowTwoSeaLayer] = useState(true); // Visibility dari layer laut
  const [selectedFile, setSelectedFile] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [run, setRun] = useState(true);


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
    oneSea: '#0000ff',
    twoSea: '#ff7800'
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
    const initialMap = L.map('map', {
      zoomControl: false, // Disable default zoom control
    }).setView([-7.797068, 110.370529], 10); // Koordinat DIY
  
    // Tambahkan tile layer
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: 'Map data © Google',
    }).addTo(initialMap);
  
    // Tambahkan Locate Control untuk menentukan lokasi pengguna
    L.control.locate({
      position: 'bottomright',
      flyTo: true,
      strings: {
        title: "Lokasi Saya",
      },
    }).addTo(initialMap);
  
    // Tambahkan kontrol zoom di pojok kanan bawah
    const zoomControl = L.control.zoom({
      position: 'bottomright',
    }).addTo(initialMap);
  
    // Atur gaya CSS secara bersamaan setelah kontrol ditambahkan
    setTimeout(() => {
      const locateControl = document.querySelector('.leaflet-control-locate');
      const zoomControl = document.querySelector('.leaflet-control-zoom');
  
      // Gaya untuk kontrol lokasi
      locateControl.style.marginBottom = '7px';
      locateControl.style.transform = 'scale(0.8)';
      locateControl.style.left = 'auto'; // Menghapus posisi kiri default
      locateControl.style.right = '13px'; // Menambahkan margin ke kanan
  
      // Gaya untuk kontrol zoom
      zoomControl.style.marginBottom = '4px'; // Beri jarak antara kontrol zoom dan lokasi
      zoomControl.style.transform = 'scale(0.8)';
      zoomControl.style.left = 'auto'; // Menghapus posisi kiri default
      zoomControl.style.right = '13px'; // Menambahkan margin ke kanan
    }, 0);
  
    // Kontrol khusus untuk menampilkan koordinat di pojok kiri bawah
    const coordsControl = L.control({ position: 'bottomleft' });
    coordsControl.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-control-latlng');
      div.style.background = 'rgba(255, 255, 255, 0.7)';
      div.style.padding = '2px';
      div.style.fontSize = '11px';
      div.innerHTML = 'Latitude: 0.000000 | Longitude: 0.000000';
      return div;
    };
    coordsControl.addTo(initialMap);
  
    // Event listener untuk memperbarui koordinat kursor
    initialMap.on('mousemove', function (e) {
      const { lat, lng } = e.latlng;
      document.querySelector('.leaflet-control-latlng').innerHTML = `Latitude: ${lat.toFixed(6)} | Longitude: ${lng.toFixed(6)}`;
    });
  
    // Event listener untuk memperbarui koordinat saat peta diklik
    initialMap.on('click', function (e) {
      const { lat, lng } = e.latlng;
      document.querySelector('.leaflet-control-latlng').innerHTML = `Latitude: ${lat.toFixed(6)} | Longitude: ${lng.toFixed(6)}`;
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (activePopup !== null) {
        const popupContainer = document.querySelector(`.popup-container.popup-${activePopup}`);
        if (popupContainer && !popupContainer.contains(event.target)) {
          handlePopupToggle(null); // Tutup popup
        }
      }
    };
  
    document.addEventListener('click', handleOutsideClick);
  
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [activePopup, handlePopupToggle]);
  
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
      // Tambahkan layer Batas Kabupaten terlebih dahulu
      toggleBoundaryLayer().then(() => {
        if (boundaryLayer) boundaryLayer.bringToBack();  // Pastikan layer Batas Kabupaten berada di bawah
  
        // Kemudian tambahkan layer Titik Pemantauan Laut Periode Satu
        loadSeaPointLayer(oneSeaLayer, setOneSeaLayer, '/map/titikLaut1.geojson', pointColors.oneSea);
      });
      
      // Jangan tampilkan layer Titik Pemantauan Laut Periode Dua saat halaman pertama kali dimuat
      setShowTwoSeaLayer(false);
    }
  }, [map]);

  // Fungsi untuk memuat layer titik pemantauan udara
  const loadSeaPointLayer = async (layer, setLayer, url, color) => {
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
        const { Lokasi, X, Y, TSS, DO, M_L, Amonia, Ortofosfat, Peruntukan, Image } = feature.properties;

        layer.bindPopup(`
          <div style="font-size: 10px; width: 250px; padding: 10px; position: relative; font-family: Arial, sans-serif; line-height: 1.5;">
            <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 10px; text-align: center;">${Lokasi}</h3>
            <div style="width: 100%; height: 150px; overflow: hidden; display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
              <img src="${Image}" alt="Foto Lokasi" style="width: 100%; height: auto; object-fit: cover; max-height: 100%;"/>
            </div>
            <div style="max-height: 120px; overflow-y: auto; margin-top: 5px; text-align: left;">
              <table style="font-size: 10px; width: 100%; border-collapse: collapse; text-align: left;">
                <tr>
                  <td style="padding: 2px; font-weight: bold; vertical-align: top;">Koordinat</td>
                  <td style="padding: 4px; vertical-align: top;">x: ${X.toFixed(6)}, y: ${Y.toFixed(6)}</td>
                </tr>
                <tr>
                  <td style="padding: 2px; font-weight: bold; vertical-align: top;">Peruntukan</td>
                  <td style="padding: 4px; vertical-align: top;">${Peruntukan}</td>
                </tr>
                <tr>
                  <td style="padding: 2px; font-weight: bold; vertical-align: top;">Total Suspended Solid (mg/L)</td>
                  <td style="padding: 4px; vertical-align: top;">${TSS}</td>
                </tr>
                <tr>
                  <td style="padding: 2px; font-weight: bold; vertical-align: top;">Dissolved Oxygen (mg/L)</td>
                  <td style="padding: 4px; vertical-align: top;">${DO}</td>
                </tr>
                <tr>
                  <td style="padding: 2px; font-weight: bold; vertical-align: top;">Minyak & Lemak (mg/L)</td>
                  <td style="padding: 4px; vertical-align: top;">${M_L}</td>
                </tr>
                <tr>
                  <td style="padding: 2px; font-weight: bold; vertical-align: top;">Amonia Total (mg/L)</td>
                  <td style="padding: 4px; vertical-align: top;">${Amonia}</td>
                </tr>
                <tr>
                  <td style="padding: 2px; font-weight: bold; vertical-align: top;">Ortofosfat (PO4-P) (mg/L)</td>
                  <td style="padding: 4px; vertical-align: top;">${Ortofosfat}</td>
                </tr>
              </table>
            </div>
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
      case 'oneSea':
        setShowOneSeaLayer(checked);
        if (checked) {
          loadSeaPointLayer(oneSeaLayer, setOneSeaLayer, '/map/titikLaut1.geojson', pointColors.oneSea);
          if (oneSeaLayer) oneSeaLayer.bringToFront(); // Layer Titik Pemantauan di atas Batas Kabupaten
        } else {
          if (oneSeaLayer) map.removeLayer(oneSeaLayer);
        }
        break;
      case 'twoSea':
        setShowTwoSeaLayer(checked);
        if (checked) {
          loadSeaPointLayer(twoSeaLayer, setTwoSeaLayer, '/map/titikLaut2.geojson', pointColors.twoSea);
          if (twoSeaLayer) twoSeaLayer.bringToFront(); // Layer Titik Pemantauan di atas Batas Kabupaten
        } else {
          if (twoSeaLayer) map.removeLayer(twoSeaLayer);
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

  const handleDownload = () => {
    if (selectedFile) {
      // Gunakan import.meta.env.BASE_URL untuk Vite
      const fileUrl = `${import.meta.env.BASE_URL}file/sea/${encodeURIComponent(selectedFile)}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = selectedFile; // Nama file saat diunduh
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Silakan pilih file untuk diunduh!');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="navbar-title">Pemantauan Kualitas Air Laut DIY</h1>
        </div>
  
        {/* Group Elemen */}
        <div className="navbar-items">
        <div className="dropdown-container">
          <label htmlFor="file-select" className="dropdown-label">
            Download:
          </label>
          <div className="dropdown-wrapper">
            <select
              id="file-select"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="dropdown-select"
            >
              <option style={{ color: 'black' }} value="">-- Pilih File --</option>
              <option style={{ color: 'black' }} value="Data Kualitas Air Laut Tahun 2023.pdf">Data Kualitas Air Laut Tahun 2023.pdf</option>
            </select>
            <span className="dropdown-icon">▼</span>
          </div>

  
            {/* Tombol untuk mengunduh data */}
            <button className="export-data-button" onClick={handleDownload}>
              <FaDownload />
            </button>
          </div>

  
            {/* Icons */}
            <div className="icon-container">
              <FaLayerGroup
                className="layer-icon"
                onClick={() => handlePopupToggle('isLayerListOpen')}
              />
              <FaCalendarAlt
                className="year-icon"
                onClick={() => handlePopupToggle('isYearFilterOpen')}
              />
              <FaInfoCircle
                className="legend-icon"
                onClick={() => handlePopupToggle('isLegendOpen')}
              />
            </div>
          </div>  

          {/* Layer List Pop-up */}
          {activePopup === 'isLayerListOpen' && (
            <div className="popup-container popup-layer-list">
              <h3 className="popup-header">Daftar Layer</h3>

              {/* Checkbox untuk Batas Kabupaten */}
              <label className="popup-checkbox-label">
                <input
                  type="checkbox"
                  checked={showBoundary}
                  onChange={(e) => handleLayerToggle(e.target.checked, 'boundary')}
                  className="popup-checkbox-input"
                />
                Batas Kabupaten DIY
              </label>
              <br />
              {/* Checkbox untuk Layer Pemantauan Air Laut Periode Satu */}
              <label className="popup-checkbox-label">
                <input
                  type="checkbox"
                  checked={showOneSeaLayer}
                  onChange={(e) => handleLayerToggle(e.target.checked, 'oneSea')}
                  className="popup-checkbox-input"
                />
                Titik Pemantauan Air Laut Periode 1
              </label>
              <br />
              {/* Checkbox untuk Layer Pemantauan Air Laut Periode Dua */}
              <label className="popup-checkbox-label">
                <input
                  type="checkbox"
                  checked={showTwoSeaLayer}
                  onChange={(e) => handleLayerToggle(e.target.checked, 'twoSea')}
                  className="popup-checkbox-input"
                />
                Titik Pemantauan Air Laut Periode 2
              </label>
            </div>
          )}

          {/* Year Filter Pop-up */}
          {activePopup === 'isYearFilterOpen' && (
            <div className="popup-container popup-year-filter">
              <h3 className="popup-header">Tahun</h3>
              <label className="popup-checkbox-label">
                <input
                  type="radio"
                  name="year"
                  value="2023"
                  checked={selectedYear === 2023}
                  onChange={() => handleYearChange(2023)}
                  className="popup-radio-input"
                />
                2023
              </label>
              <br />
              <label className="popup-checkbox-label">
                <input
                  type="radio"
                  name="year"
                  value="2024"
                  checked={selectedYear === 2024}
                  onChange={() => handleYearChange(2024)}
                  className="popup-radio-input"
                />
                2024
              </label>
            </div>
          )}

          {/* Legend Pop-up */}
          {activePopup === 'isLegendOpen' && (
            <div className="popup-container popup-legend">
              <h3 className="popup-header">Legenda</h3>

              {/* Legenda Titik Pemantauan Air Laut */}
              <div className="popup-content">
                <b>Titik Pemantauan Kualitas Air Laut</b>
                <div className="legend-item">
                  <span className="legend-circle legend-circle-oneSea"></span> Periode 1
                </div>
                <div className="legend-item">
                  <span className="legend-circle legend-circle-twoSea"></span> Periode 2
                </div>
              </div>

              {/* Legenda Batas Kabupaten */}
              <div className="popup-content">
                <b>Batas Kabupaten</b>
                {Object.keys(kabupatenColors).map((kabupaten) => (
                  <div key={kabupaten} className="legend-item">
                    <span
                      className="legend-square"
                      style={{ backgroundColor: kabupatenColors[kabupaten] }}
                    ></span>{' '}
                    {kabupaten}
                  </div>
                ))}
              </div>
            </div>
          )}
      </nav>
    
    {/* Map */}
    <div id="map" className="map"></div>

    {/* Komponen Header */}
    <div className="header-sea-water"></div>

    {/* Komponen Informasi */}
    <div className="information-sea-water"></div>

    {/* React Joyride */}
    <Joyride
        steps={TourSteps}
        run={run}
        continuous
        showSkipButton
        styles
      />
      
    </div>
  );
};

  


export default SeaWaterQualityMap;