const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/database');
const { optionalAuth, verifyToken, requireRole } = require('../middleware/auth');
const { prioritizeAlerts } = require('../services/alertService');

// Get all alerts with optional filters
router.get('/', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const { severity, type, acknowledged, limit = 50 } = req.query;

    let query = 'SELECT * FROM alerts WHERE 1=1';
    const params = [];

    if (severity) {
      query += ' AND severity = ?';
      params.push(severity);
    }
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (acknowledged !== undefined) {
      query += ' AND is_acknowledged = ?';
      params.push(acknowledged === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const alerts = db.prepare(query).all(...params);
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get alert statistics
router.get('/stats', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const total = db.prepare('SELECT COUNT(*) as count FROM alerts').get().count;
    const unacknowledged = db.prepare('SELECT COUNT(*) as count FROM alerts WHERE is_acknowledged = 0').get().count;
    const critical = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'critical' AND is_acknowledged = 0").get().count;
    const emergency = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'emergency' AND is_acknowledged = 0").get().count;

    // Breakdown by type
    const byType = db.prepare(`
      SELECT type, COUNT(*) as count FROM alerts 
      WHERE is_acknowledged = 0 
      GROUP BY type
    `).all();

    // Breakdown by severity
    const bySeverity = db.prepare(`
      SELECT severity, COUNT(*) as count FROM alerts 
      GROUP BY severity
    `).all();

    res.json({
      success: true,
      data: {
        total,
        unacknowledged,
        critical,
        emergency,
        by_type: byType,
        by_severity: bySeverity
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create a new alert (Admin/Officer)
router.post('/', verifyToken, requireRole(['admin', 'field_officer']), (req, res) => {
  try {
    const db = getDb();
    const { type, severity, title, message, district_id, lat, lng } = req.body;

    if (!type || !severity || !title) {
      return res.status(400).json({ success: false, error: 'type, severity, and title are required' });
    }

    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO alerts (id, type, severity, title, message, district_id, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, type, severity, title, message, district_id, lat, lng);

    const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Acknowledge an alert
router.put('/:id/acknowledge', verifyToken, (req, res) => {
  try {
    const db = getDb();
    const info = db.prepare('UPDATE alerts SET is_acknowledged = 1 WHERE id = ?').run(req.params.id);

    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    res.json({ success: true, message: 'Alert acknowledged' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete an alert (Admin only)
router.delete('/:id', verifyToken, requireRole(['admin']), (req, res) => {
  try {
    const db = getDb();
    const info = db.prepare('DELETE FROM alerts WHERE id = ?').run(req.params.id);

    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    res.json({ success: true, message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
