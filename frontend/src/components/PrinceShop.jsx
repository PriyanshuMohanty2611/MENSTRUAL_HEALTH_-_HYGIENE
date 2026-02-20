import React, { useState } from 'react';
import {
  ShoppingBag, Trash2, CreditCard, ArrowRight, ArrowLeft,
  Smartphone, MapPin, CheckCircle, ShieldCheck, Wallet, Globe,
  Scan, Star, Sparkles, Gift, Clock, Heart, Building2, Crown, Zap, X
} from 'lucide-react';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

async function gemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

// ─── Confetti ────────────────────────────────────────────────────────────────
const COLORS = ['#ff2d95','#ff75c3','#ffd700','#9b5de5','#00f5ff','#ff8c00'];
const confettiBits = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  color: COLORS[i % 6],
  left: `${(i * 3.7) % 100}%`,
  size: `${8 + (i % 4) * 3}px`,
  delay: `${(i * 0.12) % 1.8}s`,
  dur: `${2.2 + (i % 3) * 0.6}s`,
}));

const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {confettiBits.map(p => (
      <div key={p.id} className="absolute rounded-sm"
        style={{
          left: p.left, top: '-24px',
          width: p.size, height: p.size,
          backgroundColor: p.color,
          animationDelay: p.delay,
          animationDuration: p.dur,
          animation: `fall ${p.dur} ${p.delay} linear infinite`,
          opacity: 0.85,
        }}
      />
    ))}
    <style>{`
      @keyframes fall {
        0%   { transform: translateY(-24px) rotate(0deg); opacity: 0.8; }
        100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
      }
    `}</style>
  </div>
);

// ─── Golden Voucher Card ─────────────────────────────────────────────────────
const GoldenVoucher = ({ voucher, claimed, onClaim }) => (
  <div className="relative rounded-[36px] overflow-hidden cursor-pointer group" onClick={onClaim}>
    <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700] via-[#ffb300] to-[#ff8c00]" />
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
    <div className="absolute inset-0 opacity-10"
      style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '16px 16px' }} />
    <div className="relative z-10 p-7 flex items-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl shrink-0">
        {voucher.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-yellow-900/60 mb-1 truncate">{voucher.tag}</p>
        <h3 className="text-xl font-black text-yellow-950 leading-tight tracking-tight italic">{voucher.title}</h3>
        <p className="text-xs font-medium text-yellow-900/70 mt-1 line-clamp-2">{voucher.desc}</p>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className="text-3xl font-black text-yellow-950 italic">{voucher.value}</p>
        <p className="text-[8px] font-black uppercase tracking-widest text-yellow-900/60">Off</p>
      </div>
    </div>
    <div className="relative z-10 px-7 pb-5 flex items-center justify-between border-t border-yellow-600/30 pt-3">
      <div className="flex items-center gap-2 text-yellow-950/60">
        <Clock size={10} />
        <span className="text-[8px] font-black uppercase tracking-widest">Valid: {voucher.expiry}</span>
      </div>
      <span className="text-[8px] font-black uppercase tracking-[0.15em] text-yellow-950 bg-white/30 px-3 py-1 rounded-full group-hover:bg-white/60 transition-all">
        {claimed ? '✓ Claimed' : 'Tap to Claim →'}
      </span>
    </div>
    {claimed && (
      <div className="absolute inset-0 rounded-[36px] bg-green-900/80 backdrop-blur-sm flex items-center justify-center z-20">
        <div className="flex items-center gap-3 text-white">
          <CheckCircle size={28} className="text-green-400" />
          <span className="text-lg font-black uppercase tracking-widest">Claimed!</span>
        </div>
      </div>
    )}
  </div>
);

