export const MEGACITIES = [
  { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { id: 'london', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { id: 'new-york', name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore' },
  { id: 'delhi', name: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata' },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney' },
];

export const WHO_GUIDELINES = {
  pm2_5: { limit: 15, unit: 'μg/m³', label: 'PM2.5 (Fine Particulates)' },
  pm10: { limit: 45, unit: 'μg/m³', label: 'PM10 (Coarse Particulates)' },
  nitrogen_dioxide: { limit: 25, unit: 'μg/m³', label: 'NO2 (Nitrogen Dioxide)' },
  ozone: { limit: 100, unit: 'μg/m³', label: 'O3 (Ground-Level Ozone)' },
  carbon_monoxide: { limit: 4000, unit: 'μg/m³', label: 'CO (Carbon Monoxide)' },
  sulphur_dioxide: { limit: 40, unit: 'μg/m³', label: 'SO2 (Sulfur Dioxide)' },
};

export const BASELINE_READINGS = {
  dubai: { aqi: 58, pm2_5: 38.3, pm10: 73.3, no2: 58.9, o3: 62.0, co: 533, so2: 32.5 },
  london: { aqi: 22, pm2_5: 8.4, pm10: 16.2, no2: 24.1, o3: 45.2, co: 260, so2: 4.1 },
  'new-york': { aqi: 28, pm2_5: 11.2, pm10: 21.0, no2: 31.4, o3: 52.8, co: 310, so2: 5.6 },
  tokyo: { aqi: 19, pm2_5: 6.9, pm10: 14.1, no2: 18.5, o3: 41.0, co: 220, so2: 3.2 },
  singapore: { aqi: 31, pm2_5: 14.5, pm10: 27.8, no2: 22.0, o3: 38.5, co: 340, so2: 8.9 },
  delhi: { aqi: 168, pm2_5: 112.4, pm10: 240.1, no2: 84.2, o3: 78.5, co: 1450, so2: 48.0 },
  paris: { aqi: 25, pm2_5: 9.8, pm10: 18.4, no2: 26.5, o3: 49.0, co: 280, so2: 4.8 },
  sydney: { aqi: 16, pm2_5: 5.2, pm10: 12.3, no2: 14.0, o3: 36.2, co: 190, so2: 2.1 },
};

export async function fetchLiveAirQuality(lat, lng) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm10,pm2_5,ozone,nitrogen_dioxide&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo Air Quality API request failed');
    return await res.json();
  } catch (err) {
    console.warn('Live air quality fetch error, using fallback baseline', err);
    return null;
  }
}
