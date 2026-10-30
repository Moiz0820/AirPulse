import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CitySelector from './components/CitySelector';
import TelemetryGauges from './components/TelemetryGauges';
import DiurnalChart from './components/DiurnalChart';
import MegacityMatrix from './components/MegacityMatrix';
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* City Switcher Telemetry Ribbon */}
        <CitySelector
          cities={MEGACITIES}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />

        {/* Primary Multi-Pollutant Telemetry Gauges */}
        <TelemetryGauges
          city={selectedCity}
          liveData={liveData}
          baseline={baseline}
          isLoading={isLoading}
        />

        {/* 24-Hour Diurnal Dispersion Chart */}
        <DiurnalChart
          city={selectedCity}
          liveData={liveData}
          baseline={baseline}
        />

        {/* Megacity Benchmark Matrix Table */}
        <MegacityMatrix
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />
      </main>

      {/* Industrial Footer */}
      <Footer />
    </div>
  );
}
