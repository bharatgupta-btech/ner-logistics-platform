/**
 * AI Engine for predicting disruptions, calculating risk scores, and generating insights
 * based on geographical data and weather patterns in the North Eastern Region.
 */

// Basic factors for risk
const WEIGHTS = {
  rainfall: 0.3,
  elevation: 0.2,
  history: 0.2,
  road_condition: 0.3
};

function calculateRiskScore(district, weather, season = 'monsoon') {
  let score = 0;

  // Rainfall factor (0-100)
  const rainfallRisk = Math.min((weather.rainfall || 0) * 2, 100);
  score += rainfallRisk * WEIGHTS.rainfall;

  // Elevation & Terrain factor
  let terrainRisk = 20;
  if (district.terrain_type === 'Hilly') terrainRisk = 60;
  if (district.terrain_type === 'Mountainous') terrainRisk = 90;
  if (district.landslide_prone) terrainRisk += 10;
  if (district.flood_prone) terrainRisk += 10;
  
  score += Math.min(terrainRisk, 100) * WEIGHTS.elevation;

  // Season multiplier
  let seasonMultiplier = 1.0;
  if (season === 'monsoon') seasonMultiplier = 1.5;
  if (season === 'winter') seasonMultiplier = 1.2; // fog, snow in high alt

  // Road condition factor
  let roadRisk = 0;
  if (district.road_condition === 'fair') roadRisk = 40;
  if (district.road_condition === 'poor') roadRisk = 80;
  if (district.road_condition === 'blocked') roadRisk = 100;

  score += roadRisk * WEIGHTS.road_condition;

  // Add baseline historical risk
  score += 50 * WEIGHTS.history; // Simplified historical baseline

  score = score * seasonMultiplier;
  
  return Math.min(Math.round(score), 100);
}

function predictDisruptions(districts, weather) {
  const predictions = [];
  
  districts.forEach(d => {
    const w = weather[d.id] || { rainfall: 0 };
    const risk = calculateRiskScore(d, w);
    if (risk > 70) {
      predictions.push({
        district_id: d.id,
        probability: Math.min((risk / 100) + 0.1, 0.99),
        type: d.landslide_prone ? 'landslide' : (d.flood_prone ? 'flood' : 'severe_weather'),
        affected_area: d.name,
        predicted_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
      });
    }
  });

  return predictions;
}

function classifyUrgency(cargo_type, delay_hours) {
  if (cargo_type === 'medical') {
    return delay_hours > 1 ? 'CRITICAL' : 'HIGH';
  } else if (cargo_type === 'food') {
    return delay_hours > 12 ? 'HIGH' : 'MEDIUM';
  } else {
    return delay_hours > 24 ? 'MEDIUM' : 'LOW';
  }
}

function generateInsights(analytics_data) {
  const insights = [];
  
  if (analytics_data.delayed_vehicles > 5) {
    insights.push("High number of delayed vehicles. Immediate rerouting recommended for critical medical supplies.");
  }
  
  if (analytics_data.avg_risk_score > 60) {
    insights.push("Overall regional risk is high due to weather conditions. Expect widespread delays in mountainous districts.");
  }

  if (analytics_data.critical_alerts > 0) {
    insights.push(`There are ${analytics_data.critical_alerts} critical alerts requiring immediate dispatch of field officers.`);
  }

  if (insights.length === 0) {
    insights.push("Network operations are relatively stable with no major widespread disruptions predicted.");
  }

  return insights;
}

module.exports = {
  calculateRiskScore,
  predictDisruptions,
  classifyUrgency,
  generateInsights
};
