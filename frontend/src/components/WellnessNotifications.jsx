import React, { useState, useEffect } from 'react';

/* ─── palette ─── */
const P = { pink: '#ff2d95', purple: '#8a2be2', cyan: '#00f5ff', gold: '#ffd700', dark: '#0f0f1a' };

/* ─── Circular Ring Progress ─── */
const RingChart = ({ pct, size = 120, stroke = 10, color, children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">{children}</div>
    </div>
  );
};

/* ─── Wave SVG for water ─── */
const WaveBar = ({ pct, color }) => (
  <div className="relative w-full h-36 rounded-3xl overflow-hidden bg-blue-50 border border-blue-100">
    <div
      className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
      style={{ height: `${pct * 100}%`, background: `linear-gradient(180deg, ${color}88, ${color})` }}
    >
      <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full absolute -top-5 left-0">
        <path
          d="M0,20 C100,0 200,40 300,20 C350,10 370,25 400,20 L400,40 L0,40 Z"
          fill={color} opacity="0.9"
        >
          <animateTransform attributeName="transform" type="translate" from="-400 0" to="0 0"
            dur="2.5s" repeatCount="indefinite" />
        </path>
        <path
          d="M0,25 C80,5 180,45 300,25 C350,15 380,30 400,25 L400,40 L0,40 Z"
          fill={color} opacity="0.5"
        >
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-400 0"
            dur="3.5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center z-10">
        <p className="text-4xl font-black text-white drop-shadow-lg">{Math.round(pct * 8)}<span className="text-xl"> / 8</span></p>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/80">glasses today</p>
      </div>
    </div>
  </div>
);

/* ─── Mini bar chart ─── */
const BarChart = ({ data, color, height = 80 }) => {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div className="flex items-end gap-1.5 w-full" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-xl transition-all duration-700 flex-shrink-0"
            style={{ height: `${(d.val / max) * (height - 20)}px`, backgroundColor: i === data.length - 1 ? color : `${color}66` }} />
          <span className="text-[7px] font-black text-slate-400 uppercase">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Pulse dot ─── */
const PulseDot = ({ color }) => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
    <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: color }} />
  </span>
);

/* ─── Notification card ─── */
const NotiCard = ({ icon, title, time, msg, color, urgent }) => (
  <div className={`flex items-start gap-4 p-5 rounded-3xl border transition-all hover:scale-[1.01] cursor-default ${
    urgent ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'
  } shadow-sm`}>
    <div className="text-3xl flex-shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-black text-slate-900 leading-none">{title}</p>
        {urgent && <PulseDot color="#ef4444" />}
      </div>
      <p className="text-slate-500 text-xs mt-1 font-medium">{msg}</p>
    </div>
    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex-shrink-0">{time}</p>
  </div>
);

/* ─── Sleep arc ─── */
const SleepArc = ({ hrs }) => {
  const idealHrs = 8;
  const pct = Math.min(hrs / idealHrs, 1);
  return (
    <RingChart pct={pct} size={140} stroke={12} color={pct >= 0.875 ? '#22c55e' : pct >= 0.625 ? '#f59e0b' : '#ef4444'}>
      <span className="text-3xl font-black text-slate-900">{hrs}h</span>
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">sleep</span>
    </RingChart>
  );
};

/* ─── Food timeline item ─── */
const FoodItem = ({ emoji, meal, time, cal, img, color }) => (
  <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-pink-100 transition-all group">
    <div
      className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 group-hover:scale-110 transition-transform"
      style={{ borderColor: color }}
    >
      <img src={img} alt={meal} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML = `<span class="text-3xl flex items-center justify-center w-full h-full">${emoji}</span>`; }} />
    </div>
    <div className="flex-1">
      <p className="font-black text-slate-900 text-sm">{meal}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{time}</p>
    </div>
    <div className="text-right">
      <p className="font-black text-slate-900" style={{ color }}>{cal}</p>
      <p className="text-[9px] text-slate-400 font-bold uppercase">kcal</p>
    </div>
  </div>
);

