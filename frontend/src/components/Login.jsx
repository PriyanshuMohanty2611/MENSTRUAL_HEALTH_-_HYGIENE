import React, { useState, useEffect } from 'react';
import { Mail, Lock, Linkedin, MessageCircle, ArrowRight, Sparkles, UserCheck, Shield, Activity } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [stats, setStats] = useState({ active: 2, total: 3 });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(s => ({ 
        ...s, 
        active: Math.max(1, s.active + Math.floor(Math.random() * 2) - 1),
        total: s.total + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: email.split('@')[0], email, role, lunaCoins: 1250 });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0d0221] text-white">
      {/* Organic Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#ff2d95] aura-blob opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#8a2be2] aura-blob opacity-10 [animation-delay:2s]"></div>
      <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-[#00f5ff] aura-blob opacity-10 [animation-delay:4s]"></div>

      <div className="container max-w-6xl px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Empowerment Vision */}
        <div className="hidden lg:block space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="text-[#ff2d95] animate-pulse" size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#ff2d95]">Prince Core v2.0</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
              Menstrual <br />
              <span className="text-empower">Health.</span>
            </h1>
            <p className="text-white/40 text-xl font-medium max-w-md uppercase tracking-widest leading-relaxed border-l-4 border-[#ff2d95] pl-6">
              Hygiene is a right, not a luxury. <br />
              Breaking the silence, together.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <span className="text-[10px] font-black text-[#ff2d95] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">#allareequal</span>
              <span className="text-[10px] font-black text-[#ff2d95] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">#menstrautionisnotataboo</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-12">
            <div className="space-y-2">
              <p className="text-4xl font-black text-white italic">{stats.active}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Active Users</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-white italic">{stats.total}+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Logins</p>
            </div>
          </div>
        </div>

        {/* Right Side: Ethereal Login Card */}
        <div className="relative group">
          {/* Glowing Aura behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#ff2d95] via-[#8a2be2] to-[#00f5ff] rounded-[60px] blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          
          <div className="ethereal-glass rounded-[50px] p-12 lg:p-16 border-white/10 shadow-[0_0_50px_rgba(255,45,149,0.1)] relative overflow-hidden bg-white/5 backdrop-blur-[60px]">
             {/* Header */}
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase italic">Initialize</h2>
              <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Empowerment Portal / Luna 2.0</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Role Selector - Ultra Premium */}
              <div className="flex p-2 bg-white/5 rounded-3xl gap-2 border border-white/5">
                {[
                  { id: 'CUSTOMER', icon: <UserCheck size={14} /> },
                  { id: 'PRODUCER', icon: <Activity size={14} /> },
                  { id: 'ADMIN', icon: <Shield size={14} /> }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex-1 py-4 px-2 rounded-2xl text-[8px] font-black tracking-[0.2em] transition-all duration-700 flex flex-col items-center gap-2 ${
                      role === r.id 
                        ? 'bg-white text-[#ff2d95] shadow-[0_0_20px_white] scale-105' 
                        : 'text-white/30 hover:text-white/60 scale-95'
                    }`}
                  >
                    {r.icon}
                    {r.id === 'ADMIN' ? 'PRAGNYA' : r.id}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="relative group/input">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border-2 border-white/10 focus:border-[#ff2d95]/50 rounded-3xl px-14 py-7 text-sm font-black transition-all outline-none text-white placeholder:text-white/20"
                    placeholder="EMAIL_ADR_SECURE"
                  />
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#ff2d95]/50 group-focus-within/input:text-[#ff2d95]" size={20} />
                </div>

                <div className="relative group/input">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border-2 border-white/10 focus:border-[#ff2d95]/50 rounded-3xl px-14 py-7 text-sm font-black transition-all outline-none text-white placeholder:text-white/20"
                    placeholder="KEY_HASH_PASS"
                  />
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#ff2d95]/50 group-focus-within/input:text-[#ff2d95]" size={20} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-aura z-0 group/btn bg-white text-[#ff2d95] h-20 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_#ff2d95] transition-all"
              >
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Launch Dashboard</span>
                  <ArrowRight size={20} className="group-hover/btn:translate-x-3 transition-transform duration-500" />
                </div>
              </button>
            </form>

            <div className="mt-14">
              <div className="relative flex items-center justify-center mb-10">
                <div className="absolute w-full h-[1px] bg-white/5"></div>
                <span className="relative px-6 bg-transparent text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Link Connect</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-[#0077b5]/20 hover:border-[#0077b5]/50 transition-all group">
                  <Linkedin size={20} className="text-white/40 group-hover:text-[#0077b5]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">LinkedIn</span>
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-[#25d366]/20 hover:border-[#25d366]/50 transition-all group">
                  <MessageCircle size={20} className="text-white/40 group-hover:text-[#25d366]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
