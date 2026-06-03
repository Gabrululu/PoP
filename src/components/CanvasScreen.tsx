'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Tool, InspectorPixel } from '@/types';
import { PALETTE, COLS, ROWS, PIXEL_SCALE } from '@/constants';
import { useLang } from '@/contexts/LangContext';

interface Props {
  balance: number;
  selectedColor: string;
  selectedTool: Tool;
  pixels: string[][];
  coords: { x: number; y: number };
  txToday: number;
  isMiniPay: boolean;
  onPaint: (x: number, y: number) => void;
  onColorSelect: (color: string) => void;
  onToolSelect: (tool: Tool) => void;
  onCoordsChange: (coords: { x: number; y: number }) => void;
  onShowFeed: () => void;
  onInspect: (pixel: InspectorPixel) => void;
}

export default function CanvasScreen({
  balance, selectedColor, selectedTool, pixels, coords, txToday,
  isMiniPay, onPaint, onColorSelect, onToolSelect, onCoordsChange,
  onShowFeed, onInspect,
}: Props) {
  const { T, toggleLang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flashPixel, setFlashPixel] = useState<{ x: number; y: number } | null>(null);
  const canAfford = balance >= 0.01;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#06060e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * PIXEL_SCALE, y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
      });
    });

    if (flashPixel) {
      const { x, y } = flashPixel;
      ctx.strokeStyle = '#ffffff';
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
    if (!canAfford) return;
    onPaint(coords.x, coords.y);
    onInspect({ x: coords.x, y: coords.y, color: selectedColor });
    setFlashPixel(coords);
    setTimeout(() => setFlashPixel(null), 150);
  };

  const toolBtn = (id: Tool, icon: React.ReactNode, label: string) => {
    const active = selectedTool === id;
    return (
      <button
        key={id}
        onClick={() => onToolSelect(id)}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '7px 0',
          borderRadius: 8,
          background: active ? '#0d2018' : '#1a1a2e',
          border: active ? '0.5px solid #35d07f' : '0.5px solid #2a2a4a',
          color: active ? '#35d07f' : '#5a5a8a',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 64, overflowY: 'auto' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 8px' }}>
        <span style={{ fontSize: 14, color: '#e0e0f0', fontWeight: 500 }}>PixelCelo</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isMiniPay && (
            <div style={{ background: '#0d2018', border: '0.5px solid #35d07f', borderRadius: 20, padding: '4px 10px' }}>
              <span style={{ fontSize: 11, color: '#35d07f' }}>{T.miniPay}</span>
            </div>
          )}
          <div style={{ background: '#0d2018', border: '0.5px solid #35d07f', borderRadius: 20, padding: '4px 10px' }}>
            <span style={{ fontSize: 12, color: '#35d07f', fontWeight: 500 }}>{balance.toFixed(2)} cUSD</span>
          </div>
          <button
            onClick={onShowFeed}
            style={{ background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 20, padding: '4px 10px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: 10, color: '#35d07f' }}>{T.live}</span>
          </button>
          <button
            onClick={toggleLang}
            style={{ background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 20, padding: '4px 10px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: 10, color: '#5a5a8a', fontWeight: 500 }}>{T.langToggle}</span>
          </button>
        </div>
      </div>

      {/* Canvas card */}
      <div style={{ margin: '0 12px 10px', background: '#06060e', border: '0.5px solid #2a2a4a', borderRadius: 8, padding: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: '#5a5a8a' }}>{T.muralLabel}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button style={{ background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 4, width: 22, height: 22, color: '#e0e0f0', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>−</button>
            <span style={{ fontSize: 10, color: '#5a5a8a' }}>8x</span>
            <button style={{ background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 4, width: 22, height: 22, color: '#e0e0f0', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          style={{
            width: '100%',
            aspectRatio: `${COLS}/${ROWS}`,
            imageRendering: 'pixelated',
            cursor: selectedTool === 'zoom' ? 'zoom-in' : 'crosshair',
            display: 'block',
            borderRadius: 4,
          }}
        />
      </div>

      {/* Tool row */}
      <div style={{ display: 'flex', gap: 6, padding: '0 12px', marginBottom: 10 }}>
        {toolBtn('paint',
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
          T.toolPaint
        )}
        {toolBtn('picker',
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2 1.17 9.83a2 2 0 0 0 0 2.83L9 20.66l7.83-7.83a2 2 0 0 0 0-2.83L9 2z"/><path d="M20 7 22 5"/><path d="M16 11l6 6"/></svg>,
          T.toolColor
        )}
        {toolBtn('zoom',
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
          T.toolZoom
        )}
      </div>

      {/* Color palette */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 12px', marginBottom: 10 }}>
        {PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => { onColorSelect(color); onToolSelect('paint'); }}
            style={{
              width: 28, height: 28, borderRadius: 4, background: color,
              border: selectedColor === color ? '1.5px solid #ffffff' : '1.5px solid transparent',
              cursor: 'pointer', flexShrink: 0, transition: 'border-color 0.1s',
            }}
          />
        ))}
      </div>

      {/* Coords */}
      <div style={{ padding: '0 12px', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: '#5a5a8a', fontVariantNumeric: 'tabular-nums' }}>
          {T.cursor(coords.x, coords.y)}
        </span>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 12px', marginBottom: 10 }}>
        <button
          onClick={handleCTAPaint}
          disabled={!canAfford}
          style={{
            width: '100%', padding: '13px',
            background: canAfford ? '#35d07f' : '#1a2018',
            color: canAfford ? '#0c0c14' : '#5a5a8a',
            border: canAfford ? 'none' : '0.5px solid #2a2a4a',
            borderRadius: 8, fontSize: 14, fontWeight: 500,
            cursor: canAfford ? 'pointer' : 'not-allowed',
          }}
        >
          {canAfford ? T.paintCta : T.insufficientBalance}
        </button>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px 4px' }}>
        <span style={{ fontSize: 11, color: '#5a5a8a' }}>{T.pixelsToday}</span>
        <span style={{ fontSize: 11, color: '#35d07f', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          {txToday.toLocaleString('es')} txs
        </span>
      </div>
    </div>
  );
}
