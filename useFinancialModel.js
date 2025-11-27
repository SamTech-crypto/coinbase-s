'use client';

import { useMemo } from 'react';

const REGIONS = {
  kenya: { name: 'Kenya Only', factor: 1 },
  eastAfrica: { name: 'East Africa', factor: 2.7 },
  africa: { name: 'Pan-Africa', factor: 5.76 }
};

const BASE_DATA = {
  best: [
    { year: '2026', revenue: 2.8, ebitda: 0.7, users: 38 },
    { year: '2027', revenue: 7.2, ebitda: 3.5, users: 98 },
    { year: '2028', revenue: 14.8, ebitda: 8.7, users: 210 },
  ],
  base: [
    { year: '2026', revenue: 2.2, ebitda: 0.3, users: 30 },
    { year: '2027', revenue: 5.1, ebitda: 2.0, users: 75 },
    { year: '2028', revenue: 10.2, ebitda: 5.1, users: 155 },
  ],
  downside: [
    { year: '2026', revenue: 1.6, ebitda: -0.7, users: 22 },
    { year: '2027', revenue: 3.4, ebitda: 0.5, users: 48 },
    { year: '2028', revenue: 6.8, ebitda: 2.4, users: 95 },
  ]
};

export default function useFinancialModel(scenario, expansion, coinbaseData, exchangeRate) {
  const factor = REGIONS[expansion].factor;

  const cryptoImpact = useMemo(() => {
    return (coinbaseData.BTC / 95000) * 1.05; 
  }, [coinbaseData.BTC]);

  const chartData = useMemo(() => {
    return BASE_DATA[scenario].map(d => ({
      ...d,
      revenue: Math.round(d.revenue * cryptoImpact * factor * 10) / 10,
      ebitda: Math.round(d.ebitda * factor * 10) / 10,
      users: Math.round(d.users * factor)
    }));
  }, [scenario, factor, cryptoImpact]);

  const kpis = useMemo(() => {
    const last = chartData[2];
    return [
      { label: 'Revenue 2028', value: `$${last.revenue.toFixed(1)}M`, kes: `KES ${Math.round(last.revenue * exchangeRate)}M` },
      { label: 'EBITDA 2028', value: `$${last.ebitda.toFixed(1)}M`, trend: last.ebitda > 4 ? '+280% YoY' : '+85% YoY' },
      { label: 'MAUs', value: `${last.users}K` },
      { label: 'BTC Price', value: `$${coinbaseData.BTC.toLocaleString()}`, trend: '+12% (24h)' }
    ];
  }, [chartData, exchangeRate, coinbaseData.BTC]);

  return { REGIONS, chartData, kpis };
}
