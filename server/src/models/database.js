const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const districts = require('../data/districts');
const nerRoutes = require('../data/nerRoutes');
const vehicles = require('../data/vehicles');

let db;

function initializeDatabase() {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'ner_logistics.db');
  db = new Database(dbPath, { verbose: null });

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'field_officer', 'viewer')),
      full_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      vehicle_number TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('medical', 'food', 'construction', 'agriculture')),
      driver_name TEXT,
      driver_phone TEXT,
      cargo_description TEXT,
      origin TEXT,
      destination TEXT,
      current_lat REAL,
      current_lng REAL,
      speed REAL,
      heading REAL,
      status TEXT CHECK(status IN ('in_transit', 'delivered', 'delayed', 'stopped')),
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS districts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      lat REAL,
      lng REAL,
      population INTEGER,
      elevation INTEGER,
      terrain_type TEXT,
      landslide_prone BOOLEAN,
      flood_prone BOOLEAN,
      nearest_highway TEXT,
      connectivity_index INTEGER,
      connectivity_status TEXT DEFAULT 'accessible' CHECK(connectivity_status IN ('accessible', 'partial', 'blocked')),
      road_condition TEXT DEFAULT 'good',
      bridge_status TEXT DEFAULT 'operational',
      risk_score INTEGER DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('road_blocked', 'weather', 'delay', 'landslide', 'flood', 'bridge_damage')),
      severity TEXT NOT NULL CHECK(severity IN ('info', 'warning', 'critical', 'emergency')),
      title TEXT NOT NULL,
      message TEXT,
      district_id TEXT,
      lat REAL,
      lng REAL,
      is_acknowledged BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS field_reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT,
      incident_type TEXT,
      severity TEXT,
      description TEXT,
      lat REAL,
      lng REAL,
      photo_data TEXT,
      status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted', 'verified', 'resolved')),
      district_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(reporter_id) REFERENCES users(id),
      FOREIGN KEY(district_id) REFERENCES districts(id)
    );

    CREATE TABLE IF NOT EXISTS route_segments (
      id TEXT PRIMARY KEY,
      from_district TEXT,
      to_district TEXT,
      distance_km REAL,
      base_travel_time REAL,
      road_type TEXT,
      elevation_change REAL,
      landslide_risk REAL,
      flood_risk REAL,
      bridge_count INTEGER,
      road_condition TEXT DEFAULT 'good' CHECK(road_condition IN ('good', 'fair', 'poor', 'blocked')),
      risk_score INTEGER DEFAULT 0
    );
  `);

  seedData();
}

function seedData() {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  if (userCount === 0) {
    const insertUser = db.prepare("INSERT INTO users (id, username, password_hash, role, full_name) VALUES (?, ?, ?, ?, ?)");
    insertUser.run('u1', 'admin', bcrypt.hashSync('admin123', 10), 'admin', 'System Administrator');
    insertUser.run('u2', 'officer', bcrypt.hashSync('officer123', 10), 'field_officer', 'NER Field Officer');
    insertUser.run('u3', 'viewer', bcrypt.hashSync('viewer123', 10), 'viewer', 'Public Viewer');
  }

  const districtCount = db.prepare("SELECT COUNT(*) as count FROM districts").get().count;
  if (districtCount === 0) {
    const insertDistrict = db.prepare(`
      INSERT INTO districts (id, name, state, lat, lng, population, elevation, terrain_type, landslide_prone, flood_prone, nearest_highway, connectivity_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    districts.forEach(d => {
      insertDistrict.run(d.id, d.name, d.state, d.lat, d.lng, d.population, d.elevation, d.terrain_type, d.landslide_prone ? 1 : 0, d.flood_prone ? 1 : 0, d.nearest_highway, d.connectivity_index);
    });
  }

  db.prepare("DELETE FROM route_segments").run();
  const insertRoute = db.prepare(`
    INSERT INTO route_segments (id, from_district, to_district, distance_km, base_travel_time, road_type, elevation_change, landslide_risk, flood_risk, bridge_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  nerRoutes.forEach((r, idx) => {
    insertRoute.run(`rt_${idx}`, r.from_district, r.to_district, r.distance_km, r.base_travel_time, r.road_type, r.elevation_change, r.landslide_risk, r.flood_risk, r.bridge_count);
  });

  const vehicleCount = db.prepare("SELECT COUNT(*) as count FROM vehicles").get().count;
  if (vehicleCount === 0) {
    const insertVehicle = db.prepare(`
      INSERT INTO vehicles (id, vehicle_number, type, driver_name, driver_phone, cargo_description, origin, destination, current_lat, current_lng, speed, heading, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    vehicles.forEach(v => {
      insertVehicle.run(v.id, v.vehicle_number, v.type, v.driver_name, v.driver_phone, v.cargo_description, v.origin, v.destination, v.current_lat, v.current_lng, v.speed, v.heading, v.status);
    });
  }

  const alertCount = db.prepare("SELECT COUNT(*) as count FROM alerts").get().count;
  if (alertCount === 0) {
    const insertAlert = db.prepare(`
      INSERT INTO alerts (id, type, severity, title, message, district_id, lat, lng, is_acknowledged, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialAlerts = [
      { id: 'alt_01', type: 'landslide', severity: 'critical', title: 'Major Landslide Blockage on NH-29', message: 'Debris flow near Kohima-Dimapur corridor. Road clearance underway by BRO. Heavy transport halted.', district_id: 'NAGALAND_KOHIMA', lat: 25.6701, lng: 94.1077, ack: 0, time: new Date(Date.now() - 25 * 60000).toISOString() },
      { id: 'alt_02', type: 'weather', severity: 'emergency', title: 'Severe Cloudburst & Flash Flood Alert', message: 'Intense precipitation (>85mm/hr) recorded in Upper Dibrugarh catchment area. Avoid low-lying river routes.', district_id: 'ASSAM_DIBRUGARH', lat: 27.4728, lng: 94.9120, ack: 0, time: new Date(Date.now() - 65 * 60000).toISOString() },
      { id: 'alt_03', type: 'bridge_damage', severity: 'warning', title: 'Single-Lane Load Restriction on NH-6 Bridge', message: 'Structural inspection underway on Jowai-Silchar bypass bridge. Maximum load capacity capped at 16 tons.', district_id: 'MEGHALAYA_JOWAI', lat: 25.4419, lng: 92.2014, ack: 0, time: new Date(Date.now() - 120 * 60000).toISOString() },
      { id: 'alt_04', type: 'delay', severity: 'warning', title: 'Critical Medical Cargo Delayed by 3h', message: 'Vehicle AS-01-MC-104 carrying ICU oxygen cylinders delayed between Guwahati and Tezpur due to localized waterlogging.', district_id: 'ASSAM_TEZPUR', lat: 26.6528, lng: 92.7926, ack: 0, time: new Date(Date.now() - 180 * 60000).toISOString() },
      { id: 'alt_05', type: 'landslide', severity: 'critical', title: 'Active Rockfall Warning on Sela Pass', message: 'Intermittent rockfalls reported along Bomdila-Tawang mountain pass (NH-13). Light commercial vehicles advised caution.', district_id: 'ARUNACHAL_BOMDILA', lat: 27.2645, lng: 92.4158, ack: 0, time: new Date(Date.now() - 240 * 60000).toISOString() }
    ];

    initialAlerts.forEach(a => {
      insertAlert.run(a.id, a.type, a.severity, a.title, a.message, a.district_id, a.lat, a.lng, a.ack, a.time);
    });
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDb
};
