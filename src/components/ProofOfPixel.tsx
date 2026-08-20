'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { LangProvider } from '@/contexts/LangContext';
import { Web3Provider } from '@/contexts/Web3Provider';
import BottomNav from '@/components/BottomNav';
import CanvasScreen from '@/components/CanvasScreen';
import LeaderboardScreen from '@/components/LeaderboardScreen';
import StatsScreen from '@/components/StatsScreen';
import PixelInspector from '@/components/PixelInspector';
import LiveFeed from '@/components/LiveFeed';
import LoginModal from '@/components/LoginModal';
import ReclaimToast, { ReclaimEvent } from '@/components/ReclaimToast';
import { Screen, Tool, InspectorPixel, FeedItem } from '@/types';
import { Mark } from '@/constants/marks';
import { PALETTE, COLS, ROWS, DEMO_ADDRESSES, shortAddr } from '@/constants';
import { useWallet } from '@/hooks/useWallet';
import { usePaintPixel } from '@/hooks/usePaintPixel';
import { useUSDmBalance, usePixelEvents } from '@/hooks/useCanvasData';
import { useLeaderboard } from '@/hooks/useLeaderboard';

function initPixels(): string[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => PALETTE[Math.floor(Math.random() * PALETTE.length)])
  );
}

const PALETTE_INDEX: Record<string, number> = Object.fromEntries(PALETTE.map((c, i) => [c, i]));

