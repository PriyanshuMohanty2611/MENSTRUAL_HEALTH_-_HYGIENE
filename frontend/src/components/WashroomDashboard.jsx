import React, { useState, useEffect, useRef } from 'react';
import { Wind, Droplets, Thermometer, Activity, AlertTriangle, CheckCircle, Shield, RefreshCw, Wifi, WifiOff } from 'lucide-react';

// ── Sensor config: key, label, unit, min, max, danger threshold, icon, color
const SENSORS = [
  {
    key: 'co2', label: 'CO₂', unit: 'ppm', icon: <Wind size={22} />,
    base: 520, jitter: 60, min: 0, max: 2000,
    ranges: { good: 750, warn: 1200, danger: 2000 },
    color: '#00f5ff', dangerColor: '#ff2d95',
    desc: 'Carbon Dioxide — Ventilation Quality'
  },
  {
    key: 'co', label: 'CO', unit: 'ppm', icon: <Wind size={22} />,
    base: 6, jitter: 3, min: 0, max: 100,
    ranges: { good: 15, warn: 35, danger: 100 },
    color: '#9b5de5', dangerColor: '#ff2d95',
    desc: 'Carbon Monoxide — Air Safety Index'
  },
  {
    key: 'no2', label: 'NO₂', unit: 'ppb', icon: <Wind size={22} />,
    base: 25, jitter: 12, min: 0, max: 200,
    ranges: { good: 50, warn: 100, danger: 200 },
    color: '#ff75c3', dangerColor: '#ff2d95',
    desc: 'Nitrogen Dioxide — Pollution Marker'
  },
  {
    key: 'moisture', label: 'Moisture', unit: '%', icon: <Droplets size={22} />,
    base: 62, jitter: 8, min: 0, max: 100,
    ranges: { good: 60, warn: 80, danger: 100 },
    color: '#00b4d8', dangerColor: '#ff8c00',
    desc: 'Surface Moisture — Floor Wetness'
  },
  {
    key: 'temperature', label: 'Temperature', unit: '°C', icon: <Thermometer size={22} />,
    base: 27, jitter: 2.5, min: 0, max: 60,
    ranges: { good: 30, warn: 38, danger: 60 },
    color: '#ff8c00', dangerColor: '#ff2d95',
    desc: 'Ambient Temperature — Thermal Comfort'
  },
  {
    key: 'humidity', label: 'Humidity', unit: '%', icon: <Droplets size={22} />,
    base: 68, jitter: 7, min: 0, max: 100,
    ranges: { good: 65, warn: 80, danger: 100 },
    color: '#48cae4', dangerColor: '#ff2d95',
    desc: 'Relative Humidity — Air Moisture'
  },
  {
    key: 'loadcell', label: 'Load Cell', unit: 'kg', icon: <Activity size={22} />,
    base: 14, jitter: 8, min: 0, max: 120,
    ranges: { good: 40, warn: 80, danger: 120 },
    color: '#ffd700', dangerColor: '#ff2d95',
    desc: 'Occupancy Weight — Foot Traffic Load'
  },
  {
    key: 'stagnant', label: 'Stagnant Water', unit: 'mm', icon: <Droplets size={22} />,
    base: 4, jitter: 3, min: 0, max: 50,
    ranges: { good: 5, warn: 15, danger: 50 },
    color: '#4cc9f0', dangerColor: '#ff2d95',
    desc: 'Stagnant Water Depth — Drainage Status'
  },
  {
    key: 'waterFallen', label: 'Water Fallen', unit: 'L', icon: <Droplets size={22} />,
    base: 3.8, jitter: 1.5, min: 0, max: 20,
    ranges: { good: 6, warn: 12, danger: 20 },
    color: '#0077b6', dangerColor: '#ff2d95',
    desc: 'Water Fallen — Spillage / Usage Volume'
  },
];

// Generate initial dummy readings + 10-point history
const initialReadings = () => {
  const r = {};
  SENSORS.forEach(s => {
    const arr = [];
    for (let i = 0; i < 10; i++) arr.push(+(s.base + (Math.random() - 0.5) * s.jitter * 2).toFixed(2));
    r[s.key] = { current: arr[arr.length - 1], history: arr };
  });
  return r;
};

const getStatus = (sensor, value) => {
  if (value <= sensor.ranges.good)  return 'GOOD';
  if (value <= sensor.ranges.warn)  return 'WARN';
  return 'DANGER';
};

const STATUS_STYLE = {
  GOOD:   { bg: 'bg-emerald-50',  text: 'text-emerald-600',  badge: 'bg-emerald-100 text-emerald-700',  dot: 'bg-emerald-500',  bar: '#22c55e' },
  WARN:   { bg: 'bg-amber-50',    text: 'text-amber-600',    badge: 'bg-amber-100 text-amber-700',      dot: 'bg-amber-500',    bar: '#f59e0b' },
  DANGER: { bg: 'bg-red-50',      text: 'text-red-600',      badge: 'bg-red-100 text-red-700',         dot: 'bg-red-500',      bar: '#ef4444' },
};

