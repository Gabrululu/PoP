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
        background: '#ffffff',
        border: 'none',
        borderBottom: '1px solid #2c2c2c14',
        cursor: 'pointer',
        gap: 0,
        textAlign: 'left',
      }}
    >
      {/* Prize pool column */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, color: '#8a8a8a', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>
          {isES ? 'Premio esta semana' : 'Weekly prize'}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#3a8a68', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.8px', lineHeight: 1 }}>
            {prizePoolUsd.toFixed(3)}
          </span>
          <span style={{ fontSize: 10, color: '#68c3a0', fontWeight: 600 }}>USDm</span>
        </div>
        {/* Breakdown: platform seed + from sales */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
          <span style={{ fontSize: 9, color: '#8a8a8a' }}>
            🌱 {platformSeededUsd.toFixed(2)}
          </span>
          <span style={{ fontSize: 9, color: '#b0aca3' }}>+</span>
          <span style={{ fontSize: 9, color: '#8a8a8a' }}>
            🎨 {fromSales.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, background: '#2c2c2c14', margin: '0 12px', flexShrink: 0 }} />

      {/* My projection */}
      {projected !== null ? (
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: '#c8983a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
            {isES ? `Si ganas #${myRank}` : `If you win #${myRank}`}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fabe49', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px', lineHeight: 1 }}>
            ~{projected.toFixed(3)}
          </div>
          <div style={{ fontSize: 9, color: '#c8983a', marginTop: 3 }}>USDm</div>
        </div>
      ) : (
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: '#8a8a8a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
            {isES ? `Temporada ${season.number}` : `Season ${season.number}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fabe49', display: 'inline-block' }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#c8983a', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px', lineHeight: 1 }}>
              {season.label}
            </span>
          </div>
          <div style={{ fontSize: 9, color: '#8a8a8a', marginTop: 3 }}>
            {isES ? 'hasta distribución' : 'until distribution'}
          </div>
        </div>
      )}

      {/* Arrow */}
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8, flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2c2c2c40" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </button>
  );
}
