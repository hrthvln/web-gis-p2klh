import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import logo from '../assets/logo.png'; // Sesuaikan jalur logo

const RiverWaterQualityMap = () => {
  const [map, setMap] = useState(null);
  const [boundaryLayer, setBoundaryLayer] = useState(null);
  const [pointLayer, setPointLayer] = useState(null); // Untuk layer titik
  const [coords, setCoords] = useState({ lat: null, lng: null });

  // Warna yang ditetapkan untuk setiap kabupaten
  const kabupatenColors = {
    'Sleman': '#2c7fb8',
    'Bantul': '#FFE400',
    'Gunungkidul': '#d95f0e',
    'Kulon Progo': '#379237',
    'Kota Yogyakarta': '#dd1c77'
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
          console.log("Kabupaten ditemukan:", kabupaten); // Debugging untuk memastikan nama kabupaten
          
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

  // Fungsi untuk memuat titik-titik dari file GeoJSON
  const loadPointLayer = async () => {
    if (pointLayer) {
      map.removeLayer(pointLayer);
      setPointLayer(null);
    } else {
      const pointData = await loadGeoJsonData('/map/titikFebruari_cleaned.geojson');
      const newPointLayer = L.geoJSON(pointData, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: (feature, layer) => {
          const { Sungai, Lokasi, PL_1, IP_Feb, Status } = feature.properties;
          const [lng, lat] = feature.geometry.coordinates; // Pastikan urutannya benar (lng, lat)
          layer.bindPopup(`
            <h3>Nama Sungai: ${Sungai}</h3>
            <b>Koordinat:</b> x: ${lng}, y: ${lat}<br/>
            <b>Lokasi:</b> ${Lokasi}<br/>
            <b>Penggunaan Lahan:</b> ${PL_1}<br/>
            <b>Indeks Pencemaran:</b> ${IP_Feb}<br/>
            <b>Status:</b> ${Status}
          `);
        }
      }).addTo(map);
      setPointLayer(newPointLayer);
    }
  };

  // Memanggil fungsi untuk menampilkan batas kabupaten dan titik-titik saat komponen pertama kali dimuat
  useEffect(() => {
    if (map) {
      toggleBoundaryLayer();
      loadPointLayer();
    }
  }, [map]);

  return (
    <div>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#6A9C89', padding: '10px', display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <h2 style={{ color: 'white', margin: 0 }}>Peta Kualitas Air Sungai dan Batas Kabupaten</h2>
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