// ─── Products ────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: 'Stayfree Secure XL', mrp: 320, price: 199,
    img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT2TYFu8_YcRqr3RfcXRtGvQ4ZiTNN_B1siMxpQHsF5Dr-wheH7PjX6YyjO5h0sEuBwcMZpW8yqUnH9BvA1l_7B90Dlumkcm4ff1pAxm_5YnAcniGkl378XIvmCZnUCUscfW1pQAQ&usqp=CAc',
    fallback: 'https://www.bigbasket.com/media/uploads/p/xxl/40092316_5-stayfree-secure-cotton-soft-xl.jpg',
    category: 'Sanitary Care', badge: 'Best Seller',
    desc: '40 Units · Ultra XL · Cottony Comfort Core. Best ever protection.',
  },
  {
    id: 2, name: 'Saridon Woman', mrp: 90, price: 45,
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEnA1XDgO9He_EPd2EO2M2qjFuzseJzvexvQ&s',
    fallback: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/7e1a2c54-1d78-4d5a-87a5-6b98cfaaac5b.jpg',
    category: 'Medical', badge: 'Fast Relief',
    desc: 'For abdominal cramps, body pain & headaches. Dual-action formula.',
  },
  {
    id: 3, name: 'Panadol Period Pain', mrp: 120, price: 75,
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEnA1XDgO9He_EPd2EO2M2qjFuzseJzvexvQ&s',
    fallback: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/gsn/gsn10103/v/14.jpg',
    category: 'Medical', badge: 'Recommended',
    desc: '500mg Paracetamol + 65mg Caffeine. Rapid targeted neural relief.',
  },
  {
    id: 4, name: 'Norethisterone 5mg', mrp: 180, price: 85,
    img: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/2a30ed07-b11e-4d5b-87ee-ef96c82dc8d0.jpg',
    fallback: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/2a30ed07-b11e-4d5b-87ee-ef96c82dc8d0.jpg',
    category: 'Medical', badge: 'Rx Support',
    desc: 'Norethisterone IP 5mg. Delay & regulate your cycle with precision.',
  },
  {
    id: 5, name: 'Prince Neural Cup', mrp: 350, price: 120,
    img: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTvwQvrNwaKzfNC7KEzSoj3Q99okEAObKIM1GUo9-KlxgC92UScJ3vxzd4hA_4zz-ZP6OZNTC5x9tCOVEoyq2VK5JSu5u6e_tsSfiphIUndnaNNhdrsl6j_Gw&usqp=CAc',
    fallback: 'https://m.media-amazon.com/images/I/61CXHJ4vJQL._SL1500_.jpg',
    category: 'Sustainable', badge: 'Eco Choice',
    desc: 'Medical-grade silicone. Holds 3× more. 12-hour leak-free protection.',
  },
  {
    id: 6, name: 'Neural Heating Belt', mrp: 499, price: 195,
    img: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSHazv-WrYORxNs-sPDElp7AZYRWqu08MMU-l2JSBC4XxFr2JygmVxz3uUrBf_2FdA8-FkUOGRRZFBNsOfmIoN-5lm_R4-yCpXP-4OkdKoBmdn2ssyUZjz4K3AT8ogd&usqp=CAc',
    fallback: 'https://m.media-amazon.com/images/I/61a5ggkBuZL._SL1500_.jpg',
    category: 'Smart Tech', badge: 'New',
    desc: '3-stage intelligent heat modulation + vibration pulse therapy belt.',
  },
  {
    id: 7, name: 'Reusable Cloth Pads', mrp: 299, price: 149,
    img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTH3Otdkpfp1Uc_98ZZ4fxXBxKxTHUZaHo85He87jjf89C3XTz5e0wUZIsdHBermlWxvHTyWQbdaWKNG7Qu034c7XePeu3LPpBuuPyBWltEFtdqjc6o5JLJ_NFaQ8TtX4CUnmYA_DQ&usqp=CAc',
    fallback: 'https://m.media-amazon.com/images/I/71OzjB0fhML._SL1500_.jpg',
    category: 'Sustainable', badge: '♻ Zero Waste',
    desc: 'Washable organic cotton. 200+ reuses. Reduces plastic waste by 99%.',
  },
  {
    id: 8, name: 'Pee Safe Organic Tampon', mrp: 250, price: 99,
    img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTH3Otdkpfp1Uc_98ZZ4fxXBxKxTHUZaHo85He87jjf89C3XTz5e0wUZIsdHBermlWxvHTyWQbdaWKNG7Qu034c7XePeu3LPpBuuPyBWltEFtdqjc6o5JLJ_NFaQ8TtX4CUnmYA_DQ&usqp=CAc',
    fallback: 'https://m.media-amazon.com/images/I/71OzjB0fhML._SL1500_.jpg',
    category: 'Sustainable', badge: '100% Organic',
    desc: '100% organic cotton. No pesticides, no plastics. Biodegradable certified.',
  },
  {
    id: 9, name: 'EcoFemme Period Kit', mrp: 399, price: 189,
    img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
    category: 'Sustainable', badge: 'Kit Deal',
    desc: 'Complete eco kit: cloth pad + cup + herbal cramp balm. Full 30-day coverage.',
  },
];

