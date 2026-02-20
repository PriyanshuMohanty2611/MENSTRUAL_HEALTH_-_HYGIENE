import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Heart, Shield } from 'lucide-react';

const MedicalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Prince Care Portal active. I am Princess, your Neural Health Guide. How may I synchronize with your wellness today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    const key = process.env.REACT_APP_GEMINI_API_KEY;
    if (!key) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ API key missing! Please add REACT_APP_GEMINI_API_KEY to your .env file and restart the dev server.' }]);
      setLoading(false);
      return;
    }

    const prompt = `You are "Princess", a highly advanced and empathetic medical AI assistant for "Prince Care" — a menstrual health and wellness platform in India. 
Your personality is professional, regal, yet extremely caring and friendly. 
Help the user with questions about menstrual health, period pain, body temperature, SpO2, blood pressure, sugar levels, cycle tracking, and general women's wellness.
Keep responses concise (3-5 sentences), helpful, and warm. Stay in character as Princess AI.
User says: ${userMsg}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
          })
        }
      );
      const data = await response.json();
      if (!response.ok) {
        const errMsg = data?.error?.message || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      } else {
        throw new Error('Empty response from Gemini');
      }
    } catch (error) {
      console.error('Gemini error:', error.message);
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${error.message}. Please try again, Royal Subject. 💫` }]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-gradient-to-br from-[#ff0000] to-[#ff2d95] rounded-[30px] shadow-[0_20px_40px_rgba(255,0,0,0.4)] flex items-center justify-center text-white hover:rotate-6 hover:scale-105 active:scale-95 transition-all duration-500 group relative"
        >
          <img 
            src="/chatbot.jpg" 
            className="w-14 h-14 rounded-full border-2 border-white/50 object-cover"
            alt="Princess"
          />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-4 border-white rounded-full animate-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="w-[420px] h-[650px] bg-white rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-red-50 animate-in slide-in-from-bottom-12 duration-700">
          <div className="p-8 bg-gradient-to-br from-[#ff0000] via-[#ff2d95] to-[#8a2be2] text-white flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <img 
                src="/chatbot.jpg" 
                className="w-14 h-14 rounded-2xl object-cover border border-white/30"
                alt="Princess Avatar"
              />
              <div>
                <h3 className="font-extrabold text-xl tracking-tight leading-tight">Princess AI</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Prince Core v2.0</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[28px] text-[15px] font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-red-50 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-[28px] border border-red-50 flex gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white border-t border-red-50">
             <form onSubmit={handleSend} className="flex gap-3">
                <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Consult with Princess..."
                      className="w-full bg-slate-100 border-none rounded-2xl py-5 pl-6 pr-14 text-sm font-semibold focus:ring-2 focus:ring-red-200 outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                </div>
             </form>
             <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 opacity-30">
                   <Shield size={10} />
                   <p className="text-[8px] font-black uppercase tracking-widest">Neural Encryption Active</p>
                </div>
                <div className="flex items-center gap-2">
                   <Heart size={10} className="text-red-500" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Prince Care Support</span>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalChatbot;
