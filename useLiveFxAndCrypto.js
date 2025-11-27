'use client';

import { useEffect, useState } from 'react';

export default function useLiveFxAndCrypto() {
  const [exchangeRate, setExchangeRate] = useState(162.8);
  const [coinbaseData, setCoinbaseData] = useState({ BTC: 95000, ETH: 3500, USDC: 1 });
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [fxRes, cbRes] = await Promise.all([
          fetch('https://api.exchangerate-api.com/v4/latest/USD', { signal: controller.signal }),
          fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD', { signal: controller.signal })
        ]);

        const fxData = await fxRes.json();
        const cbData = await cbRes.json();

        setExchangeRate(fxData.rates.KES ?? 162.8);
        setCoinbaseData({
          BTC: parseFloat(cbData.data.rates.BTC) || 95000,
          ETH: parseFloat(cbData.data.rates.ETH) || 3500,
          USDC: 1
        });

        setLastUpdate(new Date().toLocaleTimeString());
      } catch (e) {
        if (!controller.signal.aborted) {
          setExchangeRate(162.8);
          setCoinbaseData({ BTC: 95000, ETH: 3500, USDC: 1 });
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return { exchangeRate, coinbaseData, lastUpdate };
}