const PAYMENT_OPTIONS = [
  { id: 'GPAY',  name: 'Google Pay',       color: '#4285F4', icon: <Smartphone size={18} /> },
  { id: 'PPAY',  name: 'PhonePe',          color: '#5f259f', icon: <Smartphone size={18} /> },
  { id: 'RAZOR', name: 'Razorpay',         color: '#3395FF', icon: <Globe size={18} /> },
  { id: 'MOBI',  name: 'MobiKwik',         color: '#0055ff', icon: <Wallet size={18} /> },
  { id: 'SUPER', name: 'SuperMoney',       color: '#ff2d95', icon: <Zap size={18} /> },
  { id: 'COD',   name: 'Cash on Delivery', color: '#1e293b', icon: <CreditCard size={18} /> },
];

const generateVouchers = (amount) => {
  const base = [
    {
      id: 'V1', value: '100%', expiry: '90 Days',
      title: 'Neural Clinic Visit',
      tag: 'GOLDEN VOUCHER — Consultation Reward',
      desc: 'Free 1st visit at any Prince Care Partner Clinic. Priority queue access included.',
      icon: <Building2 size={24} className="text-yellow-900" />,
    },
    {
      id: 'V2', value: '₹50', expiry: '30 Days',
      title: '₹50 Next Order Sync',
      tag: 'CASHBACK VOUCHER — Luna Coins Reward',
      desc: 'Redeemable on your next purchase of ₹150+. Auto-applied at checkout.',
      icon: <Sparkles size={24} className="text-yellow-900" />,
    },
  ];
  if (amount >= 300) {
    base.push({
      id: 'V3', value: '20%', expiry: '180 Days',
      title: 'Prince Crown Elite',
      tag: 'MEGA REWARD — Premium Tier Unlock',
      desc: 'Crown-tier status: 20% off all future orders + priority health concierge.',
      icon: <Crown size={24} className="text-yellow-900" />,
    });
  }
  return base;
};

