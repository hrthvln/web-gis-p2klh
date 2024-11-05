import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import { FaLayerGroup, FaInfoCircle, FaCalendarAlt, FaDownload } from 'react-icons/fa'; // Import icon dari react-icons
import logo from '../assets/logo.png'; // Sesuaikan jalur logo

const RiverWaterQualityMap = () => {
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
  const [selectedYear, setSelectedYear] = useState(2023); // State untuk tahun terpilih
  const [activePopup, setActivePopup] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('GeoJSON'); // Default format


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

// Fungsi untuk memuat dan mengaktifkan SubDAS layer (batas Sub DAS)
  const togglesubDasLayer = async () => {
    if (subDasLayer) {
      map.removeLayer(subDasLayer);
      setSubDasLayer(null);
    } else {
      const subDasData = await loadGeoJsonData('/map/dasdiy4326.geojson');
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
        loadPointLayer(febLayer, setFebLayer, '/map/titikSungai_Feb.geojson', pointColors.februari, 'IP_Feb');
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
        const { Sungai, Lokasi, PL, Status, Image, TSS, DO, COD, pH, Nitrat, T_Fosfat, BOD, BKT } = feature.properties;
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
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Residu Tersuspensi (TSS)</td>
                          <td style="padding: 4px; vertical-align: top;">${TSS}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Oksigen Terlarut (DO)</td>
                          <td style="padding: 4px; vertical-align: top;">${DO}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">COD</td>
                          <td style="padding: 4px; vertical-align: top;">${COD}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">pH</td>
                          <td style="padding: 4px; vertical-align: top;">${pH}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Nitrat</td>
                          <td style="padding: 4px; vertical-align: top;">${Nitrat}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Total Fosfat</td>
                          <td style="padding: 4px; vertical-align: top;">${T_Fosfat}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">BOD</td>
                          <td style="padding: 4px; vertical-align: top;">${BOD}</td>
                      </tr>
                      <tr>
                          <td style="padding: 2px; font-weight: bold; vertical-align: top;">Bakteri Koli Tinja</td>
                          <td style="padding: 4px; vertical-align: top;">${BKT}</td>
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
          loadPointLayer(febLayer, setFebLayer, '/map/titikSungai_Feb.geojson', pointColors.februari, 'IP_Feb');
        } else {
          if (febLayer) map.removeLayer(febLayer);
        }
        break;
      case 'june':
        setShowJunLayer(checked);
        if (checked) {
          loadPointLayer(junLayer, setJunLayer, '/map/titikSungai_Jun.geojson', pointColors.juni, 'IP_Jun');
        } else {
          if (junLayer) map.removeLayer(junLayer);
        }
        break;
      case 'october':
        setShowOktLayer(checked);
        if (checked) {
          loadPointLayer(oktLayer, setOktLayer, '/map/titikSungai_Okt.geojson', pointColors.oktober, 'IP_Okt');
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
              <h2 style="font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 15px;">NILAI IKA 2023</h2>
              <div style="margin-bottom: 15px;">
                <h4 style="font-size: 14px; font-weight: bold;">• Nilai IKA Agregasi (Kabupaten/Kota, Provinsi, Pusat)</h4>
                <p style="font-size: 12px; line-height: 1.6;">Nilai Indeks Kualitas Air (IKA) sungai di Daerah Istimewa Yogyakarta (DIY) pada tahun 2023 menunjukkan hasil sebesar 40,28. Angka ini merupakan hasil dari pengukuran komprehensif yang melibatkan berbagai tingkat pemerintahan, mulai dari pusat, provinsi, hingga kabupaten/kota, dengan tujuan untuk memberikan gambaran umum tentang kondisi kualitas air sungai di wilayah tersebut.</p>
              </div>
              <div>
                <h4 style="font-size: 14px; font-weight: bold;">• Nilai IKA Provinsi (Hasil pemantauan 11 sungai)</h4>
                <p style="font-size: 12px; line-height: 1.6;">Nilai IKA Provinsi didapatkan rata-rata sebesar 33,20 yang didapatkan dari hasil pemantauan terhadap 11 sungai di Daerah Istimewa Yogyakarta (DIY) untuk nilai Indeks Kualitas Air (IKA) tahun 2023 menunjukkan fluktuasi sebagai berikut:</p>
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
  
      const subDasData = await loadGeoJsonData('/map/batasSubdas_cleaned.geojson');
      downloadFile(subDasData, 'GeoJSON', 'sub_das.geojson');
  
      const febLayerData = await loadGeoJsonData('/map/titikSungai_Feb.geojson');
      downloadFile(febLayerData, 'GeoJSON', 'titik_sungai_feb.geojson');
  
      const junLayerData = await loadGeoJsonData('/map/titikSungai_Jun.geojson');
      downloadFile(junLayerData, 'GeoJSON', 'titik_sungai_jun.geojson');
  
      const oktLayerData = await loadGeoJsonData('/map/titikSungai_Okt.geojson');
      downloadFile(oktLayerData, 'GeoJSON', 'titik_sungai_okt.geojson');
  
    } else if (selectedFormat === 'CSV') {
      // Konversi file GeoJSON ke CSV untuk batas kabupaten
      const boundariesData = await loadGeoJsonData('/map/batasKab_cleaned.geojson');
      const csvBData = convertToCSV(boundariesData, "batasKab");
      downloadFile(csvBData, 'CSV', 'batas_kabupaten.csv');
  
      // Konversi file GeoJSON ke CSV untuk sub DAS
      const subDasData = await loadGeoJsonData('/map/batasSubdas_cleaned.geojson');
      const csvSubDasData = convertToCSV(subDasData, "subDas");
      downloadFile(csvSubDasData, 'CSV', 'sub_das.csv');
  
      // Konversi file GeoJSON ke CSV untuk titik sungai (Februari)
      const febLayerData = await loadGeoJsonData('/map/titikSungai_Feb.geojson');
      const csvFebData = convertToCSV(febLayerData, "titikSungaiFeb");
      downloadFile(csvFebData, 'CSV', 'titik_sungai_feb.csv');
  
      // Konversi file GeoJSON ke CSV untuk titik sungai (Juni)
      const junLayerData = await loadGeoJsonData('/map/titikSungai_Jun.geojson');
      const csvJunData = convertToCSV(junLayerData, "titikSungaiJun");
      downloadFile(csvJunData, 'CSV', 'titik_sungai_jun.csv');
  
      // Konversi file GeoJSON ke CSV untuk titik sungai (Oktober)
      const oktLayerData = await loadGeoJsonData('/map/titikSungai_Okt.geojson');
      const csvOktData = convertToCSV(oktLayerData, "titikSungaiOkt");
      downloadFile(csvOktData, 'CSV', 'titik_sungai_okt.csv');
    }
  };
  
  const convertToCSV = (geoJsonData, type) => {
    let csvData = "";
  
    if (type === "titikSungaiFeb") {
      // Format CSV untuk titik sungai feb
      csvData = "FID,No_,Sungai,X,Y,IP_Feb,Status,Lokasi,PL,TSS,DO,COD,pH,Nitrat,T_Fosfat,BOD,BKT,Image\n";
      geoJsonData.features.forEach(feature => {
        const { FID, No_, Sungai, X, Y, IP_Feb, Status, Lokasi, PL, TSS, DO, COD, pH, Nitrat, T_Fosfat, BOD, BKT, Image } = feature.properties;
        csvData += `${FID},${No_},${Sungai},${X},${Y},${IP_Feb},${Status},${Lokasi},${PL},${TSS},${DO},${COD},${pH},${Nitrat},${T_Fosfat},${BOD},${BKT},${Image}\n`;
      });
    } else if (type === "titikSungaiJun") {
      // Format CSV untuk titik sungai jun
      csvData = "FID,No_,Sungai,X,Y,IP_Jun,Status,Lokasi,PL,TSS,DO,COD,pH,Nitrat,T_Fosfat,BOD,BKT,Image\n";
      geoJsonData.features.forEach(feature => {
        const { FID, No_, Sungai, X, Y, IP_Jun, Status, Lokasi, PL, TSS, DO, COD, pH, Nitrat, T_Fosfat, BOD, BKT, Image } = feature.properties;
        csvData += `${FID},${No_},${Sungai},${X},${Y},${IP_Jun},${Status},${Lokasi},${PL},${TSS},${DO},${COD},${pH},${Nitrat},${T_Fosfat},${BOD},${BKT},${Image}\n`;
      });
    } else if (type === "titikSungaiOkt") {
      // Format CSV untuk titik sungai okt
      csvData = "FID,No_,Sungai,X,Y,IP_Okt,Status,Lokasi,PL,TSS,DO,COD,pH,Nitrat,T_Fosfat,BOD,BKT,Image\n";
      geoJsonData.features.forEach(feature => {
        const { FID, No_, Sungai, X, Y, IP_Okt, Status, Lokasi, PL, TSS, DO, COD, pH, Nitrat, T_Fosfat, BOD, BKT, Image } = feature.properties;
        csvData += `${FID},${No_},${Sungai},${X},${Y},${IP_Okt},${Status},${Lokasi},${PL},${TSS},${DO},${COD},${pH},${Nitrat},${T_Fosfat},${BOD},${BKT},${Image}\n`;
      });
    } else if (type === "subDas") {
      // Format CSV untuk sub DAS
      csvData = "FID,SUB_DAS_Su,IKA_FEB,IKA_JUN,IKA_OKT\n";
      geoJsonData.features.forEach(feature => {
        const { FID, SUB_DAS_Su, IKA_FEB, IKA_JUN, IKA_OKT } = feature.properties;
        csvData += `${FID},${SUB_DAS_Su},${IKA_FEB},${IKA_JUN},${IKA_OKT}\n`;
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
          <h1 style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>Peta Titik Pemantauan Kualitas Air Sungai DIY</h1>
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
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input type="checkbox" checked={showBoundary} onChange={(e) => handleLayerToggle(e.target.checked, 'boundary')} style={inputStyle} />
            Batas Kabupaten
          </label>
          <br />
          <label style={{ ...checkboxLabelStyle, ...popupContentStyle }}>
            <input type="checkbox" checked={showSubDas} onChange={(e) => handleLayerToggle(e.target.checked, 'subDas')} style={inputStyle}/>
            Batas Sub Das DIY
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
            {Object.keys(subDasColors).map(subDas => (
              <div key={subDas} style={legendItemStyle}>
                <span style={{ ...legendSquareStyle, backgroundColor: subDasColors[subDas] }}></span> {subDas}
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
  zIndex: 1000,
  minWidth: '230px',
  maxHeight: '400px', // Set max height sesuai kebutuhan
  width: '250px', // Set width yang sama dengan layer list
  overflowY: 'auto', // Aktifkan scroll jika konten lebih dari max height
  borderRadius: '8px', // Opsional: tambahkan border radius untuk estetika
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', // Opsional: tambahkan shadow untuk efek pop-up
  scrollbarWidth: 'thin', // Membuat scrollbar menjadi lebih kecil di Firefox
  scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)', // Warna scrollbar di Firefox
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

export default RiverWaterQualityMap;
