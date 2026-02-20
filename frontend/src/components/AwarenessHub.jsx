import React from 'react';
import { Heart, ArrowRight, ShieldCheck, Zap, Star, PlayCircle } from 'lucide-react';

const AwarenessHub = () => {
  const shayris = [
    {
      title: "Daughter's Love",
      text: "बेटियों को गैर कहने वालो ने, उसे अपनी गोद में उठाया ना होगा.. उसको प्यार ना देने वालो ने, ममता को भी समझ पाया ना होगा..",
      tag: "Decoding Love",
      color: "text-pink-600"
    },
    {
      title: "Jhansi Ki Rani",
      text: "उखाड़ फेंका हर दुश्मन को, जिसने झाँसी का अपमान किया.. मर्दानी की परिभाषा बन कर, आज़ादी का पैगाम दिया..",
      tag: "Tribute to Strength",
      color: "text-red-600"
    },
    {
      title: "The Silent Power",
      text: "कमजोर समझ बैठे तुम हमें तुम्हारी सोच पर हमको हंसी आती है तुम उस औरत के गर्व से ही जने हो जिसके साथ चलने से तुम्हारे अहम को शर्म आती है",
      tag: "Neural Pride",
      color: "text-purple-600"
    },
    {
      title: "Jagat Janani",
      text: "नारी तुम ही जगत जननी, तुम ममतामयी दानी हो, तुम प्रणेता हर क्षेत्र की, नहीं तुमसा कोई ज्ञानी हो... विजयी परचम की अधिकारी हो",
      tag: "Ancient Wisdom",
      color: "text-orange-600"
    },
    {
      title: "Self Reliance",
      text: "वह नारी जो आत्मनिर्भर होती है, वही समाज में नई दिशा दिखाती है।",
      tag: "Autonomy",
      color: "text-blue-600"
    }
  ];

  const videos = [
    {
      id: "9ZQOUmQ562o",
      title: "The Silent Revolution",
      desc: "How decentralized awareness shifts global health norms."
    },
    {
      id: "rZqKHBa6Bgs",
      title: "Self-Love & Strength",
      desc: "Unlocking the unbreakable spirit through mental fortitude."
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-24 space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-pink-200 shadow-xl mb-4">
          <ShieldCheck className="text-[#ff2d95]" size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Neural Awareness v2.0</span>
        </div>
        <h1 className="text-8xl font-black text-slate-900 leading-[0.8] tracking-tighter italic uppercase">
          Empowering<br />
          <span className="text-[#ff2d95]">Aura Grid.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-500 text-lg font-medium leading-relaxed uppercase tracking-widest text-xs">
          Harnessing the soul's energy through synchronized wisdom, cultural heritage, and modern medical enlightenment.
        </p>
      </section>

      {/* Shayri Gallery */}
      <div className="mb-12 flex items-end justify-between border-b border-pink-100 pb-8">
        <div>
          <p className="text-[#ff2d95] font-black text-[10px] uppercase tracking-[0.4em] mb-2 italic">Neural Repository</p>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Soul Stirring <span className="text-[#ff2d95]">Wisdom.</span></h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
           <Star size={14} className="text-yellow-400" /> 5 Essential Insights
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {shayris.map((s, i) => (
          <div key={i} className="ethereal-glass rounded-[45px] p-10 bg-white shadow-2xl border border-pink-300 hover:scale-[1.02] transition-all duration-500 group relative flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.tag}</p>
                <Heart size={16} className={`${s.color} opacity-0 group-hover:opacity-100 transition-opacity`} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">{s.title}</h3>
              <p className="text-lg font-black leading-tight text-slate-800 italic">"{s.text}"</p>
            </div>
            <div className="pt-8 flex items-center justify-between border-t border-slate-50 mt-auto">
               <span className="text-[10px] font-black uppercase tracking-widest text-[#ff2d95] italic">Sacred Stream</span>
               <ArrowRight size={16} className="text-slate-200 group-hover:text-[#ff2d95] group-hover:translate-x-2 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Multimedia Insights */}
      <div className="mb-12 flex items-end justify-between border-b border-pink-100 pb-8">
        <div>
          <p className="text-[#ff2d95] font-black text-[10px] uppercase tracking-[0.4em] mb-2 italic">Global Streams</p>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Impact <span className="text-[#ff2d95]">Visions.</span></h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {videos.map((v, i) => (
          <div key={i} className="group space-y-6">
            <div className="relative aspect-video rounded-[50px] overflow-hidden bg-slate-900 border border-pink-200 shadow-2xl">
              <iframe 
                className="w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000"
                src={`https://www.youtube.com/embed/${v.id}`} 
                title={v.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/40 to-transparent group-hover:opacity-0 transition-opacity"></div>
              <div className="absolute bottom-10 left-10 text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                 <PlayCircle size={48} className="text-white fill-white/20" />
              </div>
            </div>
            <div className="px-8 flex items-start justify-between">
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900 italic uppercase italic tracking-tighter">{v.title}</h4>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest leading-loose">{v.desc}</p>
              </div>
              <div className="p-4 bg-white border border-pink-100 rounded-2xl text-[#ff2d95] shadow-lg group-hover:scale-110 transition-transform">
                <Zap size={20} fill="currentColor" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwarenessHub;
