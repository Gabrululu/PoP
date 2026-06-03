'use client';
import { Screen } from '@/types';
import { useLang } from '@/contexts/LangContext';

interface Props {
  screen: Screen;
  onNavigate: (s: Screen) => void;
}

export default function BottomNav({ screen, onNavigate }: Props) {
  const { T } = useLang();

  const tabs: { id: Screen; label: string; icon: React.ReactNode }[] = [
    {
      id: 'canvas',
      label: T.navCanvas,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
      ),
    },
    {
      id: 'zonas',
      label: T.navZones,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
      ),
    },
    {
      id: 'stats',
      label: T.navStats,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '390px',
        background: '#0c0c14',
        borderTop: '0.5px solid #2a2a4a',
        display: 'flex',
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => {
        const active = screen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 0 12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#35d07f' : '#5a5a8a',
              transition: 'color 0.15s',
            }}
          >
            {tab.icon}
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
