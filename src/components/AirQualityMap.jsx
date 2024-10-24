import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import { FaLayerGroup, FaInfoCircle, FaCalendarAlt, FaDownload } from 'react-icons/fa'; // Import icon dari react-icons
import logo from '../assets/logo.png'; // Sesuaikan jalur logo

const AirQualityMap = () => {
  const [map, setMap] = useState(null);
  const [boundaryLayer, setBoundaryLayer] = useState(null);
  const [showBoundary, setShowBoundary] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('GeoJSON'); // Default format
  
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
  const [showIkuLayer, setShowIkuLayer] = useState(true);

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
    udara: "#0000ff"
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

  // Memanggil fungsi untuk menampilkan batas kabupaten saat komponen pertama kali dimuat
  useEffect(() => {
    if (map) {
      // Tambahkan layer Batas Kabupaten terlebih dahulu
      toggleBoundaryLayer().then(() => {
        if (boundaryLayer) boundaryLayer.bringToBack();  // Pastikan layer Batas Kabupaten berada di bawah
  
        // Kemudian tambahkan layer Titik Pemantauan Udara
        loadAirPointLayer(udaraLayer, setUdaraLayer, '/map/titikUdara.geojson', pointColors.udara);
      });
      
      // Jangan tampilkan Nilai IKU DIY saat halaman pertama kali dimuat
      setShowIkuLayer(false);
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
                <div style="font-size: 10px; width: 250px; padding: 10px; position: relative; font-family: Arial, sans-serif; line-height: 1.5;">
                    <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 10px; text-align: center;">${Nama_Lokasi}</h3>
                    <div style="width: 100%; height: 150px; overflow: hidden; display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
                     <img src="${Foto}" alt="Foto Lokasi" style="width: 100%; height: auto; object-fit: cover; max-height: 100%;"/>
                    </div>
                    <div style="max-height: 120px; overflow-y: auto; margin-top: 5px; text-align: left;">
                        <table style="font-size: 10px; width: 100%; border-collapse: collapse; text-align: left;">
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Kode</td>
                                <td style="padding: 4px; vertical-align: top;">${Kode}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Kabupaten</td>
                                <td style="padding: 4px; vertical-align: top;">${Kabupaten}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Koordinat</td>
                                <td style="padding: 4px; vertical-align: top;">x: ${x.toFixed(6)}, y: ${y.toFixed(6)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Kategori</td>
                                <td style="padding: 4px; vertical-align: top;">${Kategori}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Nama Lokasi</td>
                                <td style="padding: 4px; vertical-align: top;">${Nama_Lokasi}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Alamat</td>
                                <td style="padding: 4px; vertical-align: top;">${Alamat}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Kadar NO2 Tahap 1 (µg/m3)</td>
                                <td style="padding: 4px; vertical-align: top;">${Tahap_1_NO2}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Kadar NO2 Tahap 2 (µg/m3)</td>
                                <td style="padding: 4px; vertical-align: top;">${Tahap_2_NO2}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Kadar SO2 Tahap 1 (µg/m3)</td>
                                <td style="padding: 4px; vertical-align: top;">${Tahap_1_SO2}</td>
                            </tr>
                            <tr>
                                <td style="padding: 2px; font-weight: bold; vertical-align: top;">Kadar SO2 Tahap 2 (µg/m3)</td>
                                <td style="padding: 4px; vertical-align: top;">${Tahap_2_SO2}</td>
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
          if (boundaryLayer) boundaryLayer.bringToBack(); // Layer Batas Kabupaten di paling bawah
        } else {
          if (boundaryLayer) map.removeLayer(boundaryLayer);
        }
        break;
      case 'udara':
        setShowUdaraLayer(checked);
        if (checked) {
          loadAirPointLayer(udaraLayer, setUdaraLayer, '/map/titikUdara.geojson', pointColors.udara);
          if (udaraLayer) udaraLayer.bringToFront(); // Layer Titik Pemantauan di atas Batas Kabupaten
        } else {
          if (udaraLayer) map.removeLayer(udaraLayer);
        }
        break;
      case 'iku':
        setShowIkuLayer(checked);
        if (checked) {
          // Layer Nilai IKU DIY harus ditambahkan di atas kedua layer lainnya
          const popupContent = `
            <div style="font-family: Arial, sans-serif; width: 100%; max-width: 400px; padding: 15px;">
              <h2 style="font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 15px;">NILAI IKU DIY 2023</h2>
              <div style="margin-bottom: 15px;">
                <h4 style="font-size: 14px; font-weight: bold;">• Nilai IKU Kabupaten/Kota 2023</h4>
                <p style="font-size: 12px; line-height: 1.6;">
                  <b>Kulon Progo:</b> IKU tertinggi 94,41 – kualitas udara sangat baik.<br>
                  <b>Bantul:</b> IKU 92,58 – kualitas udara sangat baik.<br>
                  <b>Gunungkidul:</b> IKU 91,27 – kualitas udara baik.<br>
                  <b>Sleman:</b> IKU 88,95 – kualitas udara cukup baik.<br>
                  <b>Kota Yogyakarta:</b> IKU 86,55 – kualitas udara cukup baik, perlu perhatian lebih.
                </p>
              </div>
              <div>
                <h4 style="font-size: 14px; font-weight: bold;">• Nilai IKU Provinsi 2023</h4>
                <p style="font-size: 12px; line-height: 1.6;">Provinsi Daerah Istimewa Yogyakarta (DIY) mencatatkan nilai IKU sebesar 90,75, yang mencerminkan kualitas udara yang baik secara keseluruhan di wilayah DIY.</p>
              </div>
            </div>
          `;
      
          // Buat pop-up di tengah peta dengan konten yang diperbarui
          const popup = L.popup({
            maxWidth: 500,
            closeButton: true,
            autoClose: false,
            closeOnClick: false,
            className: 'iku-popup'
          })
          .setLatLng(map.getCenter()) // Posisi pop-up di tengah peta
          .setContent(popupContent)
          .openOn(map);
        } else {
          map.closePopup();
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

  const handleDownload = async () => {
    if (selectedFormat === 'GeoJSON') {
      // Unduh file GeoJSON secara terpisah
      const boundariesData = await loadGeoJsonData('/map/batasKab_cleaned.geojson');
      downloadFile(boundariesData, 'GeoJSON', 'batas_kabupaten.geojson');
  
      const airPointData = await loadGeoJsonData('/map/titikUdara.geojson');
      downloadFile(airPointData, 'GeoJSON', 'titik_udara.geojson');
  
    } else if (selectedFormat === 'CSV') {
      // Konversi file GeoJSON ke CSV untuk batas kabupaten
      const boundariesData = await loadGeoJsonData('/map/batasKab_cleaned.geojson');
      const csvBData = convertToCSV(boundariesData, "batasKab");
      downloadFile(csvBData, 'CSV', 'batas_kabupaten.csv');
  
      // Konversi file GeoJSON ke CSV untuk titik udara
      const airPointData = await loadGeoJsonData('/map/titikUdara.geojson');
      const csvTData = convertToCSV(airPointData, "titikUdara");
      downloadFile(csvTData, 'CSV', 'titik_udara.csv');
    }
  };
  
  
  const convertToCSV = (geoJsonData, type) => {
    let csvData = "";
  
    if (type === "titikUdara") {
      // Format CSV untuk titik udara
      csvData = "FID,Kode,Kabupaten,Nama_Lokasi,Latitude,Longitude,Kategori,Alamat,Tahap_1_NO2(µg/m3),Tahap_2_NO2(µg/m3),Tahap_1_SO2(µg/m3),Tahap_2_SO2(µg/m3),Foto\n";
      geoJsonData.features.forEach(feature => {
        const { FID, Kode, Kabupaten, Nama_Lokasi, Kategori, Alamat, Tahap_1_Kadar_NO2_, Tahap_2_Kadar_NO2_, Tahap_1_Kadar_SO2_, Tahap_2_Kadar_SO2_, Foto } = feature.properties;
        const [longitude, latitude] = feature.geometry.coordinates;
        csvData += `${FID},${Kode},${Kabupaten},${Nama_Lokasi},${latitude},${longitude},${Kategori},${Alamat},${Tahap_1_Kadar_NO2_},${Tahap_2_Kadar_NO2_},${Tahap_1_Kadar_SO2_},${Tahap_2_Kadar_SO2_},${Foto}\n`;
      });
    } else if (type === "batasKab") {
      // Format CSV untuk batas kabupaten
      csvData = "FID,Nama_Kabupaten,Coordinates\n";
      geoJsonData.features.forEach(feature => {
        const { FID } = feature.properties;
        const namaKabupaten = feature.properties.NAMOBJ || 'unknown'; // Menggunakan NAMOBJ
        const coordinates = feature.geometry.coordinates[0].map(coord => `[${coord[1]},${coord[0]}]`).join('; ');
        csvData += `${FID},${namaKabupaten},"${coordinates}"\n`;
      });
    }
    
    
    return csvData;
  };
  
  
  const downloadFile = (data, format, fileName) => {
    let blob;
    
    if (format === 'GeoJSON') {
      blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    } else if (format === 'CSV') {
      blob = new Blob([data], { type: 'text/csv' });
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>
  {/* Navbar */}
  <nav style={{ backgroundColor: '#0096c7', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={logo} alt="Logo" style={{ height: '35px', marginRight: '10px' }} />
          <h1 style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>Peta Titik Pemantauan Kualitas Udara DIY</h1>
        </div>

         {/* Group Elemen */}
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
        
        {/* Dropdown untuk memilih format unduhan */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px', position: 'relative' }}>
          <label htmlFor="format-select" style={{ color: 'white', marginRight: '5px', fontSize: '0.7rem' }}>
            Pilih Format:
          </label>
          <select
            id="format-select"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
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
            <option style={{ color: 'black', backgroundColor: 'white' }} value="GeoJSON">GeoJSON</option>
            <option style={{ color: 'black', backgroundColor: 'white' }} value="CSV">CSV</option>
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
            <br />
            {/* Checkbox untuk Layer Nilai IKU DIY */}
            <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
              <input 
                type="checkbox" 
                checked={showIkuLayer} 
                onChange={(e) => handleLayerToggle(e.target.checked, 'iku')} 
                style={inputStyle} 
              />
              Nilai IKU DIY
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
      <div id="map" style={{ height: '620px' }}></div>

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


export default AirQualityMap;
