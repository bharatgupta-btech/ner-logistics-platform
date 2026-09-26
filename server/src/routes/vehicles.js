const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/database');
const { optionalAuth, verifyToken, requireRole } = require('../middleware/auth');

// Get all vehicles (with filters)
router.get('/', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const { status, type } = req.query;
    
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    const vehicles = db.prepare(query).all(params);
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single vehicle
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add vehicle (Admin/Officer only)
router.post('/', verifyToken, requireRole(['admin', 'field_officer']), (req, res) => {
  try {
    const db = getDb();
    const { vehicle_number, type, driver_name, driver_phone, cargo_description, origin, destination, current_lat, current_lng } = req.body;
    
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO vehicles (id, vehicle_number, type, driver_name, driver_phone, cargo_description, origin, destination, current_lat, current_lng, speed, heading, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 'in_transit')
    `);
    
    stmt.run(id, vehicle_number, type, driver_name, driver_phone, cargo_description, origin, destination, current_lat, current_lng);
    
    res.json({ success: true, data: { id, vehicle_number } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update vehicle location manually
router.put('/:id/location', verifyToken, (req, res) => {
  try {
    const db = getDb();
    const { lat, lng, speed, heading, status } = req.body;
    
    const stmt = db.prepare(`
      UPDATE vehicles 
      SET current_lat = COALESCE(?, current_lat),
          current_lng = COALESCE(?, current_lng),
          speed = COALESCE(?, speed),
          heading = COALESCE(?, heading),
          status = COALESCE(?, status),
          last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const info = stmt.run(lat, lng, speed, heading, status, req.params.id);
    
    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }
    
    res.json({ success: true, message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
