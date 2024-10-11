import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import { FaLayerGroup, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa'; // Import icon dari react-icons
import logo from '../assets/logo.png'; // Sesuaikan jalur logo

const RiverWaterQualityMap = () => {
  const [map, setMap] = useState(null);
  const [boundaryLayer, setBoundaryLayer] = useState(null);
  const [febLayer, setFebLayer] = useState(null);
  const [junLayer, setJunLayer] = useState(null);
  const [oktLayer, setOktLayer] = useState(null);
  const [ikaLayer, setIkaLayer] = useState(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [subDasLayer, setSubDasLayer] = useState(null);

  const [showBoundary, setShowBoundary] = useState(true);
  const [showFebLayer, setShowFebLayer] = useState(true);
  const [showJunLayer, setShowJunLayer] = useState(true);
  const [showOktLayer, setShowOktLayer] = useState(true);
  const [showIkaLayer, setShowIkaLayer] = useState(true);
  const [showSubDas, setShowSubDas] = useState(true);
  
  const [isLayerListOpen, setIsLayerListOpen] = useState(false); // State untuk toggle Layer List
  const [isLegendOpen, setIsLegendOpen] = useState(false); // State untuk toggle Legend
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false); // State untuk toggle Year Filter
  const [selectedYear, setSelectedYear] = useState(2023); // State untuk tahun terpilih
  const [activePopup, setActivePopup] = useState(null);

  // Warna yang ditetapkan untuk setiap kabupaten
  const kabupatenColors = {
    'Sleman': '#2c7fb8',
    'Bantul': '#FFE400',
    'Gunungkidul': '#d95f0e',
    'Kulon Progo': '#379237',
    'Kota Yogyakarta': '#dd1c77'
  };

    // Warna yang ditetapkan untuk setiap kabupaten
    const subDasColors = {
    'SubDAS1': '#ff4500',
    'SubDAS2': '#ff6347',
    'SubDAS3': '#ffa07a',
    'SubDAS4': '#20b2aa',
    'SubDAS5': '#4682b4',
    'SubDAS6': '#8a2be2',
    'SubDAS7': '#5f9ea0',
    'SubDAS8': '#d2691e',
    'SubDAS9': '#ff69b4',
    'SubDAS10': '#cd5c5c',
    'SubDAS11': '#ffa500'
    };

  // Warna untuk setiap periode
  const pointColors = {
    februari: "#ff7800",
    juni: "#00ff00", //   untuk Juni
    oktober: "#0000ff", // Biru untuk Oktober
    ika: "#ff00ff", // Warna untuk IKA
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

    // Event listener untuk menampilkan koordinat kursor
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
          const color = kabupatenColors[kabupaten] || '#000000'; 
          return {
            color: color, 
            weight: 3,
            opacity: 0.7,
            fillOpacity: 0.2, 
            fillColor: color 
          };
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`<h3>${feature.properties.NAMOBJ}</h3>`);
        },
      }).addTo(map);
      setBoundaryLayer(newBoundaryLayer);
    }
  };

