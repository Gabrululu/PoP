'use client';
import { useEffect, useRef, useState } from 'react';
import { Zone, ZoneStatus } from '@/types';
import { PALETTE } from '@/constants';
import { useLang } from '@/contexts/LangContext';

interface Props {
  zones: Zone[];
  balance: number;
  onZonesChange: (zones: Zone[] | ((prev: Zone[]) => Zone[])) => void;
  onBalanceDeduct: (amount: number) => void;
}

const STATUS_COLOR: Record<ZoneStatus, string> = {
  dominada: '#35d07f',
  activa: '#378add',
  creciendo: '#ef9f27',
  nueva: '#7f77dd',
  'bajo ataque': '#e24b4a',
};

export default function ZonasScreen({ zones, balance, onZonesChange, onBalanceDeduct }: Props) {
  const { T, toggleLang } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PALETTE[0]);
  const shakeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const statusLabel = (s: ZoneStatus) => ({
    dominada: T.zoneStatusDominada,
    activa: T.zoneStatusActiva,
    creciendo: T.zoneStatusCreciendo,
    nueva: T.zoneStatusNueva,
    'bajo ataque': T.zoneStatusAttack,
  }[s]);

  useEffect(() => {
    if (zones.length === 0) return;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * zones.length);
      onZonesChange(zones.map((z, i) => i === idx ? { ...z, status: 'bajo ataque' as ZoneStatus } : z));
      shakeRef.current = setTimeout(() => {
        onZonesChange((prev: Zone[]) => prev.map((z, i) => i === idx ? { ...z, status: 'activa' as ZoneStatus } : z));
      }, 3000);
    }, 30000);
    return () => { clearInterval(interval); if (shakeRef.current) clearTimeout(shakeRef.current); };
  }, [zones, onZonesChange]);

  const handleCreate = () => {
    if (!newName.trim() || balance < 1.00) return;
    const zoneSize = 80;
    const x1 = Math.floor(Math.random() * (512 - zoneSize));
    const y1 = Math.floor(Math.random() * (512 - zoneSize));
    onZonesChange([...zones, { name: newName.trim(), color: newColor, x1, y1, x2: x1 + zoneSize, y2: y1 + zoneSize, pixels: 0, status: 'nueva' }]);
    onBalanceDeduct(1.00);
    setNewName('');
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 64, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px' }}>
        <span style={{ fontSize: 16, color: '#e0e0f0', fontWeight: 500 }}>{T.zonesHeader}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#5a5a8a' }}>{T.zonesThisWeek}</span>
          <button onClick={toggleLang} style={{ background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 20, padding: '3px 8px', cursor: 'pointer' }}>
            <span style={{ fontSize: 10, color: '#5a5a8a', fontWeight: 500 }}>{T.langToggle}</span>
          </button>
        </div>
      </div>

      {/* Zone list / empty state */}
      {zones.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 24px', gap: 10 }}>
          <div style={{ fontSize: 36 }}>🗺️</div>
          <div style={{ fontSize: 14, color: '#c0c0e0', fontWeight: 500 }}>{T.zonesEmptyTitle}</div>
          <div style={{ fontSize: 12, color: '#5a5a8a', textAlign: 'center', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {T.zonesEmptySub}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px' }}>
          {zones.map((zone, i) => {
            const isAttack = zone.status === 'bajo ataque';
            return (
              <div
                key={i}
                className={isAttack ? 'shake' : undefined}
                style={{
                  background: '#1a1a2e',
                  border: isAttack ? '0.5px solid #e24b4a' : '0.5px solid #2a2a4a',
                  borderRadius: 10, padding: 10,
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ width: 32, height: 32, background: zone.color, borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#c0c0e0', fontWeight: 500, marginBottom: 2 }}>{zone.name}</div>
                  <div style={{ fontSize: 10, color: '#5a5a8a' }}>
                    {T.zoneCoords(zone.x1, zone.y1, zone.x2, zone.y2)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: zone.color, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                    {zone.pixels.toLocaleString('es')}
                  </span>
                  <span style={{ fontSize: 10, color: STATUS_COLOR[zone.status], background: `${STATUS_COLOR[zone.status]}18`, padding: '2px 6px', borderRadius: 4 }}>
                    {statusLabel(zone.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create button */}
      <div style={{ padding: '12px 12px 0' }}>
        <button
          onClick={() => setShowForm(true)}
          style={{ width: '100%', padding: '12px', background: '#1a1a2e', color: '#35d07f', border: '0.5px solid #35d07f', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
        >
          {T.zonesCreateBtn}
        </button>
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: '#5a5a8a' }}>{T.zonesCostInfo(balance.toFixed(2))}</span>
        </div>
      </div>

      {/* Create form modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60 }} />
          <div
            className="slide-up"
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, margin: '0 auto',
              width: '100%', maxWidth: '390px',
              background: '#1a1a2e', borderTop: '0.5px solid #35d07f',
              borderRadius: '16px 16px 0 0', padding: '20px 16px 32px', zIndex: 70,
            }}
          >
            <div style={{ width: 36, height: 4, background: '#2a2a4a', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ fontSize: 15, color: '#e0e0f0', fontWeight: 500, marginBottom: 16 }}>{T.zonesFormTitle}</div>

            <label style={{ fontSize: 11, color: '#5a5a8a', display: 'block', marginBottom: 6 }}>{T.zonesFormNameLabel}</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={T.zonesFormNamePlaceholder}
              style={{ width: '100%', background: '#0c0c14', border: '0.5px solid #2a2a4a', borderRadius: 8, padding: '10px 12px', color: '#e0e0f0', fontSize: 14, marginBottom: 14, outline: 'none' }}
            />

            <label style={{ fontSize: 11, color: '#5a5a8a', display: 'block', marginBottom: 8 }}>{T.zonesFormColorLabel}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {PALETTE.map((c) => (
                <button key={c} onClick={() => setNewColor(c)} style={{ width: 32, height: 32, borderRadius: 6, background: c, border: newColor === c ? '2px solid #ffffff' : '2px solid transparent', cursor: 'pointer' }} />
              ))}
            </div>

            <button
              onClick={handleCreate}
              disabled={!newName.trim() || balance < 1.00}
              style={{
                width: '100%', padding: '13px',
                background: newName.trim() && balance >= 1.00 ? '#35d07f' : '#1a2018',
                color: newName.trim() && balance >= 1.00 ? '#0c0c14' : '#5a5a8a',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500,
                cursor: newName.trim() && balance >= 1.00 ? 'pointer' : 'not-allowed',
              }}
            >
              {T.zonesFormConfirm}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
