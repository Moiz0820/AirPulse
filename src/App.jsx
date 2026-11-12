import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StationRoster from './components/StationRoster';
import TelemetryGauges from './components/TelemetryGauges';
import DiurnalChart from './components/DiurnalChart';
import BenchmarkColumn from './components/BenchmarkColumn';
import Footer from './components/Footer';
import { MEGACITIES, BASELINE_READINGS, fetchLiveAirQuality } from './data/airData';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(MEGACITIES[0]); // Dubai default
  const [liveData, setLiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const loadCityData = useCallback(async (city) => {
    setIsLoading(true);
    const data = await fetchLiveAirQuality(city.lat, city.lng);
    setLiveData(data);
    setLastSync(new Date().toLocaleTimeString('en-US', { hour12: false }));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCityData(selectedCity);
  }, [selectedCity, loadCityData]);

  const baseline = BASELINE_READINGS[selectedCity.id] || BASELINE_READINGS.dubai;

  return (
    <div className="min-h-screen bg-[#121316] text-[#e4e4e7] flex flex-col font-sans selection:bg-[#f97316] selection:text-black">
      {/* Top Telemetry Header */}
      <Header
        lastSync={lastSync}
        isLoading={isLoading}
        onRefresh={() => loadCityData(selectedCity)}
      />

      {/* Industrial Mission Control Wall: 3-Column Flight Deck */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 py-5 font-mono">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Column 1: Station Roster & Feed (25% width / 3 cols) */}
          <div className="lg:col-span-3">
            <StationRoster
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              liveData={liveData}
            />
          </div>

          {/* Column 2: Center Telemetry Stage (50% width / 6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <TelemetryGauges
              city={selectedCity}
              liveData={liveData}
              baseline={baseline}
              isLoading={isLoading}
            />

            <DiurnalChart
              city={selectedCity}
              liveData={liveData}
              baseline={baseline}
            />
          </div>

          {/* Column 3: Differential Matrix & Telemetry Log (25% width / 3 cols) */}
          <div className="lg:col-span-3">
            <BenchmarkColumn
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
            />
          </div>
        </div>
      </main>

      {/* Industrial Footer */}
      <Footer />
    </div>
  );
}
