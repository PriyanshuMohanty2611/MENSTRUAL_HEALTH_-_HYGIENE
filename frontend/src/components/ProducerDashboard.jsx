import React from 'react';
import { Package, TrendingUp, Cpu, Factory, ArrowUpRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';

const ProducerDashboard = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'PRODUCTION':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
             <div className="lg:col-span-2 space-y-8">
                <div className="ethereal-card rounded-[50px] p-12 bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f5ff] aura-blob opacity-5 group-hover:scale-110 transition-transform duration-1000"></div>
                   <h3 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase italic">Production Grid</h3>
                   <div className="h-64 flex items-end gap-3 px-4">
                      {[60, 80, 45, 90, 70, 100, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-2xl relative group/bar hover:bg-[#ff2d95]/20 transition-colors">
                           <div 
                             className="absolute bottom-0 w-full bg-gradient-to-t from-[#ff2d95] to-[#8a2be2] rounded-2xl transition-all duration-1000 ease-out shadow-[0_0_20px_#ff2d95]" 
                             style={{ height: `${h}%` }}
                           ></div>
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold">
                              {h * 120} Units
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="flex justify-between mt-6 px-4">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                        <span key={d} className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{d}</span>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="ethereal-glass rounded-[40px] p-10 flex gap-6 items-center border-none shadow-sm">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
                         <Zap size={24} className="text-[#fee440]" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                         <p className="text-2xl font-black text-slate-900">99.2%</p>
                      </div>
                   </div>
                   <div className="ethereal-glass rounded-[40px] p-10 flex gap-6 items-center border-none shadow-sm">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
                         <TrendingUp size={24} className="text-[#00bbf9]" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth</p>
                         <p className="text-2xl font-black text-slate-900">+14.5%</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="ethereal-card rounded-[40px] p-10 bg-slate-900 text-white relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#ff75c3]/20 to-[#9b5de5]/20"></div>
                   <h3 className="relative z-10 text-xl font-black mb-6 tracking-tight">Resource Utilization</h3>
                   <div className="relative z-10 space-y-6">
                      {[
                        { label: 'Raw Banana Fiber', val: 82, color: '#ff75c3' },
                        { label: 'Bamboo Pulp', val: 45, color: '#9b5de5' },
                        { label: 'Aloe Extract', val: 92, color: '#00bbf9' }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span>{item.label}</span>
                              <span style={{ color: item.color }}>{item.val}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.val}%`, backgroundColor: item.color }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="ethereal-glass rounded-[40px] p-10 border-none shadow-sm relative group overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff75c3] aura-blob opacity-5"></div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-4">Batch Health</h4>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">Current batch (LC-902) has passed all microbial and absorbency tests.</p>
                  <div className="flex items-center gap-2 text-[#ff75c3] font-black text-[10px] uppercase tracking-widest">
                    <CheckCircle2 size={16} /> Certified Production
                  </div>
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="space-y-12 pb-20">
             {/* Producer Hero Cards */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 ethereal-glass rounded-[50px] p-12 relative overflow-hidden group">
                   <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#9b5de5] aura-blob opacity-5"></div>
                   <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                      <div className="w-48 h-48 rounded-[40px] bg-white shadow-2xl flex items-center justify-center p-8 group-hover:rotate-6 transition-transform">
                         <Cpu size={80} className="text-[#9b5de5]" />
                      </div>
                      <div className="space-y-6 flex-1 text-center md:text-left">
                          <div className="flex items-center gap-2 px-4 py-2 bg-[#8a2be2]/20 border border-[#8a2be2]/30 rounded-xl w-max mx-auto md:mx-0">
                             <Sparkles size={14} className="text-[#8a2be2]" />
                             <span className="text-[10px] font-black text-[#8a2be2] uppercase tracking-widest">AI Status Online</span>
                          </div>
                          <h2 className="text-4xl font-black text-white tracking-tighter leading-tight uppercase italic">Neural Inventory <br /> System.</h2>
                         <button className="btn-aura border-none shadow-sm hover:shadow-xl text-[10px] tracking-widest uppercase">Launch Stock Prediction</button>
                      </div>
                   </div>
                </div>

                <div className="ethereal-card rounded-[50px] p-10 bg-gradient-to-br from-[#ff75c3] to-[#9b5de5] border-none shadow-xl text-white group">
                   <Package className="mb-6 opacity-30 group-hover:scale-125 transition-transform" size={48} />
                   <h3 className="text-xl font-black mb-2 tracking-tight">Active Inventory</h3>
                   <p className="text-5xl font-black mb-8 tracking-tighter">12,450 <span className="text-lg opacity-50 uppercase tracking-widest ml-1">Units</span></p>
                   <div className="p-4 bg-white/10 rounded-2xl flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Next Dispatch</span>
                      <span className="text-xs font-bold">In 4 Hours</span>
                   </div>
                </div>
             </div>

             {/* Stock Alerts Area */}
             <div>
                <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">AI Forecasting Alerts</h3>
                <div className="space-y-4">
                   {[
                     { item: 'Ultra-Soft Bamboo Fiber (Raw)', urgency: 'LOW STOCK', prediction: 'Exhaustion in 3 days', color: '#ff75c3' },
                     { item: 'Recycled Compostable Packets', urgency: 'CRITICAL', prediction: 'Production stop in 12 hrs', color: '#f87171' }
                   ].map((alert, i) => (
                     <div key={i} className="ethereal-glass rounded-[40px] p-8 border-none shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:translate-x-2 transition-transform">
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest`} style={{ backgroundColor: alert.color }}>
                           {alert.urgency}
                        </div>
                        <p className="flex-1 text-lg font-black text-slate-800">{alert.item}</p>
                        <div className="flex items-center gap-3">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{alert.prediction}</p>
                           <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                              <ArrowUpRight size={18} className="text-slate-400" />
                           </button>
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
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00bbf9]">Manufacture Engine</p>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Creation <span className="text-empower">Hub.</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="p-4 ethereal-glass rounded-2xl flex items-center gap-3">
              <Factory size={20} className="text-[#00bbf9]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Beta-04 Active</span>
           </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default ProducerDashboard;
