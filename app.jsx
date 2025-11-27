'use client';

import React, { useState } from 'react';
import useLiveFxAndCrypto from './hooks/useLiveFxAndCrypto';
import useFinancialModel from './hooks/useFinancialModel';

import DarkModeToggle from './components/DarkModeToggle';
import RegionSelector from './components/RegionSelector';
import RevenueEbitdaChart from './components/RevenueEbitdaChart';

export default function HoneyCoinDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [scenario, setScenario] = useState('base');
  const [expansion, setExpansion] = useState('kenya');

  const { exchangeRate, coinbaseData, lastUpdate } = useLiveFxAndCrypto();
  const { REGIONS, chartData, kpis } = useFinancialModel(
    scenario,
    expansion,
    coinbaseData,
    exchangeRate
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-purple-50'}`}>
      <div className="max-w-7xl mx-auto p-6">

        {/* Dark Mode */}
        <div className="flex justify-end mb 6">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>

        {/* Hero */}
        <div className="p-10 rounded-3xl bg-white/80 backdrop-blur-xl">
          <h1 className="text-6xl font-black">HoneyCoin + Coinbase</h1>

          <RegionSelector
            regions={REGIONS}
            expansion={expansion}
            setExpansion={setExpansion}
          />
        </div>

        {/* Chart */}
        <div className="mt-10 p-10 rounded-3xl bg-white/80">
          <RevenueEbitdaChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