// Mini sparkline SVG
const Sparkline = ({ history, color, status }) => {
  const w = 80, h = 28, pad = 2;
  const min = Math.min(...history) * 0.95;
  const max = Math.max(...history) * 1.05 || 1;
  const pts = history.map((v, i) => {
    const x = pad + (i / (history.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  const barColor = STATUS_STYLE[status]?.bar || color;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={barColor} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={pts.split(' ').at(-1).split(',')[0]}
        cy={pts.split(' ').at(-1).split(',')[1]}
        r="3" fill={barColor}
      />
    </svg>
  );
};

// Radial gauge
const Gauge = ({ value, max, status }) => {
  const pct = Math.min(value / max, 1);
  const r = 28, cx = 36, cy = 36;
  const circ = 2 * Math.PI * r;
  const arc  = circ * 0.75; // 270°
  const dash = arc * pct;
  const barColor = STATUS_STYLE[status]?.bar || '#ff2d95';
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="7"
        strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
        transform="rotate(135 36 36)" />
      {/* Fill */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={barColor} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(135 36 36)"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
    </svg>
  );
};

const WashroomDashboard = () => {
  const [readings, setReadings] = useState(initialReadings);
  const [isLive, setIsLive]     = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [alertCount, setAlertCount] = useState(0);
  const tickRef = useRef(null);

  const tick = () => {
    setReadings(prev => {
      const next = { ...prev };
      let alerts = 0;
      SENSORS.forEach(s => {
        const prev_val = prev[s.key].current;
        // Smooth random walk
        const delta = (Math.random() - 0.48) * s.jitter * 0.5;
        const newVal = Math.max(s.min, Math.min(s.max, +(prev_val + delta).toFixed(2)));
        const hist   = [...prev[s.key].history.slice(-9), newVal];
        next[s.key]  = { current: newVal, history: hist };
        if (getStatus(s, newVal) === 'DANGER') alerts++;
        else if (getStatus(s, newVal) === 'WARN') alerts += 0.5;
      });
      setAlertCount(Math.floor(alerts));
      return next;
    });
    setLastUpdate(new Date());
  };

  useEffect(() => {
    if (isLive) {
      tickRef.current = setInterval(tick, 2500);
    } else {
      clearInterval(tickRef.current);
    }
    return () => clearInterval(tickRef.current);
  }, [isLive]);

  const dangerSensors = SENSORS.filter(s => getStatus(s, readings[s.key].current) === 'DANGER');
  const warnSensors   = SENSORS.filter(s => getStatus(s, readings[s.key].current) === 'WARN');

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff2d95] mb-1">IoT Neural Grid</p>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
            Smart Washroom.<br />
            <span className="text-[#00f5ff]">Live Sensors.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 text-sm">
            Real-time environmental monitoring • Prince Care Hygiene Network
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Live indicator */}
          <button
            onClick={() => setIsLive(v => !v)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
              isLive
                ? 'bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isLive ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={tick}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white border border-slate-100 text-slate-500 hover:text-[#ff2d95] hover:border-[#ff2d95]/20 shadow-lg transition-all"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <div className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest shadow-xl">
            Updated {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>

      {/* ── Alert Banner ── */}
      {(dangerSensors.length > 0 || warnSensors.length > 0) && (
        <div className={`flex items-start gap-5 p-6 rounded-[28px] border animate-in fade-in duration-500 ${
          dangerSensors.length > 0
            ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            dangerSensors.length > 0 ? 'bg-red-100' : 'bg-amber-100'
          }`}>
            <AlertTriangle size={24} className={dangerSensors.length > 0 ? 'text-red-500' : 'text-amber-500'} />
          </div>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
              dangerSensors.length > 0 ? 'text-red-400' : 'text-amber-400'
            }`}>
              {dangerSensors.length > 0 ? '⚠ Critical Alert' : '⚡ Warning Active'}
            </p>
            <p className="font-black text-slate-900">
              {dangerSensors.length > 0
                ? `${dangerSensors.map(s => s.label).join(', ')} exceed safe thresholds.`
                : `${warnSensors.map(s => s.label).join(', ')} approaching warning levels.`
              }
            </p>
            <p className="text-sm text-slate-500 mt-1">Maintenance alert dispatched to Prince Care Hub.</p>
          </div>
          <div className="ml-auto">
            <span className={`text-xs font-black px-4 py-2 rounded-full ${
              dangerSensors.length > 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {alertCount} alert{alertCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {dangerSensors.length === 0 && warnSensors.length === 0 && (
        <div className="flex items-center gap-5 p-6 rounded-[28px] bg-emerald-50 border border-emerald-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={24} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">All Systems Normal</p>
            <p className="font-black text-slate-900">All 9 sensors operating within safe parameters.</p>
          </div>
        </div>
      )}

      {/* ── Sensor Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SENSORS.map(sensor => {
          const { current, history } = readings[sensor.key];
          const status = getStatus(sensor, current);
          const st = STATUS_STYLE[status];
          const pct = Math.min(current / sensor.max, 1);

          return (
            <div
              key={sensor.key}
              className={`relative p-7 rounded-[36px] bg-white border transition-all duration-700 shadow-xl overflow-hidden group hover:scale-[1.02] hover:shadow-2xl ${
                status === 'DANGER' ? 'border-red-200 shadow-red-100'
                : status === 'WARN' ? 'border-amber-200 shadow-amber-100'
                : 'border-slate-100'
              }`}
            >
              {/* Glow bg */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                style={{ backgroundColor: st.bar }}
              />

              {/* Top row: icon + status badge */}
              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${st.bg}`} style={{ color: st.bar }}>
                  {sensor.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${st.dot} ${isLive ? 'animate-pulse' : ''}`} />
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${st.badge}`}>
                    {status}
                  </span>
                </div>
              </div>

              {/* Sensor name + desc */}
              <div className="relative z-10 mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{sensor.label}</p>
                <p className="text-[8px] text-slate-300 font-medium mt-0.5">{sensor.desc}</p>
              </div>

              {/* Value + Gauge row */}
              <div className="flex items-center justify-between relative z-10 mb-4">
                <div>
                  <span className="text-4xl font-black text-slate-900 italic tracking-tighter tabular-nums">
                    {current % 1 === 0 ? current : current.toFixed(1)}
                  </span>
                  <span className="text-sm font-black text-slate-400 ml-1">{sensor.unit}</span>
                </div>
                <div className="relative">
                  <Gauge value={current} max={sensor.max} status={status} />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-500">
                    {Math.round(pct * 100)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative z-10 mb-4">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct * 100}%`, backgroundColor: st.bar }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[7px] font-black text-slate-300 uppercase">0</span>
                  <span className="text-[7px] font-black text-slate-300 uppercase">Safe: {sensor.ranges.good}{sensor.unit}</span>
                  <span className="text-[7px] font-black text-slate-300 uppercase">{sensor.max}</span>
                </div>
              </div>

              {/* Sparkline + trend */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[7px] font-black uppercase tracking-widest text-slate-300 mb-1">10-Point Trend</p>
                  <Sparkline history={history} color={sensor.color} status={status} />
                </div>
                <div className="text-right">
                  <p className="text-[7px] font-black uppercase tracking-widest text-slate-300">Δ Last</p>
                  <p className={`text-sm font-black ${
                    history.at(-1) > history.at(-2) ? 'text-red-500' : 'text-emerald-500'
                  }`}>
                    {history.at(-1) > history.at(-2) ? '▲' : '▼'}
                    {Math.abs(history.at(-1) - history.at(-2)).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sensors', value: '9', icon: <Shield size={20} />, color: '#9b5de5' },
          { label: 'Online', value: isLive ? '9 / 9' : '— / 9', icon: <Wifi size={20} />, color: '#22c55e' },
          { label: 'Alerts Active', value: alertCount, icon: <AlertTriangle size={20} />, color: alertCount > 0 ? '#ef4444' : '#22c55e' },
          { label: 'Refresh Rate', value: isLive ? '2.5 s' : 'Paused', icon: <RefreshCw size={20} />, color: '#ff2d95' },
        ].map((s, i) => (
          <div key={i} className="p-6 bg-white rounded-[28px] border border-slate-100 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0" style={{ color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
              <p className="text-2xl font-black text-slate-900 italic tracking-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Raw Data Table ── */}
      <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d95]">Raw Sensor Log</p>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">Live Data Feed</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isLive ? 'Streaming' : 'Paused'}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50">
                {['Sensor', 'Current', 'Unit', 'Safe Limit', 'Status', 'Trend'].map(h => (
                  <th key={h} className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SENSORS.map((sensor, i) => {
                const { current, history } = readings[sensor.key];
                const status = getStatus(sensor, current);
                const st = STATUS_STYLE[status];
                const isUp = history.at(-1) > history.at(-2);
                return (
                  <tr key={sensor.key} className={`border-t border-slate-50 hover:bg-pink-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${st.bg}`} style={{ color: st.bar }}>
                          {React.cloneElement(sensor.icon, { size: 14 })}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{sensor.label}</p>
                          <p className="text-[7px] text-slate-400 font-medium">{sensor.desc.split('—')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-black text-slate-900 tabular-nums italic">
                        {current % 1 === 0 ? current : current.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-slate-400 uppercase">{sensor.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500">&lt; {sensor.ranges.good} {sensor.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${st.badge}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-black ${isUp ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isUp ? '▲' : '▼'} {Math.abs((history.at(-1) - history.at(-2))).toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WashroomDashboard;
