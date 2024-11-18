import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import { FaLayerGroup, FaInfoCircle, FaCalendarAlt, FaDownload } from 'react-icons/fa'; // Import icon dari react-icons
import logo from '../assets/logo.png'; // Sesuaikan jalur logo

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

  // State untuk layer pemantauan udara
  const [oneSeaLayer, setOneSeaLayer] = useState(null); 
  const [showOneSeaLayer, setShowOneSeaLayer] = useState(true); // Visibility dari layer laut periode 1
  const [twoSeaLayer, setTwoSeaLayer] = useState(null); 
  const [showTwoSeaLayer, setShowTwoSeaLayer] = useState(true); // Visibility dari layer laut
  const [selectedFile, setSelectedFile] = useState('');




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
  
      // Gaya untuk kontrol zoom
      zoomControl.style.marginBottom = '4px'; // Beri jarak antara kontrol zoom dan lokasi
      zoomControl.style.transform = 'scale(0.8)';
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
                              <td style="padding: 2px; font-weight: bold; vertical-align: top;">Total Suspended Solid</td>
                              <td style="padding: 4px; vertical-align: top;">${TSS}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px; font-weight: bold; vertical-align: top;">Dissolved Oxygen</td>
                              <td style="padding: 4px; vertical-align: top;">${DO}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px; font-weight: bold; vertical-align: top;">Minyak & Lemak</td>
                              <td style="padding: 4px; vertical-align: top;">${M_L}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px; font-weight: bold; vertical-align: top;">Amonia Total</td>
                              <td style="padding: 4px; vertical-align: top;">${Amonia}</td>
                          </tr>
                          <tr>
                              <td style="padding: 2px; font-weight: bold; vertical-align: top;">Ortofosfat (PO4-P)</td>
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
  <nav style={{ backgroundColor: '#0096c7', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={logo} alt="Logo" style={{ height: '35px', marginRight: '10px' }} />
          <h1 style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>Peta Titik Pemantauan Kualitas Air Laut DIY</h1>
        </div>

        {/* Group Elemen */}
         <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>

        {/* Dropdown untuk memilih format unduhan */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px', position: 'relative' }}>
          <label htmlFor="file-select" style={{ color: 'white', marginRight: '5px', fontSize: '0.7rem' }}>
            Export Data:
          </label>
          <select
            id="file-select"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            style={{
              marginRight: '1px',
              padding: '2px 5px',
              fontSize: '0.7rem',
              color: 'white',
              backgroundColor: 'transparent',
              border: '1px solid white',
              borderRadius: '4px',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              paddingRight: '20px', // Untuk memberi ruang bagi tanda panah
            }}
          >
            <option style={{ color: 'black', backgroundColor: 'white' }} value="">-- Pilih File --</option>
            <option style={{ color: 'black', backgroundColor: 'white' }} value="Data Kualitas Air Laut 2023.xlsx">Data Kualitas Air Laut 2023.xlsx</option>
          </select>
          {/* Tanda panah V di sebelah kanan dropdown */}
          <span style={{
            position: 'absolute',
            right: '8px',
            pointerEvents: 'none', // Agar tanda panah tidak mengganggu fungsi dropdown
            color: 'white',
            fontSize: '0.6rem',
          }}>▼</span>
        </div>


        {/* Tombol untuk mengunduh data */}
        <button onClick={handleDownload} style={{ cursor: 'pointer', fontSize: '1rem', padding: '3px 6px', marginRight: '40px', color: 'white' }}>
          <FaDownload />
        </button>
        
        {/* Icon Layer List */}
          <FaLayerGroup
            style={{ fontSize: '1.1rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={() => handlePopupToggle('isLayerListOpen')}
          />

          {/* Icon Year Filter */}
          <FaCalendarAlt
            style={{ fontSize: '1.1rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={() => handlePopupToggle('isYearFilterOpen')}
          />

          {/* Icon Legend */}
          <FaInfoCircle
            style={{ fontSize: '1.1rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
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
              {/* Checkbox untuk Layer Pemantauan Air Laut Periode Satu */}
              <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
                <input 
                  type="checkbox" 
                  checked={showOneSeaLayer} 
                  onChange={(e) => handleLayerToggle(e.target.checked, 'oneSea')} 
                  style={inputStyle} 
                />
                Titik Pemantauan Air Laut Periode 1
              </label>
              <br />
              {/* Checkbox untuk Layer Pemantauan Air Laut Periode Dua */}
              <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
                <input 
                  type="checkbox" 
                  checked={showTwoSeaLayer} 
                  onChange={(e) => handleLayerToggle(e.target.checked, 'twoSea')} 
                  style={inputStyle} 
                />
                Titik Pemantauan Air Laut Periode 2
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
              value="2024"
              checked={selectedYear === 2024}
              onChange={() => handleYearChange(2024)} style={inputStyle}
            />
            2024
          </label>
        </div>
      )}

      {/* Legend Pop-up */}
      {activePopup === 'isLegendOpen' && (
        <div style={popupStyle}>
          <h3 style={popupHeaderStyle}>Legenda</h3>

          {/* Legenda Titik Pemantauan Air Laut */}
            <div style={popupContentStyle}>
              <b>Titik Pemantauan Kualitas Air Laut</b>
                <div style={legendItemStyle}><span style={{ ...legendCircleStyle, backgroundColor: pointColors.oneSea }}></span> Periode 1</div>
                <div style={legendItemStyle}><span style={{ ...legendCircleStyle, backgroundColor: pointColors.twoSea }}></span> Periode 2</div>
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
      <div id="map" style={{ height: '586px' }}></div>

    </div>
  );
};

// Gaya CSS untuk pop-up
const popupStyle = {
  position: 'absolute',
  top: '50px',
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


export default SeaWaterQualityMap;