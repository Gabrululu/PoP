'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Tool, InspectorPixel } from '@/types';
import { PALETTE, COLS, ROWS, PIXEL_SCALE } from '@/constants';
import { Mark, OFFICIAL_MARKS } from '@/constants/marks';
import { useLang } from '@/contexts/LangContext';
import { PaintStatus } from '@/hooks/usePaintPixel';
import SeasonBanner from './SeasonBanner';
import MarksOverlay from './MarksOverlay';
import MarksPanel from './MarksPanel';
import FreeClaimBadge from './FreeClaimBadge';

function ToolBtn({ id, icon, label, active, onSelect }: { id: Tool; icon: React.ReactNode; label: string; active: boolean; onSelect: (id: Tool) => void }) {
  return (
    <button
      onClick={() => onSelect(id)}
      style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 5, padding: '8px 0', borderRadius: 14,
        background: active ? '#68c3a026' : '#ffffff',
        border: active ? '2px solid #68c3a0' : '1px solid #2c2c2c14',
        color: active ? '#2c2c2c' : '#8a8a8a',
        fontSize: 11, fontWeight: active ? 700 : 500,
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      {icon}{label}
    </button>
  );
}

interface Props {
  balance: number;
  prizePoolUsd: number;
  platformSeededUsd: number;
  myRank: number;
  selectedColor: string;
  selectedTool: Tool;
  pixels: string[][];
  coords: { x: number; y: number };
  txToday: number;
  isMiniPay: boolean;
  isConnected: boolean;
  isPainting: boolean;
  paintStatus: PaintStatus;
  address?: `0x${string}`;
  userMarks: Mark[];
  onPaint: (x: number, y: number) => void;
  onColorSelect: (color: string) => void;
  onToolSelect: (tool: Tool) => void;
  onCoordsChange: (coords: { x: number; y: number }) => void;
  onShowFeed: () => void;
  onInspect: (pixel: InspectorPixel) => void;
  onConnect: () => void;
  onNavigateLeaderboard: () => void;
  onCreateMark: (mark: Omit<Mark, 'id' | 'official' | 'logo'>) => void;
  onFreeClaim: (x: number, y: number) => void;
}

