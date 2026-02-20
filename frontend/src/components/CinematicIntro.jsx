import React, { useEffect, useState } from 'react';
import { Heart, Cloud } from 'lucide-react';

const CinematicIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('INIT'); // INIT, CHARACTER, DASH, COMPLETE
  const [quoteIdx, setQuoteIdx] = useState(0);
  const quotes = ["Womens are powerfull", "Menstraution is not a taboo anymore"];

  useEffect(() => {
    // Cinematic Timeline (Total ~10s)
    const tStart = setTimeout(() => setPhase('CHARACTER'), 100);
    const tQuote2 = setTimeout(() => setQuoteIdx(1), 4000); // 1s enter + 3s quote 1
    const tExit = setTimeout(() => setPhase('DASH'), 8000); // 4s wait + 3s quote 2 + 1s prep
    const tEnd = setTimeout(() => {
        setPhase('COMPLETE');
        onComplete();
    }, 10000);

    return () => {
        clearTimeout(tStart);
        clearTimeout(tQuote2);
        clearTimeout(tExit);
        clearTimeout(tEnd);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[1000] overflow-hidden bg-[#0d0221] flex items-center justify-center transition-all duration-1000 ${phase === 'COMPLETE' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Immersive Background Mapping the Princess Aesthetic */}
      <div className="absolute inset-0 z-0">
         <img 
           src="/princess.png" 
           className="w-full h-full object-cover opacity-20 blur-[100px] scale-110"
           alt="Backdrop"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-[#0d0221]/80 via-transparent to-[#0d0221]/80"></div>
      </div>
      
      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-10 right-10 z-[1100] px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:scale-105 active:scale-95"
      >
        Skip to Dashboard
      </button>
      
      {/* Weather: Raining Clouds */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-10 left-[10%] animate-cloud duration-[15000ms] opacity-20">
            <Cloud size={200} className="text-white" />
         </div>
         <div className="absolute top-20 right-[20%] animate-cloud duration-[20000ms] opacity-10">
            <Cloud size={300} className="text-white" />
         </div>

         {[...Array(30)].map((_, i) => (
           <div 
             key={i} 
             className="absolute bg-white/20 w-[1px] h-20 animate-fall"
             style={{ 
               left: `${Math.random() * 100}%`,
               animationDuration: `${0.5 + Math.random() * 0.5}s`,
               animationDelay: `${Math.random() * 2}s`
             }}
           ></div>
         ))}
      </div>

      {/* Speed Lines Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="speed-line animate-speed"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 200}px`,
              background: `linear-gradient(90deg, transparent, #ff2f95)`,
              animationDelay: `${Math.random() * 0.5}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="absolute inset-0 cinematic-vignette z-20"></div>

      {phase === 'DASH' && <div className="absolute inset-0 z-[100] bg-white animate-flash"></div>}

      <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-8">
        
        {/* CHARACTER SECTION - Princess arriving */}
        <div className={`relative transition-all duration-[2000ms] cubic-bezier(0.23,1,0.32,1) flex flex-col items-center
          ${phase === 'INIT' ? 'translate-x-[-100vw] opacity-0' : phase === 'CHARACTER' ? 'translate-x-0 opacity-100' : 'translate-x-[100vw] opacity-0'}`}>
           
           <div className="relative group flex flex-col items-center">
              {/* Glowing Aura Backdrop */}
              <div className="absolute inset-[-100px] bg-[#ff2d95]/30 blur-[120px] rounded-full"></div>
              
              {/* Red Heart - Stationary and Solid */}
              <div className="absolute -top-32 z-20">
                <Heart size={80} fill="#ff0000" className="text-red-500 drop-shadow-[0_0_50px_rgba(255,0,0,0.8)]" />
              </div>
              
              {/* Realistic Princess Photography */}
              <div className="relative z-10">
                <div className="w-[500px] h-[650px] rounded-[100px] overflow-hidden border-4 border-white/20 shadow-[0_0_80px_rgba(255,45,149,0.4)]">
                  <img 
                    src="/princess.png" 
                    className="w-full h-full object-cover"
                    alt="Princess"
                  />
                </div>
              </div>

              {/* Magical Speech Cloud */}
              <div className={`absolute -top-16 -right-32 z-50 transition-all duration-1000 delay-500 ${phase === 'CHARACTER' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full animate-pulse"></div>
                  <div className="relative ethereal-glass p-12 rounded-[70px] border-white/40 shadow-[0_30px_60px_rgba(255,255,255,0.2)] bg-white/50 backdrop-blur-3xl min-w-[400px] text-center">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight transition-all duration-1000">
                      "{quotes[quoteIdx]}"
                    </p>
                    {/* Tail for the speech cloud */}
                    <div className="absolute -bottom-6 left-12 w-12 h-12 bg-white/50 backdrop-blur-3xl border-r border-b border-white/40 rotate-45 rounded-br-2xl"></div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Loading Bar */}
        <div className={`mt-12 w-96 space-y-4 transition-all duration-1000 delay-300 ${phase === 'CHARACTER' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <div className="flex justify-between items-end">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Initializing Neural Vitals</p>
             <p className="text-xs font-black text-white italic">02.0 %</p>
           </div>
           <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#ff0000] to-[#ff2d95] transition-all duration-[3000ms] ease-linear shadow-[0_0_15px_#ff0000]"
                style={{ width: phase === 'CHARACTER' ? '100%' : '0%' }}
              ></div>
           </div>
        </div>
      </div>

      <div className={`absolute inset-0 z-[60] bg-white transition-all duration-1500 ${phase === 'DASH' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}></div>
    </div>
  );
};

export default CinematicIntro;
