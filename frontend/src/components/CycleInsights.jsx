import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';

/* ── Phase data ── */
const PHASES = [
  {
    id: 'MENSTRUAL', days: '1–5', label: 'Menstrual', sub: 'Luna Phase',
    color: '#ff2d95', glow: 'rgba(255,45,149,0.3)',
    emoji: '🌑', moon: 'New Moon',
    energy: 25, mood: 35, focus: 40, creativity: 60,
    desc: 'Your body sheds the uterine lining. Rest is sacred. Honor your inner winter — gentle movement, warmth, and iron-rich foods.',
    symptoms: ['Cramps', 'Fatigue', 'Lower back ache', 'Tender breasts', 'Mood dips'],
    foods: ['🫐 Berries', '🥩 Iron-rich meats', '🫖 Ginger tea', '🥬 Dark leafy greens'],
    yoga: 'Restorative & Yin Yoga', tip: 'Use your Prince Care biosensor to monitor temperature dips.',
  },
  {
    id: 'FOLLICULAR', days: '6–13', label: 'Follicular', sub: 'Dawn Phase',
    color: '#ff8c00', glow: 'rgba(255,140,0,0.3)',
    emoji: '🌒', moon: 'Waxing Crescent',
    energy: 75, mood: 70, focus: 80, creativity: 85,
    desc: 'Rising estrogen fuels your inner spring. Clarity, creativity, and confidence bloom. The world bends to your will now.',
    symptoms: ['Increased libido', 'Clear skin', 'High energy burst', 'Mental sharpness'],
    foods: ['🥚 Eggs', '🥦 Cruciferous veggies', '🌱 Sprouted grains', '🍋 Fermented foods'],
    yoga: 'Vinyasa Flow & Dynamic HIIT', tip: 'Schedule important meetings now — your verbal intelligence peaks.',
  },
  {
    id: 'OVULATION', days: '14–16', label: 'Ovulation', sub: 'Peak Phase',
    color: '#ffd700', glow: 'rgba(255,215,0,0.4)',
    emoji: '🌕', moon: 'Full Moon',
    energy: 100, mood: 95, focus: 90, creativity: 100,
    desc: 'You are at peak luminosity. Ovulation window open. Magic-hour fertility. Your charisma, confidence, and connection are at their absolute zenith.',
    symptoms: ['Slight pelvic twinge', 'Cervical mucus changes', 'Heightened senses', 'Social magnetism'],
    foods: ['🍓 Antioxidant-rich fruits', '🥗 Raw salads', '🫘 Lentils', '🌿 Zinc-rich foods'],
    yoga: 'Power Yoga & Dance', tip: 'Biosensor SpO2 often peaks during ovulation — a unique Prince Care signal.',
  },
  {
    id: 'LUTEAL', days: '17–28', label: 'Luteal', sub: 'Dusk Phase',
    color: '#8a2be2', glow: 'rgba(138,43,226,0.3)',
    emoji: '🌘', moon: 'Waning Moon',
    energy: 50, mood: 45, focus: 55, creativity: 70,
    desc: 'Progesterone rises creating your inner autumn. Introspective, intuitive, and deeply creative. PMS can arrive — but so can your most profound breakthroughs.',
    symptoms: ['Bloating', 'PMS symptoms', 'Food cravings', 'Heightened intuition', 'Sleep changes'],
    foods: ['🍫 Dark chocolate', '🥑 Avocado', '🌰 Nuts & seeds', '🍠 Complex carbs'],
    yoga: 'Pilates & Gentle Hatha', tip: 'Track temperature spike — sustained elevation confirms ovulation occurred.',
  },
];

