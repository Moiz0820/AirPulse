import React from 'react';
import { MEGACITIES, BASELINE_READINGS } from '../data/airData';

export default function CitySelector({ selectedCityId, onSelectCity, isLive }) {
  return (
    <div className="telemetry-panel p-3.5 rounded-sm font-mono mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#282c37] gap-2">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
          MEGACITY ATMOSPHERIC TELEMETRY SELECTOR
        </span>
        <span className="text-[10px] text-[#10b981] font-bold">
          {isLive ? 'FEED: LIVE OPEN-METEO TELEMETRY' : 'FEED: HARMONIZED BASELINE SYNC'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
        {MEGACITIES.map((city) => {
          const isSelected = selectedCityId === city.id;
          const baseline = BASELINE_READINGS[city.id] || { aqi: 0 };
          const isSevere = baseline.aqi > 100;
          const isModerate = baseline.aqi > 50;

          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm border transition-all ${
                isSelected
                  ? 'bg-[#f97316] text-[#090d16] border-[#f97316]'
                  : 'bg-[#1f222a] text-slate-200 border-[#2f3442] hover:border-slate-500'
              }`}
            >
              <span>{city.name.toUpperCase()} ({city.country})</span>
              <span
                className={`ml-2 text-[10px] px-1 py-0.2 rounded-xs ${
                  isSelected
                    ? 'bg-[#090d16] text-white'
                    : isSevere
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : isModerate
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                AQI {baseline.aqi}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
