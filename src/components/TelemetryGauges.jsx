import React from 'react';
import { WHO_GUIDELINES } from '../data/airData';

export default function TelemetryGauges({ currentData, cityName }) {
  if (!currentData) return null;

  const aqi = currentData.european_aqi ?? currentData.aqi ?? 0;

  let aqiClassification = 'GOOD';
  let aqiColor = 'text-[#10b981]';
  let aqiBorder = 'border-[#10b981]/40';

  if (aqi > 100) {
    aqiClassification = 'VERY POOR / HAZARDOUS';
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
    aqiClassification = 'FAIR';
    aqiColor = 'text-cyan-400';
    aqiBorder = 'border-cyan-500/40';
  }

  const pollutants = [
    { key: 'pm2_5', label: 'PM2.5 (FINE PARTICLES)', val: currentData.pm2_5 },
    { key: 'pm10', label: 'PM10 (COARSE PARTICLES)', val: currentData.pm10 },
    { key: 'nitrogen_dioxide', label: 'NO2 (NITROGEN DIOXIDE)', val: currentData.no2 || currentData.nitrogen_dioxide },
    { key: 'ozone', label: 'O3 (SURFACE OZONE)', val: currentData.o3 || currentData.ozone },
    { key: 'carbon_monoxide', label: 'CO (CARBON MONOXIDE)', val: currentData.co || currentData.carbon_monoxide },
    { key: 'sulphur_dioxide', label: 'SO2 (SULFUR DIOXIDE)', val: currentData.so2 || currentData.sulphur_dioxide },
  ];

  return (
    <div className="space-y-4 font-mono mb-4">
      {/* Primary AQI Level & City Summary */}
      <div className="telemetry-panel p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            LOCATION ATMOSPHERIC SUMMARY // {cityName.toUpperCase()}
          </span>
          <div className="flex items-baseline gap-3 my-1">
            <span className={`text-4xl font-black ${aqiColor}`}>
              EAQI {aqi}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-xs border ${aqiBorder} ${aqiColor}`}>
              {aqiClassification}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            European Air Quality Index standardized measurement calibrated to 1-hour rolling dispersion averages.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs bg-[#121316] p-3 border border-[#282c37] rounded-sm">
          <div>
            <span className="text-slate-400 text-[10px] block">CRITICAL POLLUTANT</span>
            <span className="font-bold text-[#f97316]">
              {currentData.pm2_5 > WHO_GUIDELINES.pm2_5.limit ? 'PM2.5 EXCEEDED' : 'WITHIN COMPLIANCE'}
            </span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div>
            <span className="text-slate-400 text-[10px] block">AIR EXCHANGE RISK</span>
            <span className="font-bold text-white">
              {aqi > 50 ? 'ELEVATED SENSITIVITY' : 'OPTIMAL AIR MASS'}
            </span>
          </div>
        </div>
      </div>

      {/* 6 Individual Pollutant Metric Telemetry Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {pollutants.map((item) => {
          const config = WHO_GUIDELINES[item.key] || { limit: 50, unit: 'μg/m³' };
          const val = Number((item.val || 0).toFixed(1));
          const ratio = (val / config.limit).toFixed(1);
          const isExceeded = val > config.limit;
          const pct = Math.min(100, Math.round((val / (config.limit * 2)) * 100));

          return (
            <div key={item.key} className="telemetry-card p-3 rounded-sm flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight block">
                  {item.label}
                </span>
                <div className="my-1.5 flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${isExceeded ? 'text-[#f97316]' : 'text-slate-100'}`}>
                    {val}
                  </span>
                  <span className="text-[10px] text-slate-400">{config.unit}</span>
                </div>
              </div>

              <div>
                <div className="w-full bg-[#121316] h-1.5 rounded-xs overflow-hidden border border-[#282c37] mb-1.5">
                  <div
                    className={`h-full transition-all ${isExceeded ? 'bg-[#f97316]' : 'bg-[#10b981]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>LIMIT: {config.limit}</span>
                  <span className={`font-bold ${isExceeded ? 'text-[#f97316]' : 'text-[#10b981]'}`}>
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
