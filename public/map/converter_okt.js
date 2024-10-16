import { promises as fs } from 'fs';

// Membaca file JSON yang berisi data sungai
const data = JSON.parse(await fs.readFile('oktober.json', 'utf8'));

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
        const coordinates = clean_coordinates(item.properties.X, item.properties.Y);
        if (coordinates) {
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                properties: {
                    "FID": item.properties.FID,
                    "No_": item.properties.No_,
                    "Sungai": item.properties.Sungai,
                    "IP_Okt": item.properties.IP_Okt,
                    "Status": item.properties.Status,
                    "Lokasi": item.properties.Lokasi,
                    "PL": item.properties.PL,
                    "TSS": item.properties.TSS,
                    "DO": item.properties.DO,
                    "COD": item.properties.COD,
                    "pH": item.properties.pH,
                    "Nitrat": item.properties.Nitrat,
                    "T_Fosfat": item.properties.T_Fosfat,
                    "BOD": item.properties.BOD,
                    "BKT": item.properties.BKT,
                    "Image": item.properties.Image // Menambahkan properti Image
                }
            };
        }
    }).filter(Boolean) // Filter untuk menghapus data yang memiliki koordinat null
};

// Menyimpan hasil yang sudah dikonversi dan dibersihkan ke file GeoJSON baru
await fs.writeFile('titikOktober_cleaned.geojson', JSON.stringify(geoJsonData, null, 2));

console.log('File JSON telah dikonversi dan dibersihkan sebagai titikOktober_cleaned.geojson');
