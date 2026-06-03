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
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)' }} />
      <div
        className="slide-up"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, margin: '0 auto',
          width: '100%', maxWidth: '390px',
          background: '#1a1a2e', borderTop: '0.5px solid #35d07f',
          borderRadius: '16px 16px 0 0', padding: '14px 16px 24px', zIndex: 70,
        }}
      >
        <div style={{ width: 36, height: 4, background: '#2a2a4a', borderRadius: 2, margin: '0 auto 14px' }} />

        {/* Color + coords */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, background: pixel.color, borderRadius: 6, border: '0.5px solid #2a2a4a', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 14, color: '#e0e0f0', fontWeight: 500 }}>{colorName}</div>
            <div style={{ fontSize: 11, color: '#5a5a8a', marginTop: 2 }}>
              {pixel.color.toUpperCase()} · ({pixel.x}, {pixel.y})
            </div>
          </div>
        </div>

        {/* Owner */}
        <div style={{ background: '#0c0c14', border: '0.5px solid #2a2a4a', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#5a5a8a', marginBottom: 4 }}>{T.inspectorOwner}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#35d07f', fontWeight: 500 }}>{owner}</span>
            <span style={{ fontSize: 10, color: '#5a5a8a' }}>{T.inspectorAgo(minutes)}</span>
          </div>
        </div>

        {/* History */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: '#5a5a8a', marginBottom: 6 }}>{T.inspectorHistory}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#c0c0e0', flex: 1 }}>{h.address}</span>
                <span style={{ fontSize: 10, color: '#5a5a8a' }}>{h.ago}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => { onReclaim(); onClose(); }}
          disabled={!canAfford}
          style={{
            width: '100%', padding: '12px',
            background: canAfford ? '#35d07f' : '#1a1a2e',
            color: canAfford ? '#0c0c14' : '#5a5a8a',
            border: canAfford ? 'none' : '0.5px solid #2a2a4a',
            borderRadius: 8, fontSize: 14, fontWeight: 500,
            cursor: canAfford ? 'pointer' : 'not-allowed',
          }}
        >
          {canAfford ? T.inspectorReclaim : T.inspectorInsufficient}
        </button>
      </div>
    </>
  );
}
