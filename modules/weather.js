import { showLoading, showError, hideError } from './ui.js';
import { saveToLocalStorage } from './storage.js';   // ✅ import for localStorage

export async function loadWeather() {
  showLoading('weatherSpinner', true);
  hideError('weatherError');

  try {
    // Step 1: Get user's location (latitude & longitude)
    let lat, lon, locationName = "your area";
    
    if ("geolocation" in navigator) {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      
      // Reverse geocode to get a human‑readable city name
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results[0]) {
            locationName = geoData.results[0].name;
          } else {
            locationName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
          }
        } else {
          locationName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        }
      } catch (e) {
        locationName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
      }
    } else {
      // Fallback to a default city if geolocation not supported
      lat = 51.5074;
      lon = -0.1278;
      locationName = "London (fallback)";
    }

    // ✅ Save location to localStorage (second/third property)
    saveToLocalStorage('weatherLocation', {
      lat: lat,
      lon: lon,
      name: locationName,
      timestamp: Date.now()
    });

    // Step 2: Fetch weather data for these coordinates
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const current = data.current_weather;
    const temp = current.temperature;
    const weatherCode = current.weathercode;
    let humidity = 'N/A';
    if (data.hourly?.relative_humidity_2m?.[0]) {
      humidity = data.hourly.relative_humidity_2m[0] + '%';
    }

    const weatherDesc = getWeatherDescription(weatherCode);
    const animationHTML = getWeatherAnimation(weatherCode);
    
    // Build a friendly surprise message
    const surpriseMsg = `✨ Surprise! Right now in ${locationName}, it's ${temp}°C with ${weatherDesc}. Humidity is ${humidity}. ✨`;
    
    document.getElementById('weatherMessage').innerHTML = surpriseMsg;
    document.getElementById('weatherAnimation').innerHTML = animationHTML;
    document.getElementById('weatherContent').style.display = 'block';
  } catch (error) {
    console.error('Weather error:', error);
    let errorMsg = 'Weather surprise unavailable. ';
    if (error.code === 1) errorMsg += 'Please allow location access.';
    else if (error.code === 2) errorMsg += 'Location detection failed.';
    else errorMsg += error.message;
    showError('weatherError', errorMsg);
  } finally {
    showLoading('weatherSpinner', false);
  }
}

function getWeatherDescription(code) {
  const codes = {
    0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
    45: "foggy", 51: "light drizzle", 61: "rain", 71: "snow", 80: "rain showers"
  };
  return codes[code] || "interesting weather";
}

function getWeatherAnimation(code) {
  if (code === 0 || code === 1) return `<div class="weather-sunny">☀️</div>`;
  if (code === 2 || code === 3 || code === 45) return `<div class="weather-cloudy">☁️☁️</div>`;
  if (code === 51 || code === 61 || code === 80) return `<div class="weather-rainy"><div class="cloud">☁️</div><div class="rain-drops"><span>💧</span><span>💧</span><span>💧</span></div></div>`;
  if (code === 71) return `<div class="weather-snowy"><div class="cloud">☁️</div><div class="snowflakes"><span>❄️</span><span>❄️</span><span>❄️</span></div></div>`;
  return `<div class="weather-default">🌤️</div>`;
}