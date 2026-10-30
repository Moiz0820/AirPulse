import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { WHO_GUIDELINES } from '../data/airData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DiurnalChart({ city, liveData, baseline }) {
  const [activeMetric, setActiveMetric] = useState('pm2_5'); // 'pm2_5', 'pm10', 'both'

  // Extract hourly readings or synthesize standard diurnal curve based on city baseline
  const chartData = useMemo(() => {
    let hours = [];
    let pm25Values = [];
    let pm10Values = [];

    if (liveData && liveData.hourly && liveData.hourly.time && liveData.hourly.time.length > 0) {
      // Use live Open-Meteo hourly readings (first 24 hours)
      const times = liveData.hourly.time.slice(0, 24);
      hours = times.map(t => {
        const d = new Date(t);
        return `${String(d.getHours()).padStart(2, '0')}:00`;
      });
      pm25Values = (liveData.hourly.pm2_5 || []).slice(0, 24);
      pm10Values = (liveData.hourly.pm10 || []).slice(0, 24);
    } else {
      // Diurnal curve synthesis: morning & evening rush-hour emission peaks + thermal inversion
      const base25 = baseline ? baseline.pm2_5 : 25;
      const base10 = baseline ? baseline.pm10 : 45;

      for (let h = 0; h < 24; h++) {
        const hourStr = `${String(h).padStart(2, '0')}:00`;
        hours.push(hourStr);

        // Sinusoidal morning peak (08:00) and evening peak (19:00)
        const morningFactor = Math.exp(-Math.pow(h - 8, 2) / 8) * 0.45;
        const eveningFactor = Math.exp(-Math.pow(h - 19, 2) / 10) * 0.55;
        const diurnalFactor = 0.75 + morningFactor + eveningFactor;

        pm25Values.push(Number((base25 * diurnalFactor).toFixed(1)));
        pm10Values.push(Number((base10 * diurnalFactor).toFixed(1)));
      }
    }

    const datasets = [];

    if (activeMetric === 'pm2_5' || activeMetric === 'both') {
      datasets.push({
        label: 'PM2.5 (Fine)',
        data: pm25Values,
        borderColor: '#f97316', // Safety Orange
        backgroundColor: 'rgba(249, 115, 22, 0.12)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#f97316',
      });
    }

    if (activeMetric === 'pm10' || activeMetric === 'both') {
      datasets.push({
        label: 'PM10 (Coarse)',
        data: pm10Values,
        borderColor: '#06b6d4', // Cyan
        backgroundColor: 'rgba(6, 182, 212, 0.08)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#06b6d4',
      });
    }

    // Add WHO Guideline Threshold lines
    if (activeMetric === 'pm2_5' || activeMetric === 'both') {
      datasets.push({
        label: 'WHO PM2.5 Cap (15 μg/m³)',
        data: Array(hours.length).fill(WHO_GUIDELINES.pm2_5.limit),
        borderColor: '#ef4444',
        borderWidth: 1.5,
        borderDash: [5, 4],
        pointRadius: 0,
        fill: false,
      });
    }

    return { labels: hours, datasets, pm25Values, pm10Values };
  }, [liveData, baseline, activeMetric]);

  // Telemetry stats
  const stats = useMemo(() => {
    const vals = activeMetric === 'pm10' ? chartData.pm10Values : chartData.pm25Values;
    if (!vals || vals.length === 0) return { peak: 0, mean: 0, min: 0, exceedCount: 0 };

    const validVals = vals.filter(v => v !== null && !isNaN(v));
    const peak = Math.max(...validVals);
    const min = Math.min(...validVals);
    const sum = validVals.reduce((acc, v) => acc + v, 0);
    const mean = Number((sum / validVals.length).toFixed(1));
    const limit = activeMetric === 'pm10' ? WHO_GUIDELINES.pm10.limit : WHO_GUIDELINES.pm2_5.limit;
    const exceedCount = validVals.filter(v => v > limit).length;

    return { peak, mean, min, exceedCount, totalPoints: validVals.length };
  }, [chartData, activeMetric]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#a1a1aa',
          font: { family: 'ui-monospace, monospace', size: 10 },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#fafafa',
        bodyColor: '#e4e4e7',
        borderColor: '#3f3f46',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y} μg/m³`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#27272a' },
        ticks: {
          color: '#71717a',
          font: { family: 'ui-monospace, monospace', size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        grid: { color: '#27272a' },
        ticks: {
          color: '#71717a',
          font: { family: 'ui-monospace, monospace', size: 10 },
          callback: (value) => `${value} μg/m³`,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-none p-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#27272a]">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-[#71717a] uppercase">
            [TELEMETRY STREAM: 24-HOUR DIURNAL DISPERSION]
          </div>
          <h2 className="text-base font-bold text-white tracking-wide uppercase mt-0.5">
            {city.name} ({city.country}) Hourly Particulate Trajectory
          </h2>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-1 bg-[#121316] p-1 border border-[#27272a]">
          <button
            onClick={() => setActiveMetric('pm2_5')}
            className={`px-3 py-1 text-[11px] font-mono uppercase transition-all ${
              activeMetric === 'pm2_5'
                ? 'bg-[#f97316] text-black font-bold'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            PM2.5 (Fine)
          </button>
          <button
            onClick={() => setActiveMetric('pm10')}
            className={`px-3 py-1 text-[11px] font-mono uppercase transition-all ${
              activeMetric === 'pm10'
                ? 'bg-[#06b6d4] text-black font-bold'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            PM10 (Coarse)
          </button>
          <button
            onClick={() => setActiveMetric('both')}
            className={`px-3 py-1 text-[11px] font-mono uppercase transition-all ${
              activeMetric === 'both'
                ? 'bg-white text-black font-bold'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Overlay Both
          </button>
        </div>
      </div>

      {/* Quantitative Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
        <div className="bg-[#121316] border border-[#27272a] p-2.5">
          <div className="text-[10px] font-mono text-[#71717a] uppercase">24H PEAK LEVEL</div>
          <div className="text-lg font-bold font-mono text-[#f97316] mt-0.5">
            {stats.peak} <span className="text-[10px] text-[#71717a]">μg/m³</span>
          </div>
        </div>
        <div className="bg-[#121316] border border-[#27272a] p-2.5">
          <div className="text-[10px] font-mono text-[#71717a] uppercase">24H DIURNAL MEAN</div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">
            {stats.mean} <span className="text-[10px] text-[#71717a]">μg/m³</span>
          </div>
        </div>
        <div className="bg-[#121316] border border-[#27272a] p-2.5">
          <div className="text-[10px] font-mono text-[#71717a] uppercase">24H MINIMUM</div>
          <div className="text-lg font-bold font-mono text-[#10b981] mt-0.5">
            {stats.min} <span className="text-[10px] text-[#71717a]">μg/m³</span>
          </div>
        </div>
        <div className="bg-[#121316] border border-[#27272a] p-2.5">
          <div className="text-[10px] font-mono text-[#71717a] uppercase">WHO EXCEEDANCE HRS</div>
          <div className="text-lg font-bold font-mono text-[#ef4444] mt-0.5">
            {stats.exceedCount} / 24 <span className="text-[10px] text-[#71717a]">HOURS</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <Line data={chartData} options={options} />
      </div>

      {/* Analytical Subtext */}
      <div className="mt-3 pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#71717a]">
        <div>
          REFERENCE: WHO Air Quality Guidelines (2021) 24-hour mean limit for PM2.5 is 15 μg/m³; PM10 is 45 μg/m³.
        </div>
        <div className="text-[#a1a1aa]">
          SAMPLING FREQUENCY: 1-HOUR ROLLING INTERVAL
        </div>
      </div>
    </div>
  );
}