/* ══════════════════ Main Component ══════════════════ */
const WellnessNotifications = ({ profilePhoto, userName }) => {
  const [steps, setSteps]       = useState(6240);
  const [water, setWater]       = useState(5);
  const [screen, setScreen]     = useState(3.2);
  const [sleep]                 = useState(6.5);

  /* Live-ish step & screen counter */
  useEffect(() => {
    const id = setInterval(() => {
      setSteps(s => s + Math.floor(Math.random() * 8));
      setScreen(s => +(s + 0.001).toFixed(3));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const stepPct    = Math.min(steps / 10000, 1);
  const waterPct   = Math.min(water / 8, 1);
  const screenPct  = Math.min(screen / 8, 1);

  const weekSteps = [
    { label: 'Mon', val: 8200 }, { label: 'Tue', val: 6400 }, { label: 'Wed', val: 9100 },
    { label: 'Thu', val: 5300 }, { label: 'Fri', val: 7600 }, { label: 'Sat', val: 4100 },
    { label: 'Sun', val: steps },
  ];

  const screenData = [
    { label: '6am', val: 0.3 }, { label: '9am', val: 1.1 }, { label: '12p', val: 0.7 },
    { label: '3pm', val: 0.5 }, { label: '6pm', val: 0.8 }, { label: '9pm', val: screen },
  ];

  const notifications = [
    { icon: '🦵', title: 'Time to Walk!', time: '2m ago', msg: "You've been sitting for 45 min. Take a 5-min walk to boost circulation.", color: P.pink, urgent: true },
    { icon: '💧', title: 'Hydration Reminder', time: '18m ago', msg: 'Drink a glass of water now — you\'re at Glass 5. Goal: 8 glasses.', color: '#00b4d8', urgent: false },
    { icon: '🌙', title: 'Wind Down Mode', time: '1h ago', msg: 'Sleep target is 10:30 PM. Reduce screen brightness and relax.', color: P.purple, urgent: false },
    { icon: '🍎', title: 'Lunch Reminder', time: '2h ago', msg: 'You haven\'t logged lunch! Balanced nutrition keeps your cycle healthy.', color: '#22c55e', urgent: false },
    { icon: '📱', title: 'Screen Time Alert', time: '3h ago', msg: `You've used your phone ${screen.toFixed(1)}h today. Consider digital detox.`, color: '#f59e0b', urgent: screen > 4 },
    { icon: '🏃', title: 'Step Goal Progress', time: '4h ago', msg: `${steps.toLocaleString()} / 10,000 steps — keep going! You're ${Math.round(stepPct * 100)}% there.`, color: P.pink, urgent: false },
  ];

  const foods = [
    { emoji: '🍳', meal: 'Breakfast — Oats + Banana', time: '7:30 AM', cal: 320, color: '#f59e0b',
      img: 'https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=80&h=80&fit=crop' },
    { emoji: '🍲', meal: 'Lunch — Dal Rice + Salad', time: '1:15 PM', cal: 520, color: '#22c55e',
      img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&h=80&fit=crop' },
    { emoji: '🍌', meal: 'Snack — Banana + Almonds', time: '4:00 PM', cal: 180, color: '#eab308',
      img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=80&h=80&fit=crop' },
    { emoji: '🥘', meal: 'Dinner — Chapati + Sabzi', time: '8:30 PM', cal: 450, color: '#ff2d95',
      img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=80&h=80&fit=crop' },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff2d95] mb-1">Prince Care · Daily Wellness</p>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
            Your Body.<br />
            <span className="text-[#ff2d95]">Live Insights.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 text-sm">
            Live notifications, health analytics & daily goals — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        {/* Profile greeting card */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-[28px] border border-pink-100 shadow-xl">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#ff2d95]/30 flex-shrink-0 shadow-md">
            <img
              src={profilePhoto || '/chatbot.jpg'}
              alt={userName || 'User'}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = '/chatbot.jpg'; }}
            />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Wellness Report for</p>
            <p className="text-xl font-black text-slate-900 capitalize tracking-tight">{userName || 'Princess'}</p>
            <p className="text-[9px] font-black text-[#ff2d95] uppercase tracking-widest mt-0.5">Prince Care Member</p>
          </div>
        </div>
      </div>

      {/* ── Top metric row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Steps Today', val: steps.toLocaleString(), sub: '/ 10,000', icon: '🦵', color: P.pink },
          { label: 'Water Intake', val: `${water} / 8`, sub: 'glasses', icon: '💧', color: '#00b4d8' },
          { label: 'Sleep Last Night', val: `${sleep}h`, sub: '/ 8h ideal', icon: '🌙', color: P.purple },
          { label: 'Screen Time', val: `${screen.toFixed(1)}h`, sub: 'today', icon: '📱', color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} className="p-6 bg-white rounded-[28px] border border-slate-100 shadow-lg flex items-center gap-4 hover:shadow-xl transition-all">
            <div className="text-3xl">{m.icon}</div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
              <p className="text-2xl font-black italic tracking-tighter" style={{ color: m.color }}>{m.val}</p>
              <p className="text-[9px] font-bold text-slate-400">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Steps + Water ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Steps Card */}
        <div className="p-8 bg-white rounded-[36px] border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Daily Movement</p>
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Step Counter</h3>
            </div>
            <PulseDot color={P.pink} />
          </div>
          <div className="flex items-center gap-8">
            <RingChart pct={stepPct} size={130} stroke={12} color={P.pink}>
              <span className="text-2xl font-black text-slate-900 leading-none">{Math.round(stepPct * 100)}%</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">goal</span>
            </RingChart>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-4xl font-black text-slate-900 italic tabular-nums">{steps.toLocaleString()}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">steps today</p>
              </div>
              <div className="space-y-1.5">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${stepPct * 100}%`, background: `linear-gradient(90deg, ${P.pink}, ${P.purple})` }} />
                </div>
                <p className="text-[9px] font-black text-slate-400">{(10000 - steps).toLocaleString()} steps to goal 🏁</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-pink-50 rounded-2xl p-3"><p className="text-lg font-black text-[#ff2d95]">~{Math.round(steps * 0.0008)} km</p><p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Distance</p></div>
                <div className="bg-purple-50 rounded-2xl p-3"><p className="text-lg font-black text-[#8a2be2]">{Math.round(steps * 0.04)} kcal</p><p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Burned</p></div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">This Week</p>
            <BarChart data={weekSteps} color={P.pink} height={70} />
          </div>
        </div>

        {/* Water Card */}
        <div className="p-8 bg-white rounded-[36px] border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00b4d8]">Hydration Tracker</p>
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Water Intake</h3>
            </div>
            <span className="text-2xl animate-bounce">💧</span>
          </div>
          <WaveBar pct={waterPct} color="#0096c7" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                onClick={() => setWater(i + 1)}
                className={`h-12 rounded-2xl font-black text-xs transition-all border-2 ${
                  i < water
                    ? 'bg-[#00b4d8] text-white border-[#00b4d8] shadow-lg scale-105'
                    : 'bg-blue-50 text-blue-300 border-blue-100 hover:border-[#00b4d8]/40'
                }`}
              >
                💧
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">Tap a glass to log intake</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Logged', val: `${water} glasses` },
              { label: 'Remaining', val: `${Math.max(0, 8 - water)} glasses` },
              { label: 'Streak', val: '5 days 🔥' },
            ].map((s, i) => (
              <div key={i} className="bg-blue-50 rounded-2xl p-3">
                <p className="text-base font-black text-[#00b4d8]">{s.val}</p>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sleep + Screen Time ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Sleep */}
        <div className="p-8 bg-slate-950 rounded-[36px] text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[120px] opacity-20" style={{ background: P.purple }} />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Neural Rest Analysis</p>
            <h3 className="text-2xl font-black italic tracking-tighter">Sleep Quality</h3>
          </div>
          <div className="flex items-center gap-8 relative z-10">
            <SleepArc hrs={sleep} />
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-5xl font-black italic">{sleep}h</p>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">last night</p>
              </div>
              <div className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest inline-block ${
                sleep >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
                sleep >= 5 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {sleep >= 7 ? '✅ Optimal Rest' : sleep >= 5 ? '⚠ Light Sleep' : '❌ Sleep Debt'}
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Bed Time', val: '11:30 PM', icon: '🛏' },
                  { label: 'Wake Time', val: '6:00 AM', icon: '⏰' },
                  { label: 'Deep Sleep', val: '1.8h', icon: '🌊' },
                  { label: 'REM Cycles', val: '4', icon: '🧠' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs text-white/50">{s.icon} {s.label}</span>
                    <span className="text-xs font-black">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">Recommendation</p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm font-medium text-white/70">
                💡 Aim to sleep by <strong className="text-white">10:30 PM</strong> tonight for optimal cycle health. Avoid screens 1 hour before bed.
              </p>
            </div>
          </div>
        </div>

        {/* Screen Time */}
        <div className="p-8 bg-white rounded-[36px] border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Digital Wellness</p>
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Screen Time</h3>
            </div>
            <span className="text-2xl">📱</span>
          </div>
          <div className="flex items-center gap-6">
            <RingChart pct={screenPct} size={120} stroke={12} color={screenPct > 0.6 ? '#ef4444' : '#f59e0b'}>
              <span className="text-2xl font-black text-slate-900">{screen.toFixed(1)}h</span>
              <span className="text-[8px] font-black text-slate-400 uppercase">used</span>
            </RingChart>
            <div className="flex-1 space-y-3">
              {[
                { app: '📸 Instagram', time: '52m', color: '#e040fb' },
                { app: '▶ YouTube', time: '1h 10m', color: '#ef4444' },
                { app: '💬 WhatsApp', time: '38m', color: '#22c55e' },
                { app: '📖 Reading', time: '20m', color: '#00b4d8' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700 flex-1">{a.app}</span>
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(i === 1 ? 70 : i === 0 ? 52 : i === 2 ? 38 : 20) / 80 * 100}%`, backgroundColor: a.color }} />
                  </div>
                  <span className="text-xs font-black text-slate-500 w-14 text-right tabular-nums">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Usage by Hour</p>
            <BarChart data={screenData} color="#f59e0b" height={70} />
          </div>
          {screenPct > 0.5 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-xs font-bold text-amber-700">High screen time detected. Take a 20-min break to protect your eyes and mental wellness.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Food Intake Timeline ── */}
      <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Nutrition Log</p>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Food Intake Today</h3>
          </div>
          <div className="px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-sm font-black text-emerald-700">1,470 <span className="text-xs font-bold">kcal total</span></p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {foods.map((f, i) => <FoodItem key={i} {...f} />)}
        </div>
        {/* Macro breakdown */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Macro Breakdown</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Carbs', val: '58%', pct: 0.58, color: '#f59e0b' },
              { label: 'Protein', val: '22%', pct: 0.22, color: '#ff2d95' },
              { label: 'Fats', val: '20%', pct: 0.20, color: '#8a2be2' },
            ].map((m, i) => (
              <div key={i} className="text-center space-y-2">
                <RingChart pct={m.pct} size={80} stroke={8} color={m.color}>
                  <span className="text-xs font-black text-slate-700">{m.val}</span>
                </RingChart>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notification Feed ── */}
      <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Neural Alerts</p>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Wellness Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <PulseDot color={P.pink} />
            <span className="text-[9px] font-black text-[#ff2d95] uppercase tracking-widest">Live</span>
          </div>
        </div>
        <div className="space-y-3">
          {notifications.map((n, i) => <NotiCard key={i} {...n} />)}
        </div>
      </div>
    </div>
  );
};

export default WellnessNotifications;