/* ── Hormone data for wave chart ── */
const HORMONES = [
  { key: 'estrogen', label: 'Estrogen', color: '#ff2d95', values: [10,12,18,35,70,95,90,55,45,38,30,25,20,40,80,100,90,60,40,30,25,22,20,22,24,18,14,10] },
  { key: 'progesterone', label: 'Progesterone', color: '#8a2be2', values: [5,5,5,6,8,10,12,10,8,7,8,12,15,14,12,14,18,35,55,70,80,85,80,70,55,40,25,10] },
  { key: 'lh', label: 'LH Surge', color: '#ffd700', values: [5,5,5,5,5,5,5,5,8,15,85,100,60,20,10,8,6,5,5,5,5,5,5,5,5,5,5,5] },
  { key: 'fsh', label: 'FSH', color: '#00f5ff', values: [8,8,10,15,20,30,35,25,18,25,40,30,15,10,8,8,8,8,8,10,10,10,10,10,8,8,8,8] },
];

/* ── Symptom constellation items ── */
const ALL_SYMPTOMS = [
  '😴 Fatigue', '😤 Irritability', '💧 Bloating', '🤕 Headache', '❤️ Cramps',
  '✨ High Energy', '😊 Euphoric', '🧠 Brain Fog', '😍 Libido Boost', '😰 Anxiety',
  '💤 Insomnia', '🌡️ Hot Flashes', '😭 Mood Swings', '🎯 Laser Focus', '🍫 Cravings',
  '🌿 Clear Skin', '💪 Strong', '🥱 Low Drive', '🔥 Passion Peak', '🤢 Nausea',
];

/* ── Smooth wave path ── */
function wavePath(values, w, h, pad = 20) {
  const pts = values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (w - pad * 2),
    y: pad + (1 - v / 100) * (h - pad * 2),
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 3;
    const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) / 3;
    d += ` C ${cp1x} ${pts[i - 1].y}, ${cp2x} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
  }
  return d;
}

/* ── Orbital Cycle Wheel ── */
const CycleWheel = ({ currentDay, phase }) => {
  const cx = 160, cy = 160, r = 120, totalDays = 28;
  const phaseColors = { MENSTRUAL:'#ff2d95', FOLLICULAR:'#ff8c00', OVULATION:'#ffd700', LUTEAL:'#8a2be2' };
  const phaseRanges = [
    { id:'MENSTRUAL', start:0, end:5 },
    { id:'FOLLICULAR', start:5, end:13 },
    { id:'OVULATION', start:13, end:16 },
    { id:'LUTEAL', start:16, end:28 },
  ];
  const toRad = deg => (deg * Math.PI) / 180;
  const dayAngle = day => -90 + (day / totalDays) * 360;

  const arc = (startDay, endDay, innerR, outerR) => {
    const a1 = toRad(dayAngle(startDay)), a2 = toRad(dayAngle(endDay));
    const x1 = cx + outerR * Math.cos(a1), y1 = cy + outerR * Math.sin(a1);
    const x2 = cx + outerR * Math.cos(a2), y2 = cy + outerR * Math.sin(a2);
    const x3 = cx + innerR * Math.cos(a2), y3 = cy + innerR * Math.sin(a2);
    const x4 = cx + innerR * Math.cos(a1), y4 = cy + innerR * Math.sin(a1);
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
  };

  const curAngle = toRad(dayAngle(currentDay - 0.5));
  const dotX = cx + (r + 10) * Math.cos(curAngle);
  const dotY = cy + (r + 10) * Math.sin(curAngle);

  return (
    <svg width={320} height={320} viewBox="0 0 320 320">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        {HORMONES.map(h => (
          <radialGradient key={h.key} id={`g_${h.key}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={h.color} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={h.color} stopOpacity="0"/>
          </radialGradient>
        ))}
      </defs>

      {/* Concentric guide rings */}
      {[60, 90, 120, 145].map(rr => (
        <circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4"/>
      ))}

      {/* Phase arcs */}
      {phaseRanges.map(p => (
        <path key={p.id} d={arc(p.start, p.end, 100, 140)} fill={phaseColors[p.id]} opacity="0.85"
          style={{ filter:`drop-shadow(0 0 8px ${phaseColors[p.id]}60)` }} />
      ))}

      {/* Day tick marks */}
      {Array.from({length:28},(_,i) => {
        const a = toRad(dayAngle(i)); const r1=142, r2=148;
        return <line key={i} x1={cx+r1*Math.cos(a)} y1={cy+r1*Math.sin(a)} x2={cx+r2*Math.cos(a)} y2={cy+r2*Math.sin(a)} stroke="white" strokeWidth="1.5" opacity="0.6"/>;
      })}

      {/* Day numbers (every 7) */}
      {[1,7,14,21].map(d => {
        const a = toRad(dayAngle(d)); const rr=158;
        return <text key={d} x={cx+rr*Math.cos(a)} y={cy+rr*Math.sin(a)} textAnchor="middle" dominantBaseline="central"
          fontSize="11" fontWeight="900" fill="#64748b">{d}</text>;
      })}

      {/* Inner circle */}
      <circle cx={cx} cy={cy} r={96} fill="white" />
      <circle cx={cx} cy={cy} r={96} fill="none" stroke="#f8fafc" strokeWidth="2" />

      {/* Center content */}
      <text x={cx} y={cy-22} textAnchor="middle" fontSize="36" fontWeight="900" fill={phaseColors[phase?.id || 'MENSTRUAL']}>{currentDay}</text>
      <text x={cx} y={cy+2} textAnchor="middle" fontSize="10" fontWeight="900" fill="#94a3b8" letterSpacing="2">DAY</text>
      <text x={cx} y={cy+22} textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f172a">{phase?.moon || '🌕'}</text>
      <text x={cx} y={cy+42} textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8">{phase?.label}</text>

      {/* Current day indicator */}
      <circle cx={dotX} cy={dotY} r="10" fill={phaseColors[phase?.id || 'MENSTRUAL']} filter="url(#glow)"/>
      <circle cx={dotX} cy={dotY} r="5" fill="white"/>
    </svg>
  );
};

