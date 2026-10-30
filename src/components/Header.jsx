import React, { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUtcTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  return (
    <header className="border-b border-[#282c37] bg-[#121316] py-3 px-4 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 bg-[#f97316] text-[#090d16] text-xs font-black rounded-sm">
            AQI // DISPERSION
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm tracking-wider">
                AIRPULSE
              </span>
              <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.2 border border-[#10b981]/30 rounded-sm">
                TELEMETRY DECK
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Open-Meteo High-Frequency Atmospheric Particulate & Gas Dispersion Terminal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">UTC CLOCK: <b className="text-white">{formatUtcTime(time)}</b></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">METRICS: <b className="text-[#f97316]">WHO GUIDELINES 2021</b></span>
          <span className="text-slate-600">|</span>
          <a
            href="https://github.com/Moiz0820"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#f97316] transition-colors"
          >
            AUTHOR: MOIZ0820
          </a>
        </div>
      </div>
    </header>
  );
}
