// src/data/nerRoutes.js
// Comprehensive highway and road network connecting all 8 North Eastern states and districts

module.exports = [
  // ==========================================
  // ASSAM INTERNAL HIGHWAY CORRIDORS
  // ==========================================
  { from_district: "ASSAM_GUWAHATI", to_district: "ASSAM_TEZPUR", distance_km: 180, base_travel_time: 240, road_type: "NH", elevation_change: 10, landslide_risk: 0.1, flood_risk: 0.4, bridge_count: 15 },
  { from_district: "ASSAM_TEZPUR", to_district: "ASSAM_NAGAON", distance_km: 60, base_travel_time: 90, road_type: "NH", elevation_change: 12, landslide_risk: 0.1, flood_risk: 0.5, bridge_count: 5 },
  { from_district: "ASSAM_GUWAHATI", to_district: "ASSAM_NAGAON", distance_km: 120, base_travel_time: 150, road_type: "NH", elevation_change: 5, landslide_risk: 0.1, flood_risk: 0.6, bridge_count: 8 },
  { from_district: "ASSAM_NAGAON", to_district: "ASSAM_JORHAT", distance_km: 190, base_travel_time: 260, road_type: "NH", elevation_change: 56, landslide_risk: 0.1, flood_risk: 0.5, bridge_count: 20 },
  { from_district: "ASSAM_JORHAT", to_district: "ASSAM_DIBRUGARH", distance_km: 140, base_travel_time: 190, road_type: "NH", elevation_change: -8, landslide_risk: 0.1, flood_risk: 0.7, bridge_count: 12 },
  { from_district: "ASSAM_GUWAHATI", to_district: "ASSAM_SILCHAR", distance_km: 300, base_travel_time: 480, road_type: "NH", elevation_change: -33, landslide_risk: 0.4, flood_risk: 0.8, bridge_count: 35 },
  { from_district: "ASSAM_NAGAON", to_district: "ASSAM_SILCHAR", distance_km: 260, base_travel_time: 420, road_type: "NH", elevation_change: -38, landslide_risk: 0.35, flood_risk: 0.6, bridge_count: 25 },

  // ==========================================
  // MEGHALAYA NETWORK
  // ==========================================
  { from_district: "ASSAM_GUWAHATI", to_district: "MEGHALAYA_SHILLONG", distance_km: 100, base_travel_time: 150, road_type: "NH", elevation_change: 1470, landslide_risk: 0.5, flood_risk: 0.1, bridge_count: 10 },
  { from_district: "MEGHALAYA_SHILLONG", to_district: "MEGHALAYA_JOWAI", distance_km: 65, base_travel_time: 110, road_type: "NH", elevation_change: -145, landslide_risk: 0.6, flood_risk: 0.1, bridge_count: 6 },
  { from_district: "MEGHALAYA_SHILLONG", to_district: "MEGHALAYA_NONGSTOIN", distance_km: 90, base_travel_time: 160, road_type: "SH", elevation_change: -116, landslide_risk: 0.55, flood_risk: 0.1, bridge_count: 8 },
  { from_district: "MEGHALAYA_NONGSTOIN", to_district: "MEGHALAYA_WILLIAMNAGAR", distance_km: 110, base_travel_time: 210, road_type: "SH", elevation_change: -1249, landslide_risk: 0.6, flood_risk: 0.2, bridge_count: 12 },
  { from_district: "MEGHALAYA_WILLIAMNAGAR", to_district: "MEGHALAYA_TURA", distance_km: 75, base_travel_time: 140, road_type: "NH", elevation_change: 189, landslide_risk: 0.5, flood_risk: 0.2, bridge_count: 9 },
  { from_district: "ASSAM_GUWAHATI", to_district: "MEGHALAYA_TURA", distance_km: 220, base_travel_time: 300, road_type: "NH", elevation_change: 294, landslide_risk: 0.4, flood_risk: 0.3, bridge_count: 18 },
  { from_district: "MEGHALAYA_JOWAI", to_district: "ASSAM_SILCHAR", distance_km: 140, base_travel_time: 240, road_type: "NH", elevation_change: -1358, landslide_risk: 0.75, flood_risk: 0.3, bridge_count: 22 },

  // ==========================================
  // ARUNACHAL PRADESH NETWORK
  // ==========================================
  { from_district: "ASSAM_TEZPUR", to_district: "ARUNACHAL_BOMDILA", distance_km: 155, base_travel_time: 300, road_type: "NH", elevation_change: 2367, landslide_risk: 0.85, flood_risk: 0.1, bridge_count: 14 },
  { from_district: "ARUNACHAL_BOMDILA", to_district: "ARUNACHAL_TAWANG", distance_km: 170, base_travel_time: 420, road_type: "NH", elevation_change: 633, landslide_risk: 0.9, flood_risk: 0.05, bridge_count: 22 },
  { from_district: "ASSAM_TEZPUR", to_district: "ARUNACHAL_ITANAGAR", distance_km: 160, base_travel_time: 240, road_type: "NH", elevation_change: 272, landslide_risk: 0.55, flood_risk: 0.2, bridge_count: 12 },
  { from_district: "ASSAM_JORHAT", to_district: "ARUNACHAL_ITANAGAR", distance_km: 140, base_travel_time: 220, road_type: "NH", elevation_change: 204, landslide_risk: 0.5, flood_risk: 0.3, bridge_count: 11 },
  { from_district: "ARUNACHAL_ITANAGAR", to_district: "ARUNACHAL_PASIGHAT", distance_km: 260, base_travel_time: 420, road_type: "NH", elevation_change: -167, landslide_risk: 0.65, flood_risk: 0.4, bridge_count: 24 },
  { from_district: "ASSAM_DIBRUGARH", to_district: "ARUNACHAL_PASIGHAT", distance_km: 150, base_travel_time: 210, road_type: "NH", elevation_change: 45, landslide_risk: 0.3, flood_risk: 0.7, bridge_count: 15 },
  { from_district: "ARUNACHAL_PASIGHAT", to_district: "ARUNACHAL_ALONG", distance_km: 105, base_travel_time: 200, road_type: "NH", elevation_change: 466, landslide_risk: 0.75, flood_risk: 0.2, bridge_count: 14 },
  { from_district: "ARUNACHAL_ITANAGAR", to_district: "ARUNACHAL_ALONG", distance_km: 290, base_travel_time: 480, road_type: "NH", elevation_change: 299, landslide_risk: 0.8, flood_risk: 0.2, bridge_count: 30 },
  { from_district: "ASSAM_DIBRUGARH", to_district: "ARUNACHAL_ALONG", distance_km: 240, base_travel_time: 380, road_type: "NH", elevation_change: 511, landslide_risk: 0.6, flood_risk: 0.4, bridge_count: 22 },

  // ==========================================
  // NAGALAND NETWORK
  // ==========================================
  { from_district: "ASSAM_GUWAHATI", to_district: "NAGALAND_DIMAPUR", distance_km: 280, base_travel_time: 380, road_type: "NH", elevation_change: 90, landslide_risk: 0.2, flood_risk: 0.4, bridge_count: 25 },
  { from_district: "ASSAM_NAGAON", to_district: "NAGALAND_DIMAPUR", distance_km: 170, base_travel_time: 240, road_type: "NH", elevation_change: 85, landslide_risk: 0.25, flood_risk: 0.3, bridge_count: 16 },
  { from_district: "NAGALAND_DIMAPUR", to_district: "NAGALAND_KOHIMA", distance_km: 70, base_travel_time: 130, road_type: "NH", elevation_change: 1299, landslide_risk: 0.75, flood_risk: 0.1, bridge_count: 12 },
  { from_district: "ASSAM_JORHAT", to_district: "NAGALAND_MOKOKCHUNG", distance_km: 105, base_travel_time: 210, road_type: "NH", elevation_change: 1209, landslide_risk: 0.65, flood_risk: 0.1, bridge_count: 8 },
  { from_district: "NAGALAND_KOHIMA", to_district: "NAGALAND_MOKOKCHUNG", distance_km: 145, base_travel_time: 290, road_type: "NH", elevation_change: -119, landslide_risk: 0.7, flood_risk: 0.1, bridge_count: 15 },
  { from_district: "NAGALAND_MOKOKCHUNG", to_district: "NAGALAND_TUENSANG", distance_km: 85, base_travel_time: 190, road_type: "SH", elevation_change: 46, landslide_risk: 0.8, flood_risk: 0.05, bridge_count: 9 },
  { from_district: "NAGALAND_MOKOKCHUNG", to_district: "NAGALAND_MON", distance_km: 130, base_travel_time: 270, road_type: "SH", elevation_change: -428, landslide_risk: 0.75, flood_risk: 0.1, bridge_count: 14 },
  { from_district: "ASSAM_DIBRUGARH", to_district: "NAGALAND_MON", distance_km: 120, base_travel_time: 220, road_type: "SH", elevation_change: 789, landslide_risk: 0.6, flood_risk: 0.2, bridge_count: 11 },

  // ==========================================
  // MANIPUR NETWORK
  // ==========================================
  { from_district: "NAGALAND_KOHIMA", to_district: "MANIPUR_IMPHAL", distance_km: 140, base_travel_time: 240, road_type: "NH", elevation_change: -658, landslide_risk: 0.7, flood_risk: 0.1, bridge_count: 20 },
  { from_district: "MANIPUR_IMPHAL", to_district: "MANIPUR_THOUBAL", distance_km: 25, base_travel_time: 40, road_type: "NH", elevation_change: 4, landslide_risk: 0.1, flood_risk: 0.4, bridge_count: 4 },
  { from_district: "MANIPUR_IMPHAL", to_district: "MANIPUR_BISHNUPUR", distance_km: 30, base_travel_time: 50, road_type: "NH", elevation_change: 40, landslide_risk: 0.1, flood_risk: 0.5, bridge_count: 5 },
  { from_district: "MANIPUR_BISHNUPUR", to_district: "MANIPUR_CHURACHANDPUR", distance_km: 35, base_travel_time: 60, road_type: "NH", elevation_change: 88, landslide_risk: 0.45, flood_risk: 0.2, bridge_count: 6 },
  { from_district: "MANIPUR_IMPHAL", to_district: "MANIPUR_UKHRUL", distance_km: 85, base_travel_time: 160, road_type: "NH", elevation_change: 876, landslide_risk: 0.8, flood_risk: 0.05, bridge_count: 12 },
  { from_district: "ASSAM_SILCHAR", to_district: "MANIPUR_IMPHAL", distance_km: 260, base_travel_time: 480, road_type: "NH", elevation_change: 764, landslide_risk: 0.85, flood_risk: 0.2, bridge_count: 42 },

  // ==========================================
  // MIZORAM NETWORK
  // ==========================================
  { from_district: "ASSAM_SILCHAR", to_district: "MIZORAM_KOLASIB", distance_km: 80, base_travel_time: 150, road_type: "NH", elevation_change: 756, landslide_risk: 0.7, flood_risk: 0.1, bridge_count: 12 },
  { from_district: "MIZORAM_KOLASIB", to_district: "MIZORAM_AIZAWL", distance_km: 90, base_travel_time: 170, road_type: "NH", elevation_change: 354, landslide_risk: 0.75, flood_risk: 0.05, bridge_count: 14 },
  { from_district: "ASSAM_SILCHAR", to_district: "MIZORAM_AIZAWL", distance_km: 170, base_travel_time: 320, road_type: "NH", elevation_change: 1110, landslide_risk: 0.75, flood_risk: 0.1, bridge_count: 24 },
  { from_district: "MIZORAM_AIZAWL", to_district: "MIZORAM_SERCHHIP", distance_km: 90, base_travel_time: 170, road_type: "NH", elevation_change: -244, landslide_risk: 0.7, flood_risk: 0.05, bridge_count: 10 },
  { from_district: "MIZORAM_SERCHHIP", to_district: "MIZORAM_LUNGLEI", distance_km: 85, base_travel_time: 160, road_type: "NH", elevation_change: -166, landslide_risk: 0.75, flood_risk: 0.05, bridge_count: 11 },
  { from_district: "MIZORAM_AIZAWL", to_district: "MIZORAM_LUNGLEI", distance_km: 165, base_travel_time: 310, road_type: "NH", elevation_change: -410, landslide_risk: 0.8, flood_risk: 0.05, bridge_count: 21 },
  { from_district: "MIZORAM_AIZAWL", to_district: "MIZORAM_CHAMPHAI", distance_km: 185, base_travel_time: 360, road_type: "NH", elevation_change: 546, landslide_risk: 0.85, flood_risk: 0.05, bridge_count: 19 },
  { from_district: "MANIPUR_CHURACHANDPUR", to_district: "MIZORAM_CHAMPHAI", distance_km: 190, base_travel_time: 380, road_type: "SH", elevation_change: 764, landslide_risk: 0.8, flood_risk: 0.1, bridge_count: 18 },

  // ==========================================
  // TRIPURA NETWORK
  // ==========================================
  { from_district: "ASSAM_SILCHAR", to_district: "TRIPURA_DHARMANAGAR", distance_km: 110, base_travel_time: 170, road_type: "NH", elevation_change: -1, landslide_risk: 0.2, flood_risk: 0.5, bridge_count: 10 },
  { from_district: "TRIPURA_DHARMANAGAR", to_district: "TRIPURA_KAILASHAHAR", distance_km: 30, base_travel_time: 50, road_type: "NH", elevation_change: 1, landslide_risk: 0.15, flood_risk: 0.6, bridge_count: 4 },
  { from_district: "TRIPURA_DHARMANAGAR", to_district: "TRIPURA_AMBASSA", distance_km: 85, base_travel_time: 130, road_type: "NH", elevation_change: 63, landslide_risk: 0.35, flood_risk: 0.3, bridge_count: 12 },
  { from_district: "TRIPURA_AMBASSA", to_district: "TRIPURA_AGARTALA", distance_km: 80, base_travel_time: 110, road_type: "NH", elevation_change: -72, landslide_risk: 0.2, flood_risk: 0.3, bridge_count: 9 },
  { from_district: "TRIPURA_AGARTALA", to_district: "TRIPURA_UDAIPUR", distance_km: 50, base_travel_time: 75, road_type: "NH", elevation_change: 10, landslide_risk: 0.1, flood_risk: 0.4, bridge_count: 6 },
  { from_district: "TRIPURA_AMBASSA", to_district: "TRIPURA_UDAIPUR", distance_km: 75, base_travel_time: 120, road_type: "SH", elevation_change: -62, landslide_risk: 0.25, flood_risk: 0.3, bridge_count: 8 },

  // ==========================================
  // SIKKIM & INTER-REGIONAL CORRIDORS
  // ==========================================
  { from_district: "SIKKIM_GANGTOK", to_district: "SIKKIM_NAMCHI", distance_km: 80, base_travel_time: 160, road_type: "NH", elevation_change: -335, landslide_risk: 0.8, flood_risk: 0.1, bridge_count: 12 },
  { from_district: "SIKKIM_GANGTOK", to_district: "SIKKIM_MANGAN", distance_km: 65, base_travel_time: 140, road_type: "NH", elevation_change: -694, landslide_risk: 0.9, flood_risk: 0.1, bridge_count: 10 },
  { from_district: "SIKKIM_NAMCHI", to_district: "SIKKIM_GYALSHING", distance_km: 55, base_travel_time: 120, road_type: "SH", elevation_change: -492, landslide_risk: 0.75, flood_risk: 0.1, bridge_count: 8 },
  { from_district: "SIKKIM_GANGTOK", to_district: "SIKKIM_GYALSHING", distance_km: 110, base_travel_time: 220, road_type: "SH", elevation_change: -827, landslide_risk: 0.85, flood_risk: 0.1, bridge_count: 15 },
  { from_district: "SIKKIM_GANGTOK", to_district: "ASSAM_GUWAHATI", distance_km: 540, base_travel_time: 720, road_type: "NH", elevation_change: -1595, landslide_risk: 0.5, flood_risk: 0.4, bridge_count: 45 }
];
