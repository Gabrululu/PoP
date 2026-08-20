'use client';
import { useMemo } from 'react';
import { InspectorPixel } from '@/types';
import { DEMO_ADDRESSES, shortAddr, COLOR_NAMES, PALETTE } from '@/constants';
import { useLang } from '@/contexts/LangContext';

interface Props {
  pixel: InspectorPixel;
  balance: number;
  onClose: () => void;
  onReclaim: () => void;
}

function seededInt(seed: number, max: number) {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

export default function PixelInspector({ pixel, balance, onClose, onReclaim }: Props) {
  const { T } = useLang();
  const colorName = COLOR_NAMES[pixel.color] ?? pixel.color;
  const canAfford = balance >= 0.01;

  const { owner, minutes, history } = useMemo(() => {
    const seed = pixel.x * 512 + pixel.y;
    const ownerAddr = DEMO_ADDRESSES[seededInt(seed, DEMO_ADDRESSES.length)];
    const mins = seededInt(seed + 1, 29) + 1;
    const hist = [
      { color: PALETTE[seededInt(seed + 2, PALETTE.length)], address: shortAddr(DEMO_ADDRESSES[seededInt(seed + 3, DEMO_ADDRESSES.length)]), ago: `${seededInt(seed + 4, 15) + 2} min` },
      { color: PALETTE[seededInt(seed + 5, PALETTE.length)], address: shortAddr(DEMO_ADDRESSES[seededInt(seed + 6, DEMO_ADDRESSES.length)]), ago: `${seededInt(seed + 7, 30) + 20} min` },
      { color: PALETTE[seededInt(seed + 8, PALETTE.length)], address: shortAddr(DEMO_ADDRESSES[seededInt(seed + 9, DEMO_ADDRESSES.length)]), ago: `${seededInt(seed + 10, 30) + 55} min` },
    ];
    return { owner: shortAddr(ownerAddr), minutes: mins, history: hist };
  }, [pixel.x, pixel.y]);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(44,44,44,0.4)' }} />
      <div
        className="slide-up"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, margin: '0 auto',
          width: '100%', maxWidth: '390px',
          background: '#ffffff',
          borderRadius: '24px 24px 0 0', padding: '14px 16px 24px', zIndex: 70,
          boxShadow: '0 -8px 24px rgba(44,44,44,0.08)',
        }}
      >
        <div style={{ width: 36, height: 4, background: '#2c2c2c1f', borderRadius: 2, margin: '0 auto 14px' }} />

        {/* Color + coords */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, background: pixel.color, borderRadius: 10, border: '1px solid #2c2c2c1f', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 14, color: '#2c2c2c', fontWeight: 500 }}>{colorName}</div>
            <div style={{ fontSize: 11, color: '#8a8a8a', marginTop: 2 }}>
              {pixel.color.toUpperCase()} · ({pixel.x}, {pixel.y})
            </div>
          </div>
        </div>

        {/* Owner */}
        <div style={{ background: '#f3efe7', border: '1px solid #2c2c2c14', borderRadius: 14, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#8a8a8a', marginBottom: 4 }}>{T.inspectorOwner}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#3a8a68', fontWeight: 500 }}>{owner}</span>
            <span style={{ fontSize: 10, color: '#8a8a8a' }}>{T.inspectorAgo(minutes)}</span>
          </div>
        </div>

        {/* History */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: '#8a8a8a', marginBottom: 6 }}>{T.inspectorHistory}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#2c2c2c', flex: 1 }}>{h.address}</span>
                <span style={{ fontSize: 10, color: '#8a8a8a' }}>{h.ago}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => { onReclaim(); onClose(); }}
          disabled={!canAfford}
          className="btn-press"
          style={{
            width: '100%', padding: '12px',
            background: canAfford ? '#68c3a0' : '#ffffff',
            color: canAfford ? '#ffffff' : '#8a8a8a',
            border: canAfford ? 'none' : '1px solid #2c2c2c1f',
            borderRadius: 14, fontSize: 14, fontWeight: 700,
            cursor: canAfford ? 'pointer' : 'not-allowed',
            '--btn-shadow-color': '#4a9c7c',
          } as React.CSSProperties}
        >
          {canAfford ? T.inspectorReclaim : T.inspectorInsufficient}
        </button>
      </div>
    </>
  );
}
