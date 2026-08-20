'use client';
import { TOTAL_PIXELS } from '@/constants';
import { useLang } from '@/contexts/LangContext';
import { useTotalPainted } from '@/hooks/useCanvasData';

interface Props {
  txToday: number;
}

export default function StatsScreen({ txToday }: Props) {
  const { T, toggleLang } = useLang();
  const chainTotal = useTotalPainted();

  const completedPct = ((chainTotal / TOTAL_PIXELS) * 100);
  const barWidth = Math.min(completedPct, 100);
  const usdmRaised = (chainTotal * 0.01).toFixed(2);

  const metrics = [
    {
      label: T.statsPixelsLabel,
      value: chainTotal.toLocaleString(),
      accent: false,
      icon: '🎨',
    },
    {
      label: T.statsUsdmLabel,
      value: `${usdmRaised}`,
      unit: 'USDm',
      accent: true,
      icon: '💰',
    },
    {
      label: T.statsTxsLabel,
      value: txToday.toLocaleString(),
      accent: false,
      icon: '⚡',
    },
    {
      label: T.statsCompletedLabel,
      value: `${completedPct.toFixed(3)}%`,
      accent: false,
      icon: '📊',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 64, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px' }}>
        <span className="font-display" style={{ fontSize: 20, color: '#2c2c2c' }}>
          {T.statsHeader}
        </span>
        <button
          onClick={toggleLang}
          style={{ background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 20, padding: '3px 10px', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 600 }}>{T.langToggle}</span>
        </button>
      </div>

      {/* Metric grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 12px', marginBottom: 14 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: '#ffffff',
              border: '1px solid #2c2c2c14',
              borderRadius: 16,
              padding: '14px 12px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {m.accent && (
              <div style={{
                position: 'absolute', bottom: -20, right: -20,
                width: 80, height: 80,
                background: '#68c3a0',
                borderRadius: '50%',
                opacity: 0.12,
                filter: 'blur(20px)',
              }} />
            )}
            <div style={{ fontSize: 18, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 600, marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {m.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: m.accent ? '#3a8a68' : '#2c2c2c', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>
                {m.value}
              </span>
              {m.unit && <span style={{ fontSize: 11, color: '#8a8a8a', fontWeight: 500 }}>{m.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Canvas completion */}
      <div style={{ margin: '0 12px 14px' }}>
        <div style={{
          background: '#68c3a0',
          borderRadius: 20,
          padding: '16px',
          boxShadow: '0 4px 0 0 #4a9c7c',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: '#ffffffcc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                {T.statsProgressLabel}
              </div>
              <div style={{ fontSize: 11, color: '#ffffffcc' }}>
                {T.statsPixelsCount(chainTotal.toLocaleString(), TOTAL_PIXELS.toLocaleString())} píxeles
              </div>
            </div>
            <div className="font-display" style={{ fontSize: 30, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
              {completedPct.toFixed(2)}
              <span style={{ fontSize: 14, color: '#ffffffb3' }}>%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: '#ffffff40', borderRadius: 6, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.max(barWidth, 0.5)}%`,
              background: '#ffffff',
              borderRadius: 6,
              transition: 'width 0.8s ease',
            }} />
          </div>

          <div style={{ marginTop: 8, fontSize: 10, color: '#ffffffb3' }}>
            {TOTAL_PIXELS.toLocaleString()} píxeles totales · 512 × 512
          </div>
        </div>
      </div>

      {/* Network info */}
      <div style={{ margin: '0 12px', background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 16, padding: '12px 14px' }}>
        <div style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Red
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Red', value: 'Celo Sepolia' },
            { label: 'Contrato', value: '0x5601…c3d8' },
            { label: 'Token', value: 'USDm (Mento)' },
            { label: 'Precio por pixel', value: '0.01 USDm' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#8a8a8a' }}>{label}</span>
              <span style={{ fontSize: 11, color: '#2c2c2c', fontFamily: 'monospace', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
