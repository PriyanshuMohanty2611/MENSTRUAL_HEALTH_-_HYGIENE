import React, { useState, useRef } from 'react';
import { Activity, Award, ArrowUpRight, ArrowRight, ArrowLeft, Heart, Star, Zap, UserCheck, Calendar as CalendarIcon, Clock, Droplets, Brain, Camera } from 'lucide-react';
import PrinceShop from './PrinceShop';
import AwarenessHub from './AwarenessHub';
import WashroomDashboard from './WashroomDashboard';
import WellnessNotifications from './WellnessNotifications';
import CycleInsights from './CycleInsights';

const CustomerDashboard = ({ activeTab, setActiveTab, user, profileName: navProfileName, profilePhoto: navProfilePhoto }) => {
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState({
    name: navProfileName || user?.name || 'Prince User',
    age: 24,
    gender: 'Female',
    lastPeriod: '2026-02-15'
  });
  const [localPhoto, setLocalPhoto] = useState(navProfilePhoto || '');
  const [showBioModal, setShowBioModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [bookingStatus, setBookingStatus] = useState('');
  const [selectedInsight, setSelectedInsight] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setLocalPhoto(dataUrl);
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { photo: dataUrl } }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBio = () => {
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { name: userData.name } }));
    setShowBioModal(false);
  };

  React.useEffect(() => {
    setSelectedInsight(null);
  }, [activeTab]);

  const handleBook = async () => {
    setBookingStatus('SYNCING...');
    try {
      const response = await fetch('/api/healthcare/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: "65d4c8e7fb21a32b90000001", // Mock ID
          doctor: "Dr. Sarah Prince",
          appointmentDate: `2026-09-${selectedDate}`,
          timeSlot: "10:00 AM"
        })
      });
      if (response.ok) {
        setBookingStatus('SCHEDULED');
        setTimeout(() => setShowBookingModal(false), 2000);
      }
    } catch (e) {
      setBookingStatus('ERROR');
    }
  };




  const renderContent = () => {
    if (selectedInsight === 'NEURO_RECOVERY') {
      return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-right-8 duration-700">
          <button 
            onClick={() => setSelectedInsight(null)}
            className="flex items-center gap-3 text-[#ff2d95] font-black uppercase tracking-widest text-xs hover:gap-5 transition-all"
          >
            <ArrowLeft size={20} /> Back to Health Grid
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-8">
              <div className="p-12 rounded-[60px] bg-slate-950 text-white relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff2d95] rounded-full blur-[120px] opacity-30"></div>
                <div className="relative z-10">
                  <div className="bg-[#ff2d95]/20 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-[#ff2d95]/30 shadow-[0_0_30px_rgba(255,45,149,0.3)]">
                    <Brain className="text-[#ff2d95]" size={40} />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter italic uppercase mb-4 leading-none text-white drop-shadow-2xl">Optimizing <br /> <span className="text-[#ff2d95]">Neuro-Recovery.</span></h2>
                  <p className="text-white font-medium leading-relaxed max-w-md text-lg opacity-90">Your neural synthesis is peaking. Our grid has detected optimal REM stability and synchronized your recovery cycles for maximum cognitive restoration.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: 'REM STABILITY', value: '98.2', unit: '%', icon: <Activity className="text-[#ff2d95]" /> },
                  { label: 'NEURAL FLOW', value: 'Active', unit: 'SYNCED', icon: <Zap className="text-[#9b5de5]" /> }
                ].map((m, i) => (
                  <div key={i} className="p-8 ethereal-glass rounded-[40px] bg-white border border-pink-100">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 rounded-xl bg-slate-50">{m.icon}</div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{m.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-slate-900 italic">{m.value}</span>
                       <span className="text-[10px] font-black text-slate-600 border border-slate-100 px-2 py-1 rounded-full">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-12 ethereal-glass rounded-[60px] bg-white border border-pink-100 space-y-10 shadow-2xl">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Recovery Insights</h3>
               <div className="space-y-8 text-slate-900 font-medium leading-loose">
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0">
                        <Star className="text-[#ff75c3]" size={20} />
                     </div>
                     <p>Your Alpha waves have stabilized after the last nutrition cycle. We recommend maintaining the current hydration levels for 4 more hours.</p>
                  </div>
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Award className="text-[#9b5de5]" size={20} />
                     </div>
                     <p>Neural synthesis achievement unlocked: "Deep Harmonic Rest". Your cognitive load capacity has increased by 15% for the next session.</p>
                  </div>
               </div>
               
               <div className="pt-10 border-t border-slate-100">
                  <div className="bg-slate-900 p-8 rounded-[40px] text-white flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#ff2d95]">Neuro-Flow Tech</p>
                        <p className="text-xl font-black italic">Syncing Health Grid...</p>
                     </div>
                     <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-3 h-8 bg-[#ff2d95] rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedInsight === 'BIOMETRIC_SCALING') {
      return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-right-8 duration-700">
          <button 
            onClick={() => setSelectedInsight(null)}
            className="flex items-center gap-3 text-[#ff2d95] font-black uppercase tracking-widest text-xs hover:gap-5 transition-all outline-none"
          >
            <ArrowLeft size={20} /> Back to Health Grid
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-8">
              <div className="p-12 rounded-[60px] bg-slate-950 text-white relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(155,93,229,0.4)] border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#9b5de5] rounded-full blur-[120px] opacity-30"></div>
                <div className="relative z-10">
                  <div className="bg-[#9b5de5]/20 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-[#9b5de5]/30 shadow-[0_0_30px_rgba(155,93,229,0.3)]">
                    <Zap className="text-[#9b5de5]" size={40} />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter italic uppercase mb-4 leading-none text-white drop-shadow-2xl">Advanced <br /> <span className="text-[#9b5de5]">Biometric Scaling.</span></h2>
                  <p className="text-white font-medium leading-relaxed max-w-md text-lg opacity-90">Prince Core v2.0 is actively scaling your physiological data streams. We have synchronized your metabolic efficiency with real-time cardiac variability for peak wellness performance.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: 'HRV INDEX', value: '112', unit: 'MS', icon: <Heart className="text-[#9b5de5]" /> },
                  { label: 'METABOLIC RATE', value: 'OPTIMAL', unit: 'BMR', icon: <Droplets className="text-[#ff75c3]" /> }
                ].map((m, i) => (
                  <div key={i} className="p-8 ethereal-glass rounded-[40px] bg-white border border-pink-100 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 rounded-xl bg-slate-100">{m.icon}</div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{m.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-slate-900 italic">{m.value}</span>
                       <span className="text-[10px] font-black text-slate-600 border border-slate-200 px-2 py-1 rounded-full">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-12 ethereal-glass rounded-[60px] bg-white border border-pink-100 space-y-10 shadow-2xl">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Core Scaling Metrics</h3>
               <div className="space-y-8 text-slate-900 font-medium leading-loose">
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0 shadow-sm">
                        <Activity className="text-[#9b5de5]" size={20} />
                     </div>
                     <p>Your Heart Rate Variability (HRV) has entered the "Elite Recovery" zone. This indicates high autonomic nervous system balance.</p>
                  </div>
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0 shadow-sm">
                        <Droplets className="text-[#ff75c3]" size={20} />
                     </div>
                     <p>Metabolic baseline detected. Basal Body Temperature remains stable at 98.6°F, perfectly aligned with your hormonal cycle phase.</p>
                  </div>
               </div>
               
               <div className="pt-10 border-t border-slate-100">
                  <div className="bg-slate-900 p-8 rounded-[40px] text-white flex items-center justify-between border border-white/10 shadow-2xl group overflow-hidden relative">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                     <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Prince Core Scaling</p>
                        <p className="text-xl font-black italic">Calibrating Biometrics...</p>
                     </div>
                     <div className="flex gap-2 relative z-10">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-3 h-8 bg-purple-500 rounded-full animate-bounce shadow-[0_0_10px_purple]" style={{ animationDelay: `${i * 0.15}s` }}></div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'WASHROOM': return <WashroomDashboard />;
      case 'NOTIFICATIONS': return <WellnessNotifications profilePhoto={localPhoto || navProfilePhoto} userName={userData.name} />;
      case 'SHOP':
        return <PrinceShop />;
      case 'TRACKER':
        return <CycleInsights userName={userData.name} />;
      case 'CONSULT':
        return (
          <div className="space-y-12 pb-20">
             <div className="grid lg:grid-cols-2 gap-12">
                <div className="p-12 ethereal-glass rounded-[60px] bg-white/5 border border-white/10">
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase mb-8">Gynaecology Hub.</h3>
                    <div className="space-y-6">
                       {/* Dr. Jayshree */}
                       <div className="p-8 bg-white shadow-xl rounded-[32px] border border-slate-50 flex items-center justify-between group hover:-translate-y-2 transition-transform">
                          <div className="flex gap-6 items-center">
                             <img src="/doctor.png" className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="Dr. Jayshree" onError={e=>{e.target.style.display='none'}} />
                             <div>
                                <p className="text-xl font-black text-slate-800">Dr. Jayshree</p>
                                <p className="text-[10px] font-black text-[#ff2d95] uppercase tracking-widest">Gynaecologist • MBBS MD</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">12 yrs exp · Mon–Fri · AI Verified</p>
                             </div>
                          </div>
                          <button onClick={() => setShowBookingModal(true)} className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#ff2d95] transition-colors">Book Now</button>
                       </div>

                       {/* Dr. Surya Prakash — now Gynaecologist with Book Now */}
                       <div className="p-8 bg-white shadow-xl rounded-[32px] border border-slate-50 flex items-center justify-between group hover:-translate-y-2 transition-transform">
                          <div className="flex gap-6 items-center">
                             <img src="/doctor2.png" className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="Dr. Surya Prakash" onError={e=>{e.target.style.display='none'}} />
                             <div>
                                <p className="text-xl font-black text-slate-800">Dr. Surya Prakash</p>
                                <p className="text-[10px] font-black text-[#8a2be2] uppercase tracking-widest">Gynaecologist • FRCOG</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">18 yrs exp · Tue–Sat · Rural Health Pioneer</p>
                             </div>
                          </div>
                          <button onClick={() => setShowBookingModal(true)} className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#8a2be2] transition-colors">Book Now</button>
                       </div>
                    </div>
                </div>
                
                <div className="p-12 ethereal-glass rounded-[60px] bg-white/5 border border-white/10">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Calendar.</h3>
                      <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </button>
                   </div>
                   <div className="grid grid-cols-7 gap-4">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 mb-2">{d}</div>)}
                      {[...Array(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())].map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedDate(i + 1)}
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all
                          ${selectedDate === i + 1 ? 'bg-[#ff2d95] text-white shadow-xl scale-110' : 'bg-white/10 text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                           {i + 1}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        );
      case 'AWARENESS':
        return <AwarenessHub />;
      case 'PROFILE':
        return (
          <div className="space-y-12 pb-20">
             <div className="p-16 ethereal-glass rounded-[60px] bg-white/70 border border-pink-100 shadow-xl relative overflow-hidden">
                {/* Avatar with upload */}
                <div className="absolute top-0 right-0 p-12">
                   <div className="relative group">
                     <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#ff2d95] to-[#8a2be2] p-1 flex items-center justify-center transform rotate-6 shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[36px] flex items-center justify-center overflow-hidden">
                           <img
                             src={localPhoto || navProfilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                             className="w-full h-full object-cover"
                             alt="Profile"
                             onError={e => { e.target.src = '/chatbot.jpg'; }}
                           />
                        </div>
                     </div>
                     {/* Upload overlay */}
                     <button
                       onClick={() => fileInputRef.current?.click()}
                       className="absolute inset-0 rounded-[40px] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                       title="Change profile photo"
                     >
                       <div className="text-white text-center">
                         <Camera size={20} className="mx-auto mb-1" />
                         <p className="text-[8px] font-black uppercase tracking-widest">Upload</p>
                       </div>
                     </button>
                     <input
                       ref={fileInputRef}
                       type="file"
                       accept="image/*"
                       className="hidden"
                       onChange={handlePhotoUpload}
                     />
                   </div>
                </div>
                
                <div className="space-y-8 relative z-10">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff2d95] mb-2">Neural Identity</p>
                      <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase">{userData.name}. <br /> <span className="text-empower">Sync ID.</span></h2>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-12 pt-8">
                      <div className="space-y-6">
                         {[
                           { label: 'Name', value: userData.name, icon: <UserCheck size={16} /> },
                           { label: 'Age', value: `${userData.age} Years`, icon: <Activity size={16} /> },
                           { label: 'Gender', value: userData.gender, icon: <img src="/chatbot.jpg" className="w-4 h-4 rounded-full object-cover" alt="" /> }
                         ].map((item, i) => (
                           <div key={i} className="flex items-center gap-6 p-6 bg-white shadow-sm rounded-3xl border border-slate-50 transition-all hover:border-[#ff2d95]/30">
                              <div className="text-slate-400 p-3 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">{item.icon}</div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.label}</p>
                                 <p className="text-xl font-black text-slate-800">{item.value}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                      
                      <div className="space-y-6">
                         <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-4 shadow-2xl">
                            <div className="flex items-center justify-between">
                               <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Sync Status</p>
                               <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_#ff0000]"></span>
                            </div>
                            <h4 className="text-2xl font-black italic uppercase">Biometric Verified.</h4>
                            <div className="w-full h-1 bg-white/10 rounded-full">
                               <div className="w-[100%] h-full bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
                            </div>
                            <p className="text-[10px] font-medium opacity-40 leading-relaxed uppercase tracking-widest">Linked to Prince Care Central Neural Grid.</p>
                         </div>
                         
                         <button 
                           onClick={() => setShowBioModal(true)}
                           className="w-full py-8 bg-white border-2 border-slate-100 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#ff2d95] hover:border-[#ff2d95]/20 hover:shadow-xl transition-all"
                         >
                           Modify Bio-Data
                         </button>
                      </div>
                   </div>
                </div>
             </div>

             {/* Bio Modal */}
             {showBioModal && (
               <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 backdrop-blur-3xl bg-slate-900/40">
                  <div className="w-full max-w-xl bg-white rounded-[60px] p-16 shadow-2xl relative overflow-hidden">
                     <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Update <span className="text-[#ff2d95]">Bio Core.</span></h2>
                        <div className="space-y-6">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Display Name</p>
                              <input 
                                className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-black uppercase tracking-widest border-none outline-none focus:ring-2 focus:ring-[#ff2d95]/20" 
                                value={userData.name}
                                onChange={e => setUserData({...userData, name: e.target.value})}
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Age</p>
                                 <input 
                                   type="number"
                                   className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-black border-none outline-none focus:ring-2 focus:ring-[#ff2d95]/20" 
                                   value={userData.age}
                                   onChange={e => setUserData({...userData, age: parseInt(e.target.value)})}
                                 />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Gender</p>
                                 <select 
                                   className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-black uppercase tracking-widest border-none outline-none focus:ring-2 focus:ring-[#ff2d95]/20"
                                   value={userData.gender}
                                   onChange={e => setUserData({...userData, gender: e.target.value})}
                                 >
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Other">Autonomous</option>
                                 </select>
                              </div>
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Last Period Start (For Cycle Insights)</p>
                              <input 
                                type="date"
                                className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-black border-none outline-none focus:ring-2 focus:ring-[#ff2d95]/20" 
                                value={userData.lastPeriod}
                                onChange={e => setUserData({...userData, lastPeriod: e.target.value})}
                              />
                           </div>
                        </div>
                        <button onClick={handleSaveBio} className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-[10px] font-black uppercase tracking-widest hover:bg-[#ff2d95] transition-all">Synchronize Bio-Data</button>
                     </div>
                  </div>
               </div>
             )}

             {/* Booking Modal */}
             {showBookingModal && (
               <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 backdrop-blur-3xl bg-slate-900/40">
                  <div className="w-full max-w-xl bg-white rounded-[60px] p-16 shadow-2xl text-center space-y-8">
                     <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-[#ff2d95]">
                        <CalendarIcon size={48} />
                     </div>
                      <div>
                        <h2 className="text-4xl font-black italic uppercase mb-2">
                          {new Date().toLocaleString('default', { month: 'short' })} {selectedDate}, {new Date().getFullYear()}.
                        </h2>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Target: Dr. Jayshree (Neuro-Core)</p>
                      </div>
                     <div className="flex justify-center gap-4">
                        <div className="px-6 py-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                           <Clock size={16} className="text-[#ff2d95]" />
                           <span className="font-black">10:00 AM</span>
                        </div>
                     </div>
                     <button 
                        onClick={handleBook}
                        className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all"
                     >
                        {bookingStatus || 'Confirm Neural Appointment'}
                     </button>
                     <button onClick={() => setShowBookingModal(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-300">Cancel Request</button>
                  </div>
               </div>
             )}
          </div>
        );
      default:
        return (
          <div className="space-y-12 pb-20">
            <div className="flex items-end justify-between mb-12 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff75c3]">My Body Vitals</p>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Prince Health Grid.</h1>
              </div>
              <div className="hidden sm:flex p-2 bg-white/50 backdrop-blur-md rounded-3xl border border-pink-50">
                 <div className="px-6 py-3 bg-white rounded-2xl shadow-sm text-xs font-black text-[#ff2d95]">Live Real-Time Scan</div>
              </div>
            </div>
            {/* Header Cards */}
            <div className="flex flex-wrap gap-8">
               <div 
                  onClick={() => setSelectedInsight('BIOMETRIC_SCALING')}
                  className="flex-1 min-w-[300px] h-[260px] p-10 ethereal-glass rounded-[50px] bg-white border border-pink-300 shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
               >
                  <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#ff75c3] aura-blob opacity-20 group-hover:scale-125 transition-transform duration-1000"></div>
                  <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                       <Activity className="text-[#ff75c3]" size={24} />
                    </div>
                    <div>
                      <h4 className="text-slate-500 font-black uppercase tracking-widest text-xs mb-2">My Pulse</h4>
                      <p className="text-3xl font-black text-slate-900 leading-none">Current Rate: <span className="text-[#ff2d95]">72 BPM</span></p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-black text-[#ff75c3] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      Analyze Vitals <ArrowUpRight size={16} />
                    </button>
                  </div>
               </div>

                <div 
                  onClick={() => setSelectedInsight('NEURO_RECOVERY')}
                  className="flex-1 min-w-[300px] h-[260px] p-10 ethereal-glass rounded-[50px] bg-white border border-pink-300 shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#9b5de5] aura-blob opacity-20 group-hover:scale-125 transition-transform duration-1000"></div>
                  <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                       <Award className="text-[#9b5de5]" size={24} />
                    </div>
                    <div>
                      <h4 className="text-slate-500 font-black uppercase tracking-widest text-xs mb-2">Cyber Tier</h4>
                      <p className="text-3xl font-black text-slate-900 leading-none">Prince <span className="text-[#9b5de5]">Advocate Lvl 4</span></p>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                       <div className="h-full bg-gradient-to-r from-[#ff75c3] to-[#9b5de5] w-[85%] rounded-full shadow-[0_0_10px_#ff75c3]"></div>
                    </div>
                  </div>
               </div>
            </div>

            {/* NEW: Neural Vitals Grid */}
            <div className="grid lg:grid-cols-4 gap-8">
               {[
                 { label: "Body Temp", value: "98.6°F", unit: "STABLE", icon: <Activity />, color: "#ff2d95" },
                 { label: "SpO2 Level", value: "99%", unit: "OPTIMAL", icon: <Star />, color: "#00f5ff" },
                 { label: "Blood Pressure", value: "120/80", unit: "NORMAL", icon: <Heart />, color: "#ff2d95" },
                 { label: "Sugar Levels", value: "95 mg", unit: "FASTING", icon: <Zap />, color: "#ffd700" }
               ].map((v, i) => (
                  <div key={i} className="p-8 ethereal-glass rounded-[40px] bg-white border border-pink-300 shadow-2xl hover:scale-105 transition-all group">
                     <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 shadow-2xl flex items-center justify-center transition-transform" style={{ color: v.color }}>
                           {v.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ff2d95] animate-pulse">Live Link active</span>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{v.label}</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{v.value}</span>
                        <span className="text-[10px] font-black text-slate-600 border border-slate-100 px-3 py-1 rounded-full">{v.unit}</span>
                     </div>
                  </div>
               ))}
            </div>

            {/* Recommendations Section */}
            <div>
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Feed</h2>
                   <button 
                     onClick={() => setActiveTab('AWARENESS')}
                     className="px-6 py-3 bg-white border border-pink-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#ff75c3] hover:bg-pink-50 transition-colors"
                   >
                     Access Neural Hub
                   </button>
                </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {[
                    { title: 'Optimizing Neuro-Recovery', desc: 'Syncing REM stability and cognitive cycles.', icon: <Heart className="text-[#ff75c3]" />, color: '#ff75c3', tag: 'Neural Insights' },
                    { title: 'Advanced Biometric Scaling', desc: 'Metabolic efficiency & HRV synchronization.', icon: <Star className="text-[#9b5de5]" />, color: '#9b5de5', tag: 'Prince Core' }
                  ].map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                        if (item.title === 'Optimizing Neuro-Recovery') setSelectedInsight('NEURO_RECOVERY');
                        if (item.title === 'Advanced Biometric Scaling') setSelectedInsight('BIOMETRIC_SCALING');
                    }}
                    className="p-12 ethereal-glass rounded-[40px] bg-white border border-pink-200 flex gap-10 items-center shadow-xl hover:shadow-2xl transition-all duration-700 group cursor-pointer"
                  >
                     <div className={`w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl bg-slate-900 group-hover:rotate-6 transition-transform`}>
                        <div className="text-white scale-150">{item.icon}</div>
                     </div>
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ff2d95] mb-2 block">{item.tag}</span>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-[#ff2d95] transition-colors uppercase italic mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-500 font-medium group-hover:text-slate-800 transition-colors">{item.desc}</p>
                     </div>
                     <div className="ml-auto">
                       <ArrowRight className="text-[#ff2d95] group-hover:translate-x-3 transition-transform" size={24} />
                     </div>
                  </div>
                  ))}
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {renderContent()}
    </div>
  );
};

export default CustomerDashboard;
