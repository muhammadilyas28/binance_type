'use client';

import { createChart, ColorType, UTCTimestamp, CandlestickSeries, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

const VISIBLE_BARS = 180; // ~last 3 hours on 1m

export default function CandlestickChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null); // more specific type for chartRef
  // ... existing code ...
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  // ... existing code ... // more specific type for seriesRef
  const wsRef = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  // const [updateCounter, setUpdateCounter] = useState(0);

  // --- fetch unchanged (your function) ---
  const fetchInitialData = async (limit = 600) => {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=${limit}`);
    const raw = await res.json();
    if (!Array.isArray(raw)) return [];
    const candles = raw.map((k) => ({
      time: Math.floor(k[0] / 1000) as UTCTimestamp,
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
    }));
    candles.sort((a, b) => Number(a.time) - Number(b.time));
    return candles;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1) Create chart at container size
    const chart = createChart(containerRef.current, {
      layout: { textColor: '#d1d4dc', background: { type: ColorType.Solid, color: '#131722' } },
      grid: { vertLines: { color: '#363c4e' }, horzLines: { color: '#363c4e' } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#363c4e', scaleMargins: { top: 0.12, bottom: 0.12 } },
      leftPriceScale: { visible: false },
      timeScale: {
        borderColor: '#363c4e',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 6,
        barSpacing: 8,        // slightly wider bars so you can “read” the open/close
        minBarSpacing: 3,
      },
    });

    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      borderVisible: false,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });
    seriesRef.current = series;

    // 2) Initial data + perfect initial view
    (async () => {
      const initial = await fetchInitialData(600);
      if (initial.length) {
        series.setData(initial);

        const last = initial[initial.length - 1];
        setCurrentPrice(last.close);

        // Show exactly the last N bars on first paint
        const lastTime = Number(last.time);
        const from = (lastTime - VISIBLE_BARS * 60) as UTCTimestamp;
        chart.timeScale().setVisibleRange({ from, to: last.time });

        // Autoscale prices for those bars
        // chart.timeScale().scrollToRealTime?.();
      }
      openSocket(); // your same WS logic, but see below for tiny tweak
    })();

    // 3) True responsiveness: ResizeObserver (better than window resize alone)
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        chart.applyOptions({ width, height });
        // keep latest bars visible
        // chart.timeScale().scrollToRealTime?.();
      }
    });
    ro.observe(containerRef.current);

    // fallback for browsers without RO (optional)
    const onWinResize = () => {
      const el = containerRef.current;
      if (!el) return;
      chart.applyOptions({ width: el.clientWidth, height: el.clientHeight });
      // chart.timeScale().scrollToRealTime?.();
    };
    window.addEventListener('resize', onWinResize);

    function openSocket() {
      const url = 'wss://stream.binance.com:9443/stream?streams=btcusdt@kline_1m/btcusdt@trade';
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);

      ws.onmessage = (evt) => {
        const packet = JSON.parse(evt.data);
        const d = packet?.data;
        if (!d) return;

        // trade price for the badge
        if (d.e === 'trade' && d.s === 'BTCUSDT') {
          const p = parseFloat(d.p);
          if (!Number.isNaN(p)) setCurrentPrice(p);
          return;
        }

        // kline: one update updates current bar or appends a new one
        const k = d.k;
        if (k && seriesRef.current) {
          const bar = {
            time: Math.floor(k.t / 1000) as UTCTimestamp,
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
          };
          seriesRef.current.update(bar);

          // keep chart on the right edge while streaming
          // chart.timeScale().scrollToRealTime?.();
          // setUpdateCounter(c => c + 1);
        }
      };
    }

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWinResize);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-900">
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">BTC/USDT Live Chart</h2>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-300">{isConnected ? 'Live' : 'Disconnected'}</span>
          </div>
          {currentPrice !== null && (
            <div className="text-lg font-bold text-green-400">
              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>
      </div>

      {/* Responsive container: fills parent; tweak heights per breakpoint */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[78vh]">
        <div
          ref={containerRef}
          className="absolute inset-0 border border-gray-700 rounded-lg overflow-hidden"
        />
        {/* overlays kept as-is */}
        <div className="absolute top-4 left-4 text-white text-sm">
          <div className="bg-black/50 px-3 py-2 rounded-lg">
            <div className="font-medium">1m</div>
            <div className="text-gray-300">Timeframe</div>
          </div>
        </div>
        <div className="absolute top-4 right-4 text-white text-sm">
          <div className="bg-black/50 px-3 py-2 rounded-lg text-right">
            <div className="font-medium">BTC/USDT</div>
            <div className="text-gray-300">
              {currentPrice !== null ? `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
