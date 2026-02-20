import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, UserCheck, Shield, Activity, Eye, EyeOff, Droplets, Moon, Heart } from 'lucide-react';

const ROLES = [
  { id: 'CUSTOMER', label: 'Customer', icon: <UserCheck size={16} />, desc: 'Track your wellness', color: '#ff2d95' },
  { id: 'PRODUCER', label: 'Producer', icon: <Activity size={16} />, desc: 'Manage products', color: '#8a2be2' },
  { id: 'ADMIN',    label: 'Pragnya', icon: <Shield size={16} />,    desc: 'System control', color: '#00f5ff' },
];

/* Floating animated stat pill */
const StatPill = ({ icon, value, label, delay = '0s' }) => (
  <div
    className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-xl border border-pink-100"
    style={{ animation: `float 4s ease-in-out infinite`, animationDelay: delay }}
  >
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm font-black text-slate-900 leading-none">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  </div>
);

/* Animated background blob */
const Blob = ({ style }) => (
  <div className="absolute rounded-full blur-[120px] pointer-events-none aura-blob" style={style} />
);

const Login = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('CUSTOMER');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats]       = useState({ users: 1284, cycles: 8421, sensors: 9, activeNow: 5 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { healthService } = require('../services/api');
        const res = await healthService.getPublicStats();
        setStats(res.data);
      } catch (e) {}
    };

    fetchStats();
    const id = setInterval(fetchStats, 10000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate auth
    onLogin({ name: email.split('@')[0], email, role, lunaCoins: 1250 });
    setIsLoading(false);
  };

  const selectedRole = ROLES.find(r => r.id === role);

  return (
    <div className="min-h-screen w-full flex bg-[#fff0f5] overflow-hidden font-sans relative">

      {/* ── Background blobs (same as dashboard) ── */}
      <Blob style={{ width: 600, height: 600, background: '#ff2d95', opacity: 0.07, top: '-10%', left: '-5%' }} />
      <Blob style={{ width: 500, height: 500, background: '#8a2be2', opacity: 0.06, bottom: '-10%', right: '-5%', animationDelay:'3s' }} />
      <Blob style={{ width: 300, height: 300, background: '#00f5ff', opacity: 0.05, top: '40%', right: '20%', animationDelay:'6s' }} />

      {/* ════════ LEFT PANEL — Brand Story ════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] p-16 relative z-10">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-white shadow-2xl shadow-pink-200/60 flex items-center justify-center border border-pink-100">
            <img src="/chatbot.jpg" alt="Prince Care" className="w-10 h-10 rounded-2xl object-cover" onError={e => { e.target.style.display='none'; }} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 tracking-tighter">Prince Care</p>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff2d95]">Neural Health Platform</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="space-y-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-pink-100">
            <Sparkles size={14} className="text-[#ff2d95] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff2d95]">Prince Core v2.0 — IIT Edition</span>
          </div>

          <h1 className="text-7xl font-black leading-[0.88] tracking-tighter text-slate-900 uppercase italic">
            Menstrual<br />
            <span style={{ background:'linear-gradient(135deg,#ff2d95,#8a2be2,#00b4d8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundSize:'200% auto', animation:'text-shine 4s linear infinite' }}>
              Health.
            </span>
          </h1>

          <p className="text-slate-400 text-lg font-medium leading-relaxed border-l-4 border-[#ff2d95] pl-6 max-w-sm">
            Hygiene is a right, not a luxury.<br />
            <span className="font-black text-slate-600">Breaking the silence, together.</span>
          </p>

          <div className="flex flex-wrap gap-3">
            {['#AllAreEqual','#MenstruationIsNotATaboo','#PrincessPower'].map(tag => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-[#ff2d95] bg-white px-4 py-2 rounded-full border border-pink-100 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Live stats row */}
        <div className="space-y-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Live Platform Stats</p>
          <div className="flex flex-wrap gap-3">
            <StatPill icon="🌸" value={stats.users.toLocaleString()} label="Registered users" delay="0s" />
            <StatPill icon="🌙" value={stats.cycles.toLocaleString()} label="Cycles tracked" delay="1.3s" />
            <StatPill icon="📡" value={`${stats.sensors} sensors`} label="IoT nodes live" delay="2.6s" />
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-xl border border-emerald-100 animate-pulse">
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
               <div>
                 <p className="text-sm font-black text-slate-900 leading-none">{stats.activeNow}</p>
                 <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Active Now</p>
               </div>
            </div>
          </div>

          {/* Feature strip */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: <Moon size={18}/>, label: 'Cycle AI', color: '#ff2d95' },
              { icon: <Droplets size={18}/>, label: 'Smart Washroom', color: '#00b4d8' },
              { icon: <Heart size={18}/>, label: 'Wellness Hub', color: '#8a2be2' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-md">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:`${f.color}15`, color: f.color }}>{f.icon}</div>
                <span className="text-xs font-black text-slate-700">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ RIGHT PANEL — Login Card ════════ */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-[44px] shadow-2xl shadow-pink-200/40 border border-pink-50 p-10 space-y-8 relative overflow-hidden">

            {/* Glow top-right */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20"
              style={{ background: selectedRole?.color || '#ff2d95', transform:'translate(30%,-30%)' }} />

            {/* Header */}
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95] mb-1">Empowerment Portal</p>
              <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">
                Welcome<br />Back.
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-2">Sign in to your Prince Care dashboard</p>
            </div>

            {/* Role selector — matching dashboard tab style */}
            <div className="relative z-10 bg-slate-50 rounded-2xl p-1.5 flex gap-1.5 border border-slate-100">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-500 flex flex-col items-center gap-1.5 ${
                    role === r.id
                      ? 'bg-white shadow-lg text-slate-900 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  style={role === r.id ? { color: r.color, borderBottom: `2px solid ${r.color}` } : {}}
                >
                  <span style={{ color: role === r.id ? r.color : undefined }}>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#ff2d95]/50 rounded-2xl px-12 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none transition-all duration-300"
                  placeholder="your@email.com"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#ff2d95]/50 rounded-2xl px-12 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none transition-all duration-300"
                  placeholder="••••••••••"
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#ff2d95] transition-colors"
                >
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              {/* Role description pill */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
                style={{ borderColor:`${selectedRole?.color}30`, background:`${selectedRole?.color}08` }}>
                <span style={{ color: selectedRole?.color }}>{selectedRole?.icon}</span>
                <p className="text-xs font-bold" style={{ color: selectedRole?.color }}>
                  Signing in as <strong>{selectedRole?.label}</strong> — {selectedRole?.desc}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all duration-500 disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${selectedRole?.color}, #8a2be2)`,
                  boxShadow: `0 8px 30px ${selectedRole?.color}40`
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    Launch Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Prince Care © 2026</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">System Online</span>
              </div>
            </div>
          </div>

          {/* Below-card note */}
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-300 mt-6">
            Protected by Prince Care Neural Security · Enter any credentials to access
          </p>
        </div>
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default Login;
