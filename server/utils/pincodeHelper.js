// Pincode and Geographic Location Helper
// Comprehensive dictionary focused on Delhi, Modinagar, Ghaziabad, and Meerut

const PINCODE_DATABASE = [
  // --- MODINAGAR ---
  {
    pincode: '201204',
    area: 'Delhi-Meerut Road / Modinagar Central / SRM Zone',
    city: 'Modinagar',
    state: 'Uttar Pradesh',
    lat: 28.8315,
    lng: 77.5831,
  },
  {
    pincode: '201201',
    area: 'Muradnagar / Modinagar Sub-division',
    city: 'Modinagar',
    state: 'Uttar Pradesh',
    lat: 28.7801,
    lng: 77.5028,
  },

  // --- GHAZIABAD ---
  {
    pincode: '201001',
    area: 'Navyug Market / Old Bus Stand / GT Road',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    lat: 28.6692,
    lng: 77.4538,
  },
  {
    pincode: '201002',
    area: 'Raj Nagar / Kavi Nagar / Sanjay Nagar Hub',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    lat: 28.6830,
    lng: 77.4470,
  },
  {
    pincode: '201010',
    area: 'Indirapuram / Vaishali Healthcare Zone',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    lat: 28.6415,
    lng: 77.3714,
  },
  {
    pincode: '201014',
    area: 'Kaushambi / Sahibabad / Yashoda Hospital Hub',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    lat: 28.6468,
    lng: 77.3242,
  },
  {
    pincode: '201009',
    area: 'Crossings Republik / NH-24 / Manipal Zone',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    lat: 28.6322,
    lng: 77.4371,
  },

  // --- MEERUT ---
  {
    pincode: '250004',
    area: 'Garh Road / Shastri Nagar / Anand Hospital Zone',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    lat: 28.9667,
    lng: 77.7290,
  },
  {
    pincode: '250001',
    area: 'Meerut Cantt / Begum Bridge / Military Hospital',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    lat: 28.9845,
    lng: 77.7064,
  },
  {
    pincode: '250002',
    area: 'Subhash Nagar / Railway Road / Civil Lines',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    lat: 28.9712,
    lng: 77.7011,
  },
  {
    pincode: '250005',
    area: 'Subhartipuram / NH-58 / Subharti Medical University',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    lat: 29.0125,
    lng: 77.6710,
  },

  // --- DELHI ---
  {
    pincode: '110001',
    area: 'Connaught Place / Central Delhi Healthcare Hub',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6328,
    lng: 77.2197,
  },
  {
    pincode: '110029',
    area: 'Safdarjung Enclave / AIIMS Trauma Campus',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.5672,
    lng: 77.2100,
  },
  {
    pincode: '110092',
    area: 'Laxmi Nagar / Nirman Vihar / Max Patparganj',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6310,
    lng: 77.2926,
  },
  {
    pincode: '110025',
    area: 'Sukhdev Vihar / Apollo Hospital Indraprastha',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.5615,
    lng: 77.2831,
  },
  {
    pincode: '110054',
    area: 'Civil Lines / St. Stephen Hospital Area',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6750,
    lng: 77.2220,
  },
];

// Haversine formula to calculate distance in KM between two lat/lng points
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

// Get metadata for a specific pincode
function getPincodeInfo(pincode) {
  if (!pincode) return null;
  const cleaned = pincode.toString().trim();
  return PINCODE_DATABASE.find((item) => item.pincode === cleaned) || null;
}

// Find all nearby pincodes within a given radius in KM
function getNearbyPincodes(targetPincode, radiusKm = 25) {
  const target = getPincodeInfo(targetPincode);
  if (!target) return [];

  return PINCODE_DATABASE.map((item) => {
    const distance = calculateDistance(target.lat, target.lng, item.lat, item.lng);
    return {
      ...item,
      distanceKm: distance,
    };
  })
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

// Autocomplete and search helper
function searchPincodes(query = '') {
  const q = query.toString().toLowerCase().trim();
  if (!q) return PINCODE_DATABASE;
  return PINCODE_DATABASE.filter(
    (item) =>
      item.pincode.includes(q) ||
      item.area.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q)
  );
}

module.exports = {
  PINCODE_DATABASE,
  calculateDistance,
  getPincodeInfo,
  getNearbyPincodes,
  searchPincodes,
};
