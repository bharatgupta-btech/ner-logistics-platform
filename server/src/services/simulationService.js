const { getDb } = require('../models/database');
const { getRegionWeather } = require('./weatherService');
const { generateAlerts } = require('./alertService');

let simulationInterval;

function startSimulation(io) {
  if (simulationInterval) clearInterval(simulationInterval);
  
  console.log('Starting NER Logistics Simulation...');
  
  simulationInterval = setInterval(async () => {
    const db = getDb();
    
    // 1. Update weather
    const weatherMap = await getRegionWeather();
    
    // 2. Move vehicles
    const vehicles = db.prepare("SELECT * FROM vehicles WHERE status IN ('in_transit', 'delayed')").all();
    const updateVehicle = db.prepare("UPDATE vehicles SET current_lat = ?, current_lng = ?, status = ? WHERE id = ?");
    
    vehicles.forEach(v => {
      // Very simplified movement (just random jitter for simulation)
      // In a real scenario, this would trace the route path
      const latMove = (Math.random() - 0.5) * 0.05;
      const lngMove = (Math.random() - 0.5) * 0.05;
      
      let newLat = v.current_lat + latMove;
      let newLng = v.current_lng + lngMove;
      
      // Randomly delay some vehicles
      let status = v.status;
      if (Math.random() > 0.95) status = 'delayed';
      if (status === 'delayed' && Math.random() > 0.8) status = 'in_transit';

      updateVehicle.run(newLat, newLng, status, v.id);
      
      io.emit('vehicle:update', {
        id: v.id,
        current_lat: newLat,
        current_lng: newLng,
        status: status
      });
    });
    
    // 3. Generate random alerts based on conditions
    const districts = db.prepare("SELECT * FROM districts").all();
    const newAlerts = generateAlerts(districts, vehicles, weatherMap);
    
    if (newAlerts.length > 0) {
      newAlerts.forEach(alert => {
        io.emit('alert:new', alert);
      });
    }
    
    // Emit global network status update occasionally
    if (Math.random() > 0.8) {
      io.emit('status:change', { timestamp: new Date(), message: 'Network status updated' });
    }
    
  }, 3000); // Run every 3 seconds
}

module.exports = {
  startSimulation
};
