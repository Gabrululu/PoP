'use client';
import { useEffect, useState } from 'react';

export interface ReclaimEvent {
  x: number;
  y: number;
  newPainter: string;
  color: string;
  id: string;
}

interface Props {
  events: ReclaimEvent[];
  onDismiss: (id: string) => void;
}

function Toast({ event, onDismiss }: { event: ReclaimEvent; onDismiss: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#ffffff',
        border: '1px solid #e74c3c40',
        borderLeft: '3px solid #e74c3c',
        borderRadius: 12,
        padding: '10px 12px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(44,44,44,0.14)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: event.color, flexShrink: 0, boxShadow: `0 0 6px ${event.color}` }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#e74c3c', marginBottom: 1 }}>
          ⚡ Tu píxel fue reclamado
        </div>
        <div style={{ fontSize: 11, color: '#2c2c2c' }}>
          ({event.x}, {event.y}) · por{' '}
          <span style={{ color: '#3a8a68', fontFamily: 'monospace' }}>{event.newPainter.slice(0, 6)}…{event.newPainter.slice(-4)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ReclaimToast({ events, onDismiss }: Props) {
  if (events.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        left: 0, right: 0,
        margin: '0 auto',
        width: 'calc(100% - 24px)',
        maxWidth: 366,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 200,
        pointerEvents: 'auto',
      }}
    >
      {events.slice(0, 3).map(ev => (
        <Toast key={ev.id} event={ev} onDismiss={() => onDismiss(ev.id)} />
      ))}
    </div>
  );
}
