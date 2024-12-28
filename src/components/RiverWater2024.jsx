import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import Joyride from 'react-joyride';
import { useNavigate } from "react-router-dom";
import { FaLayerGroup, FaInfoCircle, FaCalendarAlt, FaDownload } from 'react-icons/fa'; // Import icon dari react-icons
import logo from '../assets/logo.png'; // Sesuaikan jalur logo
import '../styles/webgis.css';
import TourSteps from '../components/TourSteps';

const RiverWater = () => {
  const [map, setMap] = useState(null);
  const [boundaryLayer, setBoundaryLayer] = useState(null);
  const [subDasLayer, setSubDasLayer] = useState(null);
  const [febLayer, setFebLayer] = useState(null);
  const [junLayer, setJunLayer] = useState(null);
  const [oktLayer, setOktLayer] = useState(null);

  const [showBoundary, setShowBoundary] = useState(true);
  const [showSubDas, setShowSubDas] = useState(true);
  const [showFebLayer, setShowFebLayer] = useState(true);
  const [showJunLayer, setShowJunLayer] = useState(true);
  const [showOktLayer, setShowOktLayer] = useState(true);
  const [showIkaLayer, setShowIkaLayer] = useState(true);
  
  const [isLayerListOpen, setIsLayerListOpen] = useState(false); // State untuk toggle Layer List
  const [isLegendOpen, setIsLegendOpen] = useState(false); // State untuk toggle Legend
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false); // State untuk toggle Year Filter
  const [selectedYear, setSelectedYear] = useState(2024); // State untuk tahun terpilih
  const [activePopup, setActivePopup] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [run, setRun] = useState(false);
  const navigate = useNavigate(); // Hook untuk navigasi

  // Warna yang ditetapkan untuk setiap kabupaten
  const kabupatenColors = {
    'Sleman': '#2c7fb8',
    'Bantul': '#FFE400',
    'Gunungkidul': '#d95f0e',
    'Kulon Progo': '#379237',
    'Kota Yogyakarta': '#dd1c77'
  };

  // Warna yang ditetapkan untuk setiap SubDAS sesuai dengan nama SubDAS di GeoJSON
  const subDasColors = {
    'SUB DAS BULUS': '#ff4500',
    'SUB DAS OYO': '#ff6347',
    'SUB DAS OPAK': '#ffa07a',
    'SUB DAS KUNING': '#20b2aa',
    'SUB DAS KONTENG': '#4682b4',
    'SUB DAS GAJAH WONG': '#8a2be2',
    'SUB DAS CODE': '#5f9ea0',
    'SUB DAS BELIK': '#d2691e',
    'SUB DAS BEDOG': '#ff69b4',
    'SUB DAS TAMBAKBAYAN': '#cd5c5c',
    'SUB DAS WINONGO': '#ffa500'
  };

  // Warna untuk setiap periode
  const pointColors = {
    februari: "#ff7800",
    juni: "#00ff00", //   untuk Juni
    oktober: "#0000ff", // Biru untuk Oktober
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
    // Mengatur Joyride untuk berjalan saat halaman dimuat
    setRun(true);
  }, []);
  
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

