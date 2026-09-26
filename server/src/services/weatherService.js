const districtsData = require('../data/districts');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Simulate weather if API key is absent
function simulateWeather(lat, lng) {
  // Add some randomness based on lat/lng to make it feel somewhat geographic
  const baseRain = (lat > 26 ? 20 : 0) + (Math.random() * 40); // Higher rainfall in upper Assam/Arunachal
  const temp = 25 - (lat - 24) * 2 + (Math.random() * 5);
  
  return {
    temperature: temp.toFixed(1),
    rainfall: baseRain.toFixed(1), // mm/hr
    wind_speed: (Math.random() * 30).toFixed(1), // km/h
    condition: baseRain > 40 ? 'Heavy Rain' : (baseRain > 10 ? 'Rain' : 'Cloudy')
  };
}

async function fetchWeather(lat, lng) {
  if (OPENWEATHER_API_KEY) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      const data = await response.json();
      return {
        temperature: data.main.temp,
        rainfall: data.rain ? data.rain['1h'] || 0 : 0,
        wind_speed: data.wind.speed * 3.6, // convert m/s to km/h
        condition: data.weather[0].main
      };
    } catch (err) {
      console.error('Weather API failed, falling back to simulation', err);
      return simulateWeather(lat, lng);
    }
  } else {
    return simulateWeather(lat, lng);
  }
}

async function getRegionWeather() {
  const weatherMap = {};
  for (const d of districtsData) {
    weatherMap[d.id] = await fetchWeather(d.lat, d.lng);
  }
  return weatherMap;
}

function calculateWeatherRisk(weather) {
  let risk = 0;
  if (weather.rainfall > 50) risk += 50;
  else if (weather.rainfall > 20) risk += 20;
  
  if (weather.wind_speed > 40) risk += 30;
  else if (weather.wind_speed > 20) risk += 10;
  
  return risk;
}

module.exports = {
  fetchWeather,
  getRegionWeather,
  calculateWeatherRisk
};
