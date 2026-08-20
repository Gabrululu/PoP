'use client';
import { useSeasonCountdown } from '@/hooks/useSeasonCountdown';
import { useLang } from '@/contexts/LangContext';

interface Props {
  prizePoolUsd: number;
  platformSeededUsd: number;
  myRank: number;
  onOpenLeaderboard: () => void;
}

// Calculates earnings by rank based on 50/30/20 split
function projectedEarning(prizePool: number, rank: number): number | null {
  if (rank <= 0 || prizePool <= 0) return null;
  const shares = [0.5, 0.3, 0.2];
  return rank <= 3 ? prizePool * shares[rank - 1] : null;
}

export default function SeasonBanner({ prizePoolUsd, platformSeededUsd, myRank, onOpenLeaderboard }: Props) {
  const season = useSeasonCountdown();
  const { T } = useLang();
  const isES = T.langToggle === 'EN';

  const fromSales = Math.max(0, prizePoolUsd - platformSeededUsd);
  const projected = projectedEarning(prizePoolUsd, myRank);

  return (
    <button
      onClick={onOpenLeaderboard}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        padding: '9px 14px',
        background: 'linear-gradient(90deg, #0d2a1a 0%, #0c1220 60%, #0d1a20 100%)',
        border: 'none',
        borderBottom: '1px solid #35d07f18',
        cursor: 'pointer',
        gap: 0,
        textAlign: 'left',
      }}
    >
      {/* Prize pool column */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, color: '#4a7a5a', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>
          {isES ? 'Premio esta semana' : 'Weekly prize'}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#35d07f', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.8px', lineHeight: 1 }}>
            {prizePoolUsd.toFixed(3)}
          </span>
          <span style={{ fontSize: 10, color: '#35d07f70', fontWeight: 600 }}>USDm</span>
        </div>
        {/* Breakdown: platform seed + from sales */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
          <span style={{ fontSize: 9, color: '#4a7a5a' }}>
            🌱 {platformSeededUsd.toFixed(2)}
          </span>
          <span style={{ fontSize: 9, color: '#3a4a3a' }}>+</span>
          <span style={{ fontSize: 9, color: '#4a7a5a' }}>
            🎨 {fromSales.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, background: '#35d07f15', margin: '0 12px', flexShrink: 0 }} />

      {/* My projection */}
      {projected !== null ? (
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: '#f59e0b80', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
            {isES ? `Si ganas #${myRank}` : `If you win #${myRank}`}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px', lineHeight: 1 }}>
            ~{projected.toFixed(3)}
          </div>
          <div style={{ fontSize: 9, color: '#f59e0b60', marginTop: 3 }}>USDm</div>
        </div>
      ) : (
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: '#4a6a7a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
            {isES ? `Temporada ${season.number}` : `Season ${season.number}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px', lineHeight: 1 }}>
              {season.label}
            </span>
          </div>
          <div style={{ fontSize: 9, color: '#4a5a4a', marginTop: 3 }}>
            {isES ? 'hasta distribución' : 'until distribution'}
          </div>
        </div>
      )}

      {/* Arrow */}
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8, flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#35d07f40" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </button>
  );
}
