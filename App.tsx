import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_GENERATORS, AUTO_SAVE_INTERVAL, SAVE_KEY } from './constants';
import { Generator, FloatingText, Language } from './types';
import Singularity from './components/Singularity';
import StatsPanel from './components/StatsPanel';
import UpgradeList from './components/UpgradeList';
import { calculateCost, formatNumber } from './utils/format';
import { TRANSLATIONS } from './translations';

// Helper to safely parse JSON from localStorage
const getSavedState = () => {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load save data", e);
  }
  return null;
};

const App: React.FC = () => {
  // --- Initialization ---
  const savedData = getSavedState();

  // --- State ---
  const [matter, setMatter] = useState<number>(() => {
    return (savedData?.matter !== undefined && !isNaN(savedData.matter)) ? savedData.matter : 0;
  });

  const [generators, setGenerators] = useState<Generator[]>(() => {
    if (savedData?.generators) {
      // Merge saved generators with initial to support updates
      return INITIAL_GENERATORS.map(initGen => {
        const savedGen = savedData.generators.find((g: any) => g.id === initGen.id);
        return savedGen ? { ...initGen, count: savedGen.count } : initGen;
      });
    }
    return INITIAL_GENERATORS;
  });

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  
  const [language, setLanguage] = useState<Language>(() => {
    return (savedData?.language as Language) || 'en';
  });
  
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  
  // Refs for loop optimization and event listeners
  const matterRef = useRef(matter);
  const generatorsRef = useRef(generators);
  const languageRef = useRef(language);
  
  // Sync refs with state
  useEffect(() => { matterRef.current = matter; }, [matter]);
  useEffect(() => { generatorsRef.current = generators; }, [generators]);
  useEffect(() => { languageRef.current = language; }, [language]);

  // Translation helper
  const t = TRANSLATIONS[language];

  // --- Derived State ---
  const calculateMPS = useCallback(() => {
    return generators.reduce((acc, gen) => acc + (gen.baseProduction * gen.count), 0);
  }, [generators]);

  const mps = calculateMPS();

  // --- Game Loop ---
  useEffect(() => {
    const tickRate = 100; // Run 10 times a second
    const interval = setInterval(() => {
      const currentMPS = generatorsRef.current.reduce((acc, gen) => acc + (gen.baseProduction * gen.count), 0);
      const productionPerTick = currentMPS / (1000 / tickRate);
      
      if (productionPerTick > 0) {
        setMatter(prev => prev + productionPerTick);
      }
    }, tickRate);

    return () => clearInterval(interval);
  }, []);

  // --- Robust Save System ---
  const saveGame = useCallback(() => {
    const state = {
      matter: matterRef.current,
      generators: generatorsRef.current.map(g => ({ id: g.id, count: g.count })),
      language: languageRef.current
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, []);

  useEffect(() => {
    // 1. Auto save interval (Now 1s for near real-time passive save)
    const saveInterval = setInterval(saveGame, AUTO_SAVE_INTERVAL);

    // 2. Save on page close/refresh/hide
    const handleUnload = () => saveGame();
    
    // 'beforeunload' covers tab close and refresh on desktop
    window.addEventListener('beforeunload', handleUnload);
    // 'pagehide' covers mobile browsers switching apps
    window.addEventListener('pagehide', handleUnload);
    // 'visibilitychange' covers tab switching better in modern browsers
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveGame();
    });
    // 'blur' covers window losing focus (alt-tab)
    window.addEventListener('blur', handleUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      window.removeEventListener('blur', handleUnload);
      saveGame(); // Final save on unmount
    };
  }, [saveGame]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Instant save logic
    languageRef.current = lang;
    saveGame();
  };

  // --- Interactions ---
  const handleSingularityClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Click power calculation (base 1 + 1% of MPS)
    const clickPower = 1 + (mps * 0.01);
    
    setMatter(prev => prev + clickPower);

    // Add floating text visual
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;
    
    const newText: FloatingText = {
      id: Date.now() + Math.random(),
      x: e.clientX + offsetX,
      y: e.clientY + offsetY,
      value: `+${formatNumber(clickPower)}`
    };

    setFloatingTexts(prev => [...prev, newText]);
    
    // Cleanup text after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 1000);
  };

  const buyGenerator = (id: string) => {
    // Calculate new state locally first to allow Instant Saving
    const currentGenerators = generatorsRef.current;
    const currentMatter = matterRef.current;
    
    const targetGen = currentGenerators.find(g => g.id === id);
    if (!targetGen) return;

    const cost = calculateCost(targetGen.baseCost, targetGen.count);
    if (currentMatter < cost) return;

    const newMatter = currentMatter - cost;
    const newGenerators = currentGenerators.map(gen => 
      gen.id === id ? { ...gen, count: gen.count + 1 } : gen
    );

    // 1. Update React State (UI)
    setMatter(newMatter);
    setGenerators(newGenerators);

    // 2. Update Refs Immediately (Data Integrity)
    matterRef.current = newMatter;
    generatorsRef.current = newGenerators;

    // 3. Trigger Instant Save
    saveGame();
  };

  const handleResetRequest = () => {
    setShowResetModal(true);
  };

  const executeReset = () => {
    // Clear storage
    localStorage.removeItem(SAVE_KEY);
    
    // Reset state
    setMatter(0);
    setGenerators(INITIAL_GENERATORS.map(g => ({...g})));
    
    // Reset refs
    matterRef.current = 0;
    generatorsRef.current = INITIAL_GENERATORS.map(g => ({...g}));

    // Close modal
    setShowResetModal(false);
  };

  return (
    // Added overscroll-none to prevent rubber-banding on mobile
    <div className="h-[100dvh] w-full bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white relative overscroll-none touch-none">
      {/* Floating Text Overlay - Global */}
      {floatingTexts.map(ft => (
        <div
          key={ft.id}
          className="fixed pointer-events-none text-xl font-bold text-white z-50 animate-float shadow-sm"
          style={{ left: ft.x, top: ft.y, textShadow: '0 0 10px rgba(99, 102, 241, 0.8)' }}
        >
          {ft.value}
        </div>
      ))}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-red-500/50 p-6 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-pulse-glow">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              ⚠️ {t.big_crunch}
            </h3>
            <p className="text-slate-300 mb-6">
              {t.big_crunch_confirm}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                {t.cancel}
              </button>
              <button 
                onClick={executeReset}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-900/50 font-semibold"
              >
                {t.confirm_reset}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Left Panel: The Game World 
            Mobile: Fixed 30% height to ensure Upgrade list (70%) has space.
        */}
        <div className="h-[30%] md:h-auto md:flex-1 shrink-0 relative flex flex-col p-2 md:p-6 bg-[url('https://picsum.photos/seed/nebula/1920/1080')] bg-cover bg-center touch-auto">
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0"></div>
          
          <div className="relative z-10 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-1 md:mb-8 shrink-0">
               <div>
                 <h1 className="text-lg md:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 leading-none">
                  {t.app_title}
                 </h1>
                 <p className="text-slate-400 text-[10px] md:text-xs mt-0.5 hidden md:block">{t.version}</p>
               </div>
               
               <div className="flex flex-col items-end gap-1 md:gap-2">
                 <div className="flex bg-slate-800 rounded-md p-1 border border-slate-700">
                    <button 
                      onClick={() => handleLanguageChange('en')}
                      className={`px-2 py-0.5 md:py-1 text-[10px] md:text-xs rounded transition-colors ${language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => handleLanguageChange('zh')}
                      className={`px-2 py-0.5 md:py-1 text-[10px] md:text-xs rounded transition-colors ${language === 'zh' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      中文
                    </button>
                 </div>
                 
                 <button 
                  onClick={handleResetRequest}
                  className="text-[10px] text-red-500 hover:text-red-300 underline opacity-50 hover:opacity-100 transition-opacity"
                 >
                   {t.big_crunch}
                 </button>
               </div>
            </div>

            {/* Visual Center - Flexible container */}
            <div className="flex-grow flex items-center justify-center min-h-0">
              <Singularity 
                onClick={handleSingularityClick} 
                matterPerClick={1 + (mps * 0.01)} 
                language={language}
              />
            </div>

            {/* Footer Message (Hidden on mobile) */}
            <div className="hidden md:block text-center text-slate-500 text-xs mt-auto pt-4 shrink-0">
              {t.footer_quote}
            </div>
          </div>
        </div>

        {/* Right Panel: Controls 
            Mobile: Fixed 70% height
        */}
        <div className="h-[70%] md:h-auto md:w-[400px] lg:w-[450px] bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col z-20 shadow-2xl min-h-0">
          <div className="p-3 md:p-6 pb-2 shrink-0 bg-slate-950 z-30">
            <StatsPanel matter={matter} mps={mps} language={language} />
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 md:p-6 pt-0 scroll-smooth overscroll-contain touch-pan-y">
             <UpgradeList 
               generators={generators} 
               currentMatter={matter} 
               onBuy={buyGenerator} 
               language={language}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;