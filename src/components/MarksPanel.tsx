'use client';
import { useState } from 'react';
import { Mark, OFFICIAL_MARKS, CELO_BRAND } from '@/constants/marks';
import { useLang } from '@/contexts/LangContext';
import { CeloWordmark } from './CeloLogo';

interface Props {
  userMarks: Mark[];
  balance: number;
  onClose: () => void;
  onCreateMark: (mark: Omit<Mark, 'id' | 'official' | 'logo'>) => void;
}

const USER_COLORS = [
  '#e24b4a', '#f59e0b', '#378add', '#d4537e',
  '#7f77dd', '#ef9f27', '#e0e0f0', '#35d07f',
];

export default function MarksPanel({ userMarks, balance, onClose, onCreateMark }: Props) {
  const { T } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName]   = useState('');
  const [newColor, setNewColor] = useState('#378add');
  const isES = T.langToggle === 'EN';

  const allMarks = [...OFFICIAL_MARKS, ...userMarks];
  const canCreate = balance >= 1;

  const handleCreate = () => {
    if (!newName.trim() || !canCreate) return;
    const x1 = 2 + Math.floor(Math.random() * 12);
    const y1 = 1 + Math.floor(Math.random() * 7);
    onCreateMark({
      name: newName.trim(), tagline: '',
      color: newColor, borderColor: newColor, bgOpacity: 0.08,
      x1, y1, x2: x1 + 5, y2: y1 + 3,
    });
    setNewName('');
    setShowForm(false);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 70 }} />
      <div
        className="slide-up"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          margin: '0 auto', width: '100%', maxWidth: '390px',
          background: '#0f0f1a',
          borderTop: '1px solid #35d07f40',
          borderRadius: '20px 20px 0 0',
          paddingBottom: 40,
          zIndex: 80,
          maxHeight: '82vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, background: '#2a2a4a', borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#e0e0f0', letterSpacing: '-0.3px' }}>
              {isES ? 'Marcas territoriales' : 'Territorial marks'}
            </div>
            <div style={{ fontSize: 11, color: '#5a5a8a', marginTop: 2 }}>
              {isES ? 'Zonas reclamadas en el canvas' : 'Claimed zones on the canvas'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#5a5a8a', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Marks list */}
        <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {allMarks.map((mark) => {
            const isCelo = mark.id === 'celo';
            return (
              <div
                key={mark.id}
                style={{
                  background: isCelo ? CELO_BRAND.dark : '#13131f',
                  border: isCelo
                    ? `1.5px solid ${CELO_BRAND.green}50`
                    : `1px solid ${mark.color}30`,
                  borderRadius: 14,
                  overflow: 'hidden',
                }}
              >
                {/* Celo card */}
                {isCelo ? (
                  <div style={{ padding: '14px 16px' }}>
                    {/* Logo row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <CeloWordmark width={72} fill={CELO_BRAND.green} />
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        color: CELO_BRAND.dark,
                        background: CELO_BRAND.green,
                        borderRadius: 4,
                        padding: '2px 7px',
                        fontFamily: 'DM Mono, monospace',
                        letterSpacing: '0.05em',
                      }}>
                        OFICIAL
                      </span>
                    </div>

                    {/* Tagline */}
                    <div style={{
                      fontSize: 12,
                      color: `${CELO_BRAND.green}cc`,
                      fontFamily: 'DM Mono, monospace',
                      marginBottom: 10,
                    }}>
                      {mark.tagline}
                    </div>

                    {/* Brand color palette */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                      {Object.entries(CELO_BRAND).map(([name, hex]) => (
                        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 5, background: hex, border: '1px solid rgba(255,255,255,0.08)' }} />
                          <span style={{ fontSize: 7, color: '#3a5a4a', fontFamily: 'DM Mono, monospace' }}>{hex}</span>
                        </div>
                      ))}
                    </div>

                    {/* Zona info */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: '#3a5a4a', fontFamily: 'DM Mono, monospace' }}>
                        ({mark.x1},{mark.y1}) → ({mark.x2},{mark.y2})
                      </span>
                      <a
                        href={mark.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          fontSize: 10,
                          color: CELO_BRAND.green,
                          fontFamily: 'DM Mono, monospace',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        celo.org ↗
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Generic user mark */
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', top: -20, right: -20,
                      width: 60, height: 60, background: mark.color,
                      borderRadius: '50%', opacity: 0.05, filter: 'blur(16px)',
                    }} />
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${mark.color}20`,
                      border: `1px solid ${mark.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <div style={{ width: 20, height: 20, borderRadius: 5, background: mark.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#e0e0f0', marginBottom: 2 }}>{mark.name}</div>
                      <div style={{ fontSize: 10, color: '#3a3a5a', fontFamily: 'monospace' }}>
                        ({mark.x1},{mark.y1}) → ({mark.x2},{mark.y2})
                      </div>
                    </div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: mark.color, flexShrink: 0 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Create form */}
        {showForm ? (
          <div style={{ padding: '0 12px' }}>
            <div style={{ background: '#13131f', border: '1px solid #1e1e30', borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e0e0f0', marginBottom: 12 }}>
                {isES ? 'Registrar mi marca' : 'Register my mark'}
              </div>

              <label style={{ fontSize: 10, color: '#5a5a8a', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isES ? 'Nombre' : 'Name'}
              </label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder={isES ? 'Mi comunidad…' : 'My community…'}
                maxLength={20}
                style={{ width: '100%', background: '#0c0c14', border: '1px solid #2a2a4a', borderRadius: 8, padding: '9px 12px', color: '#e0e0f0', fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box' }}
              />

              <label style={{ fontSize: 10, color: '#5a5a8a', fontWeight: 600, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Color
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {USER_COLORS.map(c => (
                  <button key={c} onClick={() => setNewColor(c)} style={{ width: 32, height: 32, borderRadius: 8, background: c, border: newColor === c ? '2.5px solid #fff' : '2.5px solid transparent', cursor: 'pointer', boxShadow: newColor === c ? `0 0 8px ${c}80` : 'none' }} />
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', background: '#1a1a2e', border: '0.5px solid #2a2a4a', borderRadius: 10, color: '#5a5a8a', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {isES ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || !canCreate}
                  style={{ flex: 2, padding: '11px', background: newName.trim() && canCreate ? `linear-gradient(135deg, ${newColor}, ${newColor}cc)` : '#1a1a2e', border: 'none', borderRadius: 10, color: newName.trim() && canCreate ? '#fff' : '#5a5a8a', fontSize: 13, fontWeight: 700, cursor: newName.trim() && canCreate ? 'pointer' : 'not-allowed' }}
                >
                  {isES ? 'Registrar — 1 USDm' : 'Register — 1 USDm'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '0 12px' }}>
            <button
              onClick={() => setShowForm(true)}
              style={{ width: '100%', padding: '13px', background: '#13131f', border: '1px dashed #35d07f40', borderRadius: 12, color: '#35d07f', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <span style={{ fontSize: 16 }}>+</span>
              {isES ? 'Registrar mi marca — 1 USDm' : 'Register my mark — 1 USDm'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 6, fontSize: 10, color: '#3a3a5a' }}>
              {isES ? `Necesitas 1 USDm · balance: ${balance.toFixed(2)}` : `Requires 1 USDm · balance: ${balance.toFixed(2)}`}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
