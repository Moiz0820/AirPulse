# AirPulse: Global Atmospheric Particulate & Telemetry Engine

High-frequency atmospheric telemetry, multi-pollutant dispersion analytics, and WHO air quality compliance monitoring across global megacities.

Live Application: https://moiz0820.github.io/AirPulse/

---

## Executive Overview

AirPulse is an industrial-grade atmospheric telemetry engine designed to monitor, model, and benchmark urban particulate matter (PM2.5, PM10) and gaseous pollutants (NO2, O3, CO, SO2) across eight primary global metropolitan hubs: Dubai, London, New York, Tokyo, Singapore, New Delhi, Paris, and Sydney.

The engine integrates satellite assimilation and ground sensor feeds via the Open-Meteo CAMS Atmospheric API, evaluates real-time concentrations against World Health Organization (WHO) 2021 Global Air Quality Guidelines, and generates 24-hour diurnal particulate dispersion trajectories.

---

## Analytical Capabilities

- Multi-Pollutant Telemetry: Simultaneous ingestion and normalization of European AQI, PM2.5 (fine respirable particles), PM10 (coarse inhalable particles), Nitrogen Dioxide (NO2), Ground Ozone (O3), Carbon Monoxide (CO), and Sulfur Dioxide (SO2).
- WHO Guideline Attainment Benchmarking: Real-time calculation of exposure multiples relative to WHO 24-hour mean guideline thresholds (15 ug/m3 for PM2.5, 45 ug/m3 for PM10, 25 ug/m3 for NO2).
- 24-Hour Diurnal Dispersion Curve: Dynamic temporal trajectory modeling particulate concentration fluctuations driven by rush-hour thermal inversions and vehicular emission spikes.
- Cross-Metropolitan Comparative Matrix: Multi-city density ranking with real-time sorting by index, particulate concentration, and attainment status.
- 1-Click Telemetry Export: Direct client-side generation and download of formatted tabular CSV datasets (`airpulse_megacity_telemetry.csv`) for offline econometric and statistical modeling.

---

## System Architecture

- Framework: React 19.x with functional hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- Styling: Tailwind CSS v4.x (Industrial Gunmetal & High-Vis Safety Orange telemetry aesthetic, zero glassmorphism)
- Data Visualization: Chart.js 4.x with React-ChartJS-2 (custom dark gridlines, smoothed Bezier trajectories, WHO threshold limits)
- Data Source: Open-Meteo Air Quality API (Copernicus CAMS & ECMWF atmospheric model assimilation)
- Deployment: Automated continuous integration pipeline via GitHub Actions and GitHub Pages

---

## Local Development

```bash
git clone https://github.com/Moiz0820/AirPulse.git
cd AirPulse
npm install
npm run dev
```

---

## Author

Moiz Anwar
AI-Focused Data Analyst & Engineer | Business Data & Analytics Specialist
GitHub: https://github.com/Moiz0820