// Fungsi untuk memuat dan mengaktifkan SubDAS layer (batas Sub DAS)
  const togglesubDasLayer = async () => {
    if (subDasLayer) {
      map.removeLayer(subDasLayer);
      setSubDasLayer(null);
    } else {
      const subDasData = await loadGeoJsonData('/map/subDAS.geojson');
      const newSubDasLayer = L.geoJSON(subDasData, {
         style: (feature) => {
          const subDas = feature.properties.SUB_DAS_Su; 
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
            const subDas = feature.properties.SUB_DAS_Su; 
            const ikaFeb = feature.properties.IKA_FEB; 
            const ikaJun = feature.properties.IKA_JUN; 
            const ikaOkt = feature.properties.IKA_OKT;

            layer.bindPopup(`
              <h3>${subDas}</h3>
              <p>Nilai IKA Februari: ${ikaFeb}</p>
              <p>Nilai IKA Juni: ${ikaJun}</p>
              <p>Nilai IKA Oktober: ${ikaOkt}</p>
            `);
          },
        }).addTo(map);
        setSubDasLayer(newSubDasLayer);
    }
  };

  // Memanggil fungsi untuk menampilkan batas kabupaten dan titik saat komponen pertama kali dimuat
  useEffect(() => {
    if (map) {
      // Tambahkan layer Batas Kabupaten terlebih dahulu
      toggleBoundaryLayer().then(() => {
        if (boundaryLayer) boundaryLayer.bringToBack();  // Pastikan layer Batas Kabupaten berada di bawah
  
        // Kemudian tambahkan layer Titik Februari
        loadPointLayer(febLayer, setFebLayer, '/map/titikSungaiFeb_2024.geojson', pointColors.februari, 'IP_Feb');
      });
      
      // Jangan tampilkan saat halaman pertama kali dimuat
      setShowSubDas(false);
      setShowJunLayer(false);
      setShowOktLayer(false);
      setShowIkaLayer(false);
    }
  }, [map]);

  // Fungsi untuk memuat layer titik pemantauan air sungai
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
        const { Sungai, Lokasi, PL, Status, Image, TSS, DO, COD, pH, Nitrat, T_Fosfat, BOD, BKT, Keterangan, Kegiatan} = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;
  
        const ipDisplay = feature.properties[ipField] !== undefined ? feature.properties[ipField] : 'Data tidak tersedia';
 
        layer.bindPopup(`
          <div style="font-size: 10px; width: 250px; padding: 10px; position: relative; font-family: Arial, sans-serif; line-height: 1.5;">
              <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 10px; text-align: center;">${Sungai}</h3>
              <div style="width: 100%; height: 150px; overflow: hidden; display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
                <img src="${Image}" alt="Foto Lokasi" style="width: 100%; height: auto; object-fit: cover; max-height: 100%;"/>
              </div>
              <div style="max-height: 120px; overflow-y: auto; margin-top: 5px; text-align: left;">
                  <table style="font-size: 10px; width: 100%; border-collapse: collapse; text-align: left;">
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Koordinat</td>
                          <td style="padding: 4px; vertical-align: top;">x: ${lng}, y: ${lat}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Lokasi</td>
                          <td style="padding: 4px; vertical-align: top;">${Lokasi}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Penggunaan Lahan Radius 1000m</td>
                          <td style="padding: 4px; vertical-align: top;">${PL}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Indeks Pencemaran</td>
                          <td style="padding: 4px; vertical-align: top;">${ipDisplay}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Status</td>
                          <td style="padding: 4px; vertical-align: top;">${Status}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Residu Tersuspensi/TSS (mg/L)</td>
                          <td style="padding: 4px; vertical-align: top;">${TSS}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Oksigen Terlarut/DO (mg/L)</td>
                          <td style="padding: 4px; vertical-align: top;">${DO}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">COD (mg/L)</td>
                          <td style="padding: 4px; vertical-align: top;">${COD}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">pH</td>
                          <td style="padding: 4px; vertical-align: top;">${pH}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Nitrat (mg/L)</td>
                          <td style="padding: 4px; vertical-align: top;">${Nitrat}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Total Fosfat (mg/L)</td>
                          <td style="padding: 4px; vertical-align: top;">${T_Fosfat}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">BOD (mg/L)</td>
                          <td style="padding: 4px; vertical-align: top;">${BOD}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Bakteri Koli Tinja (MPN/100ml)</td>
                          <td style="padding: 4px; vertical-align: top;">${BKT}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Keterangan</td>
                          <td style="padding: 4px; vertical-align: top;">${Keterangan}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Sumber Pencemar Radius 1000m</td>
                          <td style="padding: 4px; vertical-align: top;">${Kegiatan}</td>
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
      case 'subDas':
        setShowSubDas(checked); // Simpan status checkbox
        if (checked) {
          togglesubDasLayer(); // Muat layer jika dicentang
        } else {
          if (subDasLayer) map.removeLayer(subDasLayer); // Hapus layer jika tidak dicentang
        }                                                                                                                     
        break;
      case 'february':
        setShowFebLayer(checked);
        if (checked) {
          loadPointLayer(febLayer, setFebLayer, '/map/titikSungaiFeb_2024.geojson', pointColors.februari, 'IP_Feb');
        } else {
          if (febLayer) map.removeLayer(febLayer);
        }
        break;
      case 'june':
        setShowJunLayer(checked);
        if (checked) {
          loadPointLayer(junLayer, setJunLayer, '/map/titikSungaiJun_2024.geojson', pointColors.juni, 'IP_Jun');
        } else {
          if (junLayer) map.removeLayer(junLayer);
        }
        break;
      case 'october':
        setShowOktLayer(checked);
        if (checked) {
          loadPointLayer(oktLayer, setOktLayer, '/map/titikSungaiOkt_2024.geojson', pointColors.oktober, 'IP_Okt');
        } else {
          if (oktLayer) map.removeLayer(oktLayer);
        }
        break;
      case 'ika':
        setShowIkaLayer(checked);
        if (checked) {
          // Create a popup manually with large content
          const popupContent = `
            <div style="font-family: Arial, sans-serif; width: 100%; max-width: 400px; padding: 15px;">
              <h2 style="font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 15px;">NILAI IKA 2024</h2>
              <div style="margin-bottom: 15px;">
                <h4 style="font-size: 14px; font-weight: bold;">• Nilai IKA Agregasi (Kabupaten/Kota, Provinsi, Pusat)</h4>
                <p style="font-size: 12px; line-height: 1.6;">Nilai Indeks Kualitas Air (IKA) sungai di Daerah Istimewa Yogyakarta (DIY) pada tahun 2024 menunjukkan hasil sebesar 40,28. Angka ini merupakan hasil dari pengukuran komprehensif yang melibatkan berbagai tingkat pemerintahan, mulai dari pusat, provinsi, hingga kabupaten/kota, dengan tujuan untuk memberikan gambaran umum tentang kondisi kualitas air sungai di wilayah tersebut.</p>
              </div>
              <div>
                <h4 style="font-size: 14px; font-weight: bold;">• Nilai IKA Provinsi (Hasil pemantauan 11 sungai)</h4>
                <p style="font-size: 12px; line-height: 1.6;">Nilai IKA Provinsi didapatkan rata-rata sebesar 33,20 yang didapatkan dari hasil pemantauan terhadap 11 sungai di Daerah Istimewa Yogyakarta (DIY) untuk nilai Indeks Kualitas Air (IKA) tahun 2024 menunjukkan fluktuasi sebagai berikut:</p>
                <ol style="font-size: 12px; padding-left: 20px; line-height: 1.6;">
                  <li>Periode 1: Nilai IKA sebesar 34,40</li>
                  <li>Periode 2: Nilai IKA sebesar 34,40</li>
                  <li>Periode 3: Nilai IKA sebesar 30,82</li>
                </ol>
              </div>
            </div>
          `;

          // Create a popup in the center of the map
          const popup = L.popup({
            maxWidth: 500,
            closeButton: true,
            autoClose: false,
            closeOnClick: false,
            className: 'ika-popup'  // Optional: use for custom styling
          })
          .setLatLng(map.getCenter())  // Position the popup at the center of the map
          .setContent(popupContent)
          .openOn(map);
        } else {
          // If unchecked, close the popup
          map.closePopup();
        }
        break;
      default:
        break;
    }
  };

  // Fungsi untuk menangani perubahan tahun
  const handleYearChange = (year) => {
    setSelectedYear(year); // Update state
    // Navigasi ke rute sesuai tahun
    if (year === 2024) {
      navigate("/maps/kualitas-air-sungai-2024");
    } else if (year === 2023) {
      navigate("/maps/kualitas-air-sungai-2023");
    }
  };


  const handleDownload = () => {
    if (selectedFile) {
     // Gunakan import.meta.env.BASE_URL untuk Vite
      const fileUrl = `${import.meta.env.BASE_URL}file/river/${encodeURIComponent(selectedFile)}`;
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
          <h1 className="navbar-title">Pemantauan Kualitas Air Sungai DIY</h1>
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
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Tambakbayan 2023.pdf">Perhitungan Indeks Pencemaran Sungai Tambakbayan 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Bedog 2023.pdf">Perhitungan Indeks Pencemaran Sungai Bedog 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Belik 2023.pdf">Perhitungan Indeks Pencemaran Sungai Belik 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Bulus 2023.pdf">Perhitungan Indeks Pencemaran Sungai Bulus 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Code 2023.pdf">Perhitungan Indeks Pencemaran Sungai Code 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Gadjahwong 2023.pdf">Perhitungan Indeks Pencemaran Sungai Gadjahwong 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Konteng 2023.pdf">Perhitungan Indeks Pencemaran Sungai Konteng 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Kuning 2023.pdf">Perhitungan Indeks Pencemaran Sungai Kuning 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Opak 2023.pdf">Perhitungan Indeks Pencemaran Sungai Opak 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Oyo 2023.pdf">Perhitungan Indeks Pencemaran Sungai Oyo 2023.pdf</option>
              <option style={{ color: 'black' }} value="Perhitungan Indeks Pencemaran Sungai Winongo 2023.pdf">Perhitungan Indeks Pencemaran Sungai Winongo 2023.pdf</option>
              <option style={{ color: 'black' }} value="Kategori Status Mutu Metode Indeks Pencemaran 2023.pdf">Kategori Status Mutu Metode Indeks Pencemaran 2023.pdf</option>
              <option style={{ color: 'black' }} value="Data IKA Tiap Sungai.pdf">Data IKA Tiap Sungai.pdf</option>
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
              {/* Checkbox untuk Batas Sub DAS */}
              <label className="popup-checkbox-label">
                <input
                  type="checkbox"
                  checked={showSubDas}
                  onChange={(e) => handleLayerToggle(e.target.checked, 'subDas')}
                  className="popup-checkbox-input"
                />
                Batas Sub Das DIY
              </label>
              <br />
              {/* Checkbox untuk Layer Pemantauan Sungai Periode Februari */}
              <label className="popup-checkbox-label">
                <input
                  type="checkbox"
                  checked={showFebLayer}
                  onChange={(e) => handleLayerToggle(e.target.checked, 'february')}
                  className="popup-checkbox-input"
                />
                Titik Pemantauan Air Sungai Periode 1 (Februari)  
              </label>
              <br />
              {/* Checkbox untuk Layer Pemantauan Sungai Periode Juni */}
              <label className="popup-checkbox-label">
                <input
                  type="checkbox"
                  checked={showJunLayer}
                  onChange={(e) => handleLayerToggle(e.target.checked, 'june')}
                  className="popup-checkbox-input"
                />
                Titik Pemantauan Air Sungai Periode 2 (Juni)
              </label>
              <br />
              {/* Checkbox untuk Layer Pemantauan Sungai Periode Oktober */}
              <label className="popup-checkbox-label">
                <input
                  type="checkbox"
                  checked={showOktLayer}
                  onChange={(e) => handleLayerToggle(e.target.checked, 'october')}
                  className="popup-checkbox-input"
                />
                Titik Pemantauan Air Sungai Periode 3 (Oktober)
              </label>
              <br />
              {/* Checkbox untuk Nilai IKA DIY */}
              <label className="popup-checkbox-label">
                <input
                  type="checkbox"
                  checked={showIkaLayer}
                  onChange={(e) => handleLayerToggle(e.target.checked, 'ika')}
                  className="popup-checkbox-input"
                />
                Nilai IKA DIY
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
                <b>Titik Pemantauan Kualitas Air Sungai</b>
                <div className="legend-item">
                  <span className="legend-circle legend-circle-february"></span> Februari
                </div>
                <div className="legend-item">
                  <span className="legend-circle legend-circle-june"></span> Juni
                </div>
                <div className="legend-item">
                  <span className="legend-circle legend-circle-october"></span> Oktober
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

              {/* Legenda Batas Sub DAS */}
              <div className="popup-content">
                <b>Batas Sub DAS</b>
                {Object.keys(subDasColors).map((subDas) => (
                  <div key={subDas} className="legend-item">
                    <span
                      className="legend-square"
                      style={{ backgroundColor: subDasColors[subDas] }}
                    ></span>{' '}
                    {subDas}
                  </div>
                ))}
              </div>
            </div>
          )}
      </nav>

      {/* Map */}
      <div id="map" className="map"></div>

      {/* Komponen Header */}
      <div className="header-river-water"></div>

      {/* Komponen Informasi */}
      <div className="information-river-water"></div>
      
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


export default RiverWater;
