import React, { useState } from 'react';
import './App.css';
import './weathernow-theme.css';

// PUBLIC_INTERFACE
function WeatherDisplay({ weather, loading, error }) {
  /** Displays current weather information, loading state, or error. */
  if (loading) {
    return (
      <div className="weather-info" style={{ marginTop: 24 }}>
        <span>Loading weather...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="weather-info" style={{ marginTop: 24, color: '#F5A623' }}>
        <span>{error}</span>
      </div>
    );
  }
  if (!weather) {
    return (
      <div className="weather-info" style={{ marginTop: 24, color: '#777' }}>
        <span>Weather info will appear here.</span>
      </div>
    );
  }
  return (
    <div className="weather-info" style={{
      marginTop: 24,
      padding: 24,
      background: 'rgba(74,144,226,0.08)',
      borderRadius: 16,
      border: '1px solid #E3E8F0',
      textAlign: 'left',
      width: 'min(320px, 90%)',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <div style={{ fontSize: 26, fontWeight: 600 }}>
        {weather.name}
      </div>
      <div style={{ fontSize: 52, color: '#4A90E2', fontWeight: 700 }}>
        {Math.round(weather.temp)}°C
      </div>
      <div style={{ color: '#50E3C2', fontWeight: 500, fontSize: 18 }}>
        {weather.description}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function SearchBar({ onSearch, loading }) {
  /** Minimal search bar to search weather by city name. */
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };
  return (
    <form onSubmit={handleSubmit} className="search-bar" style={{
      margin: '32px auto 0 auto',
      maxWidth: 360,
      display: 'flex',
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 1px 8px 0 rgba(80,227,194,0.10)',
      border: '1px solid #E3E8F0'
    }}>
      <input
        type="text"
        placeholder="Search city..."
        aria-label="City name"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'none',
          padding: '14px 16px',
          fontSize: 18,
          borderRadius: 20,
          color: '#333'
        }}
        disabled={loading}
      />
      <button
        type="submit"
        aria-label="Search"
        style={{
          background: '#4A90E2',
          color: '#fff',
          border: 'none',
          borderRadius: '0 20px 20px 0',
          padding: '0 22px',
          fontSize: 16,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
        disabled={loading}
      >
        🔎
      </button>
    </form>
  );
}

// PUBLIC_INTERFACE
function LocationAccess({ onUseLocation, loading }) {
  /** Button to get weather by user's current location. */
  return (
    <div style={{ margin: '18px auto 0 auto', display: 'flex', justifyContent: 'center' }}>
      <button
        onClick={onUseLocation}
        className="btn btn-large"
        style={{
          background: '#50E3C2',
          color: '#fff',
          border: 'none',
          padding: '11px 22px',
          fontSize: 16,
          borderRadius: 8,
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background .2s'
        }}
        disabled={loading}
      >
        Use My Location
      </button>
    </div>
  );
}

// Mock weather API - simulate with timeout
async function getWeatherByCity(city) {
  // PUBLIC_INTERFACE
  /** Mock placeholder: Fetch weather for city name */
  await new Promise(res => setTimeout(res, 700));
  // Dummy weather info
  return {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    temp: 22 + Math.random() * 10,
    description: "Clear sky"
  };
}

async function getWeatherByCoords(lat, lon) {
  // PUBLIC_INTERFACE
  /** Mock placeholder: Fetch weather by coordinates */
  await new Promise(res => setTimeout(res, 700));
  // Dummy data - In a real implementation call backend API with lat/lon
  return {
    name: `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`,
    temp: 24 + Math.random() * 8,
    description: "Partly cloudy"
  };
}

function App() {
  // weather, loading, error state
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // PUBLIC_INTERFACE
  async function handleSearch(city) {
    setLoading(true);
    setError('');
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
    } catch {
      setError("Could not fetch weather data.");
      setWeather(null);
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  function handleUseLocation() {
    setLoading(true);
    setError('');
    setWeather(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude, longitude } = pos.coords;
        const data = await getWeatherByCoords(latitude, longitude);
        setWeather(data);
      } catch {
        setError("Could not fetch weather for your location.");
        setWeather(null);
      }
      setLoading(false);
    }, (err) => {
      setError("Could not get your location.");
      setWeather(null);
      setLoading(false);
    });
  }

  return (
    <div className="app" style={{ background: "#f7fbfc", minHeight: "100vh" }}>
      <nav className="navbar" style={{ background: "#4A90E2" }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo" style={{ color: '#fff' }}>
              <span className="logo-symbol" style={{ color: '#F5A623', marginRight: 8 }}>⛅</span>
              WeatherNow
            </div>
            <div>
              <a href="https://kavia.ai" target="_blank" rel="noopener noreferrer"
                style={{
                  color: '#FFF',
                  background: '#F5A623',
                  borderRadius: 6,
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: '7px 12px',
                  fontSize: 15,
                  border: 'none'
                }}>
                Powered by KAVIA AI
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: 88 }}>
        <div className="container">
          <div className="hero" style={{ paddingTop: 40, gap: 8 }}>
            <div className="subtitle" style={{ color: '#4A90E2', fontWeight: 600, fontSize: 18 }}>
              Check the weather instantly
            </div>
            <h1 className="title" style={{
              color: '#092c4c',
              fontWeight: 700,
              fontSize: 38,
              margin: '8px 0 0 0'
            }}>
              WeatherNow
            </h1>
            <div className="description" style={{ color: '#333', fontSize: 17, maxWidth: 460 }}>
              Enter a city or use your location to see the current weather with a clean, minimal design.
            </div>

            <SearchBar onSearch={handleSearch} loading={loading} />
            <LocationAccess onUseLocation={handleUseLocation} loading={loading} />
            <WeatherDisplay weather={weather} loading={loading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
