const express = require('express');
const router = express.Router();
const { getDb } = require('../models/database');
const { optionalAuth, verifyToken } = require('../middleware/auth');
const routeOptimizer = require('../services/routeOptimizer');

router.post('/optimize', optionalAuth, (req, res) => {
  try {
    const { from_district, to_district, constraints } = req.body;
    
    if (!from_district || !to_district) {
      return res.status(400).json({ success: false, error: 'from_district and to_district required' });
    }

    const routes = routeOptimizer.findOptimalRoute(from_district, to_district, constraints || {});
    res.json({ success: true, data: routes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/status', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const segments = db.prepare('SELECT * FROM route_segments').all();
    
    const blockedCount = segments.filter(s => s.road_condition === 'blocked').length;
    const poorCount = segments.filter(s => s.road_condition === 'poor').length;
    
    res.json({ 
      success: true, 
      data: {
        total_segments: segments.length,
        blocked: blockedCount,
        poor: poorCount,
        network_health: 100 - ((blockedCount * 2 + poorCount) / segments.length * 100)
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/emergency/:from/:to', optionalAuth, (req, res) => {
  try {
    const { from, to } = req.params;
    const route = routeOptimizer.findEmergencyRoute(from, to);
    res.json({ success: true, data: route });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