export default function CanvasScreen({
  balance, prizePoolUsd, platformSeededUsd, myRank,
  selectedColor, selectedTool, pixels, coords, txToday,
  isMiniPay, isConnected, isPainting, paintStatus, address, userMarks,
  onPaint, onColorSelect, onToolSelect, onCoordsChange,
  onShowFeed, onInspect, onConnect, onNavigateLeaderboard, onCreateMark, onFreeClaim,
}: Props) {
  const { T, toggleLang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flashPixel, setFlashPixel] = useState<{ x: number; y: number } | null>(null);
  const [showMarks, setShowMarks] = useState(false);
  const [selectedMark, setSelectedMark] = useState<Mark | null>(null);
  const canAfford = balance >= 0.01;
  const allMarks = [...OFFICIAL_MARKS, ...userMarks];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#f3efe7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * PIXEL_SCALE, y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
      });
    });
    if (flashPixel) {
      const { x, y } = flashPixel;
      ctx.strokeStyle = '#2c2c2c';
      ctx.lineWidth = 2;
      ctx.strokeRect(x * PIXEL_SCALE + 1, y * PIXEL_SCALE + 1, PIXEL_SCALE - 2, PIXEL_SCALE - 2);
    }
  }, [pixels, flashPixel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = COLS * PIXEL_SCALE;
    canvas.height = ROWS * PIXEL_SCALE;
    drawCanvas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const getPixelCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX / PIXEL_SCALE);
    const y = Math.floor((e.clientY - rect.top) * scaleY / PIXEL_SCALE);
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
    return { x, y };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPixelCoords(e);
    if (!pos) return;
    onCoordsChange(pos);
    if (selectedTool === 'picker') { onColorSelect(pixels[pos.y][pos.x]); return; }
    if (selectedTool === 'zoom')   { onInspect({ x: pos.x, y: pos.y, color: pixels[pos.y][pos.x] }); return; }
    if (selectedTool === 'paint' && canAfford) {
      onPaint(pos.x, pos.y);
      onInspect({ x: pos.x, y: pos.y, color: selectedColor });
      setFlashPixel(pos);
      setTimeout(() => setFlashPixel(null), 150);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPixelCoords(e);
    if (pos) onCoordsChange(pos);
  };

  const handleCTAPaint = () => {
    if (!canAfford || isPainting) return;
    onPaint(coords.x, coords.y);
    onInspect({ x: coords.x, y: coords.y, color: selectedColor });
    setFlashPixel(coords);
    setTimeout(() => setFlashPixel(null), 150);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 64, overflowY: 'auto' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-display" style={{ fontSize: 20, color: '#2c2c2c', letterSpacing: '0.02em' }}>
            <span style={{ color: '#68c3a0' }}>PoP</span>
            <span style={{ color: '#8a8a8a', fontSize: 12, marginLeft: 3 }}>Proof of Pixel</span>
          </span>
          {isMiniPay && (
            <span style={{ fontSize: 9, fontWeight: 700, color: '#3a8a68', background: '#68c3a01a', border: '1px solid #68c3a066', borderRadius: 20, padding: '2px 7px' }}>
              MiniPay
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {isConnected && address ? (
            <div style={{ background: '#68c3a01a', border: '1px solid #68c3a066', borderRadius: 20, padding: '4px 10px' }}>
              <span style={{ fontSize: 12, color: '#3a8a68', fontWeight: 700 }}>{balance.toFixed(2)} USDm</span>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="btn-press font-display"
              style={{ background: '#68c3a0', border: 'none', borderRadius: 16, padding: '6px 16px', cursor: 'pointer', '--btn-shadow-color': '#4a9c7c' } as React.CSSProperties}
            >
              <span style={{ fontSize: 12, color: '#ffffff' }}>Conectar</span>
            </button>
          )}
          <button
            onClick={onShowFeed}
            style={{ background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 20, padding: '4px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#68c3a0', display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: '#2c2c2c' }}>{T.live}</span>
          </button>
          <button
            onClick={toggleLang}
            style={{ background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 20, padding: '4px 8px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 600 }}>{T.langToggle}</span>
          </button>
        </div>
      </div>

      {/* Season banner — prize pool + countdown + projection */}
      <SeasonBanner
        prizePoolUsd={prizePoolUsd}
        platformSeededUsd={platformSeededUsd}
        myRank={myRank}
        onOpenLeaderboard={onNavigateLeaderboard}
      />

      {/* Canvas card */}
      <div style={{ margin: '10px 12px 8px', background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 20, padding: 8, boxShadow: '0 4px 0 0 #2c2c2c0a' }}>
        {/* Canvas label row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 600, letterSpacing: '0.05em' }}>{T.muralLabel}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Marks toggle */}
            <button
              onClick={() => setShowMarks(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 3, padding: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#68c3a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span style={{ fontSize: 9, color: '#3a8a68', fontWeight: 700 }}>
                {allMarks.length} {allMarks.length === 1 ? 'marca' : 'marcas'}
              </span>
            </button>
            <span style={{ fontSize: 10, color: '#8a8a8a', fontVariantNumeric: 'tabular-nums' }}>
              {T.cursor(coords.x, coords.y)}
            </span>
          </div>
        </div>

        {/* Canvas + marks overlay container */}
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            style={{
              width: '100%',
              aspectRatio: `${COLS}/${ROWS}`,
              imageRendering: 'pixelated',
              cursor: selectedTool === 'zoom' ? 'zoom-in' : selectedTool === 'picker' ? 'crosshair' : 'cell',
              display: 'block',
            }}
          />
          <MarksOverlay marks={allMarks} onMarkClick={setSelectedMark} />
        </div>
      </div>

      {/* Tools + palette row */}
      <div style={{ padding: '0 12px', marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <ToolBtn id="paint" active={selectedTool === 'paint'} onSelect={onToolSelect}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>}
            label={T.toolPaint}
          />
          <ToolBtn id="picker" active={selectedTool === 'picker'} onSelect={onToolSelect}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2 1.17 9.83a2 2 0 0 0 0 2.83L9 20.66l7.83-7.83a2 2 0 0 0 0-2.83L9 2z"/><path d="M20 7 22 5"/><path d="M16 11l6 6"/></svg>}
            label={T.toolColor}
          />
          <ToolBtn id="zoom" active={selectedTool === 'zoom'} onSelect={onToolSelect}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>}
            label={T.toolZoom}
          />
        </div>

        {/* Palette */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'nowrap' }}>
          {PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => { onColorSelect(color); onToolSelect('paint'); }}
              style={{
                flex: 1, aspectRatio: '1', borderRadius: 9, background: color,
                border: selectedColor === color ? '3px solid #2c2c2c' : '3px solid transparent',
                cursor: 'pointer',
                boxShadow: selectedColor === color ? `0 0 0 1px #ffffff, 0 3px 0 0 #2c2c2c30` : 'none',
                transition: 'all 0.1s', minWidth: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Daily free claim */}
      <div style={{ padding: '0 12px', marginBottom: 7 }}>
        <FreeClaimBadge
          isConnected={isConnected}
          onFreeClaim={() => onFreeClaim(coords.x, coords.y)}
          onConnect={onConnect}
        />
      </div>

      {/* Paid CTA */}
      <div style={{ padding: '0 12px', marginBottom: 6 }}>
        <button
          onClick={!isConnected ? onConnect : handleCTAPaint}
          disabled={isConnected && (!canAfford || isPainting)}
          className="btn-press font-display"
          style={{
            width: '100%', padding: '14px',
            background: isPainting
              ? '#fabe49'
              : canAfford || !isConnected
                ? '#68c3a0'
                : '#ffffff',
            color: isPainting ? '#2c2c2c' : canAfford || !isConnected ? '#ffffff' : '#8a8a8a',
            border: canAfford || !isConnected || isPainting ? 'none' : '1px solid #2c2c2c14',
            borderRadius: 16, fontSize: 16,
            cursor: isPainting ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            '--btn-shadow-color': isPainting ? '#c8983a' : canAfford || !isConnected ? '#4a9c7c' : '#2c2c2c1f',
          } as React.CSSProperties}
        >
          {isPainting
            ? paintStatus === 'approving' ? '⏳ Aprobando USDm…' : '⏳ Pintando en Celo…'
            : !isConnected
              ? '🔗 Conectar para pintar'
              : canAfford ? T.paintCta : T.insufficientBalance}
        </button>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px 4px' }}>
        <span style={{ fontSize: 10, color: '#8a8a8a' }}>{T.pixelsToday}</span>
        <span style={{ fontSize: 11, color: '#3a8a68', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {txToday.toLocaleString('es')}
        </span>
      </div>

      {/* Marks panel */}
      {showMarks && (
        <MarksPanel
          userMarks={userMarks}
          balance={balance}
          onClose={() => setShowMarks(false)}
          onCreateMark={(m) => {
            onCreateMark(m);
            setShowMarks(false);
          }}
        />
      )}

      {/* Mark detail tooltip */}
      {selectedMark && (
        <>
          <div onClick={() => setSelectedMark(null)} style={{ position: 'fixed', inset: 0, zIndex: 65 }} />
          <div
            className="slide-up"
            style={{
              position: 'fixed', bottom: 72, left: 12, right: 12, margin: '0 auto',
              maxWidth: 366,
              background: '#ffffff',
              border: `1px solid ${selectedMark.color}50`,
              borderRadius: 18, padding: '12px 14px',
              zIndex: 66,
              boxShadow: '0 4px 20px rgba(44,44,44,0.12)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${selectedMark.color}20`, border: `1px solid ${selectedMark.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 20 }}>{selectedMark.logo === 'celo' ? '🌱' : '📍'}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#2c2c2c' }}>{selectedMark.name}</div>
              {selectedMark.tagline && <div style={{ fontSize: 11, color: '#8a8a8a', marginTop: 1 }}>{selectedMark.tagline}</div>}
            </div>
            <button onClick={() => setSelectedMark(null)} style={{ background: 'none', border: 'none', color: '#8a8a8a', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        </>
      )}
    </div>
  );
}
