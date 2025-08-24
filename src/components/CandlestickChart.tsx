'use client';

import { CandlestickSeries, createChart, ColorType, Time } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

interface CandlestickData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

const CandlestickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Function to fetch initial historical data
  const fetchInitialData = async (limit: number = 2000, endTime?: number) => {
    try {
      let url = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=${limit}`;
      if (endTime) {
        url += `&endTime=${endTime}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.length === 0) return [];
      
      const historicalData: CandlestickData[] = data.map((kline: any[]) => ({
        time: Math.floor(kline[0] / 1000) as Time,
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4])
      }));

      // Sort data by time to ensure ascending order
      historicalData.sort((a, b) => Number(a.time) - Number(b.time));

      return historicalData;
    } catch (error) {
      console.error('Error fetching initial data:', error);
      return [];
    }
  };

  // Handle time scale visible range changes to load more history
  const handleVisibleRangeChange = async (timeRange: any) => {
    console.log('handleVisibleRangeChange called with:', timeRange);
    
    if (!timeRange || !timeRange.from || !chartRef.current || !chartContainerRef.current || !seriesRef.current) {
      console.log('Early return - missing required data:', {
        hasTimeRange: !!timeRange,
        hasFrom: !!(timeRange && timeRange.from),
        hasChartRef: !!chartRef.current,
        hasContainerRef: !!chartContainerRef.current,
        hasSeriesRef: !!seriesRef.current
      });
      return;
    }
    
    const fromTime = Number(timeRange.from);
    const currentData = seriesRef.current.data();
    
    console.log('Processing visible range change:', {
      fromTime,
      currentDataLength: currentData.length,
      earliestTime: currentData.length > 0 ? Number(currentData[0].time) : 'N/A'
    });
    
    if (currentData.length === 0) return;
    
    const earliestLoadedTime = Number(currentData[0].time);
    
    // If we're scrolling back more than 50 bars from the earliest loaded data, load more
    if (fromTime < earliestLoadedTime - 3000) { // 3000 seconds = 50 minutes
      console.log('Loading more historical data...');
      const moreData = await fetchInitialData(2000, earliestLoadedTime * 1000);
      
      if (moreData.length > 0 && chartRef.current && chartContainerRef.current && seriesRef.current) {
        // Get current data and combine with new data
        const combinedData = [...moreData, ...currentData];
        
        // Sort the combined data by time to ensure ascending order
        combinedData.sort((a, b) => Number(a.time) - Number(b.time));
        
        // Remove duplicates based on time
        const uniqueData = combinedData.filter((item, index, self) => 
          index === 0 || item.time !== self[index - 1].time
        );
        
        seriesRef.current.setData(uniqueData);
        console.log('More historical data loaded:', uniqueData.length, 'total candlesticks');
      }
    } else {
      console.log('No need to load more data yet. fromTime:', fromTime, 'earliestLoadedTime:', earliestLoadedTime);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Chart options with dark theme
    const chartOptions = {
      layout: {
        textColor: '#d1d4dc',
        background: { type: ColorType.Solid, color: '#131722' }
      },
      grid: {
        vertLines: { color: '#363c4e' },
        horzLines: { color: '#363c4e' }
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#758696',
          width: 1 as any,
          style: 3,
          labelBackgroundColor: '#131722',
        },
        horzLine: {
          color: '#758696',
          width: 1 as any,
          style: 3,
          labelBackgroundColor: '#131722',
        },
      },
      rightPriceScale: {
        borderColor: '#363c4e',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        visible: true,
        borderVisible: true,
        drawTicks: true,
        entireTextOnly: false,
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: '#363c4e',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12, // Reduced for better real-time visibility
        barSpacing: 6, // Balanced spacing for real-time updates
        minBarSpacing: 2, // Allow tighter spacing for mobile
        fixLeftEdge: false, // Allow scrolling left for historical data
        fixRightEdge: false, // Allow real-time updates to extend right
        lockVisibleTimeRangeOnResize: false, // Allow time range changes
        rightBarStaysOnScroll: true, // Keep latest data visible
        borderVisible: true,
        visible: true,
        scaleMargins: {
          left: 0.1,
          right: 0.1, // Reduced right margin for better real-time visibility
        },
        // Real-time friendly time labels
        ticksVisible: true,
        timeUnit: 'minute',
        // Show time markers more frequently for real-time trading
        markFormatter: (time: Time) => {
          const date = new Date(Number(time) * 1000);
          const minutes = date.getMinutes();
          
          // Show major time markers every 10 minutes for better real-time visibility
          if (minutes % 10 === 0) {
            return date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            });
          }
          
          // Show minor markers every 2 minutes for real-time updates
          if (minutes % 2 === 0) {
            return date.getMinutes().toString();
          }
          
          return '';
        },
        tickMarkFormatter: (time: Time) => {
          const date = new Date(Number(time) * 1000);
          const minutes = date.getMinutes();
          
          // Show time labels every 2 minutes for real-time visibility
          if (minutes % 2 === 0) {
            return date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            });
          }
          
          // Show shorter labels for other minutes
          return date.getMinutes().toString();
        },
        // Optimized spacing for real-time updates
        labelSpacing: 15,
        tickMarkSpacing: 10
      },
      watermark: {
        visible: true,
        fontSize: 24,
        text: 'BTC/USDT',
        color: 'rgba(255, 255, 255, 0.1)',
        horzAlign: 'center',
        vertAlign: 'center',
      }
    };

    // Create the chart
    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;
    
    console.log('Chart created:', chart);
    console.log('Chart container dimensions:', {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight
    });

    // Add candlestick series with enhanced styling
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceFormat: {
        type: 'price',
        precision: 6,
        minMove: 0.000001,
      }
    });
    seriesRef.current = candlestickSeries;
    
    console.log('Candlestick series created:', candlestickSeries);
    console.log('Series ref set:', seriesRef.current);

    // Load initial data
    const loadInitialData = async () => {
      try {
        console.log('Loading initial data...');
        let initialData = await fetchInitialData(2000);
        
        // If no data from API, use sample data as fallback
        if (initialData.length === 0) {
          console.log('No API data, using sample data');
          const now = Math.floor(Date.now() / 1000);
          initialData = [];
          for (let i = 50; i >= 0; i--) {
            const time = now - (i * 60); // 1 minute intervals
            const basePrice = 50000 + Math.random() * 10000;
            initialData.push({
              time: time as Time,
              open: basePrice,
              high: basePrice + Math.random() * 1000,
              low: basePrice - Math.random() * 1000,
              close: basePrice + (Math.random() - 0.5) * 2000,
            });
          }
        }
        
        console.log('Initial data loaded:', initialData.length, 'candlesticks');
        
        if (initialData.length > 0 && chart && chartContainerRef.current) {
          candlestickSeries.setData(initialData);
          console.log('Data set to chart, length:', initialData.length);
          console.log('First data point:', initialData[0]);
          console.log('Last data point:', initialData[initialData.length - 1]);
          
          // Position chart to show recent data and prepare for real-time updates
          const lastTime = Number(initialData[initialData.length - 1].time);
          const currentTime = Math.floor(Date.now() / 1000);
          
          // If the last data is recent (within last 5 minutes), show it centered
          if (lastTime >= currentTime - 300) {
            // Show last 30 minutes of data for real-time trading
            chart.timeScale().setVisibleRange({
              from: (lastTime - 1800) as Time, // 30 minutes ago
              to: (lastTime + 60) as Time // 1 minute into future for real-time updates
            });
            console.log('Chart positioned for real-time trading');
          } else {
            // Show last 20% of data for historical view
            const firstTime = Number(initialData[0].time);
            const timeRange = lastTime - firstTime;
            chart.timeScale().setVisibleRange({
              from: (lastTime - timeRange * 0.2) as Time,
              to: (lastTime + 60) as Time
            });
            console.log('Chart positioned for historical view');
          }
          
          console.log('Visible range set:', {
            from: new Date(Number(chart.timeScale().getVisibleRange()?.from || 0) * 1000),
            to: new Date(Number(chart.timeScale().getVisibleRange()?.to || 0) * 1000)
          });
        } else {
          console.error('No initial data received or chart destroyed');
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();

    // Subscribe to visible range changes
    chart.timeScale().subscribeVisibleTimeRangeChange(handleVisibleRangeChange);
    console.log('Subscribed to visible range changes');

    // Test the subscription by manually triggering a visible range change
    setTimeout(() => {
      if (chart && chartContainerRef.current) {
        console.log('Testing visible range change subscription...');
        // This should trigger the handler
        chart.timeScale().setVisibleRange({
          from: (Math.floor(Date.now() / 1000) - 3600) as Time, // 1 hour ago
          to: Math.floor(Date.now() / 1000) as Time
        });
      }
    }, 2000);

    // Handle window resize
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.clientWidth;
        const containerHeight = chartContainerRef.current.clientHeight;
        
        // Apply responsive sizing
        chart.applyOptions({ 
          width: containerWidth || 800,
          height: containerHeight || 600
        });
        
        // Adjust chart options based on screen size for real-time updates
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          chart.timeScale().applyOptions({
            rightOffset: 8, // Smaller offset for mobile real-time
            barSpacing: 4, // Tighter spacing for mobile
            minBarSpacing: 2,
          });
        } else {
          chart.timeScale().applyOptions({
            rightOffset: 12, // Optimized for real-time desktop
            barSpacing: 6,
            minBarSpacing: 2,
          });
        }
      }
    };

    // Initial resize call
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart && chartContainerRef.current) {
        chart.timeScale().unsubscribeVisibleTimeRangeChange(handleVisibleRangeChange);
        chart.remove();
      }
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []); // Remove dependencies to prevent recreation

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!seriesRef.current) return;

    console.log('Connecting to WebSocket...');
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");
    wsRef.current = ws;

    // Add connection timeout
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        console.log('WebSocket connection timeout, retrying...');
        ws.close();
      }
    }, 10000);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const candlestick = data.k;

        if (!candlestick) {
          console.log('No candlestick data in message:', data);
          return;
        }

        if (!seriesRef.current || !chartRef.current || !chartContainerRef.current) {
          console.log('Chart references not available:', {
            hasSeries: !!seriesRef.current,
            hasChart: !!chartRef.current,
            hasContainer: !!chartContainerRef.current
          });
          return;
        }

        console.log('Processing candlestick:', candlestick);
        const updateData = {
          time: Math.floor(candlestick.t / 1000) as Time,
          open: parseFloat(candlestick.o),
          high: parseFloat(candlestick.h),
          low: parseFloat(candlestick.l),
          close: parseFloat(candlestick.c),
        };
        
        console.log('Updating with real-time data:', updateData);
        console.log('Current chart data length:', seriesRef.current.data().length);
        
        // Update the last update time for real-time indicator
        setLastUpdateTime(new Date());
        
        // Check if this is a new candlestick or an update to existing one
        const currentData = seriesRef.current.data();
        const existingIndex = currentData.findIndex((item: CandlestickData) => Number(item.time) === Number(updateData.time));
        
        console.log('Existing index:', existingIndex, 'Current data length:', currentData.length);
        
        if (existingIndex >= 0) {
          // Update existing candlestick
          console.log('Updating existing candlestick at index:', existingIndex);
          seriesRef.current.update(updateData);
          
          // Force chart to redraw and ensure latest data is visible
          if (chartRef.current) {
            const timeScale = chartRef.current.timeScale();
            
            // Get current visible range
            const visibleRange = timeScale.getVisibleRange();
            const currentTime = Number(updateData.time);
            
            // If we're updating the current minute, ensure it's visible
            if (visibleRange && visibleRange.to) {
              const visibleEndTime = Number(visibleRange.to);
              
              // If the update is recent (within last 2 minutes), scroll to show it
              if (currentTime >= visibleEndTime - 120) {
                timeScale.scrollToPosition(1, false);
                console.log('Scrolled to show latest update');
              }
            }
            
            // Force chart to redraw
            chartRef.current.resize(
              chartContainerRef.current?.clientWidth || 800,
              chartContainerRef.current?.clientHeight || 600
            );
          }
        } else {
          // Add new candlestick
          console.log('Adding new candlestick');
          const newData = [...currentData, updateData];
          
          // Sort by time to maintain order
          newData.sort((a, b) => Number(a.time) - Number(b.time));
          
          // Set new data
          seriesRef.current.setData(newData);
          
          // Ensure the new candlestick is visible
          if (chartRef.current) {
            const timeScale = chartRef.current.timeScale();
            
            // Scroll to the rightmost position to show latest data
            timeScale.scrollToPosition(1, false);
            
            // Force chart to redraw
            chartRef.current.resize(
              chartContainerRef.current?.clientWidth || 800,
              chartContainerRef.current?.clientHeight || 600
            );
            
            console.log('New candlestick added and chart scrolled to show it');
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      clearTimeout(connectionTimeout);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, []); // Remove dependencies to prevent recreation

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-900">
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">BTC/USDT Live Chart</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-300">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
            {lastUpdateTime && (
              <span className="text-xs text-gray-400">
                Last update: {lastUpdateTime.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        {/* Debug button for testing chart updates */}
        <button
          onClick={() => {
            if (seriesRef.current && chartRef.current) {
              const currentData = seriesRef.current.data();
              console.log('Current chart data:', currentData);
              console.log('Chart ref:', chartRef.current);
              console.log('Series ref:', seriesRef.current);
              
              // Test manual update
              const testTime = Math.floor(Date.now() / 1000) as Time;
              const testData = {
                time: testTime,
                open: 50000 + Math.random() * 1000,
                high: 50000 + Math.random() * 1000,
                low: 50000 + Math.random() * 1000,
                close: 50000 + Math.random() * 1000,
              };
              console.log('Testing manual update with:', testData);
              seriesRef.current.update(testData);
            }
          }}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Test Update
        </button>
      </div>
      
      {/* Chart Container with enhanced styling */}
      <div className="relative">
        <div 
          ref={chartContainerRef} 
          className="w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden"
          style={{ minHeight: '400px' }}
        />
        
        {/* Chart overlay info */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white text-xs sm:text-sm">
          <div className="bg-black bg-opacity-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
            <div className="font-medium">1m</div>
            <div className="text-gray-300 text-xs">Timeframe</div>
          </div>
        </div>
        
        {/* Price info overlay */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-xs sm:text-sm">
          <div className="bg-black bg-opacity-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-right">
            <div className="font-medium">BTC/USDT</div>
            <div className="text-gray-300 text-xs">Live Price</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;