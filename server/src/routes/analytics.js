const express = require('express');
const router = express.Router();
const { getDb } = require('../models/database');
const { optionalAuth, verifyToken } = require('../middleware/auth');
const { calculateRiskScore, predictDisruptions, generateInsights } = require('../services/aiEngine');
const { getRegionWeather } = require('../services/weatherService');
const districtsData = require('../data/districts');

// Get dashboard overview statistics
router.get('/overview', optionalAuth, async (req, res) => {
  try {
    const db = getDb();

    // Vehicle statistics
    const totalVehicles = db.prepare('SELECT COUNT(*) as count FROM vehicles').get().count;
    const activeVehicles = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'in_transit'").get().count;
    const delayedVehicles = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'delayed'").get().count;
    const deliveredVehicles = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'delivered'").get().count;

    // Alert statistics
    const totalAlerts = db.prepare('SELECT COUNT(*) as count FROM alerts').get().count;
    const activeAlerts = db.prepare('SELECT COUNT(*) as count FROM alerts WHERE is_acknowledged = 0').get().count;
    const criticalAlerts = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity IN ('critical', 'emergency') AND is_acknowledged = 0").get().count;

    // Route statistics
    const totalRoutes = db.prepare('SELECT COUNT(*) as count FROM route_segments').get().count;
    const blockedRoutes = db.prepare("SELECT COUNT(*) as count FROM route_segments WHERE road_condition = 'blocked'").get().count;
    const poorRoutes = db.prepare("SELECT COUNT(*) as count FROM route_segments WHERE road_condition = 'poor'").get().count;

    // District statistics
    const totalDistricts = db.prepare('SELECT COUNT(*) as count FROM districts').get().count;
    const accessibleDistricts = db.prepare("SELECT COUNT(*) as count FROM districts WHERE connectivity_status = 'accessible'").get().count;
    const partialDistricts = db.prepare("SELECT COUNT(*) as count FROM districts WHERE connectivity_status = 'partial'").get().count;
    const blockedDistricts = db.prepare("SELECT COUNT(*) as count FROM districts WHERE connectivity_status = 'blocked'").get().count;

    // Field reports
    const totalReports = db.prepare('SELECT COUNT(*) as count FROM field_reports').get().count;
    const pendingReports = db.prepare("SELECT COUNT(*) as count FROM field_reports WHERE status = 'submitted'").get().count;

    // Delivery success rate
    const deliveryRate = totalVehicles > 0 ? Math.round((deliveredVehicles / totalVehicles) * 100) : 0;

    // Network health score
    const networkHealth = totalRoutes > 0 ? Math.round(((totalRoutes - blockedRoutes * 2 - poorRoutes) / totalRoutes) * 100) : 100;

    res.json({
      success: true,
      data: {
        vehicles: { total: totalVehicles, active: activeVehicles, delayed: delayedVehicles, delivered: deliveredVehicles },
        alerts: { total: totalAlerts, active: activeAlerts, critical: criticalAlerts },
        routes: { total: totalRoutes, blocked: blockedRoutes, poor: poorRoutes, network_health: networkHealth },
        districts: { total: totalDistricts, accessible: accessibleDistricts, partial: partialDistricts, blocked: blockedDistricts },
        reports: { total: totalReports, pending: pendingReports },
        delivery_rate: deliveryRate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get AI-powered predictions
router.get('/predictions', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const districts = db.prepare('SELECT * FROM districts').all();

    // Get current weather for all districts
    const weatherMap = await getRegionWeather();

    // Generate predictions using the AI engine
    const predictions = predictDisruptions(districts, weatherMap);

    // Calculate risk scores for all districts
    const districtRisks = districts.map(d => {
      const weather = weatherMap[d.id] || { rainfall: 0, wind_speed: 0 };
      const currentMonth = new Date().getMonth();
      const season = (currentMonth >= 5 && currentMonth <= 9) ? 'monsoon' : (currentMonth >= 11 || currentMonth <= 1) ? 'winter' : 'dry';

      return {
        district_id: d.id,
        name: d.name,
        state: d.state,
        risk_score: calculateRiskScore(d, weather, season),
        weather: weather
      };
    });

    // Generate overall insights
    const analyticsData = {
      delayed_vehicles: db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'delayed'").get().count,
      avg_risk_score: Math.round(districtRisks.reduce((sum, d) => sum + d.risk_score, 0) / districtRisks.length),
      critical_alerts: db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'critical' AND is_acknowledged = 0").get().count
    };

    const insights = generateInsights(analyticsData);

    // Generate 72-hour risk timeline (every 6 hours)
    const timeline = [];
    const now = Date.now();
    for (let i = 0; i < 12; i++) {
      const time = new Date(now + i * 6 * 60 * 60 * 1000);
      const degradation = 1 + (i * 0.05); // Risk increases with time due to uncertainty
      timeline.push({
        time: time.toISOString(),
        avg_risk: Math.min(Math.round(analyticsData.avg_risk_score * degradation), 100),
        high_risk_districts: districtRisks.filter(d => d.risk_score * degradation > 70).length
      });
    }

    res.json({
      success: true,
      data: {
        predictions,
        district_risks: districtRisks.sort((a, b) => b.risk_score - a.risk_score),
        insights,
        timeline
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get supply chain analytics
router.get('/supply-chain', optionalAuth, (req, res) => {
  try {
    const db = getDb();

    // Vehicles by cargo type
    const byCargoType = db.prepare(`
      SELECT type, COUNT(*) as count,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN status = 'delayed' THEN 1 ELSE 0 END) as delayed
      FROM vehicles GROUP BY type
    `).all();

    // Get the most affected routes (blocked or poor condition)
    const bottleneckRoutes = db.prepare(`
      SELECT rs.*, 
        d1.name as from_name, d1.state as from_state,
        d2.name as to_name, d2.state as to_state
      FROM route_segments rs
      LEFT JOIN districts d1 ON rs.from_district = d1.id
      LEFT JOIN districts d2 ON rs.to_district = d2.id
      WHERE rs.road_condition IN ('poor', 'blocked')
      ORDER BY rs.risk_score DESC
      LIMIT 10
    `).all();

    // Supply gap analysis: districts with blocked access and pending deliveries
    const supplyGaps = db.prepare(`
      SELECT d.name, d.state, d.connectivity_status, d.risk_score,
        (SELECT COUNT(*) FROM vehicles v WHERE v.destination = d.name AND v.status IN ('in_transit', 'delayed')) as pending_deliveries
      FROM districts d
      WHERE d.connectivity_status != 'accessible'
      ORDER BY d.risk_score DESC
    `).all();

    // Simulated daily delivery metrics (last 7 days)
    const dailyMetrics = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dailyMetrics.push({
        date: date.toISOString().split('T')[0],
        deliveries: Math.floor(Math.random() * 15) + 5,
        delays: Math.floor(Math.random() * 5),
        avg_delivery_time_hrs: parseFloat((Math.random() * 12 + 4).toFixed(1))
      });
    }

    res.json({
      success: true,
      data: {
        by_cargo_type: byCargoType,
        bottleneck_routes: bottleneckRoutes,
        supply_gaps: supplyGaps,
        daily_metrics: dailyMetrics
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get district connectivity matrix
router.get('/district-connectivity', optionalAuth, (req, res) => {
  try {
    const db = getDb();

    // Get all districts with their status grouped by state
    const districts = db.prepare(`
      SELECT state, 
        COUNT(*) as total,
        SUM(CASE WHEN connectivity_status = 'accessible' THEN 1 ELSE 0 END) as accessible,
        SUM(CASE WHEN connectivity_status = 'partial' THEN 1 ELSE 0 END) as partial,
        SUM(CASE WHEN connectivity_status = 'blocked' THEN 1 ELSE 0 END) as blocked,
        ROUND(AVG(connectivity_index), 1) as avg_connectivity,
        ROUND(AVG(risk_score), 1) as avg_risk
      FROM districts 
      GROUP BY state
    `).all();

    res.json({ success: true, data: districts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
