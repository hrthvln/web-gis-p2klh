import { promises as fs } from 'fs';

// Membaca file JSON yang berisi data titik sungai (titikFebruari.json)
const data = JSON.parse(await fs.readFile('titikFebruari.json', 'utf8'));

// Fungsi untuk membersihkan nilai null dan 0 dari koordinat
function clean_coordinates(x, y) {
    if (x !== null && y !== null && x !== 0 && y !== 0) {
        return [x, y];
    }
    return null;
}

// Konversi JSON menjadi GeoJSON
const geoJsonData = {
    type: 'FeatureCollection',
    features: data.features.map(item => {
        const coordinates = clean_coordinates(item.attributes.X, item.attributes.Y);
        if (coordinates) {
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                properties: {
                    "FID": item.attributes.FID,
                    "No_": item.attributes.No_,
                    "Sungai": item.attributes.Sungai,
                    "IP_Feb": item.attributes.IP_Feb,
                    "Status": item.attributes.Status,
                    "Lokasi": item.attributes.Lokasi,
                    "BUFF_DIST": item.attributes.BUFF_DIST,
                    "PL_1": item.attributes.PL_1,
                    "Luas_Ha": item.attributes.Luas_Ha,
                    "SUMBER": item.attributes.SUMBER,
                    "LUSE": item.attributes.LUSE
                }
            };
        }
    }).filter(Boolean) // Filter untuk menghapus data yang memiliki koordinat null
};

// Menyimpan hasil yang sudah dikonversi dan dibersihkan ke file GeoJSON baru
await fs.writeFile('titikFebruari_cleaned.geojson', JSON.stringify(geoJsonData, null, 2));

console.log('File JSON telah dikonversi dan dibersihkan sebagai titikFebruari_cleaned.geojson');
