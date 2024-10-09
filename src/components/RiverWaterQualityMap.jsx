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
      'SubDAS1': '#2c7fb8',
      'SubDAS2': '#2c7fb8',
      'SubDAS3': '#2c7fb8',
      'SubDAS4': '#2c7fb8',
      'SubDAS5': '#2c7fb8',
      'SubDAS6': '#2c7fb8',
      'SubDAS7': '#2c7fb8',
      'SubDAS8': '#2c7fb8',
      'SubDAS9': '#2c7fb8',
      'SubDAS10': '#2c7fb8',
      'SubDAS11': '#2c7fb8'
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
        const { Sungai, Lokasi, PL, Status } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates; // Pastikan urutannya benar (lng, lat)
        const ipValue = feature.properties[ipField];
        layer.bindPopup(`
          <h3>Nama Sungai: ${Sungai}</h3>
          <b>Koordinat:</b> x: ${lng}, y: ${lat}<br/>
          <b>Lokasi:</b> ${Lokasi}<br/>
          <b>Penggunaan Lahan:</b> ${PL}<br/>
          <b>Indeks Pencemaran:</b> ${ipValue}<br/>
          <b>Status:</b> ${Status}
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
    // Implementasikan logika untuk memuat data berdasarkan tahun jika diperlukan
    // Misalnya:
    // loadDataForYear(year);
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
            style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={() => setIsLayerListOpen(!isLayerListOpen)}
          />

          {/* Icon Year Filter */}~
          <FaCalendarAlt
            style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer', marginRight: '20px' }}
            onClick={() => setIsYearFilterOpen(!isYearFilterOpen)}
          />

          {/* Icon Legend */}
          <FaInfoCircle
            style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer' }}
            onClick={() => setIsLegendOpen(!isLegendOpen)}
          />
        </div>

        {/* Layer List Pop-up */}
        {isLayerListOpen && (
          <div style={popupStyle}>
            <h3 style={popupHeaderStyle}>Layer List</h3>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={showBoundary} onChange={(e) => handleLayerToggle(e.target.checked, 'boundary')} />
              Batas Kabupaten
            </label>
            <br />
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={showFebLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'february')} />
              Periode Februari
            </label>
            <br />
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={showJunLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'june')} />
              Periode Juni
            </label>
            <br />
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={showOktLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'october')} />
              Periode Oktober
            </label>
            <br />
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={showIkaLayer} onChange={(e) => handleLayerToggle(e.target.checked, 'ika')} />
              Nilai IKA DIY
            </label>
            <br />
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={showSubDas} onChange={(e) => handleLayerToggle(e.target.checked, 'subDas')} />
              Batas Sub Das DIY
            </label>
          </div>
        )}

        {/* Year Filter Pop-up */}
        {isYearFilterOpen && (
          <div style={popupStyle}>
            <h3 style={popupHeaderStyle}>Filter Tahun</h3>
            <select 
              value={selectedYear} 
              onChange={(e) => handleYearChange(e.target.value)} 
              style={{ width: '100%', padding: '5px', fontSize: '1rem' }}
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
              <option value={2021}>2021</option>
            </select>
          </div>
        )}

        {/* Legend Pop-up */}
        {isLegendOpen && (
          <div style={popupStyle}>
            <h3 style={popupHeaderStyle}>Legenda</h3>
            <div style={{ marginBottom: '10px' }}>
              <b>Titik Pemantauan Kualitas Air Sungai</b>
              <div style={legendItemStyle}><span style={{ ...legendColorStyle, backgroundColor: pointColors.februari }}></span> Februari</div>
              <div style={legendItemStyle}><span style={{ ...legendColorStyle, backgroundColor: pointColors.juni }}></span> Juni</div>
              <div style={legendItemStyle}><span style={{ ...legendColorStyle, backgroundColor: pointColors.oktober }}></span> Oktober</div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <b>Batas Kabupaten</b>
              {Object.keys(kabupatenColors).map(kabupaten => (
                <div key={kabupaten} style={legendItemStyle}>
                  <span style={{ ...legendColorStyle, backgroundColor: kabupatenColors[kabupaten] }}></span> {kabupaten}
                </div>
              ))}
            </div>
            <div>
              <b>Batas Sub DAS</b>
              {Object.keys(subDasColors).map(subDasLayer => (
                <div key={subDasLayer} style={legendItemStyle}>
                  <span style={{ ...legendColorStyle, backgroundColor: subDasColors[subDasLayer] }}></span> {subDasLayer}
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
  top: '60px',
  right: '50px',
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 0 15px rgba(0,0,0,0.3)',
  zIndex: 1000,
  maxWidth: '250px',
  width: 'auto'
};

const popupHeaderStyle = {
  margin: '0 0 10px 0',
  fontSize: '1.2rem',
  borderBottom: '1px solid #ccc',
  paddingBottom: '5px'
};

const checkboxLabelStyle = {
  fontSize: '1rem',
  marginBottom: '5px'
};

const legendItemStyle = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '5px'
};

const legendColorStyle = {
  display: 'inline-block',
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  marginRight: '10px'
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