/* ── Hormone Wave Chart ── */
const HormoneChart = ({ activeHormones, currentDay }) => {
  const w = 600, h = 140;
  const visibleHormones = HORMONES.filter(h => activeHormones.includes(h.key));
  const xPos = 20 + ((currentDay - 1) / 27) * (w - 40);
  return (
    <div className="overflow-x-auto">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{height:140}}>
        <defs>
          {visibleHormones.map(h => (
            <linearGradient key={h.key} id={`wg_${h.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={h.color} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={h.color} stopOpacity="0"/>
            </linearGradient>
          ))}
        </defs>
        {/* Phase zones */}
        {[{x:0,w:107,c:'#ff2d9520'},{x:107,w:178,c:'#ff8c0020'},{x:285,w:64,c:'#ffd70020'},{x:349,w:251,c:'#8a2be220'}]
          .map((z,i)=><rect key={i} x={20+z.x*(w-40)/600} y={0} width={z.w*(w-40)/600} height={h} fill={z.c}/>)}
        {/* Waves + fills */}
        {visibleHormones.map(h => {
          const path = wavePath(h.values, w, h);
          const closedPath = path + ` L ${w-20} ${h} L 20 ${h} Z`;
          return (
            <g key={h.key}>
              <path d={closedPath} fill={`url(#wg_${h.key})`}/>
              <path d={path} stroke={h.color} strokeWidth="2.5" fill="none" strokeLinecap="round"
                style={{filter:`drop-shadow(0 0 4px ${h.color}80)`}}/>
            </g>
          );
        })}
        {/* Current day line */}
        <line x1={xPos} y1={0} x2={xPos} y2={h} stroke="#ff2d95" strokeWidth="2" strokeDasharray="4 3"/>
        <circle cx={xPos} cy={h/2} r="6" fill="#ff2d95" stroke="white" strokeWidth="2"/>
        {/* X axis labels */}
        {[1,7,14,21,28].map(d=>{
          const x = 20+((d-1)/27)*(w-40);
          return <text key={d} x={x} y={h-2} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="900">D{d}</text>;
        })}
      </svg>
    </div>
  );
};

