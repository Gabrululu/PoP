'use client';
import { useFreeClaimStatus } from '@/hooks/useFreeClaimStatus';
import { useLang } from '@/contexts/LangContext';

interface Props {
  isConnected: boolean;
  onFreeClaim: () => void;
  onConnect: () => void;
}

export default function FreeClaimBadge({ isConnected, onFreeClaim, onConnect }: Props) {
  const { canClaim, countdown } = useFreeClaimStatus();
  const { T } = useLang();
  const isES = T.langToggle === 'EN';

  if (!isConnected) {
    // Tease: show the badge is available but requires login
    return (
      <button
        onClick={onConnect}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#fabe491a',
          border: '1px solid #fabe4966',
          borderRadius: 16,
          cursor: 'pointer',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎁</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2c2c2c', lineHeight: 1.2 }}>
              {isES ? '¡Reclamo gratis disponible!' : 'Free claim available!'}
            </div>
            <div style={{ fontSize: 10, color: '#8a8a8a', marginTop: 1 }}>
              {isES ? 'Conecta para usar tu turno diario' : 'Connect to use your daily turn'}
            </div>
          </div>
        </div>
        <div style={{
          background: '#fabe49',
          borderRadius: 10,
          padding: '4px 10px',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2c2c2c' }}>
            {isES ? 'Conectar' : 'Connect'}
          </span>
        </div>
      </button>
    );
  }

  if (canClaim) {
    return (
      <button
        onClick={onFreeClaim}
        className="glow-btn btn-press"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 14px',
          background: '#fabe49',
          border: 'none',
          borderRadius: 16,
          cursor: 'pointer',
          gap: 10,
          position: 'relative',
          overflow: 'hidden',
          '--btn-shadow-color': '#c8983a',
        } as React.CSSProperties}
      >
        {/* Shimmer */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, #ffffff40 50%, transparent 100%)',
          animation: 'shimmer 2.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <span style={{ fontSize: 20, animation: 'bounce 1s ease-in-out infinite' }}>🎁</span>
          <div style={{ textAlign: 'left' }}>
            <div className="font-display" style={{ fontSize: 14, color: '#2c2c2c', lineHeight: 1.2 }}>
              {isES ? '¡Tu reclamo gratis de hoy!' : "Today's free claim!"}
            </div>
            <div style={{ fontSize: 10, color: '#5a4a20', marginTop: 1 }}>
              {isES ? 'Pinta este píxel sin costo · 1 por día' : 'Paint this pixel for free · 1 per day'}
            </div>
          </div>
        </div>

        <div style={{
          background: '#2c2c2c',
          borderRadius: 10,
          padding: '5px 12px',
          flexShrink: 0,
          position: 'relative',
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#ffffff' }}>
            {isES ? 'Gratis →' : 'Free →'}
          </span>
        </div>
      </button>
    );
  }

  // Already claimed today — show countdown
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '9px 14px',
      background: '#ffffff',
      border: '1px solid #2c2c2c14',
      borderRadius: 16,
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>✅</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#8a8a8a', lineHeight: 1.2 }}>
            {isES ? 'Reclamo diario usado' : 'Daily claim used'}
          </div>
          <div style={{ fontSize: 10, color: '#b0aca3', marginTop: 1 }}>
            {isES ? 'Vuelve mañana para otro gratis' : 'Come back tomorrow for another free one'}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: '#b0aca3', marginBottom: 1 }}>
          {isES ? 'Próximo en' : 'Next in'}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#8a8a8a', fontVariantNumeric: 'tabular-nums' }}>
          {countdown}
        </div>
      </div>
    </div>
  );
}
