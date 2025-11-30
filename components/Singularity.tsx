import React, { useState } from 'react';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface SingularityProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  matterPerClick: number;
  language: Language;
}

const Singularity: React.FC<SingularityProps> = ({ onClick, language }) => {
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<{id: number, x: number, y: number}[]>([]);
  const t = TRANSLATIONS[language];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClicking(true);
    
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    // Clean up ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 500);

    setTimeout(() => setIsClicking(false), 100);
    onClick(e);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Background glow effects - scaled down for mobile */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-40 h-40 md:w-64 md:h-64 bg-indigo-600 rounded-full blur-[60px] md:blur-[100px] animate-pulse"></div>
      </div>

      <div 
        className={`
          relative w-36 h-36 md:w-64 md:h-64 rounded-full cursor-pointer select-none transition-transform duration-100 z-10
          flex items-center justify-center
          ${isClicking ? 'scale-95' : 'scale-100 hover:scale-105'}
        `}
        onClick={handleClick}
        style={{
          background: 'radial-gradient(circle at 30% 30%, #4c1d95, #000000)',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(255,255,255,0.1)'
        }}
      >
        {/* Core Detail */}
        <div className="absolute inset-2 rounded-full border border-indigo-500/30 animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
        
        {/* Central visual */}
        <div className="text-4xl md:text-6xl animate-pulse-glow rounded-full p-4 md:p-8 bg-black">
          ⚛️
        </div>

        {/* Click Ripples */}
        {ripples.map(r => (
           <div 
            key={r.id}
            className="absolute rounded-full border border-white opacity-0 animate-[ping_0.5s_ease-out_forwards]"
            style={{
              left: r.x,
              top: r.y,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)'
            }}
           />
        ))}
      </div>

      <div className="mt-2 md:mt-8 text-center pointer-events-none">
        <p className="hidden md:block text-gray-400 text-sm tracking-widest uppercase">{t.target_label}</p>
        <h2 className="text-lg md:text-2xl font-bold text-white tracking-wider">{t.target_name}</h2>
        <p className="text-indigo-400 text-[10px] md:text-xs mt-1 md:block hidden">{t.click_instruction}</p>
      </div>
    </div>
  );
};

export default Singularity;