import React from 'react';
import { Generator, Language } from '../types';
import { calculateCost, formatNumber } from '../utils/format';
import { TRANSLATIONS } from '../translations';

interface UpgradeListProps {
  generators: Generator[];
  currentMatter: number;
  onBuy: (id: string) => void;
  language: Language;
}

const UpgradeList: React.FC<UpgradeListProps> = ({ generators, currentMatter, onBuy, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex flex-col gap-3 md:gap-4 pb-20">
      {/* Header text */}
      <h3 className="text-lg md:text-xl font-bold text-white border-b border-slate-700 pb-1 md:pb-2 mb-1 md:mb-2 pt-1 md:pt-2">
        {t.upgrade_title}
      </h3>
      
      {generators.map((gen) => {
        const cost = calculateCost(gen.baseCost, gen.count);
        const canAfford = currentMatter >= cost;
        const genTrans = t.generators[gen.id] || { name: gen.name, description: gen.description };

        return (
          <button
            key={gen.id}
            disabled={!canAfford}
            onClick={() => onBuy(gen.id)}
            className={`
              group relative flex items-center p-3 md:p-4 rounded-lg border transition-all duration-200 text-left
              ${canAfford 
                ? 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer' 
                : 'bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed'}
            `}
          >
            {/* Icon Box */}
            <div className={`
              w-10 h-10 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-xl md:text-3xl shadow-inner
              bg-slate-900 mr-3 md:mr-4 shrink-0
              ${gen.color}
            `}>
              {gen.icon}
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-baseline mb-0.5 md:mb-1">
                <h4 className="font-bold text-slate-200 truncate pr-2 text-sm md:text-base">{genTrans.name}</h4>
                <span className="text-lg md:text-2xl font-bold text-slate-500 group-hover:text-white transition-colors">
                  {gen.count}
                </span>
              </div>
              
              <p className="text-[10px] md:text-xs text-slate-400 mb-1 md:mb-2 truncate">{genTrans.description}</p>
              
              <div className="flex items-center gap-2 md:gap-4 text-xs font-mono">
                <div className={`${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                  {t.cost}: {formatNumber(cost)}
                </div>
                <div className="text-indigo-300">
                  +{formatNumber(gen.baseProduction)} MPS
                </div>
              </div>
            </div>

            {/* Visual fill for progress (optional flare) */}
            <div className={`absolute inset-0 rounded-lg border-2 border-indigo-500 opacity-0 transition-opacity duration-100 pointer-events-none ${canAfford ? 'group-active:opacity-100' : ''}`} />
          </button>
        );
      })}
      
      {generators.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          {t.loading}
        </div>
      )}
    </div>
  );
};

export default UpgradeList;