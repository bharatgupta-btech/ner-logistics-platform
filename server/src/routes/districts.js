const express = require('express');
const router = express.Router();
const { getDb } = require('../models/database');
const { optionalAuth, verifyToken, requireRole } = require('../middleware/auth');

// Get all districts with their current status
router.get('/', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const { state, status } = req.query;

    let query = 'SELECT * FROM districts WHERE 1=1';
    const params = [];

    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }
    if (status) {
      query += ' AND connectivity_status = ?';
      params.push(status);
    }

    query += ' ORDER BY state, name';
    const districts = db.prepare(query).all(...params);

    res.json({ success: true, data: districts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get a single district by ID
router.get('/:id', verifyToken, (req, res) => {
  try {
    const db = getDb();
    const district = db.prepare('SELECT * FROM districts WHERE id = ?').get(req.params.id);

    if (!district) {
      return res.status(404).json({ success: false, error: 'District not found' });
    }

    // Get related alerts
    const alerts = db.prepare('SELECT * FROM alerts WHERE district_id = ? ORDER BY created_at DESC LIMIT 10').all(req.params.id);

    // Get related field reports
    const reports = db.prepare('SELECT * FROM field_reports WHERE district_id = ? ORDER BY created_at DESC LIMIT 10').all(req.params.id);

    // Get connected routes
    const routes = db.prepare(`
      SELECT rs.*, d1.name as from_name, d2.name as to_name 
      FROM route_segments rs 
      LEFT JOIN districts d1 ON rs.from_district = d1.id
      LEFT JOIN districts d2 ON rs.to_district = d2.id
      WHERE rs.from_district = ? OR rs.to_district = ?
    `).all(req.params.id, req.params.id);

    // Get vehicles heading to this district
    const vehicles = db.prepare("SELECT * FROM vehicles WHERE destination = ? AND status = 'in_transit'").all(district.name);

    res.json({
      success: true,
      data: {
        ...district,
        alerts,
        reports,
        connected_routes: routes,
        incoming_vehicles: vehicles
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update district status (Admin/Officer)
router.put('/:id/status', verifyToken, requireRole(['admin', 'field_officer']), (req, res) => {
  try {
    const db = getDb();
    const { connectivity_status, road_condition, bridge_status, risk_score } = req.body;

    let updates = [];
    let params = [];

    if (connectivity_status) {
      if (!['accessible', 'partial', 'blocked'].includes(connectivity_status)) {
        return res.status(400).json({ success: false, error: 'Invalid connectivity_status' });
      }
      updates.push('connectivity_status = ?');
      params.push(connectivity_status);
    }
    if (road_condition) {
      updates.push('road_condition = ?');
      params.push(road_condition);
    }
    if (bridge_status) {
      updates.push('bridge_status = ?');
      params.push(bridge_status);
    }
    if (risk_score !== undefined) {
      updates.push('risk_score = ?');
      params.push(risk_score);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push('last_updated = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    const info = db.prepare(`UPDATE districts SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'District not found' });
    }

    const updated = db.prepare('SELECT * FROM districts WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get connectivity matrix — all districts with connection status summary
router.get('/connectivity/matrix', verifyToken, (req, res) => {
  try {
    const db = getDb();

    const districts = db.prepare('SELECT id, name, state, lat, lng, connectivity_status, risk_score FROM districts ORDER BY state, name').all();
    const routes = db.prepare('SELECT from_district, to_district, road_condition, distance_km FROM route_segments').all();

    // Build adjacency map
    const connections = {};
    routes.forEach(r => {
      if (!connections[r.from_district]) connections[r.from_district] = [];
      if (!connections[r.to_district]) connections[r.to_district] = [];
      connections[r.from_district].push({ to: r.to_district, condition: r.road_condition, distance: r.distance_km });
      connections[r.to_district].push({ to: r.from_district, condition: r.road_condition, distance: r.distance_km });
    });

    const result = districts.map(d => ({
      ...d,
      connections: (connections[d.id] || []).length,
      blocked_connections: (connections[d.id] || []).filter(c => c.road_condition === 'blocked').length
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