function App() {
  const [screen, setScreen]               = useState<Screen>('canvas');
  const [selectedColor, setSelectedColor] = useState('#e24b4a');
  const [selectedTool, setSelectedTool]   = useState<Tool>('paint');
  const [pixels, setPixels]               = useState<string[][]>(initPixels);
  const [coords, setCoords]               = useState({ x: 0, y: 0 });
  const [inspectorPixel, setInspectorPixel] = useState<InspectorPixel | null>(null);
  const [localFeed, setLocalFeed]         = useState<FeedItem[]>([]);
  const [showFeed, setShowFeed]           = useState(false);
  const [showLogin, setShowLogin]         = useState(false);
  const [txToday, setTxToday]             = useState(0);
  const [userMarks, setUserMarks]         = useState<Mark[]>([]);
  const [reclaimEvents, setReclaimEvents] = useState<ReclaimEvent[]>([]);

  // Track which pixels the connected user has painted this session
  const myPixelsRef = useRef<Set<string>>(new Set());

  const { address, isConnected } = useWallet();
  const { balance: usdmBalance, refetch: refetchBalance } = useUSDmBalance();
  const { feed: eventFeed } = usePixelEvents();
  const { paint, freeClaim, status: paintStatus } = usePaintPixel();
  const { prizePoolUsd, platformSeededUsd, myRank } = useLeaderboard();

  const isMiniPay = typeof window !== 'undefined' &&
    !!(window as unknown as { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay;

  const balance      = usdmBalance ?? 0;
  const feed         = [...eventFeed, ...localFeed].slice(0, 20);

  // Simulated feed while disconnected
  useEffect(() => {
    if (isConnected) return;
    const interval = setInterval(() => {
      const item: FeedItem = {
        id: `${Date.now()}-${Math.random()}`,
        address: shortAddr(DEMO_ADDRESSES[Math.floor(Math.random() * DEMO_ADDRESSES.length)]),
        x: Math.floor(Math.random() * 512),
        y: Math.floor(Math.random() * 512),
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        timestamp: Date.now(),
      };
      setLocalFeed(prev => [item, ...prev].slice(0, 20));
    }, 2500);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Process on-chain events: update canvas + detect reclaims
  useEffect(() => {
    if (eventFeed.length === 0) return;
    const latest = eventFeed[0];

    // Update canvas pixel
    if (latest.x < COLS && latest.y < ROWS) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs local canvas with incoming on-chain PixelPainted events
      setPixels(prev => {
        const next = prev.map(row => [...row]);
        next[latest.y][latest.x] = latest.color;
        return next;
      });
    }

    // Reclaim detection: was this pixel in user's set and painted by someone else?
    const key = `${latest.x},${latest.y}`;
    const isOtherPainter = address && latest.address.toLowerCase() !== address.toLowerCase();
    if (isOtherPainter && myPixelsRef.current.has(key)) {
      myPixelsRef.current.delete(key);
      const newReclaim: ReclaimEvent = {
        id: latest.id,
        x: latest.x,
        y: latest.y,
        newPainter: latest.address,
        color: latest.color,
      };
      setReclaimEvents(prev => [...prev, newReclaim].slice(0, 3));
    }
  }, [eventFeed, address]);

  const handlePaint = useCallback(async (x: number, y: number) => {
    if (!isConnected) { setShowLogin(true); return; }
    if (balance < 0.01) return;

    // Optimistic update
    setPixels(prev => {
      const next = prev.map(row => [...row]);
      next[y][x] = selectedColor;
      return next;
    });

    // Track as user's pixel for reclaim detection
    if (address) myPixelsRef.current.add(`${x},${y}`);

    const colorIndex = PALETTE_INDEX[selectedColor] ?? 0;
    await paint(x, y, colorIndex);
    refetchBalance();
    setTxToday(prev => prev + 1);
  }, [balance, selectedColor, isConnected, paint, refetchBalance, address]);

  const handleFreeClaim = useCallback(async (x: number, y: number) => {
    if (!isConnected) { setShowLogin(true); return; }

    const colorIndex = PALETTE_INDEX[selectedColor] ?? 0;

    // Optimistic update
    setPixels(prev => {
      const next = prev.map(row => [...row]);
      next[y][x] = selectedColor;
      return next;
    });
    if (address) myPixelsRef.current.add(`${x},${y}`);

    await freeClaim(x, y, colorIndex);
    setTxToday(prev => prev + 1);
  }, [isConnected, selectedColor, freeClaim, address]);

  const handleCreateMark = useCallback((markData: Omit<Mark, 'id' | 'official' | 'logo'>) => {
    const newMark: Mark = {
      ...markData,
      id: `user-${Date.now()}`,
      official: false,
      logo: 'custom',
    };
    setUserMarks(prev => [...prev, newMark]);
  }, []);

  const isPainting = paintStatus === 'approving' || paintStatus === 'painting';

  return (
    <div style={{ background: '#0c0c14', minHeight: '100dvh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '390px', minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#0c0c14' }}>

        {/* Reclaim notifications */}
        <ReclaimToast
          events={reclaimEvents}
          onDismiss={(id) => setReclaimEvents(prev => prev.filter(e => e.id !== id))}
        />

        {screen === 'canvas' && (
          <CanvasScreen
            balance={balance}
            prizePoolUsd={prizePoolUsd}
            platformSeededUsd={platformSeededUsd}
            myRank={myRank}
            selectedColor={selectedColor}
            selectedTool={selectedTool}
            pixels={pixels}
            coords={coords}
            txToday={txToday}
            isMiniPay={isMiniPay}
            isConnected={isConnected}
            isPainting={isPainting}
            paintStatus={paintStatus}
            address={address}
            userMarks={userMarks}
            onPaint={handlePaint}
            onColorSelect={setSelectedColor}
            onToolSelect={setSelectedTool}
            onCoordsChange={setCoords}
            onShowFeed={() => setShowFeed(true)}
            onInspect={setInspectorPixel}
            onConnect={() => setShowLogin(true)}
            onNavigateLeaderboard={() => setScreen('leaderboard')}
            onCreateMark={handleCreateMark}
            onFreeClaim={handleFreeClaim}
          />
        )}

        {screen === 'leaderboard' && <LeaderboardScreen />}

        {screen === 'stats' && (
          <StatsScreen txToday={txToday} />
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

        {showFeed  && <LiveFeed   feed={feed} onClose={() => setShowFeed(false)} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Web3Provider>
      <LangProvider>
        <App />
      </LangProvider>
    </Web3Provider>
  );
}
