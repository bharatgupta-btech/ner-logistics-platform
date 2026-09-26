const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/database');
const { optionalAuth, verifyToken, requireRole } = require('../middleware/auth');

// Get all field reports with optional filters
router.get('/', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const { incident_type, status, district_id, limit = 50 } = req.query;

    let query = 'SELECT * FROM field_reports WHERE 1=1';
    const params = [];

    if (incident_type) {
      query += ' AND incident_type = ?';
      params.push(incident_type);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (district_id) {
      query += ' AND district_id = ?';
      params.push(district_id);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const reports = db.prepare(query).all(...params);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get report statistics
router.get('/stats', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const total = db.prepare('SELECT COUNT(*) as count FROM field_reports').get().count;
    const submitted = db.prepare("SELECT COUNT(*) as count FROM field_reports WHERE status = 'submitted'").get().count;
    const verified = db.prepare("SELECT COUNT(*) as count FROM field_reports WHERE status = 'verified'").get().count;
    const resolved = db.prepare("SELECT COUNT(*) as count FROM field_reports WHERE status = 'resolved'").get().count;

    // Breakdown by incident type
    const byType = db.prepare(`
      SELECT incident_type, COUNT(*) as count FROM field_reports 
      GROUP BY incident_type
    `).all();

    res.json({
      success: true,
      data: {
        total,
        submitted,
        verified,
        resolved,
        by_type: byType
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submit a new field report (with geo-tagged photo)
router.post('/', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const {
      incident_type,
      severity,
      description,
      lat,
      lng,
      photo_data,
      district_id
    } = req.body;

    if (!incident_type || !description) {
      return res.status(400).json({
        success: false,
        error: 'incident_type and description are required'
      });
    }

    const reporterId = req.user?.id || 'u2'; // Default to field officer if guest
    const reportLat = lat || 26.2;
    const reportLng = lng || 92.9;

    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO field_reports (id, reporter_id, incident_type, severity, description, lat, lng, photo_data, district_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      reporterId,
      incident_type,
      severity || 'medium',
      description,
      reportLat,
      reportLng,
      photo_data || null,
      district_id || null
    );

    // Also auto-generate an alert from this report so it appears in the Alert Center
    try {
      const alertId = uuidv4();
      const alertStmt = db.prepare(`
        INSERT INTO alerts (id, type, severity, title, message, district_id, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const alertSeverity = (severity === 'critical' || severity === 'high') ? 'critical' : 'warning';
      const alertTitle = `Field Report: ${incident_type.replace('_', ' ').toUpperCase()}`;
      alertStmt.run(alertId, incident_type, alertSeverity, alertTitle, description, district_id || null, reportLat, reportLng);
    } catch (e) {
      console.warn('Failed to auto-create alert from report:', e);
    }

    const report = db.prepare('SELECT * FROM field_reports WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update report status (Admin/Officer: submitted → verified → resolved)
router.put('/:id/status', verifyToken, requireRole(['admin', 'field_officer']), (req, res) => {
  try {
    const db = getDb();
    const { status } = req.body;

    if (!['submitted', 'verified', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be submitted, verified, or resolved.' });
    }

    const info = db.prepare('UPDATE field_reports SET status = ? WHERE id = ?').run(status, req.params.id);

    if (info.changes === 0) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    res.json({ success: true, message: `Report status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get a single report by ID
router.get('/:id', verifyToken, (req, res) => {
  try {
    const db = getDb();
    const report = db.prepare('SELECT * FROM field_reports WHERE id = ?').get(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
