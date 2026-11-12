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
  dubai: { aqi: 39, pm2_5: 14.5, pm10: 29.6, no2: 10.7, o3: 97.0, co: 144, so2: 5.6 },
  london: { aqi: 46, pm2_5: 12.2, pm10: 13.8, no2: 36.3, o3: 16.0, co: 207, so2: 4.0 },
  'new-york': { aqi: 52, pm2_5: 11.0, pm10: 12.2, no2: 46.7, o3: 24.0, co: 238, so2: 1.6 },
  tokyo: { aqi: 69, pm2_5: 57.2, pm10: 58.7, no2: 78.1, o3: 16.0, co: 1094, so2: 59.1 },
  singapore: { aqi: 48, pm2_5: 12.0, pm10: 12.2, no2: 39.7, o3: 61.0, co: 222, so2: 22.4 },
  delhi: { aqi: 125, pm2_5: 108.5, pm10: 142.0, no2: 9.4, o3: 205.0, co: 659, so2: 35.5 },
  paris: { aqi: 49, pm2_5: 20.8, pm10: 23.3, no2: 40.6, o3: 2.0, co: 365, so2: 4.0 },
  sydney: { aqi: 33, pm2_5: 11.3, pm10: 19.0, no2: 5.8, o3: 58.0, co: 79, so2: 2.6 },
};

/**
 * Fetch live atmospheric telemetry for all 8 megacities simultaneously in a single API call
 */
export async function fetchAllMegacitiesTelemetry() {
  try {
    const lats = MEGACITIES.map((c) => c.lat).join(',');
    const lngs = MEGACITIES.map((c) => c.lng).join(',');
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm10,pm2_5,ozone,nitrogen_dioxide&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo multi-city fetch failed');
    const data = await res.json();

    const cityMap = {};
    if (Array.isArray(data)) {
      MEGACITIES.forEach((c, idx) => {
        cityMap[c.id] = data[idx];
      });
    } else {
      // Single object fallback
      cityMap[MEGACITIES[0].id] = data;
    }
    return cityMap;
  } catch (err) {
    console.warn('Live multi-city air quality fetch error, using harmonized baseline', err);
    return null;
  }
}

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
