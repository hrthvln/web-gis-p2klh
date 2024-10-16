import { promises as fs } from 'fs';

// Membaca file batasKab.json secara asinkron
const data = JSON.parse(await fs.readFile('batasKab.json', 'utf8'));

// Fungsi untuk membersihkan nilai null dan 0 dari koordinat
function clean_coordinates(coordinates) {
    return coordinates.map(coord => [coord[0], coord[1]]).filter(coord => coord[0] !== null && coord[1] !== null);
}

// Melakukan iterasi pada fitur dan membersihkan koordinatnya
data.features.forEach(feature => {
    if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates = feature.geometry.coordinates.map(polygon => clean_coordinates(polygon));
    } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates = feature.geometry.coordinates.map(multi => multi.map(polygon => clean_coordinates(polygon)));
    }
});

// Menyimpan hasil yang sudah dibersihkan ke file baru secara asinkron
await fs.writeFile('batasKab_cleaned.geojson', JSON.stringify(data, null, 2));

console.log('GeoJSON telah dibersihkan dan disimpan sebagai batasKab_cleaned.geojson');
