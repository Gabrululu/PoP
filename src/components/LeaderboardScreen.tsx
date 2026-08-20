'use client';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useSeasonCountdown } from '@/hooks/useSeasonCountdown';
import { useLang } from '@/contexts/LangContext';
import { shortAddr } from '@/constants';
import { useAccount } from 'wagmi';

const MEDAL = ['🥇', '🥈', '🥉'];

const RANK_COLORS = [
  { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', text: '#c8983a' },
  { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.35)', text: '#6b7686' },
  { bg: 'rgba(180,120,80,0.12)', border: 'rgba(180,120,80,0.35)', text: '#a8663f' },
];

export default function LeaderboardScreen() {
  const { T, toggleLang } = useLang();
  const { leaders, prizePoolUsd, platformSeededUsd, myPixels, myRank, loading } = useLeaderboard();
  const season = useSeasonCountdown();
  const { address } = useAccount();
  const isES = T.langToggle === 'EN';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 64, overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 10px' }}>
        <span className="font-display" style={{ fontSize: 20, color: '#2c2c2c' }}>
          {T.leaderHeader}
        </span>
        <button onClick={toggleLang} style={{ background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 20, padding: '3px 10px', cursor: 'pointer' }}>
          <span style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 600 }}>{T.langToggle}</span>
        </button>
      </div>

      {/* Season info strip */}
      <div style={{ margin: '0 12px 12px', background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 16, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
            {isES ? `Temporada ${season.number}` : `Season ${season.number}`}
          </div>
          <div style={{ fontSize: 11, color: '#2c2c2c' }}>
            {isES ? 'Los top 3 se reparten el prize pool' : 'Top 3 share the prize pool'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#8a8a8a', marginBottom: 2 }}>
            {isES ? 'Termina en' : 'Ends in'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fabe49', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: '#c8983a', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px' }}>
              {season.label}
            </span>
          </div>
        </div>
      </div>

      {/* Prize Pool Card */}
      <div style={{ margin: '0 12px 12px' }}>
        <div style={{
          background: '#68c3a0',
          borderRadius: 20,
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 0 0 #4a9c7c',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: '#ffffff', borderRadius: '50%', opacity: 0.12, filter: 'blur(30px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🏆</span>
                <span style={{ fontSize: 11, color: '#ffffff', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {T.leaderPrizePool}
                </span>
              </div>
              <div className="font-display" style={{ fontSize: 36, color: '#ffffff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {prizePoolUsd.toFixed(4)}
                <span style={{ fontSize: 14, fontFamily: 'var(--font-geist-sans)', letterSpacing: 0, fontWeight: 500, color: '#ffffffb3', marginLeft: 5 }}>USDm</span>
              </div>
              {/* Pool breakdown */}
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <div style={{ background: '#ffffff26', borderRadius: 10, padding: '5px 10px' }}>
                  <div style={{ fontSize: 9, color: '#ffffffcc', marginBottom: 2 }}>🌱 {isES ? 'Plataforma' : 'Platform'}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
                    {platformSeededUsd.toFixed(2)} USDm
                  </div>
                </div>
                <div style={{ background: '#ffffff26', borderRadius: 10, padding: '5px 10px' }}>
                  <div style={{ fontSize: 9, color: '#ffffffcc', marginBottom: 2 }}>🎨 {isES ? 'Pinturas' : 'Paintings'}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
                    {Math.max(0, prizePoolUsd - platformSeededUsd).toFixed(4)} USDm
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution — amounts reales */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', flexShrink: 0 }}>
              {[
                { medal: '🥇', share: 0.5 },
                { medal: '🥈', share: 0.3 },
                { medal: '🥉', share: 0.2 },
              ].map(({ medal, share }) => (
                <div key={share} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 14 }}>{medal}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
                      {(prizePoolUsd * share).toFixed(3)}
                    </span>
                    <span style={{ fontSize: 9, color: '#ffffffb3', marginLeft: 2 }}>USDm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* My stats */}
      {address && (
        <div style={{ margin: '0 12px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 16, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{T.leaderYourRank}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: myRank > 0 ? '#3a8a68' : '#8a8a8a', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>
              {myRank > 0 ? `#${myRank}` : '—'}
            </div>
            {myRank === 0 && <div style={{ fontSize: 10, color: '#b0aca3', marginTop: 2 }}>{T.leaderUnranked}</div>}
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 16, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#8a8a8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{T.leaderYourPixels}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#2c2c2c', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>
              {myPixels.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: '#b0aca3', marginTop: 2 }}>px pintados</div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div style={{ margin: '0 12px 8px' }}>
        <div style={{ fontSize: 11, color: '#8a8a8a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
          {T.leaderTopPainters}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 62, borderRadius: 16, background: '#ffffff', border: '1px solid #2c2c2c14', opacity: 0.6 + i * 0.08, animation: 'pulse 1.8s ease-in-out infinite' }} />
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid #2c2c2c14', borderRadius: 16, padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🎨</div>
            <div style={{ fontSize: 13, color: '#2c2c2c', fontWeight: 600, marginBottom: 4 }}>{T.leaderEmpty}</div>
            <div style={{ fontSize: 11, color: '#b0aca3' }}>{T.leaderHowToWin}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {leaders.map((entry, i) => {
              const isMe = address?.toLowerCase() === entry.address.toLowerCase();
              const rankStyle = RANK_COLORS[i] ?? { bg: '#ffffff', border: '#2c2c2c14', text: '#8a8a8a' };
              const pct = leaders[0]?.pixels > 0 ? (entry.pixels / leaders[0].pixels) * 100 : 0;

              return (
                <div
                  key={entry.address}
                  style={{
                    background: isMe ? '#68c3a01a' : i < 3 ? rankStyle.bg : '#ffffff',
                    border: isMe ? '1px solid #68c3a0' : i < 3 ? `1px solid ${rankStyle.border}` : '1px solid #2c2c2c14',
                    borderRadius: 16, padding: '10px 12px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
                    {i < 3
                      ? <span style={{ fontSize: 18 }}>{MEDAL[i]}</span>
                      : <span style={{ fontSize: 13, fontWeight: 700, color: '#8a8a8a' }}>#{entry.rank}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: isMe ? 700 : 500, color: isMe ? '#3a8a68' : i < 3 ? rankStyle.text : '#2c2c2c', fontFamily: 'monospace' }}>
                        {shortAddr(entry.address)}
                      </span>
                      {isMe && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#3a8a68', background: '#68c3a026', borderRadius: 4, padding: '1px 5px' }}>TÚ</span>
                      )}
                    </div>
                    <div style={{ height: 3, background: '#2c2c2c14', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: i < 3 ? rankStyle.text : '#68c3a0', borderRadius: 2, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: i < 3 ? rankStyle.text : '#2c2c2c', fontVariantNumeric: 'tabular-nums' }}>
                      {entry.pixels.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 9, color: '#b0aca3' }}>px</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '8px 12px 4px', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: '#b0aca3' }}>{T.leaderHowToWin}</span>
      </div>
    </div>
  );
}
