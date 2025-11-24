/**
 * Script per aggiornare le immagini dei veicoli con URL affidabili
 * Usa placeholder.com per demo locale, poi su Vercel useremo Unsplash API
 */

const fs = require('fs');
const path = require('path');

// Mapping marche -> colori per placeholder
const brandColors = {
  'Fiat': 'FF6900',
  'Alfa Romeo': '98002E',
  'Volkswagen': '000000',
  'Audi': 'BB0A30',
  'Mercedes-Benz': '00ADEF',
  'Renault': 'FFCC00',
  'Peugeot': '002F5F',
  'Nissan': 'C41E3A',
  'Toyota': 'EB0A1E',
  'BMW': '1C69D4',
  'Opel': 'FFCC00',
  'Ford': '003478',
  'Citroen': 'E21E24',
  'Seat': 'E21E24',
  'Skoda': '4BA82E',
  'Mazda': '101820',
  'Hyundai': '002C5F',
  'Kia': '05141F',
  'Ducati': 'C41E3A',
  'Yamaha': '000000',
};

function getPlaceholderImage(brand, model, index) {
  const color = brandColors[brand] || '666666';
  const text = `${brand} ${model}`.replace(/\s+/g, '+').substring(0, 20);
  // placeholder.com con dimensioni e colori
  return `https://via.placeholder.com/800x600/${color}/FFFFFF?text=${text}`;
}

// Alternativa: usare picsum.photos (più affidabile)
function getPicsumImage(seed) {
  // picsum.photos con seed per immagini consistenti
  return `https://picsum.photos/seed/${seed}/800/600`;
}

// Soluzione migliore per demo: usare un mix
function getDemoImage(brand, model, index, vehicleId) {
  // Per demo locale usiamo placeholder.com (sempre funziona)
  // Su Vercel useremo Unsplash API ufficiale
  const color = brandColors[brand] || '666666';
  const text = `${brand}+${model}`.replace(/\s+/g, '+').substring(0, 25);
  
  // placeholder.com è più affidabile per demo
  return `https://via.placeholder.com/800x600/${color}/FFFFFF?text=${text}`;
}

// Carica vehicles.json
const vehiclesPath = path.join(__dirname, '..', 'data', 'vehicles.json');
const vehiclesData = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));

// Aggiorna le immagini
vehiclesData.vehicles.forEach((vehicle, vehicleIndex) => {
  // Genera 3 immagini diverse per ogni veicolo
  vehicle.immagini = [
    getDemoImage(vehicle.marca, vehicle.modello, 0, vehicle.id),
    getDemoImage(vehicle.marca, vehicle.modello, 1, vehicle.id),
    getDemoImage(vehicle.marca, vehicle.modello, 2, vehicle.id),
  ];
});

// Salva il file aggiornato
fs.writeFileSync(vehiclesPath, JSON.stringify(vehiclesData, null, 2));

console.log(`✅ Aggiornate le immagini per ${vehiclesData.vehicles.length} veicoli`);
console.log('📸 Usando placeholder.com per demo locale');
console.log('💡 Su Vercel useremo Unsplash API per immagini reali');
