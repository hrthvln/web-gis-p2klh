import { promises as fs } from 'fs';

// Membaca file JSON secara asinkron
async function convertSubdas() {
  try {
    const data = await fs.readFile('batasSubdas.json', 'utf8');
    const jsonData = JSON.parse(data);

    // Membuat GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: jsonData.features.map(feature => ({
        type: 'Feature',
        properties: {
          FID: feature.attributes.FID,
          SUB_DAS_Su: feature.attributes.SUB_DAS_Su,
          IKA_FEB: feature.attributes.IKA_FEB,
          IKA_JUN: feature.attributes.IKA_JUN,
          IKA_OKT: feature.attributes.IKA_OKT
        },
        geometry: {
          type: 'Polygon',
          coordinates: feature.geometry.rings
        }
      }))
    };

    // Menyimpan GeoJSON ke file output
    await fs.writeFile('batasSubdas_cleaned.geojson', JSON.stringify(geojson, null, 2));
    console.log('File GeoJSON berhasil dibuat!');
  } catch (err) {
    console.error('Error:', err);
  }
}

convertSubdas();
