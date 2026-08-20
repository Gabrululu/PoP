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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
          <path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>
        </svg>
      ),
    },
    {
      id: 'leaderboard',
      label: T.navLeader,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
        </svg>
      ),
    },
    {
      id: 'stats',
      label: T.navStats,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
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
        background: 'rgba(12,12,20,0.96)',
        backdropFilter: 'blur(12px)',
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
              gap: 4,
              padding: '10px 0 12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#35d07f' : '#5a5a8a',
              transition: 'color 0.15s',
              position: 'relative',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute',
                top: 0, left: '20%', right: '20%',
                height: 2,
                background: '#35d07f',
                borderRadius: '0 0 2px 2px',
              }} />
            )}
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
