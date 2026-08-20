'use client';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useSeasonCountdown } from '@/hooks/useSeasonCountdown';
import { useLang } from '@/contexts/LangContext';
import { shortAddr } from '@/constants';
import { useAccount } from 'wagmi';

const MEDAL = ['🥇', '🥈', '🥉'];

const RANK_COLORS = [
  { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.30)', text: '#fbbf24' },
  { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.25)', text: '#94a3b8' },
  { bg: 'rgba(180,120,80,0.1)', border: 'rgba(180,120,80,0.25)', text: '#cd7c4f' },
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
        <span style={{ fontSize: 16, fontWeight: 800, color: '#e0e0f0', letterSpacing: '-0.3px' }}>
          {T.leaderHeader}
        </span>
        <button onClick={toggleLang} style={{ background: '#13131f', border: '0.5px solid #1e1e30', borderRadius: 20, padding: '3px 10px', cursor: 'pointer' }}>
          <span style={{ fontSize: 10, color: '#5a5a8a', fontWeight: 600 }}>{T.langToggle}</span>
        </button>
      </div>

      {/* Season info strip */}
      <div style={{ margin: '0 12px 12px', background: '#13131f', border: '1px solid #1e1e30', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, color: '#5a5a8a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
            {isES ? `Temporada ${season.number}` : `Season ${season.number}`}
          </div>
          <div style={{ fontSize: 11, color: '#c0c0e0' }}>
            {isES ? 'Los top 3 se reparten el prize pool' : 'Top 3 share the prize pool'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#5a5a8a', marginBottom: 2 }}>
            {isES ? 'Termina en' : 'Ends in'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px' }}>
              {season.label}
            </span>
          </div>
        </div>
      </div>

      {/* Prize Pool Card */}
      <div style={{ margin: '0 12px 12px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0d2a1a 0%, #0c1e2e 100%)',
          border: '1px solid #35d07f40',
          borderRadius: 16,
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: '#35d07f', borderRadius: '50%', opacity: 0.07, filter: 'blur(30px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🏆</span>
                <span style={{ fontSize: 11, color: '#35d07f', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {T.leaderPrizePool}
                </span>
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, color: '#35d07f', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px', lineHeight: 1 }}>
                {prizePoolUsd.toFixed(4)}
                <span style={{ fontSize: 14, fontWeight: 500, color: '#35d07f80', marginLeft: 5 }}>USDm</span>
              </div>
              {/* Pool breakdown */}
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <div style={{ background: '#0a1c10', border: '1px solid #35d07f18', borderRadius: 8, padding: '5px 10px' }}>
                  <div style={{ fontSize: 9, color: '#4a7a5a', marginBottom: 2 }}>🌱 {isES ? 'Plataforma' : 'Platform'}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#35d07f', fontVariantNumeric: 'tabular-nums' }}>
                    {platformSeededUsd.toFixed(2)} USDm
                  </div>
                </div>
                <div style={{ background: '#0a1c10', border: '1px solid #35d07f18', borderRadius: 8, padding: '5px 10px' }}>
                  <div style={{ fontSize: 9, color: '#4a7a5a', marginBottom: 2 }}>🎨 {isES ? 'Pinturas' : 'Paintings'}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#35d07f', fontVariantNumeric: 'tabular-nums' }}>
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
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#35d07f', fontVariantNumeric: 'tabular-nums' }}>
                      {(prizePoolUsd * share).toFixed(3)}
                    </span>
                    <span style={{ fontSize: 9, color: '#35d07f50', marginLeft: 2 }}>USDm</span>
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
          <div style={{ background: '#13131f', border: '0.5px solid #1e1e30', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#5a5a8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{T.leaderYourRank}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: myRank > 0 ? '#35d07f' : '#5a5a8a', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>
              {myRank > 0 ? `#${myRank}` : '—'}
            </div>
            {myRank === 0 && <div style={{ fontSize: 10, color: '#3a3a5a', marginTop: 2 }}>{T.leaderUnranked}</div>}
          </div>
          <div style={{ background: '#13131f', border: '0.5px solid #1e1e30', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#5a5a8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{T.leaderYourPixels}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#e0e0f0', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>
              {myPixels.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: '#3a3a5a', marginTop: 2 }}>px pintados</div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div style={{ margin: '0 12px 8px' }}>
        <div style={{ fontSize: 11, color: '#5a5a8a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
          {T.leaderTopPainters}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 62, borderRadius: 12, background: '#13131f', opacity: 0.6 + i * 0.08, animation: 'pulse 1.8s ease-in-out infinite' }} />
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <div style={{ background: '#13131f', border: '1px solid #1e1e30', borderRadius: 12, padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🎨</div>
            <div style={{ fontSize: 13, color: '#c0c0e0', fontWeight: 600, marginBottom: 4 }}>{T.leaderEmpty}</div>
            <div style={{ fontSize: 11, color: '#3a3a5a' }}>{T.leaderHowToWin}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {leaders.map((entry, i) => {
              const isMe = address?.toLowerCase() === entry.address.toLowerCase();
              const rankStyle = RANK_COLORS[i] ?? { bg: '#13131f', border: '#1e1e3022', text: '#5a5a8a' };
              const pct = leaders[0]?.pixels > 0 ? (entry.pixels / leaders[0].pixels) * 100 : 0;

              return (
                <div
                  key={entry.address}
                  style={{
                    background: isMe ? 'rgba(53,208,127,0.07)' : i < 3 ? rankStyle.bg : '#13131f',
                    border: isMe ? '1px solid #35d07f55' : i < 3 ? `1px solid ${rankStyle.border}` : '0.5px solid #1e1e30',
                    borderRadius: 12, padding: '10px 12px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
                    {i < 3
                      ? <span style={{ fontSize: 18 }}>{MEDAL[i]}</span>
                      : <span style={{ fontSize: 13, fontWeight: 700, color: '#5a5a8a' }}>#{entry.rank}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: isMe ? 700 : 500, color: isMe ? '#35d07f' : i < 3 ? rankStyle.text : '#c0c0e0', fontFamily: 'monospace' }}>
                        {shortAddr(entry.address)}
                      </span>
                      {isMe && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#35d07f', background: '#35d07f20', borderRadius: 4, padding: '1px 5px' }}>TÚ</span>
                      )}
                    </div>
                    <div style={{ height: 3, background: '#0c0c14', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: i < 3 ? rankStyle.text : '#35d07f44', borderRadius: 2, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: i < 3 ? rankStyle.text : '#e0e0f0', fontVariantNumeric: 'tabular-nums' }}>
                      {entry.pixels.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 9, color: '#3a3a5a' }}>px</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '8px 12px 4px', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: '#3a3a5a' }}>{T.leaderHowToWin}</span>
      </div>
    </div>
  );
}