// Fungsi untuk memuat dan mengaktifkan subDAS layer (batas sub DAS)
  const togglesubDasLayer = async () => {
    if (subDasLayer) {
      map.removeLayer(subDasLayer);
      setSubDasLayer(null);
    } else {
      const subDasData = await loadGeoJsonData('/map/batasSubDAS_cleaned.geojson');
      const newsubDasLayer = L.geoJSON(subDasData, {
        style: (feature) => {
          const subDas = feature.properties.NAMOBJ;
          const color = subDasColors[subDas] || '#000000'; 
          return {
            color: color, 
            weight: 3,
            opacity: 0.7,
            fillOpacity: 0.2, 
            fillColor: color 
          };
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`<h3>${feature.properties.NAMOBJ}</h3>`);
        },
      }).addTo(map);
      setSubDasLayer(newsubDasLayer); 
    }
  };


  // Fungsi untuk memuat titik-titik per periode
  const loadPointLayer = async (layer, setLayer, url, color, ipField) => {
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
        const { Sungai, Lokasi, PL, Status, Image, TSS, DO, COD, pH, Nitrat, T_Fosfat, BOD, BKT } = feature.properties; // Menambahkan semua properti yang diperlukan
        const [lng, lat] = feature.geometry.coordinates; // Pastikan urutannya benar (lng, lat)
        
        // Ambil nilai indeks pencemaran sesuai periode
        const ipDisplay = feature.properties[ipField] !== undefined ? feature.properties[ipField] : 'Data tidak tersedia';

        layer.bindPopup(`
          <h3 style="font-size: 14px; font-weight: bold;">${Sungai}</h3> <!-- Nama sungai dengan ukuran font kecil dan bold -->
          <img src="${Image}" alt="Foto Lokasi" style="width: 100%; height: auto;"/><br/> <!-- Gambar lokasi -->
          <table style="font-size: 12px; width: 100%;">
            <tr><td><b>Koordinat:</b></td><td>x: ${lng}, y: ${lat}</td></tr>
            <tr><td><b>Lokasi:</b></td><td>${Lokasi}</td></tr>
            <tr><td><b>Penggunaan Lahan Radius 1000m:</b></td><td>${PL}</td></tr>
            <tr><td><b>Indeks Pencemaran:</b></td><td>${ipDisplay}</td></tr>
            <tr><td><b>Status:</b></td><td>${Status}</td></tr>
            <tr><td><b>Residu Tersuspensi (TSS):</b></td><td>${TSS}</td></tr>
            <tr><td><b>Oksigen Terlarut (DO):</b></td><td>${DO}</td></tr>
            <tr><td><b>COD:</b></td><td>${COD}</td></tr>
            <tr><td><b>pH:</b></td><td>${pH}</td></tr>
            <tr><td><b>Nitrat:</b></td><td>${Nitrat}</td></tr>
            <tr><td><b>Total Fosfat:</b></td><td>${T_Fosfat}</td></tr>
            <tr><td><b>BOD:</b></td><td>${BOD}</td></tr>
            <tr><td><b>Bakteri Koli Tinja:</b></td><td>${BKT}</td></tr>
          </table>
        `);
      }
    }).addTo(map);

    newLayer.bringToFront(); // Pastikan layer titik selalu di depan
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
      case 'february':
        setShowFebLayer(checked);
        if (checked) {
          loadPointLayer(febLayer, setFebLayer, '/map/titikFebruari_cleaned.geojson', pointColors.februari, 'IP_Feb');
        } else {
          if (febLayer) map.removeLayer(febLayer);
        }
        break;
      case 'june':
        setShowJunLayer(checked);
        if (checked) {
          loadPointLayer(junLayer, setJunLayer, '/map/titikJuni_cleaned.geojson', pointColors.juni, 'IP_Jun');
        } else {
          if (junLayer) map.removeLayer(junLayer);
        }
        break;
      case 'october':
        setShowOktLayer(checked);
        if (checked) {
          loadPointLayer(oktLayer, setOktLayer, '/map/titikOktober_cleaned.geojson', pointColors.oktober, 'IP_Okt');
        } else {
          if (oktLayer) map.removeLayer(oktLayer);
        }
        break;
      case 'ika':
        setShowIkaLayer(checked);
        if (checked) {
          loadPointLayer(ikaLayer, setIkaLayer, '/map/titikIKA_cleaned.geojson', pointColors.ika, 'IP_Ika');
        } else {
          if (ikaLayer) map.removeLayer(ikaLayer);
        }
        break;
      case 'subDas':
        setShowSubDas(checked);
        if (checked) {
          togglesubDasLayer();
        } else {
          if (subDasLayer) map.removeLayer(subDasLayer);
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
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input type="checkbox" checked={showBoundary} onChange={(e) => handleLayerToggle(e.target.checked, 'boundary')} style={inputStyle} />
            Batas Kabupaten
          </label>
          <br />
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input type="checkbox" checked={showFebLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'february')} style={inputStyle} />
            Periode Februari
          </label>
          <br />
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input type="checkbox" checked={showJunLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'june')} style={inputStyle} />
            Periode Juni
          </label>
          <br />
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input type="checkbox" checked={showOktLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'october')} style={inputStyle} />
            Periode Oktober
          </label>
          <br />
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input type="checkbox" checked={showIkaLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'ika')} style={inputStyle} />
            Nilai IKA DIY
          </label>
          <br />
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input type="checkbox" checked={showSubDas} onChange={(e) => handleLayerToggle(e.target.checked, 'subDas')} style={inputStyle}/>
            Batas Sub Das DIY
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
          <div style={popupContentStyle}>
            <b>Titik Pemantauan Kualitas Air Sungai</b>
            <div style={legendItemStyle}><span style={{ ...legendCircleStyle, backgroundColor: pointColors.februari }}></span> Februari</div>
            <div style={legendItemStyle}><span style={{ ...legendCircleStyle, backgroundColor: pointColors.juni }}></span> Juni</div>
            <div style={legendItemStyle}><span style={{ ...legendCircleStyle, backgroundColor: pointColors.oktober }}></span> Oktober</div>
          </div>
          <div style={popupContentStyle }>
            <b>Batas Kabupaten</b>
            {Object.keys(kabupatenColors).map(kabupaten => (
              <div key={kabupaten} style={legendItemStyle}>
                <span style={{ ...legendSquareStyle, backgroundColor: kabupatenColors[kabupaten] }}></span> {kabupaten}
              </div>
            ))}
          </div>
          <div style={popupContentStyle}>
            <b>Batas Sub DAS</b>
            {Object.keys(subDasColors).map(subDasLayer => (
              <div key={subDasLayer} style={legendItemStyle}>
                <span style={{ ...legendSquareStyle, backgroundColor: subDasColors[subDasLayer] }}></span> {subDasLayer}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>

      {/* Peta */}
      <div id="map" style={{ height: '615px' }}></div>

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
  padding: '20px',
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

export default RiverWaterQualityMap;
