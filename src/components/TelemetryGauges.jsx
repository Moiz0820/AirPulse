import React from 'react';
import { WHO_GUIDELINES } from '../data/airData';

export default function TelemetryGauges({ city, liveData, baseline, isLoading }) {
  const cityName = city?.name || 'DUBAI';
  const currentData = liveData?.current || baseline || {};

  const aqi = currentData.european_aqi ?? currentData.aqi ?? 0;

  let aqiClassification = 'OPTIMAL / GOOD';
  let aqiColor = 'text-emerald-400';
  let aqiBorder = 'border-emerald-500/40';

  if (aqi > 100) {
    aqiClassification = 'HAZARDOUS AIR MASS';
    aqiColor = 'text-rose-400';
    aqiBorder = 'border-rose-500/40';
  } else if (aqi > 75) {
    aqiClassification = 'POOR (UNHEALTHY)';
    aqiColor = 'text-orange-400';
    aqiBorder = 'border-orange-500/40';
  } else if (aqi > 50) {
    aqiClassification = 'MODERATE';
    aqiColor = 'text-amber-400';
    aqiBorder = 'border-amber-500/40';
  } else if (aqi > 25) {
    aqiClassification = 'FAIR / ACCEPTABLE';
    aqiColor = 'text-cyan-400';
    aqiBorder = 'border-cyan-500/40';
  }

  const pollutants = [
    { key: 'pm2_5', label: 'PM2.5 (FINE)', val: currentData.pm2_5 },
    { key: 'pm10', label: 'PM10 (COARSE)', val: currentData.pm10 },
    { key: 'nitrogen_dioxide', label: 'NO2 (NITROGEN)', val: currentData.no2 || currentData.nitrogen_dioxide },
    { key: 'ozone', label: 'O3 (OZONE)', val: currentData.o3 || currentData.ozone },
    { key: 'carbon_monoxide', label: 'CO (MONOXIDE)', val: currentData.co || currentData.carbon_monoxide },
    { key: 'sulphur_dioxide', label: 'SO2 (SULFUR)', val: currentData.so2 || currentData.sulphur_dioxide },
  ];

  const pm25Val = currentData.pm2_5 || 0;
  const isPm25Exceeded = pm25Val > WHO_GUIDELINES.pm2_5.limit;

  return (
    <div className="space-y-3 font-mono">
      {/* Primary AQI Level & City Summary */}
      <div className="telemetry-panel p-4 rounded-none border border-[#27272a] bg-[#18181b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              ACTIVE SENSOR STAGE // {cityName.toUpperCase()} [{city?.country}]
            </span>
            {isLoading && (
              <span className="text-[9px] px-1.5 py-0.2 bg-[#f97316] text-black font-bold">
                STREAMING
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3 my-1">
            <span className={`text-4xl font-black ${aqiColor}`}>
              EAQI {aqi}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 border ${aqiBorder} ${aqiColor}`}>
              {aqiClassification}
            </span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Coordinates: {city?.lat}°N, {city?.lng}°E | Timezone: {city?.timezone}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5 text-xs bg-[#121316] p-3 border border-[#27272a]">
          <div>
            <span className="text-zinc-500 text-[9px] block">WHO 2021 COMPLIANCE</span>
            <span className={`font-bold ${isPm25Exceeded ? 'text-[#f97316]' : 'text-emerald-400'}`}>
              {isPm25Exceeded ? 'GUIDELINE BREACH (PM2.5)' : 'COMPLIANT AIR MASS'}
            </span>
          </div>
          <div className="text-[9px] text-zinc-500">
            Current PM2.5: <span className="font-bold text-white">{pm25Val} μg/m³</span> (Cap: 15 μg/m³)
          </div>
        </div>
      </div>

      {/* 6 Individual Pollutant Metric Telemetry Blocks (3x2 grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {pollutants.map((item) => {
          const config = WHO_GUIDELINES[item.key] || { limit: 50, unit: 'μg/m³' };
          const val = Number((item.val || 0).toFixed(1));
          const ratio = (val / config.limit).toFixed(1);
          const isExceeded = val > config.limit;
          const pct = Math.min(100, Math.round((val / (config.limit * 2)) * 100));

          return (
            <div
              key={item.key}
              className="p-3 border border-[#27272a] bg-[#18181b] flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight block truncate">
                  {item.label}
                </span>
                <div className="my-1.5 flex items-baseline gap-1">
                  <span className={`text-xl font-black ${isExceeded ? 'text-[#f97316]' : 'text-zinc-100'}`}>
                    {val}
                  </span>
                  <span className="text-[9px] text-zinc-500">{config.unit}</span>
                </div>
              </div>

              <div>
                <div className="w-full bg-[#121316] h-1.5 overflow-hidden border border-[#27272a] mb-1.5">
                  <div
                    className={`h-full transition-all ${isExceeded ? 'bg-[#f97316]' : 'bg-emerald-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-400">
                  <span>CAP: {config.limit}</span>
                  <span className={`font-bold ${isExceeded ? 'text-[#f97316]' : 'text-emerald-400'}`}>
                    {ratio}x WHO
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
