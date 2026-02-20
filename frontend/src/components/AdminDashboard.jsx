import React from 'react';
import { Database, Users, AlertTriangle, ArrowUpRight, CheckCircle2, Droplets, Trash2, Thermometer, Activity, ShieldCheck } from 'lucide-react';

const AdminDashboard = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'IOT':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
            {[
              { id: 'WR-001', location: 'Main Lobby', spill: false, weight: '45kg', temp: '24°C' },
              { id: 'WR-002', location: 'Factory Floor', spill: true, weight: '85kg', temp: '28°C' },
              { id: 'WR-003', location: 'Office Wing', spill: false, weight: '12kg', temp: '22°C' },
            ].map((wr, i) => (
              <div key={i} className="ethereal-card rounded-[40px] p-10 relative overflow-hidden group">
                 {wr.spill && <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 aura-blob opacity-10 animate-pulse"></div>}
                 
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-2xl font-black text-white leading-tight">{wr.location}</h3>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">ID: {wr.id}</p>
                    </div>
                    {wr.spill ? (
                      <div className="px-4 py-2 bg-[#ff2d95]/10 text-[#ff2d95] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#ff2d95]/20 flex items-center gap-2">
                         <AlertTriangle size={14} /> Critical Spill
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-[#00f5ff]/10 text-[#00f5ff] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#00f5ff]/20 flex items-center gap-2">
                         <CheckCircle2 size={14} /> Hygienic
                      </div>
                    )}
                 </div>

                 <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                          <Trash2 size={18} />
                       </div>
                       <p className="text-xl font-black text-white">{wr.weight}</p>
                       <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Bin Load</p>
                    </div>
                    <div className="space-y-2">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                          <Droplets size={18} />
                       </div>
                       <p className="text-xl font-black text-white">{wr.spill ? 'YES' : 'NO'}</p>
                       <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Floor Spill</p>
                    </div>
                    <div className="space-y-2">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                          <Thermometer size={18} />
                       </div>
                       <p className="text-xl font-black text-white">{wr.temp}</p>
                       <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Temp</p>
                    </div>
                 </div>

                 <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                    <button className="flex items-center gap-2 text-[10px] font-black text-[#00f5ff] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                       Request Cleaning <ArrowUpRight size={14} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="flex-1 space-y-12 pb-24">
            {/* Admin Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: <Activity className="text-[#00f5ff]" />, label: "Grid Load", value: "88%", color: "#00f5ff" },
                { icon: <Users className="text-[#ff2d95]" />, label: "Active Nodes", value: "2,451", color: "#ff2d95" },
                { icon: <ShieldCheck className="text-[#8a2be2]" />, label: "Integrity", value: "99.9%", color: "#8a2be2" },
                { icon: <Database className="text-[#ffd700]" />, label: "Data Flow", value: "4.2TB/s", color: "#ffd700" },
              ].map((stat, i) => (
                <div key={i} className="p-8 bg-white/5 rounded-[40px] border border-white/10 group hover:bg-white/10 transition-all duration-500 relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl opacity-10 group-hover:opacity-20 transition-opacity" style={{ from: stat.color, to: 'transparent' }}></div>
                   <div className="relative z-10 space-y-4">
                     <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5 shadow-inner">
                        {stat.icon}
                     </div>
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 leading-none">{stat.label}</p>
                       <p className="text-4xl font-black text-white italic tracking-tighter uppercase">{stat.value}</p>
                     </div>
                   </div>
                </div>
              ))}
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[50px] p-12 border border-white/10 shadow-2xl">
                <h3 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase italic">System Integrity Feed</h3>
                <div className="space-y-6">
                   {[
                     { msg: 'Incinerator Cycle #12 completed successfully at Building B', time: '2 mins ago', type: 'success' },
                     { msg: 'New Distributor registered: Rural Care NGO (Maharashtra)', time: '14 mins ago', type: 'info' },
                     { msg: 'Hygiene alert resolved at Floor 2 Reception Washroom', time: '1 hr ago', type: 'success' }
                   ].map((log, i) => (
                     <div key={i} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-white/5 transition-all group">
                        <div className={`w-3 h-3 rounded-full ${log.type === 'success' ? 'bg-[#00f5ff] shadow-[0_0_10px_#00f5ff]' : 'bg-[#8a2be2] shadow-[0_0_10px_#8a2be2]'}`}></div>
                        <p className="flex-1 text-sm font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-tight">{log.msg}</p>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{log.time}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8a2be2]">Admin Authority</p>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Command <span className="text-empower">Insights.</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse shadow-[0_0_10px_#00f5ff]"></div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Network Secure</span>
           </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
