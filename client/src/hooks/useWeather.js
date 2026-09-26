import { useState, useEffect } from 'react';
import * as api from '../utils/api';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherData([
          { state: 'Assam', condition: 'Rain', temp: 24, risk: 40 },
          { state: 'Meghalaya', condition: 'Heavy Rain', temp: 18, risk: 75 }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch weather', error);
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  return { weatherData, loading };
};
