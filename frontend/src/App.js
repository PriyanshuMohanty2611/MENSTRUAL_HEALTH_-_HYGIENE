import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sphere } from '@react-three/drei';
import { 
  Users, Settings, LogOut, ShoppingCart, 
  Calendar, Activity, BookOpen, Bell, Search, 
  Menu, X, Heart, LayoutDashboard, Database, UserCheck, Gift, Wind
} from 'lucide-react';

import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProducerDashboard from './components/ProducerDashboard';
import MedicalChatbot from './components/MedicalChatbot';
import Login from './components/Login';

const AuraSphere = () => (
  <Float speed={2} rotationIntensity={1} floatIntensity={1}>
    <Sphere args={[1.5, 64, 64]}>
      <MeshDistortMaterial
        color="#ff2d95"
        attach="material"
        distort={0.1}
        speed={0.5}
        roughness={0}
        metalness={0.9}
        emissive="#8a2be2"
        emissiveIntensity={0.2}
      />
    </Sphere>
  </Float>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [voucherCount, setVoucherCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem('prince_vouchers') || '[]').length; } catch { return 0; }
  });
  const [showVoucherPanel, setShowVoucherPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDrop, setShowSearchDrop] = useState(false);

  // Extra aliases so typing natural words (period, buy, doctor…) works
  const SEARCH_ALIASES = {
    DASHBOARD: ['dashboard','home','wellness','vitals','health','pulse','overview','grid','main'],
    SHOP:      ['shop','buy','purchase','order','pad','sanitary','product','store','sustainable','eco'],
    TRACKER:   ['tracker','period','cycle','menstrual','ovulation','flow','calendar','date'],
    CONSULT:   ['consult','doctor','appointment','book','clinic','healthcare','dr','physician','schedule'],
    AWARENESS: ['awareness','learn','education','hub','article','knowledge','info','blog'],
    PROFILE:   ['profile','account','bio','name','gender','me','settings','edit','photo','identity'],
    SEARCH:    ['search','find','global','command'],
    USERS:     ['users','community','members','people','staff'],
    IOT:       ['iot','network','device','sensor','device','data'],
    WASHROOM:  ['washroom','bathroom','toilet','iot','sensor','co2','co','no2','moisture','humidity','temperature','loadcell','water','smart','hygiene','air'],
    NOTIFICATIONS: ['notification','notify','alert','wellness','steps','water','sleep','screen','food','fitness','health','reminder','walk','drink'],
    PRODUCTION:['production','metrics','line','factory','output'],
  };

  // Profile state — lifted so navbar updates when bio-data changes
  const [profileName, setProfileName] = useState(
    () => localStorage.getItem('prince_profile_name') || ''
  );
  const [profilePhoto, setProfilePhoto] = useState(
    () => localStorage.getItem('prince_profile_photo') || ''
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const onVouchersUpdated = (e) => setVoucherCount(e.detail ?? 0);
    const onProfileUpdated = (e) => {
      if (e.detail?.name !== undefined) { setProfileName(e.detail.name); localStorage.setItem('prince_profile_name', e.detail.name); }
      if (e.detail?.photo !== undefined) { setProfilePhoto(e.detail.photo); localStorage.setItem('prince_profile_photo', e.detail.photo); }
    };
    window.addEventListener('vouchersUpdated', onVouchersUpdated);
    window.addEventListener('profileUpdated', onProfileUpdated);
    return () => {
      clearInterval(timer);
      window.removeEventListener('vouchersUpdated', onVouchersUpdated);
      window.removeEventListener('profileUpdated', onProfileUpdated);
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const logout = () => {
    setUser(null);
    setActiveTab('DASHBOARD');
  };

  const navItems = {
    ADMIN: [
      { id: 'SEARCH', label: 'Global Search', icon: <Search size={20} /> },
      { id: 'DASHBOARD', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
      { id: 'IOT', label: 'IoT Network', icon: <Database size={20} /> },
      { id: 'USERS', label: 'Community', icon: <Users size={20} /> },
      { id: 'SETTINGS', label: 'System Settings', icon: <Settings size={20} /> },
    ],
    PRODUCER: [
      { id: 'DASHBOARD', label: 'Creation Hub', icon: <LayoutDashboard size={20} /> },
      { id: 'PRODUCTION', label: 'Line Metrics', icon: <Activity size={20} /> },
      { id: 'AWARENESS', label: 'Impact Portal', icon: <BookOpen size={20} /> },
    ],
    CUSTOMER: [
      { id: 'SEARCH', label: 'Global Search', icon: <Search size={20} /> },
      { id: 'DASHBOARD', label: 'My Wellness', icon: <LayoutDashboard size={20} /> },
      { id: 'SHOP', label: 'Sustainable Shop', icon: <ShoppingCart size={20} /> },
      { id: 'TRACKER', label: 'Cycle Insights', icon: <Activity size={20} /> },
      { id: 'CONSULT', label: 'Healthcare', icon: <Calendar size={20} /> },
      { id: 'AWARENESS', label: 'Awareness Hub', icon: <BookOpen size={20} /> },
      { id: 'WASHROOM', label: 'Smart Washroom', icon: <Wind size={20} /> },
      { id: 'NOTIFICATIONS', label: 'Wellness Alerts', icon: <Bell size={20} /> },
      { id: 'PROFILE', label: 'Profile Grid', icon: <UserCheck size={20} /> },
    ],
  };

  const renderActivePortal = () => {
    switch (user.role) {
      case 'ADMIN': return <AdminDashboard activeTab={activeTab} />;
      case 'PRODUCER': return <ProducerDashboard activeTab={activeTab} />;
      case 'CUSTOMER': return (
        <CustomerDashboard
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          profileName={profileName}
          profilePhoto={profilePhoto}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-screen max-w-[100vw] bg-[#fff0f5] overflow-hidden font-sans text-slate-900 selection:bg-[#ff2d95] selection:text-white" style={{position:'fixed',top:0,left:0,right:0,bottom:0}}>
      {/* 3D Aura Background */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <AuraSphere />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8a2be2] aura-blob opacity-20 pointer-events-none" style={{ animation: 'none' }} />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00f5ff] aura-blob opacity-10 pointer-events-none" style={{ animation: 'none' }} />

      {/* ── SIDEBAR (static, never scrolls) ─────────────────────────────── */}
      <aside className={`relative z-50 flex-shrink-0 ${isSidebarOpen ? 'w-80' : 'w-24'} flex flex-col ethereal-glass border-r border-pink-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] m-6 rounded-[40px] bg-white/60 backdrop-blur-[40px] shadow-2xl shadow-pink-200/50 overflow-hidden`}>
        <div className={`p-6 flex-shrink-0 ${isSidebarOpen ? 'flex items-center gap-4' : 'flex justify-center'}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff2d95] to-[#8a2be2] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
            <Heart size={24} fill="white" className="text-white" />
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tighter">Prince Care</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2d95] mt-1">Prince Core v2.0</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-8 overflow-y-auto no-scrollbar">
          {navItems[user.role].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center transition-all duration-500 relative group overflow-hidden ${
                isSidebarOpen 
                  ? 'w-full gap-4 p-5 px-6 rounded-3xl' 
                  : 'w-16 h-16 justify-center rounded-2xl mx-auto my-1'
              } ${
                activeTab === item.id 
                  ? 'text-white' 
                  : 'text-slate-600 hover:text-[#ff2d95]'
              }`}
            >
              <div className={`relative z-10 transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:rotate-12'}`}>
                {item.icon}
              </div>
              {isSidebarOpen && <span className="relative z-10 font-bold text-sm tracking-tight">{item.label}</span>}
              {activeTab === item.id && (
                <div className={`absolute inset-0 bg-[#ff2d95] shadow-[0_10px_20px_rgba(255,45,149,0.3)] transition-all duration-500 ${isSidebarOpen ? 'rounded-3xl' : 'rounded-2xl'} animate-in zoom-in-95 duration-500`} />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto flex-shrink-0">
          {isSidebarOpen && (
            <div className="bg-gradient-to-br from-[#ff2d95] to-[#8a2be2] p-6 rounded-[32px] text-white space-y-4 shadow-2xl shadow-pink-500/20 animate-in fade-in zoom-in-95 duration-500">
               <div className="flex items-center gap-3">
                 {/* Profile photo synced from Profile Grid */}
                 <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white/40 flex-shrink-0 shadow-md">
                   <img
                     src={profilePhoto || '/chatbot.jpg'}
                     alt={user?.name || 'User'}
                     className="w-full h-full object-cover"
                     onError={e => { e.target.src = '/chatbot.jpg'; }}
                   />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none text-white/90 font-sans">{profileName || user?.name || 'Prince User'}</span>
               </div>
               <div>
                  <p className="text-xs font-bold text-white/70 uppercase">Radiance Level</p>
                  <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                     <div className="w-[85%] h-full bg-white rounded-full shadow-[0_0_10px_white]" />
                  </div>
               </div>
            </div>
          )}
        <button 
          onClick={logout}
          className={`w-full mt-6 flex items-center ${isSidebarOpen ? 'gap-4 p-5' : 'justify-center p-5'} text-slate-600 hover:text-[#ff2d95] transition-all font-black text-xs uppercase tracking-widest`}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span>Exit Grid</span>}
        </button>
        </div>
      </aside>

      {/* ── MAIN COLUMN (header static, only section scrolls) ───────────── */}
      <main className="flex-1 flex flex-col min-w-0 w-0 relative z-10 overflow-hidden pr-8 py-8">

        {/* HEADER — never scrolls */}
        <header className="flex-shrink-0 flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-4 ethereal-glass rounded-2xl hover:scale-110 transition-transform bg-white/80 border-slate-100 shadow-xl"
            >
              {isSidebarOpen ? <X size={20} className="text-slate-900" /> : <Menu size={20} className="text-slate-900" />}
            </button>
            {/* ── Smart Search Bar ── */}
            <div className="relative lg:w-96 hidden md:block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10"
                style={{ color: searchQuery ? '#ff2d95' : '#cbd5e1' }}
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                placeholder="Access Neural Command..."
                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#ff2d95]/10 focus:border-[#ff2d95]/30 transition-all text-slate-900 placeholder:text-slate-400"
                onChange={e => { setSearchQuery(e.target.value); setShowSearchDrop(true); }}
                onFocus={() => setShowSearchDrop(true)}
                onBlur={() => setTimeout(() => setShowSearchDrop(false), 150)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const q = searchQuery.toLowerCase().trim();
                    if (!q) return;
                    // Find first matching tab
                    const items = navItems[user.role] || [];
                    const match = items.find(item => {
                      const aliases = SEARCH_ALIASES[item.id] || [];
                      return (
                        item.label.toLowerCase().includes(q) ||
                        item.id.toLowerCase().includes(q) ||
                        aliases.some(a => a.includes(q) || q.includes(a))
                      );
                    });
                    if (match) { setActiveTab(match.id); setSearchQuery(''); setShowSearchDrop(false); }
                  }
                  if (e.key === 'Escape') { setSearchQuery(''); setShowSearchDrop(false); }
                }}
              />

              {/* Dropdown suggestions */}
              {showSearchDrop && searchQuery.trim() && (() => {
                const q = searchQuery.toLowerCase();
                const items = navItems[user.role] || [];
                const matches = items.filter(item => {
                  const aliases = SEARCH_ALIASES[item.id] || [];
                  return (
                    item.label.toLowerCase().includes(q) ||
                    item.id.toLowerCase().includes(q) ||
                    aliases.some(a => a.includes(q) || q.includes(a))
                  );
                });
                if (!matches.length) return (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-[500]">
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest text-center">No pages match "{searchQuery}"</p>
                  </div>
                );
                return (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[500] animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Navigate To</p>
                    </div>
                    {matches.map(item => (
                      <button
                        key={item.id}
                        onMouseDown={() => { setActiveTab(item.id); setSearchQuery(''); setShowSearchDrop(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-pink-50 transition-colors text-left group ${
                          activeTab === item.id ? 'bg-pink-50' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${
                          activeTab === item.id
                            ? 'bg-[#ff2d95] text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-[#ff2d95]/10 group-hover:text-[#ff2d95]'
                        } transition-colors`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">{item.label}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                        </div>
                        {activeTab === item.id && (
                          <span className="ml-auto text-[8px] font-black uppercase tracking-widest text-[#ff2d95] bg-pink-50 px-2 py-1 rounded-full border border-pink-100">
                            Current
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff2d95]">Neural Sync</p>
              <p className="text-xl font-black text-slate-900 tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>

            {user.role === 'CUSTOMER' && (
              <div className="relative">
                <button
                  onClick={() => { setShowVoucherPanel(v => !v); setActiveTab('SHOP'); }}
                  className="relative p-4 ethereal-glass rounded-2xl hover:scale-105 transition-transform bg-white/80 border border-yellow-200 shadow-xl group"
                  title="Your Golden Vouchers"
                >
                  <Gift size={20} className="text-[#ffb300] group-hover:rotate-12 transition-transform" />
                  {voucherCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-gradient-to-br from-[#ffd700] to-[#ff8c00] text-yellow-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg px-1">
                      {voucherCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* ── Washroom shortcut ── */}
            {user.role === 'CUSTOMER' && (
              <button
                onClick={() => setActiveTab('WASHROOM')}
                className="relative ethereal-glass p-4 rounded-2xl hover:scale-105 transition-transform group bg-white/80 border-slate-100 shadow-xl"
                title="Smart Washroom IoT"
              >
                <Wind size={20} className="text-slate-400 group-hover:text-[#00f5ff] transition-colors" />
                <span className="absolute top-3 right-3 w-3 h-3 bg-[#00f5ff] border-2 border-white rounded-full" />
              </button>
            )}

            <button
              onClick={() => user.role === 'CUSTOMER' && setActiveTab('NOTIFICATIONS')}
              className="relative ethereal-glass p-4 rounded-2xl hover:scale-105 transition-transform group bg-white/80 border-slate-100 shadow-xl"
              title="Wellness Notifications"
            >
              <Bell size={20} className="text-slate-400 group-hover:text-[#ff2d95] transition-colors" />
              <span className="absolute top-3 right-3 w-3 h-3 bg-[#ff2d95] border-2 border-white rounded-full animate-pulse" />
            </button>
            <div className="h-10 w-px bg-slate-200" />
            {/* Navbar profile — clickable, shows live name & photo */}
            <button
              onClick={() => user.role === 'CUSTOMER' && setActiveTab('PROFILE')}
              className="flex items-center gap-4 ethereal-glass p-2 pr-6 rounded-2xl bg-white/80 border-slate-100 shadow-lg hover:border-[#ff2d95]/30 hover:shadow-xl transition-all group"
              title="Go to Profile"
            >
              <div className="relative">
                <img
                  src={profilePhoto || '/chatbot.jpg'}
                  className="w-10 h-10 rounded-xl object-cover shadow-md"
                  alt="Profile"
                  onError={e => { e.target.src = '/chatbot.jpg'; }}
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ff2d95] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-black text-slate-900 leading-none capitalize tracking-tight group-hover:text-[#ff2d95] transition-colors">
                  {profileName || user.name}
                </p>
                <p className="text-[10px] font-black text-[#ff2d95] uppercase tracking-widest mt-1">level 2 alpha</p>
              </div>
            </button>
          </div>
        </header>

        {/* CONTENT — ONLY THIS SCROLLS */}
        <section className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
          {renderActivePortal()}
        </section>

        {/* Floating AI Assistant */}
        <MedicalChatbot />
      </main>
    </div>
  );
};

export default App;
