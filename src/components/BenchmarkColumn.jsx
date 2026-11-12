import React from 'react';
import { MEGACITIES, BASELINE_READINGS, WHO_GUIDELINES } from '../data/airData';

export default function BenchmarkColumn({ selectedCity, onSelectCity }) {
  // Sort cities by PM2.5 descending
  const sortedMegacities = [...MEGACITIES].map((c) => {
    const base = BASELINE_READINGS[c.id] || { aqi: 0, pm2_5: 0, pm10: 0 };
    const ratio = Math.round((base.pm2_5 / WHO_GUIDELINES.pm2_5.limit) * 100);
    const delta = Math.round(((base.pm2_5 - WHO_GUIDELINES.pm2_5.limit) / WHO_GUIDELINES.pm2_5.limit) * 100);
    return {
      ...c,
      aqi: base.aqi,
      pm2_5: base.pm2_5,
      pm10: base.pm10,
      ratio,
      delta,
    };
  }).sort((a, b) => b.pm2_5 - a.pm2_5);

  const handleExportCSV = () => {
    const headers = ['Station', 'Country', 'Latitude', 'Longitude', 'AQI', 'PM2.5 (ug/m3)', 'PM10 (ug/m3)', 'WHO PM2.5 Ratio (%)'];
    const rows = sortedMegacities.map((c) => [
      `"${c.name}"`,
      `"${c.country}"`,
      c.lat,
      c.lng,
      c.aqi,
      c.pm2_5,
      c.pm10,
      `${c.ratio}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AirPulse_GlobalTelemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="telemetry-panel p-3.5 font-mono space-y-3 bg-[#18181b] border border-[#27272a] rounded-none">
      {/* Benchmark Header */}
      <div className="border-b border-[#27272a] pb-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest block">
            DIFFERENTIAL MATRIX
          </span>
          <span className="text-[9px] text-zinc-500">WHO GUIDELINE DELTA</span>
        </div>
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#27272a] text-zinc-300">
          RANKED 1-8
        </span>
      </div>

      {/* Ranked City Table */}
      <div className="space-y-1.5">
        {sortedMegacities.map((city, rank) => {
          const isSelected = selectedCity.id === city.id;
          const isBreach = city.delta > 0;

          return (
            <div
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={`p-2 border text-[11px] font-mono flex items-center justify-between cursor-pointer transition-colors ${
                isSelected
                  ? 'border-[#f97316] bg-[#f97316]/10 text-white'
                  : 'border-[#27272a] bg-[#121316]/50 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-600 font-bold w-3">{rank + 1}.</span>
                <div>
                  <span className="font-bold text-white text-[11px] block">{city.name}</span>
                  <span className="text-[9px] text-zinc-500">{city.pm2_5} μg/m³</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-bold font-mono px-1.5 py-0.2 border block ${
                    isBreach
                      ? 'border-rose-900/60 bg-rose-950/40 text-rose-400'
                      : 'border-emerald-900/60 bg-emerald-950/40 text-emerald-400'
                  }`}
                >
                  {isBreach ? `+${city.delta}%` : `${city.delta}%`}
                </span>
                <span className="text-[8px] text-zinc-500 mt-0.5 block">
                  {isBreach ? 'EXCEED' : 'COMPLIANT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSV Export & Sensor Calibration */}
      <div className="pt-2 border-t border-[#27272a] space-y-2">
        <button
          type="button"
          onClick={handleExportCSV}
          className="w-full py-2 bg-[#f97316] hover:bg-[#ea580c] text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#f97316]"
        >
          DOWNLOAD TELEMETRY CSV
        </button>

        <div className="bg-[#121316] p-2 border border-[#27272a] text-[9px] text-zinc-500 space-y-1">
          <div className="flex justify-between">
            <span>MODEL:</span>
            <span className="text-zinc-300 font-mono">ECMWF / CAMS</span>
          </div>
          <div className="flex justify-between">
            <span>CADENCE:</span>
            <span className="text-zinc-300 font-mono">60-MIN ROLLING</span>
          </div>
          <div className="flex justify-between">
            <span>INDEX:</span>
            <span className="text-zinc-300 font-mono">EUROPEAN AQI (EAQI)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
