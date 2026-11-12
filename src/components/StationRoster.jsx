import React from 'react';
import { MEGACITIES, BASELINE_READINGS, WHO_GUIDELINES } from '../data/airData';

export default function StationRoster({ selectedCity, onSelectCity, liveData }) {
  const getStatusBadge = (aqi) => {
    if (aqi > 100) return { label: 'HAZARDOUS', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' };
    if (aqi > 50) return { label: 'MODERATE', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
    return { label: 'OPTIMAL', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
  };

  return (
    <div className="telemetry-panel p-3.5 font-mono space-y-3 bg-[#18181b] border border-[#27272a] rounded-none">
      {/* Roster Header */}
      <div className="border-b border-[#27272a] pb-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest block">
            STATION ROSTER // 08 NODES
          </span>
          <span className="text-[9px] text-zinc-500">CAMS TELEMETRY FEED</span>
        </div>
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#27272a] text-zinc-300">
          GLOBAL SCADA
        </span>
      </div>

      {/* Vertical Station Cards */}
      <div className="space-y-1.5">
        {MEGACITIES.map((city) => {
          const isSelected = selectedCity.id === city.id;
          const baseline = BASELINE_READINGS[city.id] || { aqi: 0, pm2_5: 0 };
          const aqi = isSelected && liveData?.current?.european_aqi !== undefined
            ? liveData.current.european_aqi
            : baseline.aqi;
          const status = getStatusBadge(aqi);
          const pm25 = isSelected && liveData?.current?.pm2_5 !== undefined
            ? liveData.current.pm2_5
            : baseline.pm2_5;
          const whoRatio = Math.round((pm25 / WHO_GUIDELINES.pm2_5.limit) * 100);

          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={`w-full p-2.5 text-left border transition-all cursor-pointer font-mono ${
                isSelected
                  ? 'border-[#f97316] bg-[#f97316]/10 text-white shadow-sm'
                  : 'border-[#27272a] bg-[#121316]/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold tracking-tight text-white uppercase">
                      {city.name}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      [{city.country}]
                    </span>
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">
                    PM2.5: {pm25} μg/m³ ({whoRatio}%)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold font-mono text-white">
                    AQI {aqi}
                  </div>
                  <span
                    className={`inline-block text-[8px] font-bold px-1.5 py-0.2 border uppercase mt-0.5 ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Mini ratio bar */}
              <div className="w-full bg-[#27272a] h-1 mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    whoRatio > 100 ? 'bg-[#f97316]' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(whoRatio, 200) / 2}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Roster Footer Status */}
      <div className="pt-2 border-t border-[#27272a] text-[9px] text-zinc-500 space-y-1">
        <div className="flex justify-between">
          <span>WHO SAFE LIMIT:</span>
          <span className="text-zinc-300 font-bold">15 μg/m³ (24h)</span>
        </div>
        <div className="flex justify-between">
          <span>SENSOR NETWORK:</span>
          <span className="text-emerald-400 font-bold">ALL 8 ONLINE</span>
        </div>
      </div>
    </div>
  );
}
