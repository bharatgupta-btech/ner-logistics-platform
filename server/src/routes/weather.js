const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { fetchWeather, getRegionWeather, calculateWeatherRisk } = require('../services/weatherService');
const districtsData = require('../data/districts');

// Get weather for a specific district
router.get('/current/:districtId', verifyToken, async (req, res) => {
  try {
    const district = districtsData.find(d => d.id === req.params.districtId);
    if (!district) {
      return res.status(404).json({ success: false, error: 'District not found' });
    }

    const weather = await fetchWeather(district.lat, district.lng);
    const risk = calculateWeatherRisk(weather);

    res.json({
      success: true,
      data: {
        district: district.name,
        state: district.state,
        ...weather,
        weather_risk: risk
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get weather for all NER states (aggregated by state)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const weatherMap = await getRegionWeather();

    // Aggregate by state
    const stateWeather = {};
    districtsData.forEach(d => {
      if (!stateWeather[d.state]) {
        stateWeather[d.state] = {
          state: d.state,
          districts: [],
          avg_temperature: 0,
          avg_rainfall: 0,
          max_rainfall: 0,
          avg_wind_speed: 0,
          overall_risk: 0
        };
      }

      const w = weatherMap[d.id];
      if (w) {
        stateWeather[d.state].districts.push({
          name: d.name,
          id: d.id,
          ...w,
          risk: calculateWeatherRisk(w)
        });
      }
    });

    // Calculate averages per state
    Object.values(stateWeather).forEach(state => {
      const count = state.districts.length || 1;
      state.avg_temperature = (state.districts.reduce((sum, d) => sum + parseFloat(d.temperature || 0), 0) / count).toFixed(1);
      state.avg_rainfall = (state.districts.reduce((sum, d) => sum + parseFloat(d.rainfall || 0), 0) / count).toFixed(1);
      state.max_rainfall = Math.max(...state.districts.map(d => parseFloat(d.rainfall || 0))).toFixed(1);
      state.avg_wind_speed = (state.districts.reduce((sum, d) => sum + parseFloat(d.wind_speed || 0), 0) / count).toFixed(1);
      state.overall_risk = Math.round(state.districts.reduce((sum, d) => sum + (d.risk || 0), 0) / count);
    });

    res.json({ success: true, data: stateWeather });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get weather forecast for a district (simulated 72-hour forecast)
router.get('/forecast/:districtId', verifyToken, async (req, res) => {
  try {
    const district = districtsData.find(d => d.id === req.params.districtId);
    if (!district) {
      return res.status(404).json({ success: false, error: 'District not found' });
    }

    // Generate simulated 72-hour forecast in 6-hour intervals
    const forecast = [];
    const now = Date.now();
    for (let i = 0; i < 12; i++) {
      const time = new Date(now + i * 6 * 60 * 60 * 1000);
      const hour = time.getHours();
      
      // Simulate diurnal variation: more rain in afternoon/evening
      const diurnalFactor = hour >= 12 && hour <= 20 ? 1.5 : 0.7;
      // Increasing uncertainty with time
      const uncertaintyFactor = 1 + (i * 0.1);

      const baseRain = (district.lat > 26 ? 15 : 5) + (Math.random() * 30 * diurnalFactor * uncertaintyFactor);
      const temp = 22 - (district.elevation / 500) + (Math.random() * 8) - (hour < 6 || hour > 20 ? 3 : 0);

      const weather = {
        time: time.toISOString(),
        temperature: parseFloat(temp.toFixed(1)),
        rainfall: parseFloat(Math.max(0, baseRain).toFixed(1)),
        wind_speed: parseFloat((Math.random() * 25 * uncertaintyFactor).toFixed(1)),
        condition: baseRain > 40 ? 'Heavy Rain' : baseRain > 15 ? 'Rain' : baseRain > 5 ? 'Light Rain' : 'Cloudy',
        risk: calculateWeatherRisk({ rainfall: baseRain, wind_speed: Math.random() * 25 })
      };

      forecast.push(weather);
    }

    res.json({
      success: true,
      data: {
        district: district.name,
        state: district.state,
        forecast
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
