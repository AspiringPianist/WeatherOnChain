import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCoordinates = async (cityName) => {
    const apiKey = '75a792e6fd184893860d0feb41cfd741'; // Replace with your OpenCage API key
    const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityName)}&key=${apiKey}`;

    try {
      const response = await fetch(geocodingUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates.');
      }
      const data = await response.json();
      
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error('Location not found.');
      }
    } catch (error) {
      throw new Error('Error in fetching coordinates.');
    }
  };

  const fetchWeather = async (latitude, longitude) => {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data.');
      }
      const data = await response.json();
      return data.current_weather;
    } catch (error) {
      throw new Error('Error in fetching weather data.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (city.trim() !== '') {
      setLoading(true);
      setError('');
      try {
        // Fetch coordinates based on city name
        const { latitude, longitude } = await fetchCoordinates(city);
        // Fetch weather data based on coordinates
        const weather = await fetchWeather(latitude, longitude);
        setWeatherData(weather);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>Current Weather in {city}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Windspeed: {weatherData.windspeed} km/h</p>
        </div>
      )}
    </div>
  );
};

export default App;
