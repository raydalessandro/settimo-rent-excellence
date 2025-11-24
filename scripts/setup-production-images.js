/**
 * Script per configurare immagini reali in produzione (Vercel)
 * Usa Unsplash API ufficiale per immagini reali di auto
 * 
 * Esegui questo script dopo il deploy su Vercel
 * Oppure configura come variabile d'ambiente NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
 */

const fs = require('fs');
const path = require('path');

// Funzione per ottenere immagini da Unsplash API
// Richiede API key (gratuita su unsplash.com/developers)
function getUnsplashImageUrl(query, width = 800, height = 600) {
  // In produzione, usa Unsplash API ufficiale
  // Per ora usiamo Unsplash Source (deprecato ma funziona)
  const encodedQuery = encodeURIComponent(query);
  return `https://source.unsplash.com/${width}x${height}/?${encodedQuery},car`;
}

// Mapping marche -> query di ricerca
const brandQueries = {
  'Fiat': 'fiat-500',
  'Alfa Romeo': 'alfa-romeo',
  'Volkswagen': 'volkswagen-golf',
  'Audi': 'audi',
  'Mercedes-Benz': 'mercedes-benz',
  'Renault': 'renault',
  'Peugeot': 'peugeot',
  'Nissan': 'nissan',
  'Toyota': 'toyota',
  'BMW': 'bmw',
  'Opel': 'opel',
  'Ford': 'ford',
  'Citroen': 'citroen',
  'Seat': 'seat',
  'Skoda': 'skoda',
  'Mazda': 'mazda',
  'Hyundai': 'hyundai',
  'Kia': 'kia',
  'Ducati': 'ducati-motorcycle',
  'Yamaha': 'yamaha-motorcycle',
};

function getProductionImage(brand, model, index) {
  const query = brandQueries[brand] || brand.toLowerCase();
  return getUnsplashImageUrl(`${query} ${model}`, 800, 600);
}

// Carica vehicles.json
const vehiclesPath = path.join(__dirname, '..', 'data', 'vehicles.json');
const vehiclesData = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));

// Aggiorna le immagini per produzione
if (process.env.NODE_ENV === 'production' || process.env.USE_REAL_IMAGES === 'true') {
  vehiclesData.vehicles.forEach((vehicle) => {
    vehicle.immagini = [
      getProductionImage(vehicle.marca, vehicle.modello, 0),
      getProductionImage(vehicle.marca, vehicle.modello, 1),
      getProductionImage(vehicle.marca, vehicle.modello, 2),
    ];
  });

  fs.writeFileSync(vehiclesPath, JSON.stringify(vehiclesData, null, 2));
  console.log('✅ Immagini aggiornate per produzione (Unsplash)');
} else {
  console.log('ℹ️  Modalità sviluppo: usa placeholder.com');
  console.log('💡 Per immagini reali: NODE_ENV=production node scripts/setup-production-images.js');
}

