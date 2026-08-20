'use client';
import { FeedItem } from '@/types';
import { useLang } from '@/contexts/LangContext';

interface Props {
  feed: FeedItem[];
  onClose: () => void;
}

function feedAge(timestamp: number, T: { feedNow: string; feedMin: (m: number) => string; feedHour: (h: number) => string }) {
  const secs = Math.floor((Date.now() - timestamp) / 1000);
  if (secs < 60) return T.feedNow;
  if (secs < 3600) return T.feedMin(Math.floor(secs / 60));
  return T.feedHour(Math.floor(secs / 3600));
}

export default function LiveFeed({ feed, onClose }: Props) {
  const { T } = useLang();

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(44,44,44,0.4)' }}
      />
      <div
        className="slide-up"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          margin: '0 auto',
          width: '100%',
          maxWidth: '390px',
          background: '#ffffff',
          borderRadius: '24px 24px 0 0',
          maxHeight: '70vh',
          overflowY: 'auto',
          zIndex: 80,
          paddingBottom: 64,
          boxShadow: '0 -8px 24px rgba(44,44,44,0.08)',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: '#ffffff',
            borderBottom: '1px solid #2c2c2c14',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#68c3a0', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#2c2c2c' }}>{T.feedTitle}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#8a8a8a', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '8px 0' }}>
          {feed.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#8a8a8a', fontSize: 12 }}>
              {T.feedEmpty}
            </div>
          ) : (
            feed.map((item, i) => (
              <div
                key={item.id}
                className={i === 0 ? 'feed-in' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderBottom: '1px solid #2c2c2c0d',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#2c2c2c', flex: 1 }}>{item.address}</span>
                <span style={{ fontSize: 11, color: '#8a8a8a' }}>({item.x}, {item.y})</span>
                <span style={{ fontSize: 10, color: '#8a8a8a', marginLeft: 4 }}>
                  {feedAge(item.timestamp, T)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
