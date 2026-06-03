'use client';
import { useState, useEffect, useCallback } from 'react';
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

function ageFeedItems(items: FeedItem[]): FeedItem[] {
  const now = Date.now();
  return items.map(item => {
    const secs = Math.floor((now - parseInt(item.id)) / 1000);
    const time =
      secs < 60 ? 'ahora' :
      secs < 3600 ? `${Math.floor(secs / 60)} min` :
      `${Math.floor(secs / 3600)} h`;
    return { ...item, time };
  });
}

export default function Home() {
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

  // Live feed: new item every 2.5s + age existing items every 30s
  useEffect(() => {
    const addItem = setInterval(() => {
      const id = `${Date.now()}-${Math.random()}`;
      const item: FeedItem = {
        id,
        address: shortAddr(DEMO_ADDRESSES[Math.floor(Math.random() * DEMO_ADDRESSES.length)]),
        x: Math.floor(Math.random() * 512),
        y: Math.floor(Math.random() * 512),
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        time: 'ahora',
      };
      setFeed(prev => [item, ...prev].slice(0, 20));
    }, 2500);

    const ageItems = setInterval(() => {
      setFeed(prev => ageFeedItems(prev));
    }, 30000);

    return () => { clearInterval(addItem); clearInterval(ageItems); };
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