// ─── Main Component ──────────────────────────────────────────────────────────
const PrinceShop = () => {
  const [cart, setCart]                     = useState([]);
  const [showCart, setShowCart]             = useState(false);
  const [view, setView]                     = useState('SHOP'); // SHOP | CHECKOUT | SUCCESS
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [scannedAddress, setScannedAddress] = useState('');
  const [isScanning, setIsScanning]         = useState(false);
  const [claimedVouchers, setClaimedVouchers] = useState([]);
  const [showRewards, setShowRewards]       = useState(false);
  const [purchasedAmount, setPurchasedAmount] = useState(0);

  const addToCart    = (p) => setCart(prev => [...prev, { ...p, cartId: Date.now() + Math.random() }]);
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.cartId !== id));
  const totalPrice   = cart.reduce((s, i) => s + i.price, 0);
  const discount     = (mrp, price) => mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const [locationError, setLocationError]   = useState('');
  const [generatedVouchers, setGeneratedVouchers] = useState([]); // AI-generated vouchers from Gemini

  const startScan = () => {
    setIsScanning(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by your browser.');
      setIsScanning(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Use Gemini to format a beautiful, precise delivery address from coordinates
          const prompt = `You are a location assistant. Given GPS coordinates latitude=${latitude.toFixed(6)}, longitude=${longitude.toFixed(6)}, infer and return a realistic, human-readable Indian delivery address for that location. Include building/area name, street, city, state and PIN code. Reply with ONLY the address, no other text. If you cannot determine the exact address, provide the nearest recognizable landmark and city.`;
          const geminiAddr = await gemini(prompt);
          setScannedAddress(geminiAddr || `📍 ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E`);
        } catch {
          setScannedAddress(`📍 ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E`);
        }
        setIsScanning(false);
      },
      (err) => {
        let msg = 'Could not fetch location. ';
        if (err.code === 1) msg += 'Location permission denied — please allow in browser settings.';
        else if (err.code === 2) msg += 'Location unavailable.';
        else msg += 'Request timed out.';
        setLocationError(msg);
        setIsScanning(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePayment = async () => {
    if (!selectedPayment || !scannedAddress) return;
    const amount = totalPrice;
    const cartSnapshot = [...cart];
    setPurchasedAmount(amount);
    setCart([]);
    setShowCart(false);
    setView('SUCCESS');

    try {
      const itemList = cartSnapshot.map(i => `${i.name} (₹${i.price})`).join(', ');
      const prompt = `You are Prince Care's AI reward engine. A customer just purchased: ${itemList} totalling ₹${amount}. Generate exactly ${amount >= 300 ? 3 : 2} personalised Golden Vouchers as a JSON array. Each voucher must have these fields:
- id: unique string like 'GV-<random 4-digit>'
- title: catchy reward title (max 5 words)
- tag: short category label in UPPERCASE (e.g. 'CASHBACK REWARD', 'CLINIC VOUCHER', 'LOYALTY TIER')
- desc: one sentence describing the benefit
- value: discount value like '₹50', '15%', '100%'
- expiry: e.g. '30 Days', '60 Days', '90 Days'
- emoji: a single relevant emoji

Make vouchers relevant to menstrual health, wellness, and sustainable products. Return ONLY the JSON array, no markdown fences.`;

      const raw = await gemini(prompt);
      let newVouchers = [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) newVouchers = parsed;
      } catch {}

      // Fallback if Gemini didn't return valid JSON
      if (newVouchers.length === 0) {
        newVouchers = [
          { id: `GV-${Date.now()}`, title: 'Neural Clinic Visit', tag: 'FREE CONSULTATION', desc: 'Free first visit at any Prince Care partner clinic.', value: '100%', expiry: '90 Days', emoji: '🏥' },
          { id: `GV-${Date.now()+1}`, title: '₹50 Luna Cashback', tag: 'CASHBACK REWARD', desc: 'Auto-applied on next purchase of ₹150+.', value: '₹50', expiry: '30 Days', emoji: '✨' },
        ];
        if (amount >= 300) newVouchers.push({ id: `GV-${Date.now()+2}`, title: 'Crown Elite Tier', tag: 'LOYALTY TIER', desc: '20% off all future orders + priority health concierge.', value: '20%', expiry: '180 Days', emoji: '👑' });
      }

      // Save to component state for SUCCESS screen display
      setGeneratedVouchers(newVouchers);

      // Persist to localStorage & notify navbar badge
      const existing = JSON.parse(localStorage.getItem('prince_vouchers') || '[]');
      const merged = [...existing, ...newVouchers];
      localStorage.setItem('prince_vouchers', JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('vouchersUpdated', { detail: merged.length }));
    } catch (e) {
      console.error('Voucher generation failed', e);
    } finally {
      setTimeout(() => setShowRewards(true), 800);
    }
  };

  const goToShop = () => {
    setView('SHOP');
    setScannedAddress('');
    setSelectedPayment(null);
    setClaimedVouchers([]);
    setShowRewards(false);
  };

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (view === 'SUCCESS') {
    // Use AI-generated vouchers if ready, otherwise fall back to static ones
    const vouchers = generatedVouchers.length > 0
      ? generatedVouchers.map(v => ({
          ...v,
          icon: <span className="text-3xl">{v.emoji || '🎁'}</span>
        }))
      : generateVouchers(purchasedAmount);
    return (
      <div className="relative space-y-12 pb-32 overflow-hidden">
        <Confetti />

        {/* Hero */}
        <div className="relative z-10 text-center pt-8 space-y-6">
          <div className="w-36 h-36 mx-auto rounded-[50px] bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center shadow-[0_0_60px_rgba(255,215,0,0.5)]">
            <ShieldCheck size={64} className="text-yellow-950" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff2d95] mb-2">Neural Payment Authorized</p>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic mb-3 uppercase leading-none">
              Order Synced.<br />
              <span className="text-[#ffd700]">Rewards Unlocked.</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-lg mx-auto">
              Your order is on its way. The Prince Grid has issued exclusive Golden Vouchers — including a <strong>free clinic visit</strong>!
            </p>
          </div>
        </div>

        {/* Rewards section */}
        {showRewards && (
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center shadow-lg">
                <Gift size={20} className="text-yellow-950" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Your Golden Vouchers</h2>
            </div>

            {vouchers.map(v => (
              <GoldenVoucher
                key={v.id}
                voucher={v}
                claimed={claimedVouchers.includes(v.id)}
                onClaim={() => setClaimedVouchers(prev => prev.includes(v.id) ? prev : [...prev, v.id])}
              />
            ))}

            {/* Clinic Banner */}
            <div className="p-8 rounded-[40px] bg-slate-950 text-white relative overflow-hidden shadow-2xl border border-white/5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff2d95] rounded-full blur-[100px] opacity-20 pointer-events-none" />
              <div className="relative z-10 flex gap-6 items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#ff2d95]/20 border border-[#ff2d95]/30 flex items-center justify-center shrink-0">
                  <Heart size={32} className="text-[#ff2d95]" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ff2d95] mb-1">Prince Care Partner Network</p>
                  <h3 className="text-xl font-black italic uppercase leading-none mb-2">Free Clinic Consultation Unlocked.</h3>
                  <p className="text-white/60 text-sm">Visit any Prince Care partner clinic within 90 days. Just show your Golden Voucher code at reception.</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-4xl font-black text-[#ffd700] italic">FREE</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/40">1st Visit</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Order ID',       value: `PC-${String(Date.now()).slice(-6)}` },
                { label: 'Vouchers',       value: `${vouchers.length} Golden` },
                { label: 'Luna Coins',     value: `+${Math.round(purchasedAmount * 0.1)}` },
              ].map((s, i) => (
                <div key={i} className="p-6 bg-white border border-pink-100 rounded-[28px] shadow-sm text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1">{s.label}</p>
                  <p className="text-lg font-black text-slate-900 italic">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative z-10 text-center">
          <button
            onClick={goToShop}
            className="px-12 py-5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-[#ff2d95] transition-all shadow-2xl"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ── CHECKOUT ───────────────────────────────────────────────────────────────
  if (view === 'CHECKOUT') {
    return (
      <div className="space-y-10 pb-32">
        <button
          onClick={() => setView('SHOP')}
          className="flex items-center gap-3 text-[#ff2d95] font-black uppercase tracking-widest text-xs hover:gap-5 transition-all"
        >
          <ArrowLeft size={18} /> Back to Shop
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left column */}
          <div className="space-y-8">
            {/* Address Scanner */}
            <div className="p-10 bg-white rounded-[50px] border border-pink-100 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Delivery Node</h2>
                <MapPin className="text-[#ff2d95]" size={22} />
              </div>
              <button
                onClick={startScan}
                disabled={isScanning}
                className="w-full p-6 border-2 border-dashed border-pink-200 rounded-[30px] flex items-center justify-center gap-4 text-slate-400 hover:border-[#ff2d95] hover:text-[#ff2d95] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isScanning ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Fetching GPS coordinates...</span>
                  </div>
                ) : (
                  <>
                    <Scan size={22} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {scannedAddress ? '↻ Use Current Location Again' : '📍 Use My Present Location'}
                    </span>
                  </>
                )}
              </button>

              {/* Error message */}
              {locationError && (
                <div className="p-4 rounded-[20px] bg-red-50 border border-red-100">
                  <p className="text-xs font-bold text-red-600 leading-snug">⚠️ {locationError}</p>
                </div>
              )}

              {/* Scanned address display */}
              {scannedAddress && (
                <div className="p-6 bg-green-50 rounded-[24px] border border-green-100">
                  <p className="text-[8px] font-black uppercase tracking-widest text-green-600 mb-2 flex items-center gap-1">
                    <CheckCircle size={10} /> GPS Location Detected
                  </p>
                  <p className="text-slate-800 font-bold text-sm leading-relaxed">{scannedAddress}</p>
                </div>
              )}
            </div>

            {/* Payment Gateways */}
            <div className="p-10 bg-white rounded-[50px] border border-pink-100 shadow-xl space-y-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Payment Gateways</h2>
              <div className="grid grid-cols-2 gap-4">
                {PAYMENT_OPTIONS.map(opt => {
                  const isSelected = selectedPayment === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedPayment(opt.id)}
                      className={`relative p-6 rounded-[28px] border-2 transition-all flex flex-col items-start gap-3 text-left ${
                        isSelected
                          ? 'border-[#ff2d95] bg-pink-50 shadow-md'
                          : 'border-slate-100 bg-white hover:border-pink-200'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle size={16} className="text-[#ff2d95]" />
                        </div>
                      )}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: opt.color }}
                      >
                        {opt.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 leading-tight">{opt.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="p-5 rounded-[24px] bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c00]/10 border border-[#ffd700]/40 flex items-center gap-4">
                <Gift size={22} className="text-[#ff8c00] shrink-0" />
                <p className="text-sm font-black text-slate-700 italic">
                  🏆 Earn <span className="text-[#ff8c00]">Golden Vouchers</span> + <span className="text-[#ff2d95]">FREE clinic visit</span> on completing this order!
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Order Summary */}
          <div>
            <div className="p-10 bg-slate-950 rounded-[50px] text-white shadow-2xl sticky top-4 border border-white/5">
              <h2 className="text-3xl font-black tracking-tighter italic uppercase mb-10">Order Summary</h2>
              <div className="space-y-6 mb-10 max-h-[35vh] overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.cartId} className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-800">
                      <img src={item.img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-all" alt=""
                        onError={e => { e.target.src = item.fallback; e.target.onerror = null; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-base uppercase italic tracking-tight text-white/90 truncate">{item.name}</h4>
                      <p className="text-[#ff2d95] font-black text-sm">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Delivery</p>
                  <p className="font-black text-green-400">FREE</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Platform Fee</p>
                  <p className="font-black">₹0</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <p className="text-white/90 font-black uppercase tracking-widest text-base italic">Total</p>
                  <p className="text-5xl font-black text-[#ff2d95]">₹{totalPrice}</p>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={!selectedPayment || !scannedAddress}
                style={{ cursor: (!selectedPayment || !scannedAddress) ? 'not-allowed' : 'pointer' }}
                className={`w-full h-24 rounded-[36px] mt-10 flex items-center justify-between px-10 transition-all font-black ${
                  selectedPayment && scannedAddress
                    ? 'bg-[#ff2d95] text-white hover:bg-white hover:text-slate-900 shadow-[0_16px_40px_rgba(255,45,149,0.4)]'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <ShieldCheck size={28} />
                  <span className="text-lg uppercase tracking-[0.15em]">Confirm & Pay</span>
                </div>
                <ArrowRight size={28} />
              </button>
              {(!selectedPayment || !scannedAddress) && (
                <p className="text-center mt-4 text-[9px] font-black text-white/30 uppercase tracking-widest">
                  {!scannedAddress ? 'Scan address first →' : 'Select a payment method →'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SHOP ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff2d95]">Sustainable Live Inventory</p>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Prince Shop.</h1>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative p-6 bg-white border border-pink-100 rounded-[30px] shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          <ShoppingBag className="text-[#ff2d95]" size={26} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xl">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Rewards Teaser Banner */}
      <div className="relative rounded-[32px] overflow-hidden p-6 flex items-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffd700] via-[#ffb300] to-[#ff8c00]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '14px 14px' }} />
        <div className="relative z-10 flex items-center gap-5 flex-1">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Gift size={24} className="text-yellow-950" />
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-yellow-900/70">Prince Golden Rewards Program</p>
            <h3 className="text-lg font-black text-yellow-950 italic">Every purchase earns Golden Vouchers + a FREE Clinic Visit!</h3>
          </div>
        </div>
        <div className="relative z-10 flex gap-1">
          {[0,1,2].map(i => <Star key={i} size={16} className="fill-yellow-900/40 text-yellow-900/40" />)}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {PRODUCTS.map(p => (
          <div key={p.id} className="rounded-[36px] bg-white border border-slate-100 overflow-hidden group shadow hover:shadow-2xl transition-all duration-500 flex flex-col">
            <div className="h-48 overflow-hidden relative bg-gradient-to-br from-pink-50 to-slate-100 shrink-0">
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={e => { e.target.src = p.fallback; e.target.onerror = null; }}
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm">
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-600">{p.category}</span>
              </div>
              {p.badge && (
                <div className="absolute top-3 right-3 bg-[#ff2d95] px-2.5 py-1 rounded-lg shadow-sm">
                  <span className="text-[7px] font-black uppercase tracking-widest text-white">{p.badge}</span>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1 gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase italic mb-1 group-hover:text-[#ff2d95] transition-colors line-clamp-2 leading-snug">{p.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex items-end justify-between pt-1">
                <div>
                  <p className="text-[9px] font-black text-slate-300 line-through">MRP ₹{p.mrp}</p>
                  <p className="text-xl font-black text-slate-900">₹{p.price}</p>
                  {discount(p.mrp, p.price) > 0 && (
                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">{discount(p.mrp, p.price)}% off</p>
                  )}
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg hover:bg-[#ff2d95] hover:rotate-12 active:scale-90 transition-all"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
            onClick={() => setShowCart(false)}
          />
          {/* Modal */}
          <div className="relative w-full max-w-xl bg-white rounded-[50px] shadow-2xl overflow-hidden z-10">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Cart Hub</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-3 bg-slate-100 hover:bg-red-50 rounded-xl transition-all"
              >
                <X size={22} className="text-slate-400 hover:text-red-500" />
              </button>
            </div>

            {/* Items */}
            <div className="p-8 overflow-y-auto max-h-[40vh] space-y-5">
              {cart.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center">
                    <ShoppingBag size={36} className="text-slate-200" />
                  </div>
                  <p className="text-slate-300 font-extrabold uppercase tracking-[0.3em] text-sm">Cart is Empty</p>
                </div>
              ) : cart.map(item => (
                <div key={item.cartId} className="flex items-center gap-6 group">
                  <div className="w-20 h-20 rounded-[24px] overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.img}
                      className="w-full h-full object-cover"
                      alt=""
                      onError={e => { e.target.src = item.fallback; e.target.onerror = null; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-lg text-slate-800 uppercase italic tracking-tight truncate">{item.name}</h4>
                    <p className="text-[#ff2d95] font-black">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="p-3 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-slate-900 text-white">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-white/40 font-black uppercase tracking-widest text-xs">Total</p>
                  <p className="text-5xl font-black">₹{totalPrice}</p>
                </div>
                <button
                  onClick={() => { setShowCart(false); setView('CHECKOUT'); }}
                  className="w-full h-20 bg-[#ff2d95] text-white rounded-[30px] flex items-center justify-between px-8 hover:bg-white hover:text-slate-900 transition-all shadow-[0_16px_40px_rgba(255,45,149,0.3)]"
                >
                  <div className="flex items-center gap-4">
                    <CreditCard size={26} />
                    <span className="text-lg font-black uppercase tracking-[0.15em]">Proceed to Checkout</span>
                  </div>
                  <ArrowRight size={26} />
                </button>
                <p className="text-center mt-4 text-[9px] font-black text-white/20 uppercase tracking-widest">
                  🏆 Golden Vouchers + Free Clinic Visit await!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrinceShop;
