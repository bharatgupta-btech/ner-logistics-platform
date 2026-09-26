// src/data/districts.js
module.exports = [
  // Assam
  { id: "ASSAM_GUWAHATI", name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362, population: 963429, elevation: 55, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 27", connectivity_index: 95 },
  { id: "ASSAM_JORHAT", name: "Jorhat", state: "Assam", lat: 26.7509, lng: 94.2037, population: 153889, elevation: 116, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 715", connectivity_index: 80 },
  { id: "ASSAM_DIBRUGARH", name: "Dibrugarh", state: "Assam", lat: 27.4728, lng: 94.9120, population: 154019, elevation: 108, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 15", connectivity_index: 75 },
  { id: "ASSAM_SILCHAR", name: "Silchar", state: "Assam", lat: 24.8333, lng: 92.7789, population: 172830, elevation: 22, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 37", connectivity_index: 70 },
  { id: "ASSAM_TEZPUR", name: "Tezpur", state: "Assam", lat: 26.6528, lng: 92.7926, population: 102505, elevation: 48, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 15", connectivity_index: 78 },
  { id: "ASSAM_NAGAON", name: "Nagaon", state: "Assam", lat: 26.3480, lng: 92.6840, population: 117722, elevation: 60, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 27", connectivity_index: 82 },

  // Arunachal Pradesh
  { id: "ARUNACHAL_ITANAGAR", name: "Itanagar", state: "Arunachal Pradesh", lat: 27.0844, lng: 93.6053, population: 59490, elevation: 320, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 415", connectivity_index: 60 },
  { id: "ARUNACHAL_TAWANG", name: "Tawang", state: "Arunachal Pradesh", lat: 27.5861, lng: 91.8697, population: 11202, elevation: 3048, terrain_type: "Mountainous", landslide_prone: true, flood_prone: false, nearest_highway: "NH 13", connectivity_index: 40 },
  { id: "ARUNACHAL_BOMDILA", name: "Bomdila", state: "Arunachal Pradesh", lat: 27.2645, lng: 92.4158, population: 8000, elevation: 2415, terrain_type: "Mountainous", landslide_prone: true, flood_prone: false, nearest_highway: "NH 13", connectivity_index: 45 },
  { id: "ARUNACHAL_PASIGHAT", name: "Pasighat", state: "Arunachal Pradesh", lat: 28.0619, lng: 95.3259, population: 24656, elevation: 153, terrain_type: "Foothills", landslide_prone: true, flood_prone: true, nearest_highway: "NH 515", connectivity_index: 55 },
  { id: "ARUNACHAL_ALONG", name: "Along", state: "Arunachal Pradesh", lat: 28.1691, lng: 94.7958, population: 20680, elevation: 619, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 13", connectivity_index: 48 },

  // Manipur
  { id: "MANIPUR_IMPHAL", name: "Imphal", state: "Manipur", lat: 24.8170, lng: 93.9368, population: 268243, elevation: 786, terrain_type: "Valley", landslide_prone: false, flood_prone: true, nearest_highway: "NH 2", connectivity_index: 75 },
  { id: "MANIPUR_CHURACHANDPUR", name: "Churachandpur", state: "Manipur", lat: 24.3333, lng: 93.6667, population: 54141, elevation: 914, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 60 },
  { id: "MANIPUR_THOUBAL", name: "Thoubal", state: "Manipur", lat: 24.6369, lng: 94.0152, population: 45947, elevation: 790, terrain_type: "Valley", landslide_prone: false, flood_prone: true, nearest_highway: "NH 102", connectivity_index: 68 },
  { id: "MANIPUR_BISHNUPUR", name: "Bishnupur", state: "Manipur", lat: 24.6293, lng: 93.7599, population: 16264, elevation: 826, terrain_type: "Valley", landslide_prone: false, flood_prone: true, nearest_highway: "NH 2", connectivity_index: 65 },
  { id: "MANIPUR_UKHRUL", name: "Ukhrul", state: "Manipur", lat: 25.1116, lng: 94.3592, population: 24397, elevation: 1662, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 202", connectivity_index: 50 },

  // Meghalaya
  { id: "MEGHALAYA_SHILLONG", name: "Shillong", state: "Meghalaya", lat: 25.5788, lng: 91.8933, population: 143229, elevation: 1525, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 6", connectivity_index: 80 },
  { id: "MEGHALAYA_TURA", name: "Tura", state: "Meghalaya", lat: 25.5134, lng: 90.2173, population: 74858, elevation: 349, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 217", connectivity_index: 60 },
  { id: "MEGHALAYA_JOWAI", name: "Jowai", state: "Meghalaya", lat: 25.4419, lng: 92.2014, population: 28430, elevation: 1380, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 6", connectivity_index: 65 },
  { id: "MEGHALAYA_NONGSTOIN", name: "Nongstoin", state: "Meghalaya", lat: 25.5204, lng: 91.2662, population: 28742, elevation: 1409, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 106", connectivity_index: 55 },
  { id: "MEGHALAYA_WILLIAMNAGAR", name: "Williamnagar", state: "Meghalaya", lat: 25.5002, lng: 90.6273, population: 14389, elevation: 160, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 127B", connectivity_index: 50 },

  // Mizoram
  { id: "MIZORAM_AIZAWL", name: "Aizawl", state: "Mizoram", lat: 23.7367, lng: 92.7146, population: 293416, elevation: 1132, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 70 },
  { id: "MIZORAM_LUNGLEI", name: "Lunglei", state: "Mizoram", lat: 22.8809, lng: 92.7351, population: 57011, elevation: 722, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 60 },
  { id: "MIZORAM_CHAMPHAI", name: "Champhai", state: "Mizoram", lat: 23.4735, lng: 93.3275, population: 32734, elevation: 1678, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 102B", connectivity_index: 55 },
  { id: "MIZORAM_SERCHHIP", name: "Serchhip", state: "Mizoram", lat: 23.3087, lng: 92.8398, population: 21158, elevation: 888, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 58 },
  { id: "MIZORAM_KOLASIB", name: "Kolasib", state: "Mizoram", lat: 24.2255, lng: 92.6738, population: 24272, elevation: 778, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 306", connectivity_index: 62 },

  // Nagaland
  { id: "NAGALAND_KOHIMA", name: "Kohima", state: "Nagaland", lat: 25.6701, lng: 94.1077, population: 99039, elevation: 1444, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 70 },
  { id: "NAGALAND_DIMAPUR", name: "Dimapur", state: "Nagaland", lat: 25.9060, lng: 93.7275, population: 122834, elevation: 145, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 29", connectivity_index: 85 },
  { id: "NAGALAND_MOKOKCHUNG", name: "Mokokchung", state: "Nagaland", lat: 26.3312, lng: 94.5273, population: 35914, elevation: 1325, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 65 },
  { id: "NAGALAND_TUENSANG", name: "Tuensang", state: "Nagaland", lat: 26.2750, lng: 94.8250, population: 36774, elevation: 1371, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 202", connectivity_index: 50 },
  { id: "NAGALAND_MON", name: "Mon", state: "Nagaland", lat: 26.7454, lng: 95.0931, population: 16590, elevation: 897, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 702", connectivity_index: 45 },

  // Sikkim
  { id: "SIKKIM_GANGTOK", name: "Gangtok", state: "Sikkim", lat: 27.3389, lng: 88.6065, population: 100286, elevation: 1650, terrain_type: "Mountainous", landslide_prone: true, flood_prone: false, nearest_highway: "NH 10", connectivity_index: 75 },
  { id: "SIKKIM_NAMCHI", name: "Namchi", state: "Sikkim", lat: 27.1678, lng: 88.3512, population: 12194, elevation: 1315, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 710", connectivity_index: 60 },
  { id: "SIKKIM_GYALSHING", name: "Gyalshing", state: "Sikkim", lat: 27.2917, lng: 88.2435, population: 4013, elevation: 823, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 510", connectivity_index: 55 },
  { id: "SIKKIM_MANGAN", name: "Mangan", state: "Sikkim", lat: 27.4984, lng: 88.5283, population: 4644, elevation: 956, terrain_type: "Mountainous", landslide_prone: true, flood_prone: false, nearest_highway: "NH 310A", connectivity_index: 50 },

  // Tripura
  { id: "TRIPURA_AGARTALA", name: "Agartala", state: "Tripura", lat: 23.8315, lng: 91.2868, population: 400004, elevation: 12, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 8", connectivity_index: 85 },
  { id: "TRIPURA_UDAIPUR", name: "Udaipur", state: "Tripura", lat: 23.5350, lng: 91.4815, population: 32781, elevation: 22, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 8", connectivity_index: 70 },
  { id: "TRIPURA_DHARMANAGAR", name: "Dharmanagar", state: "Tripura", lat: 24.3809, lng: 92.1627, population: 40595, elevation: 21, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 8", connectivity_index: 68 },
  { id: "TRIPURA_KAILASHAHAR", name: "Kailashahar", state: "Tripura", lat: 24.3168, lng: 92.0083, population: 22405, elevation: 22, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 8", connectivity_index: 65 },
  { id: "TRIPURA_AMBASSA", name: "Ambassa", state: "Tripura", lat: 23.9213, lng: 91.8541, population: 16285, elevation: 84, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 8", connectivity_index: 60 }
];
