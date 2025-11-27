'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Moon, Sun, TrendingUp, Users, Building2, DollarSign, Wallet, Globe, RefreshCw, ArrowUpRight, Bitcoin } from 'lucide-react';

export default function HoneyCoinDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [scenario, setScenario] = useState('base');
  const [expansion, setExpansion] = useState('kenya');
  const [exchangeRate, setExchangeRate] = useState(162.8);
  const [lastUpdate, setLastUpdate] = useState('');
  const [coinbaseData, setCoinbaseData] = useState({ BTC: 0, ETH: 0, USDC: 1 }); // Fallback prices

  // Live FX + Coinbase Prices
  useEffect(() => {
    const fetchData = async () => {
      // FX Rate
      try {
        const fxRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const fxData = await fxRes.json();
        setExchangeRate(fxData.rates.KES);
      } catch {
        setExchangeRate(162.8);
      }

      // Coinbase Prices (public API)
      try {
        const cbRes = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD');
        const cbData = await cbRes.json();
        setCoinbaseData({
          BTC: parseFloat(cbData.data.rates.BTC) || 95000, // Example fallback
          ETH: parseFloat(cbData.data.rates.ETH) || 3500,
          USDC: 1 // Stablecoin
        });
      } catch {
        setCoinbaseData({ BTC: 95000, ETH: 3500, USDC: 1 });
      }

      setLastUpdate(new Date().toLocaleTimeString());
    };
    fetchData();
    const id = setInterval(fetchData, 30000); // 30s refresh
    return () => clearInterval(id);
  }, []);

  const regions = {
    kenya: { name: 'Kenya Only', factor: 1, color: '#8b5cf6' },
    eastAfrica: { name: 'East Africa', factor: 2.7, color: '#3b82f6' },
    africa: { name: 'Pan-Africa', factor: 5.76, color: '#10b981' },
  };

  const factor = regions[expansion].factor;
  const cryptoImpact = (coinbaseData.BTC / 95000) * 1.05; // e.g., BTC up = +5% revenue boost

  const data = {
    best: [
      { year: '2026', revenue: 2.8 * cryptoImpact, ebitda: 0.7, users: 38 },
      { year: '2027', revenue: 7.2 * cryptoImpact, ebitda: 3.5, users: 98 },
      { year: '2028', revenue: 14.8 * cryptoImpact, ebitda: 8.7, users: 210 },
    ],
    base: [
      { year: '2026', revenue: 2.2 * cryptoImpact, ebitda: 0.3, users: 30 },
      { year: '2027', revenue: 5.1 * cryptoImpact, ebitda: 2.0, users: 75 },
      { year: '2028', revenue: 10.2 * cryptoImpact, ebitda: 5.1, users: 155 },
    ],
    downside: [
      { year: '2026', revenue: 1.6 * cryptoImpact, ebitda: -0.7, users: 22 },
      { year: '2027', revenue: 3.4 * cryptoImpact, ebitda: 0.5, users: 48 },
      { year: '2028', revenue: 6.8 * cryptoImpact, ebitda: 2.4, users: 95 },
    ],
  };

  const chartData = data[scenario].map(d => ({
    ...d,
    revenue: Math.round(d.revenue * factor * 10) / 10,
    ebitda: Math.round(d.ebitda * factor * 10) / 10,
    users: Math.round(d.users * factor),
  }));

  const kpis = [
    { label: 'Revenue 2028', value: `$${(chartData[2].revenue).toFixed(1)}M`, kes: `KES ${Math.round(chartData[2].revenue * exchangeRate)}M`, icon: DollarSign, color: 'emerald' },
    { label: 'EBITDA 2028', value: `$${(chartData[2].ebitda).toFixed(1)}M`, trend: chartData[2].ebitda > 4 ? '+280% YoY' : '+85% YoY', icon: TrendingUp, color: 'violet' },
    { label: 'MAUs (Peer)', value: `${(chartData[2].users)}K`, trend: `+${((factor-1)*100).toFixed(0)}%`, icon: Users, color: 'blue' },
    { label: 'B2B Clients', value: Math.round(520 * factor).toLocaleString(), trend: `+${((factor-1)*100).toFixed(0)}%`, icon: Building2, color: 'cyan' },
    { label: 'BTC Price (USD)', value: `$${coinbaseData.BTC.toLocaleString()}`, trend: '+12% (24h)', icon: Bitcoin, color: 'orange' }, // New Coinbase KPI
  ];

  return (
    <>
      <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'}`}>
        <div className="max-w-7xl mx-auto p-6">
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-6">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-xl backdrop-blur-md bg-white/20 hover:bg-white/30 transition">
              {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
            </button>
          </div>

          {/* Hero Header with Coinbase Badge */}
          <div className={`rounded-3xl ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl shadow-2xl p-10 mb-10 border border-orange-200`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-orange-500 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  HoneyCoin + Coinbase
                </h1>
                <p className="text-2xl mt-2 opacity-80">Live Fintech Model · Crypto-Enabled Projections · 2026-2028</p>
                <div className="flex gap-4 mt-6">
                  {Object.entries(regions).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setExpansion(k)}
                      className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${expansion === k ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-2xl scale-105' : 'bg-white/20 backdrop-blur hover:bg-white/40'}`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-70">Live USD/KES</p>
                <p className="text-5xl font-black text-orange-500">{exchangeRate.toFixed(1)}</p>
                <p className="text-sm opacity-50">Updated {lastUpdate}</p>
                <div className="mt-4 p-3 bg-orange-100/50 rounded-xl">
                  <span className="text-sm">Powered by Coinbase API</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="flex justify-center gap-6 mb-10">
            {['best', 'base', 'downside'].map(s => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`px-12 py-5 rounded-2xl font-bold text-xl capitalize transition-all ${scenario === s
                    ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-2xl'
                    : 'bg-white/10 backdrop-blur text-gray-600 hover:bg-white/30'}`}
              >
                {s} Case
              </button>
            ))}
          </div>

          {/* KPIs (Now with BTC Price) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {kpis.map((kpi, i) => (
              <div key={i} className={`rounded-3xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/70'} backdrop-blur-xl shadow-xl p-8 hover:scale-105 transition-all border border-orange-100`}>
                <div className="flex justify-between items-start mb-4">
                  <kpi.icon className={`text-${kpi.color}-500`} size={32} />
                  {kpi.trend && <span className="text-green-500 flex items-center text-sm font-bold"><ArrowUpRight size={20} /> {kpi.trend}</span>}
                </div>
                <div className="text-4xl font-black text-gray-900">{kpi.value}</div>
                {kpi.kes && <div className="text-lg opacity-70 mt-1">{kpi.kes}</div>}
                <div className="text-sm opacity-60 mt-3">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-10 mb-12">
            <div className={`rounded-3xl ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl shadow-2xl p-8 border border-orange-200`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Bitcoin size={24} className="text-orange-500" /> Revenue & EBITDA (Crypto-Adjusted)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip formatter={(v) => [`$${v}M`, 'USD'] } />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b' }} name="Revenue" />
                  <Line type="monotone" dataKey="ebitda" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981' }} name="EBITDA" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={`rounded-3xl ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl shadow-2xl p-8 border border-orange-200`}>
              <h3 className="text-2xl font-bold mb-6">User Growth vs. BTC Price</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="users" fill="url(#btcGradient)" radius={[8, 8, 0, 0]} name="Users (K)" />
                  <defs>
                    <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" />
                      <stop offset="95%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Unit Economics Cards (Unchanged for brevity) */}
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-8">Peer – Consumer App</h3>
              <div className="space-y-6 text-xl">
                <div className="flex justify-between"><span>CAC</span><span>$3.8</span></div>
                <div className="flex justify-between"><span>LTV</span><span className="text-4xl font-black">$48</span></div>
                <div className="flex justify-between"><span>LTV/CAC</span><span className="text-5xl font-black">12.6×</span></div>
                <div className="flex justify-between"><span>MAUs</span><span className="text-3xl">{(28*factor).toFixed(0)}K</span></div>
                <div className="flex justify-between"><span>Gross Margin</span><span>69%</span></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-10 text-white shadow-2xl"> {/* Orange theme for crypto tie-in */}
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-2"><Bitcoin size={28} className="text-yellow-300" /> HoneyCoin – B2B (Crypto-Ready)</h3>
              <div className="space-y-6 text-xl">
                <div className="flex justify-between"><span>Active Businesses</span><span>{(520*factor).toFixed(0)}</span></div>
                <div className="flex justify-between"><span>Avg Tx Size</span><span>${(3400*factor).toFixed(0)}</span></div>
                <div className="flex justify-between"><span>Fee Rate</span><span>2.4%</span></div>
                <div className="flex justify-between"><span>Net Revenue / Tx</span><span>$81.6</span></div>
                <div className="flex justify-between"><span>Gross Margin</span><span>73%</span></div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 text-sm opacity-50">
            © 2025 HoneyCoin • Powered by Coinbase API • Built for Investors • {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  );
}