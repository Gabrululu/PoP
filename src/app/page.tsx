'use client';
import { useState, useEffect, useCallback } from 'react';
import { LangProvider } from '@/contexts/LangContext';
import BottomNav from '@/components/BottomNav';
import CanvasScreen from '@/components/CanvasScreen';
import ZonasScreen from '@/components/ZonasScreen';
import StatsScreen from '@/components/StatsScreen';
import PixelInspector from '@/components/PixelInspector';
import LiveFeed from '@/components/LiveFeed';
import { Screen, Tool, Zone, InspectorPixel, FeedItem } from '@/types';
import { PALETTE, COLS, ROWS, DEMO_ADDRESSES, shortAddr } from '@/constants';

function initPixels(): string[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => PALETTE[Math.floor(Math.random() * PALETTE.length)])
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>('canvas');
  const [balance, setBalance] = useState(2.40);
  const [selectedColor, setSelectedColor] = useState('#e24b4a');
  const [selectedTool, setSelectedTool] = useState<Tool>('paint');
  const [pixels, setPixels] = useState<string[][]>(initPixels);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [totalPainted, setTotalPainted] = useState(0);
  const [txToday, setTxToday] = useState(0);
  const [inspectorPixel, setInspectorPixel] = useState<InspectorPixel | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [showFeed, setShowFeed] = useState(false);
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    setIsMiniPay(!!(window as unknown as { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const item: FeedItem = {
        id: `${Date.now()}-${Math.random()}`,
        address: shortAddr(DEMO_ADDRESSES[Math.floor(Math.random() * DEMO_ADDRESSES.length)]),
        x: Math.floor(Math.random() * 512),
        y: Math.floor(Math.random() * 512),
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        timestamp: Date.now(),
      };
      setFeed(prev => [item, ...prev].slice(0, 20));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handlePaint = useCallback((x: number, y: number) => {
    setPixels(prev => {
      const next = prev.map(row => [...row]);
      next[y][x] = selectedColor;
      return next;
    });
    setBalance(prev => Math.max(0, +(prev - 0.01).toFixed(2)));
    setTotalPainted(prev => prev + 1);
    setTxToday(prev => prev + 1);
  }, [selectedColor]);

  const handleBalanceDeduct = (amount: number) => {
    setBalance(prev => Math.max(0, +(prev - amount).toFixed(2)));
  };

  return (
    <div style={{ background: '#0c0c14', minHeight: '100dvh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '390px', minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#0c0c14' }}>
        {screen === 'canvas' && (
          <CanvasScreen
            balance={balance}
            selectedColor={selectedColor}
            selectedTool={selectedTool}
            pixels={pixels}
            coords={coords}
            txToday={txToday}
            isMiniPay={isMiniPay}
            onPaint={handlePaint}
            onColorSelect={setSelectedColor}
            onToolSelect={setSelectedTool}
            onCoordsChange={setCoords}
            onShowFeed={() => setShowFeed(true)}
            onInspect={setInspectorPixel}
          />
        )}
        {screen === 'zonas' && (
          <ZonasScreen
            zones={zones}
            balance={balance}
            onZonesChange={setZones}
            onBalanceDeduct={handleBalanceDeduct}
          />
        )}
        {screen === 'stats' && (
          <StatsScreen totalPainted={totalPainted} txToday={txToday} />
        )}

        <BottomNav screen={screen} onNavigate={setScreen} />

        {inspectorPixel && (
          <PixelInspector
            pixel={inspectorPixel}
            balance={balance}
            onClose={() => setInspectorPixel(null)}
            onReclaim={() => {
              handlePaint(inspectorPixel.x, inspectorPixel.y);
              setInspectorPixel(null);
            }}
          />
        )}

        {showFeed && <LiveFeed feed={feed} onClose={() => setShowFeed(false)} />}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <LangProvider>
      <App />
    </LangProvider>
  );
}