/* ── Stat Bar ── */
const StatBar = ({ label, val, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-sm font-black" style={{color}}>{val}%</span>
    </div>
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000"
        style={{width:`${val}%`, background:`linear-gradient(90deg, ${color}88, ${color})`}}/>
    </div>
  </div>
);

/* ══════════════════ Main Component ══════════════════ */
const CycleInsights = ({ lastPeriod = '2026-02-15', userName = 'Princess' }) => {
  const [currentDay, setCurrentDay] = useState(() => {
    const msPerDay = 86400000;
    return Math.min(28, Math.max(1, Math.ceil((Date.now() - new Date(lastPeriod).getTime()) / msPerDay)));
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState(['😊 Euphoric','✨ High Energy','🍫 Cravings']);
  const [activeHormones, setActiveHormones] = useState(['estrogen','progesterone','lh']);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [animatedDay, setAnimatedDay] = useState(1);

  // Determine phase from day
  const getPhase = day => {
    if (day <= 5)  return PHASES[0];
    if (day <= 13) return PHASES[1];
    if (day <= 16) return PHASES[2];
    return PHASES[3];
  };
  const phase = getPhase(currentDay);

  // Animate day counter on mount
  useEffect(() => {
    let d = 1;
    const id = setInterval(() => {
      d++;
      setAnimatedDay(d);
      if (d >= currentDay) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [currentDay]);

  // Fertility & ovulation windows
  const ovDay = 14;
  const fertileStart = ovDay - 5, fertileEnd = ovDay + 1;
  const daysToOv = Math.max(0, ovDay - currentDay);

  const fetchAIInsight = async () => {
    const key = process.env.REACT_APP_GEMINI_API_KEY;
    if (!key) { setAiInsight('⚠️ API key missing.'); return; }
    setLoadingAI(true); setShowAIPanel(true);
    const symptoms = selectedSymptoms.join(', ');
    const prompt = `You are "Princess Neural", the world's most advanced AI cycle coach for "Prince Care" — India's #1 menstrual wellness platform. 
The user "${userName}" is on Day ${currentDay} of their 28-day cycle (${phase.label} phase, ${phase.sub}).
Logged symptoms today: ${symptoms || 'none'}.
Provide a deeply personalized, warm, 4-5 sentence neural cycle insight. Cover: what's happening hormonally right now, one surprising science fact about this phase, today's optimal activity, and a specific food recommendation. 
End with a regal, empowering one-liner. Be elegant, scientific, and inspiring. Write in 2nd person.`;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:350,temperature:0.8} }) }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiInsight(text || 'Unable to generate insight.');
    } catch { setAiInsight('Neural circuits busy. Try again.'); }
    finally { setLoadingAI(false); }
  };

  const toggleSymptom = s => setSelectedSymptoms(p => p.includes(s) ? p.filter(x=>x!==s) : [...p, s]);
  const toggleHormone = h => setActiveHormones(p => p.includes(h) ? p.filter(x=>x!==h) : [...p, h]);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-[48px] p-10 text-white"
        style={{background:`linear-gradient(135deg, ${phase.color}ee 0%, #1a0a2e 60%, #0f0f1a 100%)`}}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-30"
          style={{background:phase.color, transform:'translate(30%,-30%)'}}/>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] opacity-20"
          style={{background:'#8a2be2', transform:'translate(-20%,30%)'}}/>
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-2">Prince Care · Neural Cycle Intelligence</p>
            <h1 className="text-6xl font-black tracking-tighter italic leading-none mb-2">
              Day {animatedDay}.<br/>
              <span style={{color:phase.color===('#ff2d95') ? '#ff9de2' : '#ffd700'}}>{phase.label}.</span>
            </h1>
            <p className="text-white/60 font-medium text-sm max-w-md mt-3">{phase.desc.slice(0,120)}…</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CycleWheel currentDay={animatedDay} phase={phase}/>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Orbital Cycle Map</p>
          </div>
        </div>
        {/* Phase badges */}
        <div className="relative z-10 flex flex-wrap gap-3 mt-6">
          {[
            {label:'Phase', val:phase.label},
            {label:'Moon', val:phase.moon},
            {label:'Ovulation in', val: daysToOv === 0 ? 'Today 🌕' : `${daysToOv} days`},
            {label:'Fertility Window', val: currentDay >= fertileStart && currentDay <= fertileEnd ? 'Open 🟢' : 'Closed'},
          ].map((b,i) => (
            <div key={i} className="px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/40">{b.label}</p>
              <p className="text-sm font-black text-white">{b.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Day Selector Slider ── */}
      <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Neural Cycle Navigator</p>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Explore Any Day</h3>
          </div>
          <span className="text-5xl">{phase.emoji}</span>
        </div>
        <input type="range" min="1" max="28" value={currentDay}
          onChange={e => { setCurrentDay(+e.target.value); setAnimatedDay(+e.target.value); setAiInsight(''); setShowAIPanel(false); }}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{background:`linear-gradient(90deg, ${phase.color} ${((currentDay-1)/27)*100}%, #e2e8f0 0%)`}}
        />
        <div className="flex justify-between mt-2">
          {PHASES.map(p => (
            <div key={p.id} className="text-center">
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{p.label}</div>
              <div className="text-[8px] text-slate-300">{p.days}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-col: Phase details + Stats ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Phase Deep Dive */}
        <div className="bg-slate-950 rounded-[36px] text-white p-8 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-30"
            style={{background:phase.color}}/>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{color:phase.color}}>
              {phase.sub} · {phase.moon}
            </p>
            <h3 className="text-3xl font-black italic tracking-tighter">{phase.label} Phase</h3>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">{phase.desc}</p>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Best Yoga</p>
              <p className="text-xs font-bold text-white/80">{phase.yoga}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Prince Tip</p>
              <p className="text-xs font-bold text-white/80">{phase.tip}</p>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">Power Foods</p>
            <div className="flex flex-wrap gap-2">
              {phase.foods.map((f,i) => (
                <span key={i} className="px-3 py-1.5 bg-white/10 rounded-xl text-xs font-bold text-white border border-white/10">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Energy & Mood Stats */}
        <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-8 space-y-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Neural Vitality Index</p>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Phase Metrics</h3>
          </div>
          <StatBar label="Energy Level" val={phase.energy} color={phase.color}/>
          <StatBar label="Mood Score" val={phase.mood} color="#8a2be2"/>
          <StatBar label="Focus & Clarity" val={phase.focus} color="#00b4d8"/>
          <StatBar label="Creative Flow" val={phase.creativity} color="#ff8c00"/>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label:'Common Signs', items: phase.symptoms.slice(0,3) },
            ].map((g,i) => (
              <div key={i} className="col-span-2 space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{g.label}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s,j) => (
                    <span key={j} className="text-xs font-bold px-3 py-1.5 rounded-xl border"
                      style={{borderColor:`${phase.color}40`, color:phase.color, backgroundColor:`${phase.color}10`}}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hormone Wave Chart ── */}
      <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Endocrine Intelligence</p>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Live Hormone Waves</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {HORMONES.map(h => (
              <button key={h.key} onClick={() => toggleHormone(h.key)}
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2"
                style={{
                  borderColor: activeHormones.includes(h.key) ? h.color : '#e2e8f0',
                  backgroundColor: activeHormones.includes(h.key) ? `${h.color}15` : 'transparent',
                  color: activeHormones.includes(h.key) ? h.color : '#94a3b8',
                }}>
                {h.label}
              </button>
            ))}
          </div>
        </div>
        <HormoneChart activeHormones={activeHormones} currentDay={currentDay}/>
        <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span>▐ Menstrual</span><span>▐ Follicular</span><span>▐ Ovulation</span><span>▐ Luteal</span>
        </div>
      </div>

      {/* ── 28-day calendar strip ── */}
      <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-8">
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Neural Calendar</p>
          <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">28-Day Cycle Map</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="text-center text-[7px] font-black text-slate-300 uppercase tracking-widest pb-1">{d}</div>
          ))}
          {Array.from({length:28},(_,i)=>{
            const day = i+1;
            const ph = getPhase(day);
            const isOv = day===ovDay;
            const isFertile = day>=fertileStart && day<=fertileEnd;
            const isCurrent = day===currentDay;
            return (
              <button key={day} onClick={()=>{setCurrentDay(day);setAnimatedDay(day);setAiInsight('');setShowAIPanel(false);}}
                className={`relative h-12 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-110 ${
                  isCurrent ? 'scale-110 shadow-xl ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: isCurrent ? ph.color : `${ph.color}18`,
                  color: isCurrent ? 'white' : ph.color,
                  ringColor: ph.color,
                }}>
                <span className="text-[10px] font-black leading-none">{day}</span>
                {isOv && <span className="text-[6px] mt-0.5">🌕</span>}
                {isFertile && !isOv && <span className="text-[6px] mt-0.5">💚</span>}
              </button>
            );
          })}
        </div>
        <div className="flex gap-6 mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest flex-wrap">
          <span>🌕 Ovulation</span><span>💚 Fertile Window</span>
          {PHASES.map(p=><span key={p.id} style={{color:p.color}}>■ {p.label}</span>)}
        </div>
      </div>

      {/* ── Symptom Constellation ── */}
      <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-8 space-y-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Symptom Mapper</p>
          <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">How Are You Feeling?</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Select all that apply — your AI insight will personalize to these signals</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SYMPTOMS.map(s => (
            <button key={s} onClick={() => toggleSymptom(s)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border-2 hover:scale-105 ${
                selectedSymptoms.includes(s)
                  ? 'text-white border-transparent shadow-lg'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-[#ff2d95]/30'
              }`}
              style={selectedSymptoms.includes(s)?{backgroundColor:phase.color,boxShadow:`0 4px 15px ${phase.color}40`}:{}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Gemini AI Neural Insight ── */}
      <div className="rounded-[36px] overflow-hidden shadow-2xl"
        style={{background:`linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0d1117 100%)`}}>
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff2d95] mb-1">Princess Neural · Gemini AI</p>
              <h3 className="text-3xl font-black text-white italic tracking-tighter">Your Neural Cycle Insight</h3>
              <p className="text-white/40 text-sm mt-1">Personalized to Day {currentDay} + {selectedSymptoms.length} logged symptoms</p>
            </div>
            <button onClick={fetchAIInsight} disabled={loadingAI}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50"
              style={{background:`linear-gradient(135deg, ${phase.color}, #8a2be2)`, color:'white', boxShadow:`0 8px 30px ${phase.color}50`}}>
              {loadingAI
                ? <><RefreshCw size={16} className="animate-spin"/> Generating...</>
                : <><Sparkles size={16}/> Generate AI Insight</>
              }
            </button>
          </div>

          {showAIPanel && (
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {loadingAI ? (
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i=>(
                      <div key={i} className="w-2.5 h-2.5 rounded-full animate-bounce" style={{backgroundColor:phase.color, animationDelay:`${i*150}ms`}}/>
                    ))}
                  </div>
                  <p className="text-white/50 text-sm font-medium">Princess Neural is analyzing your cycle signals…</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{phase.emoji}</span>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Princess Neural says</p>
                      <p className="text-xs font-bold" style={{color:phase.color}}>Day {currentDay} · {phase.label} Phase</p>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed font-medium whitespace-pre-line">{aiInsight}</p>
                </div>
              )}
            </div>
          )}

          {!showAIPanel && (
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <Brain className="text-[#ff2d95]" size={28}/>
              <div>
                <p className="text-white/60 font-medium text-sm">Tap <strong className="text-white">Generate AI Insight</strong> to receive a personalized neural cycle analysis powered by Google Gemini.</p>
                <p className="text-white/30 text-xs mt-1">Adapts to your current phase + logged symptoms</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CycleInsights;
