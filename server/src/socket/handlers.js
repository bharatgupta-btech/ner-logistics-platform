module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Join room for specific vehicle updates
    socket.on('vehicle:subscribe', (vehicleId) => {
      socket.join(`vehicle_${vehicleId}`);
      console.log(`[Socket] ${socket.id} subscribed to vehicle_${vehicleId}`);
    });

    socket.on('vehicle:unsubscribe', (vehicleId) => {
      socket.leave(`vehicle_${vehicleId}`);
    });

    // Field officer submitting a quick report via socket
    socket.on('report:submit', (data) => {
      console.log(`[Socket] Report received from ${socket.id}`, data);
      io.emit('alert:new', {
        id: `rep_${Date.now()}`,
        type: data.incident_type || 'info',
        severity: data.severity || 'warning',
        title: 'Field Report',
        message: data.description,
        lat: data.lat,
        lng: data.lng,
        created_at: new Date().toISOString()
      });
    });

    socket.on('alert:acknowledge', (alertId) => {
      console.log(`[Socket] Alert ${alertId} acknowledged by ${socket.id}`);
      io.emit('alert:updated', { id: alertId, is_acknowledged: 1 });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
};
