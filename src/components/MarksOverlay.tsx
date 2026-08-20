'use client';
import { Mark, CELO_BRAND } from '@/constants/marks';
import { COLS, ROWS } from '@/constants';
import { CeloWordmark } from './CeloLogo';

interface Props {
  marks: Mark[];
  onMarkClick: (mark: Mark) => void;
}

export default function MarksOverlay({ marks, onMarkClick }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {marks.map((mark) => {
        const leftPct   = (mark.x1 / COLS) * 100;
        const topPct    = (mark.y1 / ROWS) * 100;
        const widthPct  = ((mark.x2 - mark.x1) / COLS) * 100;
        const heightPct = ((mark.y2 - mark.y1) / ROWS) * 100;

        const isCelo = mark.logo === 'celo';

        return (
          <div
            key={mark.id}
            onClick={() => onMarkClick(mark)}
            style={{
              position: 'absolute',
              left:   `${leftPct}%`,
              top:    `${topPct}%`,
              width:  `${widthPct}%`,
              height: `${heightPct}%`,
              background: isCelo
                ? `${CELO_BRAND.dark}cc`
                : `${mark.color}12`,
              border: isCelo
                ? `1.5px solid ${CELO_BRAND.green}90`
                : `1.5px dashed ${mark.color}70`,
              borderRadius: 2,
              pointerEvents: 'auto',
              cursor: 'pointer',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Celo zone: wordmark centrado en amarillo oficial */}
            {isCelo && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}>
                <CeloWordmark width={54} fill={CELO_BRAND.yellow} />
              </div>
            )}

            {/* Non-Celo badge */}
            {!isCelo && (
              <div style={{
                position: 'absolute',
                top: 2, left: 2,
                display: 'flex', alignItems: 'center', gap: 3,
                background: mark.color,
                borderRadius: '2px 0 4px 0',
                padding: '1px 5px 1px 3px',
              }}>
                <span style={{ fontSize: 7, fontWeight: 800, color: '#fff', letterSpacing: '0.06em', fontFamily: 'system-ui' }}>
                  {mark.name.toUpperCase()}
                </span>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}
