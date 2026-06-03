'use client';
import { TOTAL_PIXELS } from '@/constants';

interface Props {
  totalPainted: number;
  txToday: number;
}

export default function StatsScreen({ totalPainted, txToday }: Props) {
  const completedPct = ((totalPainted / TOTAL_PIXELS) * 100).toFixed(2);
  const barWidth = Math.min((totalPainted / TOTAL_PIXELS) * 100, 100);

  const metrics = [
    { label: 'Píxeles pintados', value: totalPainted.toLocaleString('es'), accent: false },
    { label: 'cUSD recaudado',   value: (totalPainted * 0.01).toFixed(2),  accent: true  },
    { label: 'Txs hoy',          value: txToday.toLocaleString('es'),       accent: false },
    { label: 'Canvas completado',value: `${completedPct}%`,                 accent: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 64, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px' }}>
        <span style={{ fontSize: 16, color: '#e0e0f0', fontWeight: 500 }}>Stats globales</span>
      </div>

      {/* 2×2 metric grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 12px', marginBottom: 14 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{ background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 12, padding: '14px 12px' }}
          >
            <div style={{ fontSize: 10, color: '#5a5a8a', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: m.accent ? '#35d07f' : '#e0e0f0', fontVariantNumeric: 'tabular-nums' }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Top painters */}
      <div style={{ margin: '0 12px', background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#5a5a8a', marginBottom: 10 }}>Top pintores · esta semana</div>
        {totalPainted === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🎨</div>
            <div style={{ fontSize: 13, color: '#5a5a8a' }}>Sé el primero en pintar</div>
            <div style={{ fontSize: 11, color: '#3a3a5a', marginTop: 4 }}>El ranking aparecerá aquí</div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0d2018', borderRadius: 8, padding: '8px 10px' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#f59e0b', width: 16, textAlign: 'center', flexShrink: 0 }}>1</span>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2a2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🧙</div>
            <span style={{ fontSize: 12, color: '#35d07f', flex: 1, fontWeight: 500 }}>tú</span>
            <span style={{ fontSize: 12, color: '#35d07f', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
              {totalPainted.toLocaleString('es')}
            </span>
          </div>
        )}
      </div>

      {/* Canvas completion */}
      <div style={{ margin: '0 12px', background: '#1a2e22', border: '0.5px solid #2a4a38', borderRadius: 12, padding: '14px', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#5a8a6a' }}>canvas completado</span>
          <span style={{ fontSize: 18, color: '#35d07f', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
            {completedPct}%
          </span>
        </div>
        <div style={{ background: '#0d1f16', border: '0.5px solid #2a4a38', borderRadius: 3, height: 6, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${barWidth}%`,
              background: '#35d07f',
              borderRadius: 3,
              transition: 'width 0.6s ease',
              minWidth: totalPainted > 0 ? 4 : 0,
            }}
          />
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: '#5a8a6a' }}>
          {totalPainted.toLocaleString('es')} / {TOTAL_PIXELS.toLocaleString('es')} píxeles
        </div>
      </div>
    </div>
  );
}
