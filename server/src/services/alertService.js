const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/database');

function generateAlerts(districts, vehicles, weatherMap) {
  const db = getDb();
  const alerts = [];
  const stmt = db.prepare(`
    INSERT INTO alerts (id, type, severity, title, message, district_id, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Check weather for districts
  for (const district of districts) {
    const weather = weatherMap[district.id];
    if (weather && weather.rainfall > 50) {
      const alert = {
        id: uuidv4(),
        type: 'weather',
        severity: 'critical',
        title: 'Heavy Rainfall Warning',
        message: `Extremely heavy rainfall (${weather.rainfall}mm/hr) detected in ${district.name}. High risk of landslides.`,
        district_id: district.id,
        lat: district.lat,
        lng: district.lng
      };
      stmt.run(alert.id, alert.type, alert.severity, alert.title, alert.message, alert.district_id, alert.lat, alert.lng);
      alerts.push(alert);
    }
  }

  // Check vehicles
  for (const vehicle of vehicles) {
    if (vehicle.status === 'delayed') {
      const alert = {
        id: uuidv4(),
        type: 'delay',
        severity: 'warning',
        title: 'Vehicle Delayed',
        message: `Vehicle ${vehicle.vehicle_number} (${vehicle.type}) is severely delayed.`,
        district_id: null,
        lat: vehicle.current_lat,
        lng: vehicle.current_lng
      };
      stmt.run(alert.id, alert.type, alert.severity, alert.title, alert.message, alert.district_id, alert.lat, alert.lng);
      alerts.push(alert);
    }
  }
  
  return alerts;
}

function prioritizeAlerts(alerts) {
  const severityScore = { 'emergency': 4, 'critical': 3, 'warning': 2, 'info': 1 };
  
  return alerts.sort((a, b) => {
    // Primary sort: severity
    if (severityScore[a.severity] !== severityScore[b.severity]) {
      return severityScore[b.severity] - severityScore[a.severity];
    }
    // Secondary sort: freshness (newest first)
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

module.exports = {
  generateAlerts,
  prioritizeAlerts
};
