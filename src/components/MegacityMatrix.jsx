import React, { useState, useMemo } from 'react';
import { MEGACITIES, BASELINE_READINGS, WHO_GUIDELINES } from '../data/airData';

export default function MegacityMatrix({ selectedCity, onSelectCity }) {
  const [sortField, setSortField] = useState('aqi');
  const [sortAsc, setSortAsc] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Assemble full comparative matrix dataset
  const matrixData = useMemo(() => {
    return MEGACITIES.map(city => {
      const readings = BASELINE_READINGS[city.id] || {
        aqi: 0,
        pm2_5: 0,
        pm10: 0,
        no2: 0,
        o3: 0,
        co: 0,
        so2: 0,
      };

      // Classification based on AQI
      let status = 'GOOD';
      let statusColor = 'text-[#10b981] border-[#10b981]/40 bg-[#10b981]/10';
      if (readings.aqi > 150) {
        status = 'HAZARDOUS';
        statusColor = 'text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10';
      } else if (readings.aqi > 100) {
        status = 'UNHEALTHY';
        statusColor = 'text-[#f97316] border-[#f97316]/40 bg-[#f97316]/10';
      } else if (readings.aqi > 50) {
        status = 'MODERATE';
        statusColor = 'text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10';
      }

      // Who pm2.5 ratio
      const pm25Ratio = Number(((readings.pm2_5 / WHO_GUIDELINES.pm2_5.limit) * 100).toFixed(0));
      const isCompliant = readings.pm2_5 <= WHO_GUIDELINES.pm2_5.limit;

      return {
        id: city.id,
        name: city.name,
        country: city.country,
        aqi: readings.aqi,
        pm2_5: readings.pm2_5,
        pm10: readings.pm10,
        no2: readings.no2,
        o3: readings.o3,
        pm25Ratio,
        isCompliant,
        status,
        statusColor,
      };
    });
  }, []);

  // Filter & Sort
  const processedData = useMemo(() => {
    return matrixData
      .filter(item => {
        const query = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(query) || item.country.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [matrixData, searchTerm, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ['City', 'Country', 'AQI Index', 'PM2.5 (ug/m3)', 'PM10 (ug/m3)', 'NO2 (ug/m3)', 'O3 (ug/m3)', 'WHO PM2.5 Cap (%)', 'Attainment Status'];
    const rows = processedData.map(item => [
      item.name,
      item.country,
      item.aqi,
      item.pm2_5,
      item.pm10,
      item.no2,
      item.o3,
      `${item.pm25Ratio}%`,
      item.isCompliant ? 'COMPLIANT' : 'EXCEEDANCE',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `airpulse_megacity_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-none p-5">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#27272a]">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-[#71717a] uppercase">
            [GLOBAL BENCHMARK MATRIX: 8 MEGACITIES]
          </div>
          <h2 className="text-base font-bold text-white tracking-wide uppercase mt-0.5">
            Cross-Metropolitan Atmospheric Density Comparison
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <input
            type="text"
            placeholder="FILTER MEGACITY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#121316] border border-[#27272a] px-3 py-1.5 text-xs font-mono text-white placeholder-[#52525b] focus:border-[#f97316] focus:outline-none w-44"
          />

          {/* CSV Export Button */}
          <button
            onClick={exportCSV}
            className="bg-[#121316] border border-[#3f3f46] hover:border-[#f97316] px-3 py-1.5 text-xs font-mono font-bold text-white hover:text-[#f97316] uppercase transition-colors"
          >
            [EXPORT CSV]
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#27272a] bg-[#121316] text-[10px] tracking-wider text-[#71717a] uppercase">
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                METROPOLIS {sortField === 'name' ? (sortAsc ? '[ASC]' : '[DESC]') : ''}
              </th>
              <th
                onClick={() => handleSort('aqi')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                AQI INDEX {sortField === 'aqi' ? (sortAsc ? '[ASC]' : '[DESC]') : ''}
              </th>
              <th className="py-3 px-3 text-center">AIR CLASSIFICATION</th>
              <th
                onClick={() => handleSort('pm2_5')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                PM2.5 (FINE) {sortField === 'pm2_5' ? (sortAsc ? '[ASC]' : '[DESC]') : ''}
              </th>
              <th
                onClick={() => handleSort('pm10')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                PM10 (COARSE) {sortField === 'pm10' ? (sortAsc ? '[ASC]' : '[DESC]') : ''}
              </th>
              <th
                onClick={() => handleSort('no2')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                NO2
              </th>
              <th
                onClick={() => handleSort('o3')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                O3
              </th>
              <th className="py-3 px-3 text-right">WHO THRESHOLD</th>
              <th className="py-3 px-3 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a] text-xs">
            {processedData.map((item) => {
              const isSelected = selectedCity.id === item.id;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-[#202024] ${
                    isSelected ? 'bg-[#f97316]/10 border-l-2 border-[#f97316]' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-[#71717a] uppercase">{item.country}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sm">
                    <span className={item.aqi > 100 ? 'text-[#ef4444]' : item.aqi > 50 ? 'text-[#f59e0b]' : 'text-[#10b981]'}>
                      {item.aqi}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold border ${item.statusColor}`}>
                      [{item.status}]
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-white font-bold">
                    {item.pm2_5} <span className="text-[10px] text-[#71717a] font-normal">μg/m³</span>
                  </td>
                  <td className="py-3 px-3 text-right text-[#a1a1aa]">
                    {item.pm10} <span className="text-[10px] text-[#71717a] font-normal">μg/m³</span>
                  </td>
                  <td className="py-3 px-3 text-right text-[#a1a1aa]">
                    {item.no2}
                  </td>
                  <td className="py-3 px-3 text-right text-[#a1a1aa]">
                    {item.o3}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className={`font-bold ${item.isCompliant ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                      {item.pm25Ratio}% CAP
                    </div>
                    <div className="text-[9px] text-[#71717a]">
                      {item.isCompliant ? 'SAFE' : 'EXCEEDED'}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onSelectCity(MEGACITIES.find(c => c.id === item.id))}
                      disabled={isSelected}
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold transition-all border ${
                        isSelected
                          ? 'border-[#f97316] text-[#f97316] bg-transparent cursor-default'
                          : 'border-[#3f3f46] text-white hover:border-[#f97316] hover:text-[#f97316]'
                      }`}
                    >
                      {isSelected ? '[MONITORING]' : '[INSPECT]'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#71717a]">
        <div>
          TOTAL MONITORED NODES: {processedData.length} METROPOLITAN SENSORS
        </div>
        <div>
          STATUS LEGEND: [GOOD: 0-50] | [MODERATE: 51-100] | [UNHEALTHY: 101-150] | [HAZARDOUS: 151+]
        </div>
      </div>
    </div>
  );
}
