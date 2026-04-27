// ── Open-Meteo Weather Service ──────────────────────────────────────────────
// Free, no API key required. Docs: https://open-meteo.com/
// Coordinates are supplied at runtime from the browser Geolocation API.
// Fallback: Balagtas, Bulacan (14.8167° N, 120.9000° E)

export const FALLBACK_COORDS = { lat: 14.8167, lon: 120.9000, label: 'Balagtas, Bulacan' };

const TIMEZONE = 'Asia/Manila';
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL  = 'https://nominatim.openstreetmap.org/reverse';

// ── WMO Weather Code → description + icon ──────────────────────────────────
export const WMO_CODES = {
  0:  { label: 'Clear Sky',            icon: '☀️',  risk: 'none'   },
  1:  { label: 'Mainly Clear',         icon: '🌤️', risk: 'none'   },
  2:  { label: 'Partly Cloudy',        icon: '⛅',  risk: 'none'   },
  3:  { label: 'Overcast',             icon: '☁️',  risk: 'low'    },
  45: { label: 'Fog',                  icon: '🌫️', risk: 'low'    },
  48: { label: 'Icy Fog',              icon: '🌫️', risk: 'low'    },
  51: { label: 'Light Drizzle',        icon: '🌦️', risk: 'low'    },
  53: { label: 'Moderate Drizzle',     icon: '🌧️', risk: 'medium' },
  55: { label: 'Heavy Drizzle',        icon: '🌧️', risk: 'medium' },
  61: { label: 'Light Rain',           icon: '🌧️', risk: 'medium' },
  63: { label: 'Moderate Rain',        icon: '🌧️', risk: 'high'   },
  65: { label: 'Heavy Rain',           icon: '🌧️', risk: 'high'   },
  80: { label: 'Light Showers',        icon: '🌦️', risk: 'medium' },
  81: { label: 'Moderate Showers',     icon: '🌧️', risk: 'high'   },
  82: { label: 'Violent Showers',      icon: '⛈️',  risk: 'critical'},
  95: { label: 'Thunderstorm',         icon: '⛈️',  risk: 'critical'},
  96: { label: 'Thunderstorm + Hail',  icon: '⛈️',  risk: 'critical'},
  99: { label: 'Severe Thunderstorm',  icon: '⛈️',  risk: 'critical'},
};

export function decodeWMO(code) {
  return WMO_CODES[code] || { label: 'Unknown', icon: '🌡️', risk: 'none' };
}

// ── Risk level from combined weather data ───────────────────────────────────
export function assessRisk({ weathercode, rain = 0, windspeed = 0, precipitation = 0 }) {
  const codeRisk = (decodeWMO(weathercode)).risk;
  if (codeRisk === 'critical') return 'critical';
  if (rain > 20 || precipitation > 25 || windspeed > 60) return 'critical';
  if (codeRisk === 'high' || rain > 10 || precipitation > 15 || windspeed > 40) return 'high';
  if (codeRisk === 'medium' || rain > 3 || precipitation > 5 || windspeed > 25) return 'medium';
  if (codeRisk === 'low' || windspeed > 15) return 'low';
  return 'none';
}

export function riskMeta(level) {
  const map = {
    none:     { label: 'Normal',   color: 'green',  advice: 'No immediate weather threats. Stay informed through official channels.' },
    low:      { label: 'Low',      color: 'blue',   advice: 'Minor weather activity expected. Check advisories before outdoor activities.' },
    medium:   { label: 'Moderate', color: 'orange', advice: 'Significant rainfall or wind expected. Secure loose items and limit travel.' },
    high:     { label: 'High',     color: 'red',    advice: 'Heavy rain or strong winds. Prepare go-bags. Monitor PAGASA advisories closely.' },
    critical: { label: 'Critical', color: 'purple', advice: 'Extreme conditions. Consider pre-emptive evacuation in flood-prone barangays.' },
  };
  return map[level] || map.none;
}

// ── Reverse-geocode lat/lon to a human place name ─────────────────────────
export async function reverseGeocode(lat, lon) {
  try {
    const url = `${GEO_URL}?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};
    // Build a short label: barangay/suburb + city/municipality
    const parts = [
      addr.village || addr.suburb || addr.neighbourhood || addr.hamlet,
      addr.city || addr.town || addr.municipality || addr.county
    ].filter(Boolean);
    return parts.length ? parts.join(', ') : data.display_name?.split(',').slice(0, 2).join(',').trim() || null;
  } catch {
    return null;
  }
}

// ── Fetch current + 7-day forecast ─────────────────────────────────────────
export async function fetchWeather({ lat, lon } = {}) {
  const latitude  = lat ?? FALLBACK_COORDS.lat;
  const longitude = lon ?? FALLBACK_COORDS.lon;
  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone:   TIMEZONE,
    forecast_days: 7,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'rain',
      'weathercode',
      'windspeed_10m',
      'winddirection_10m',
    ].join(','),
    daily: [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'windspeed_10m_max',
    ].join(','),
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
  return response.json();
}

// ── Wind direction label ────────────────────────────────────────────────────
export function windDirectionLabel(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16] || '—';
}
