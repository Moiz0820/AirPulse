import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[#27272a] bg-[#121316] py-6 px-4 font-mono text-xs text-[#71717a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-white font-bold tracking-wider">
            AIRPULSE // ATMOSPHERIC TELEMETRY SYSTEM
          </div>
          <div className="text-[11px] text-[#52525b] mt-0.5">
            DATA FEEDS: OPEN-METEO CAMS SATELLITE ASSIMILATION &bull; WHO AIR QUALITY GUIDELINES 2021
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <div>
            ENGINEERING & ANALYTICS: <span className="text-[#f97316] font-bold">MOIZ ANWAR</span>
          </div>
          <div className="text-[#52525b]">|</div>
          <a
            href="https://github.com/Moiz0820/AirPulse"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:text-[#f97316] underline underline-offset-4 uppercase transition-colors"
          >
            [GITHUB REPOSITORY]
          </a>
        </div>
      </div>
    </footer>
  );
}
