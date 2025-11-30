import React from 'react';
import { formatNumber } from '../utils/format';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface StatsPanelProps {
  matter: number;
  mps: number;
  language: Language;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ matter, mps, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-6 rounded-xl shadow-xl sticky top-4 z-20">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">{t.total_matter}</span>
          <span className="text-emerald-400 text-xs font-mono">{t.efficiency}</span>
        </div>
        
        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-500 truncate">
          {formatNumber(matter)}
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-slate-300 font-mono">
            +{formatNumber(mps)} <span className="text-slate-500 text-sm">{t.matter_per_sec}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;